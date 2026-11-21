<script setup lang="ts">
import { useFetch } from '@/composables/useFetch'
import {
  ALLOCATION_SYMBOLS,
  COINBASE_EXCHANGE_RATES_URL,
  FIAT_CURRENCIES,
  type AllocationSymbol,
  type CoinbaseExchangeRatesResponse,
} from '@/types/coinbase.types'
import AllocationSelector from '@/components/AllocationSelector.vue'
import { getSharesForAllocation } from '@/utils/allocationUtils'
import { useCalculatorSession } from '@/composables/useCalculatorSession'
import { formatDecimal, formatFiatAmount, parseFiatInput } from '@/utils/formatUtils'
import { ref, computed } from 'vue'

const { currency, btcRatio, assets } = useCalculatorSession()
// Raw number while focused; currency formatting when blurred.
const assetsFocused = ref(false)
const assetsFieldValue = computed({
  get() {
    if (assetsFocused.value) {
      return assets.value === 0 ? '' : String(assets.value)
    }
    return formatFiatAmount(assets.value, currency.value)
  },
  set(raw: string) {
    assets.value = parseFiatInput(raw)
  },
})
const url = computed(() => `${COINBASE_EXCHANGE_RATES_URL}?currency=${currency.value}`)
// Moving ETH updates btcRatio so the pair always totals 100%.
const ethRatio = computed({
  get: () => 100 - btcRatio.value,
  set: (percent) => {
    btcRatio.value = 100 - percent
  },
})

const { data, isLoading, error } = useFetch<CoinbaseExchangeRatesResponse>(url)
const rates = computed(() => data.value?.data.rates)

const sharesForSymbol = (symbol: AllocationSymbol) => {
  const rate = rates.value?.[symbol]
  if (rate == null) {
    return undefined
  }
  const percent = symbol === 'BTC' ? btcRatio.value : ethRatio.value
  return getSharesForAllocation(assets.value, percent, Number(rate))
}
</script>

<template>
  <div v-if="error" role="alert">There was an unexpected error returning rates: {{ error }}</div>
  <section v-else class="calculator" aria-label="Asset allocation calculator">
    <div v-if="!rates && isLoading" class="form-row" role="status" aria-live="polite">
      Rates loading...
    </div>
    <dl v-else-if="rates" class="rates">
      <div v-for="symbol in ALLOCATION_SYMBOLS" :key="symbol" class="form-row">
        <dt>Rate for {{ symbol }} in {{ currency }}</dt>
        <dd>{{ formatDecimal(rates[symbol]) }}</dd>
      </div>
    </dl>

    <form class="asset-allocation-form" @submit.prevent>
      <div class="form-row">
        <label for="amount">Investable assets</label>
        <input id="amount" type="text" inputmode="decimal" class="assets-input" v-model="assetsFieldValue"
          @focus="assetsFocused = true" @blur="assetsFocused = false" />
        <select id="currency-selector" class="currency-select" aria-label="Currency" v-model="currency">
          <option v-for="code in FIAT_CURRENCIES" :key="code" :value="code">
            {{ code }}
          </option>
        </select>
      </div>

      <div class="form-row">
        <AllocationSelector symbol="BTC" v-model="btcRatio" :amount="sharesForSymbol('BTC')" />
      </div>
      <div class="form-row">
        <AllocationSelector symbol="ETH" v-model="ethRatio" :amount="sharesForSymbol('ETH')" />
      </div>
    </form>
  </section>
</template>

<style scoped>
.rates {
  margin: 0;
}

.calculator {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: min(36rem, 100%);
  padding: 2rem;
}

.asset-allocation-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-row input.assets-input,
.form-row .currency-select {
  height: 30px;
  padding: 0 0.4rem;
  box-sizing: border-box;
}

.form-row input.assets-input {
  width: 8.75rem;
  flex-shrink: 0;
}

.form-row .currency-select {
  flex-shrink: 0;
}
</style>
