import { FIAT_CURRENCIES, type FiatCurrency } from '@/types/coinbase.types'

export const CALCULATOR_SESSION_KEY = 'asset-calculator'

/** Persisted fields only; ETH allocation is always `100 - btcRatio` in the UI. */
export type SavedCalculator = {
  currency: FiatCurrency
  btcRatio: number
  assets: number
}

export const DEFAULT_CALCULATOR_SESSION: SavedCalculator = {
  currency: 'USD',
  btcRatio: 70,
  assets: 0,
}

/** Accepts only known fields with valid values; ignores corrupt or hand-edited session JSON. */
export function parseCalculatorSession(raw: string): Partial<SavedCalculator> {
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>
    const saved: Partial<SavedCalculator> = {}
    if (
      typeof parsed.currency === 'string' &&
      (FIAT_CURRENCIES as readonly string[]).includes(parsed.currency)
    ) {
      saved.currency = parsed.currency as FiatCurrency
    }
    if (typeof parsed.btcRatio === 'number' && Number.isFinite(parsed.btcRatio)) {
      saved.btcRatio = Math.min(100, Math.max(0, parsed.btcRatio))
    }
    if (typeof parsed.assets === 'number' && Number.isFinite(parsed.assets) && parsed.assets >= 0) {
      saved.assets = parsed.assets
    }
    return saved
  } catch {
    return {}
  }
}