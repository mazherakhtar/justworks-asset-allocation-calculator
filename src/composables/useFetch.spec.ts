import { defineComponent } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { useFetch } from './useFetch'

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

describe('useFetch', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('loads JSON into data', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.resolve(new Response(JSON.stringify({ ok: true }), { status: 200 }))),
    )

    const { data, isLoading } = withComposable(() => useFetch<{ ok: boolean }>('/rates'))
    await flushPromises()

    expect(data.value).toEqual({ ok: true })
    expect(isLoading.value).toBe(false)
  })

  it('stores an error message when the response is not ok', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.resolve(new Response('', { status: 500 }))),
    )

    const { error, isLoading } = withComposable(() => useFetch('/rates'))
    await flushPromises()

    expect(error.value).toContain('500')
    expect(isLoading.value).toBe(false)
  })
})