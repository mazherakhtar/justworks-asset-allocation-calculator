export const COINBASE_EXCHANGE_RATES_URL = 'https://api.coinbase.com/v2/exchange-rates'

/** Fiat codes exposed in the calculator; the only values sent as Coinbase `currency` query params. */
export const FIAT_CURRENCIES = ['USD', 'GBP', 'EUR'] as const

export type FiatCurrency = (typeof FIAT_CURRENCIES)[number]

/** Assets available for allocation sliders and rate display. */
export const ALLOCATION_SYMBOLS = ['BTC', 'ETH'] as const

export type AllocationSymbol = (typeof ALLOCATION_SYMBOLS)[number]

export type CoinbaseExchangeRatesResponse = {
  data: {
    /** Fiat currency for `rates` (expected to match the requested `currency` param). */
    currency: FiatCurrency
    /** Map of currency to rates */
    rates: Record<string, string>
  }
}
