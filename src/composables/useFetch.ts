import { type MaybeRefOrGetter, ref, toValue, watchEffect } from 'vue'

export function useFetch<T>(url: MaybeRefOrGetter<string>) {
  const data = ref<T | null>(null)
  const error = ref<string | null>(null)
  const isLoading = ref<boolean>(false)

  watchEffect(async (onCleanup) => {
    // URL is reactive (e.g. currency changes); abort so an older response cannot win the race.
    const abortController = new AbortController()
    onCleanup(() => abortController.abort())
    isLoading.value = true
    error.value = null

    try {
      const res = await fetch(toValue(url), { signal: abortController.signal })

      if (!res.ok) {
        throw new Error(`Request failed with status: ${res.status}`)
      }

      const json = (await res.json()) as T
      if (!abortController.signal.aborted) {
        data.value = json
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        return
      }
      if (!abortController.signal.aborted) {
        error.value = err instanceof Error ? err.message : 'Unknown error'
      }
    } finally {
      if (!abortController.signal.aborted) {
        isLoading.value = false
      }
    }
  })

  return { data, error, isLoading }
}
