import type { FiatCurrency } from '@/types/coinbase.types'

const formatter = new Intl.NumberFormat(undefined, { maximumFractionDigits: 12 })

export const formatDecimal = (value: number | string | undefined) => {
  if (value == null || value === '') {
    return ''
  }
  const n = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(n) ? formatter.format(n) : String(value)
}

export const formatFiatAmount = (value: number, currencyCode: FiatCurrency) =>
  new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: currencyCode,
    maximumFractionDigits: 2,
  }).format(value)

/** Parses typed input; strips currency symbols/grouping left over from formatted blur display. */
export const parseFiatInput = (raw: string | number) => {
  if (typeof raw === 'number') {
    return Number.isFinite(raw) ? raw : 0
  }
  const n = Number(String(raw).replace(/[^\d.-]/g, ''))
  return Number.isFinite(n) ? n : 0
}
