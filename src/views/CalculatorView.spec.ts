import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import CalculatorView from './CalculatorView.vue'

const ratesBody = {
  data: {
    currency: 'USD',
    rates: { BTC: '0.00002', ETH: '0.0003' },
  },
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

describe('CalculatorView', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('shows loading, then rates when the request succeeds', async () => {
    let resolveFetch!: (response: Response) => void
    const pending = new Promise<Response>((resolve) => {
      resolveFetch = resolve
    })
    vi.stubGlobal('fetch', vi.fn(() => pending))

    const wrapper = mount(CalculatorView)
    await wrapper.vm.$nextTick()

    expect(wrapper.get('[role="status"]').text()).toContain('Rates loading')

    resolveFetch(jsonResponse(ratesBody))
    await flushPromises()
    await wrapper.vm.$nextTick()

    const rows = wrapper.findAll('dl.rates .form-row')
    expect(rows).toHaveLength(2)
    expect(rows[0]!.text()).toContain('Rate for BTC in USD')
    expect(rows[1]!.text()).toContain('Rate for ETH in USD')
    expect(wrapper.find('#amount').exists()).toBe(true)
    expect(wrapper.get('#currency-selector').findAll('option')).toHaveLength(3)
    expect(wrapper.findAll('input[type="range"]')).toHaveLength(2)
  })

  it('shows an alert when the rates request fails', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(jsonResponse({}, 500))))

    const wrapper = mount(CalculatorView)
    await flushPromises()

    expect(wrapper.get('[role="alert"]').text()).toContain('Request failed with status: 500')
    expect(wrapper.find('form').exists()).toBe(false)
  })
})