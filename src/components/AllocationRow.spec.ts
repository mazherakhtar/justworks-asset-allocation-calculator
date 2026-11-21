import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import AllocationRow from './AllocationRow.vue'

describe('AllocationRow', () => {
  it('renders symbol, percent, and amount with units', () => {
    const wrapper = mount(AllocationRow, {
      props: {
        symbol: 'BTC',
        amount: 1.5,
        modelValue: 72,
      },
    })

    expect(wrapper.get('label').text()).toBe('BTC')
    expect(wrapper.get('.ratio').text()).toBe('72%')
    expect(wrapper.get('.amount').text()).toContain('1.5')
    expect(wrapper.get('.amount').text()).toContain('units')
  })

  it('omits units when amount is missing', () => {
    const wrapper = mount(AllocationRow, {
      props: { symbol: 'ETH', modelValue: 28 },
    })

    expect(wrapper.get('.amount').text()).not.toContain('units')
  })

  it('updates displayed percent when the slider moves', async () => {
    const wrapper = mount(AllocationRow, {
      props: { symbol: 'BTC', modelValue: 40 },
    })

    const slider = wrapper.get('input[type="range"]').element as HTMLInputElement
    await wrapper.get('input[type="range"]').setValue(55)

    expect(slider.value).toBe('55')
    expect(wrapper.get('.ratio').text()).toBe('55%')
  })
})