import { defineComponent } from 'vue'
import { beforeEach, describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { useSessionStorage } from './useSessionStorage'

function withComposable<T>(setupComposable: () => T): T {
  let result!: T
  mount(
    defineComponent({
      setup() {
        result = setupComposable()
        return () => null
      },
    }),
  )
  return result
}

describe('useSessionStorage', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('returns the default when nothing is stored', () => {
    const state = withComposable(() => useSessionStorage('test-key', { count: 0 }))
    expect(state.value).toEqual({ count: 0 })
  })

  it('persists changes to sessionStorage', async () => {
    const state = withComposable(() => useSessionStorage('test-key', { count: 0 }))
    state.value = { count: 2 }
    await flushPromises()
    expect(sessionStorage.getItem('test-key')).toBe('{"count":2}')
  })
})