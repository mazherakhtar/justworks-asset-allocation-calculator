# Asset allocation calculator

Vue 3 app that loads BTC and ETH exchange rates from the [Coinbase public API](https://docs.cdp.coinbase.com/exchange/reference/getexchangerates), lets you split investable assets between the two coins with linked sliders (always totaling 100%), and shows how much of each crypto that allocation implies.

## Stack

- Vue 3 + TypeScript, Vite
- No client-side router or global store; state lives in composables and session storage

## Decisions

**`sessionStorage` instead of route params or query strings:** Calculator inputs (amount, currency, BTC split) are UI preferences for the current tab, not shareable URLs. Session storage restores state on refresh which keeps history clean, and avoids vue-router for a single screen.

**No Pinia:** State is local to the calculator. One persisted object and fields exposed from composables. Component hierarchy is small, so a global store would only add complexity.

**No vue-router:** The app has one view; the header and calculator mount directly from `App.vue`.

**UX:** Using sliders since there are only two allocation types and no assumptions need to be made for another allocation when adjusting the other. Investable amount shows a raw number while editing and formatted on blur for simplified user input. Exchange rates are read-only above the form so quotes are visible before changing allocation.

**Tests and HTTP:** View and composable specs stub `globalThis.fetch` to stay fast and deterministic. In a production codebase, [MSW](https://mswjs.io/) (or similar) would intercept the same requests with realistic handlers so tests exercise real fetch paths without hitting Coinbase.

**Unit tests:** Small and readable over DRY. Helpers (e.g. mounting a composable) are inlined where needed, so some duplication across files is intentional.

**Types vs runtime:** Coinbase responses are typed with `FiatCurrency` and related types in `src/types/coinbase.types.ts` for the supported USD/GBP/EUR currencies. Session JSON is validated in `parseCalculatorSession`; API JSON is trusted after a successful `fetch` (no response schema validation). In production, [Zod](https://zod.dev/) (or similar) at fetch and storage boundaries would parse external JSON once and keep runtime checks aligned with those types.
## Commands

```sh
npm install
npm run dev      # local dev server
npm run build    # type-check + production build
npm run test:unit
npm run lint
npm run format
```