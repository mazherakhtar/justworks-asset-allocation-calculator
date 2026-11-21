import { describe, expect, it } from 'vitest'
import { formatDecimal, parseFiatInput } from './formatUtils'

describe('parseFiatInput', () => {
  it('strips symbols and grouping from formatted currency strings', () => {
    expect(parseFiatInput('$1,234.56')).toBe(1234.56)
  })

  it('returns 0 when parsing fails', () => {
    expect(parseFiatInput('not a number')).toBe(0)
  })
})

describe('formatDecimal', () => {
  it('returns empty string for missing values', () => {
    expect(formatDecimal(undefined)).toBe('')
    expect(formatDecimal('')).toBe('')
  })
})