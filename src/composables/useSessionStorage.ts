import { ref, watch, type Ref } from 'vue'

type UseSessionStorageOptions<T> = {
  read?: (raw: string) => T | undefined
  write?: (value: T) => string
}

export function useSessionStorage<T>(
  key: string,
  defaultValue: T,
  options?: UseSessionStorageOptions<T>,
): Ref<T> {
  const read = (): T => {
    try {
      const raw = sessionStorage.getItem(key)
      if (raw == null) {
        return defaultValue
      }
      const value = options?.read?.(raw)
      if (value !== undefined) {
        return value
      }
      return JSON.parse(raw) as T
    } catch {
      return defaultValue
    }
  }

  const state = ref(read()) as Ref<T>

  watch(
    state,
    (value) => {
      try {
        const raw = options?.write?.(value) ?? JSON.stringify(value)
        sessionStorage.setItem(key, raw)
      } catch {
        // sessionStorage may be unavailable or full
      }
    },
    { deep: true },
  )

  return state
}
