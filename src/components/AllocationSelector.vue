<script setup lang="ts">
import { formatDecimal } from '@/utils/formatUtils'
import { computed } from 'vue'

const { symbol, amount } = defineProps<{
  symbol: string
  amount?: number
}>()

const ratio = defineModel<number>({ required: true })

const id = computed(() => symbol.toLowerCase())
</script>

<template>
  <label :for="`${id}-ratio`">{{ symbol }}</label>
  <input
    :id="`${id}-ratio`"
    v-model.number="ratio"
    type="range"
    min="0"
    max="100"
    step="1"
    :aria-describedby="`${id}-amount`"
  />
  <output :for="`${id}-ratio`" class="ratio">{{ ratio }}%</output>
  <output :id="`${id}-amount`" class="amount">
    {{ formatDecimal(amount) }}{{ amount != null ? ' units' : '' }}
  </output>
</template>

<style scoped>
input[type='range'] {
  flex: 1;
  min-width: 0;
}

.ratio {
  flex-shrink: 0;
  width: 1rem;
  text-align: center;
}

.amount {
  flex: 0 0 11.5rem;
  white-space: nowrap;
  text-align: right;
  padding-inline: 0.4rem;
}
</style>