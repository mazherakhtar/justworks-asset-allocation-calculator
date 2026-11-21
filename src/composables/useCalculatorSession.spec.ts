import { defineComponent } from 'vue'
import { beforeEach, describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { useCalculatorSession } from './useCalculatorSession'
import { CALCULATOR_SESSION_KEY } from '../utils/calculatorSessionUtils'

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

describe('useCalculatorSession', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('rehydrates saved fields and persists updates', async () => {
    sessionStorage.setItem(
      CALCULATOR_SESSION_KEY,
      JSON.stringify({ btcRatio: 60, assets: 100 }),
    )

    const { btcRatio, assets } = withComposable(() => useCalculatorSession())
    expect(btcRatio.value).toBe(60)
    expect(assets.value).toBe(100)

    btcRatio.value = 55
    await flushPromises()

    expect(JSON.parse(sessionStorage.getItem(CALCULATOR_SESSION_KEY)!).btcRatio).toBe(55)
  })
})