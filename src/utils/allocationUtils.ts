/** Coinbase rate is crypto amount per 1 unit of fiat. `allocationPercent` is 0-100. */
export const getSharesForAllocation = (
  assetValue: number,
  allocationPercent: number,
  rate: number,
) => assetValue * (allocationPercent / 100) * rate
