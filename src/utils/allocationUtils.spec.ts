import { describe, expect, it } from 'vitest'
import { getSharesForAllocation } from './allocationUtils'

describe('getSharesForAllocation', () => {
  it('applies allocation percent and Coinbase rate to fiat amount', () => {
    expect(getSharesForAllocation(10_000, 50, 0.00002)).toBe(0.1)
  })
})