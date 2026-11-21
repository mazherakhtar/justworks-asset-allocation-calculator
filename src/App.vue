<script setup lang="ts">
import CalculatorView from './views/CalculatorView.vue'
</script>

<template>
  <header>
    <h1>Asset allocation calculator</h1>
  </header>
  <CalculatorView />
</template>

<style scoped>
header {
  width: 100%;
  text-align: center;
  padding: 1.25rem 1rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-background-soft);
}

h1 {
  margin: 0;
  font-size: 1.25rem;
  color: var(--color-text-primary);
}
</style>
