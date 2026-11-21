import { describe, expect, it } from 'vitest'
import { parseCalculatorSession } from './calculatorSessionUtils'

describe('parseCalculatorSession', () => {
  it('keeps valid persisted fields', () => {
    expect(parseCalculatorSession('{"currency":"EUR","btcRatio":40,"assets":500}')).toEqual({
      currency: 'EUR',
      btcRatio: 40,
      assets: 500,
    })
  })

  it('clamps ratio and drops invalid fields', () => {
    expect(parseCalculatorSession('{"currency":"JPY","btcRatio":150,"assets":-1}')).toEqual({
      btcRatio: 100,
    })
  })

  it('returns empty object for corrupt JSON', () => {
    expect(parseCalculatorSession('{')).toEqual({})
  })
})