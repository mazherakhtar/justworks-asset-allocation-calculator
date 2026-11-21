import { computed } from 'vue'
import { useSessionStorage } from '@/composables/useSessionStorage'
import {
  CALCULATOR_SESSION_KEY,
  DEFAULT_CALCULATOR_SESSION,
  parseCalculatorSession,
  type SavedCalculator,
} from '@/utils/calculatorSessionUtils'
import type { FiatCurrency } from '@/types/coinbase.types'

export function useCalculatorSession() {
  const state = useSessionStorage<SavedCalculator>(
    CALCULATOR_SESSION_KEY,
    { ...DEFAULT_CALCULATOR_SESSION },
    {
      // Merge parsed fields onto defaults so new session keys do not break older saved state.
      read: (raw) => ({
        ...DEFAULT_CALCULATOR_SESSION,
        ...parseCalculatorSession(raw),
      }),
    },
  )

  const currency = computed({
    get: () => state.value.currency,
    set: (currency: FiatCurrency) => {
      state.value = { ...state.value, currency }
    },
  })
  const btcRatio = computed({
    get: () => state.value.btcRatio,
    set: (btcRatio: number) => {
      state.value = { ...state.value, btcRatio }
    },
  })
  const assets = computed({
    get: () => state.value.assets,
    set: (assets: number) => {
      state.value = { ...state.value, assets }
    },
  })

  return { currency, btcRatio, assets }
}
