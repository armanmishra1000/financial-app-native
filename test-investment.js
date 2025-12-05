const {
  calculateFixedDailyReturns,
  FIXED_DAILY_RATE_PERCENT,
} = require('./src/lib/investment-utils.ts');

const principalUSD = 500;
const planId = 'p1'; // 3 Month Plan -> 90 days
const projection = calculateFixedDailyReturns(principalUSD, planId, 90);

if (!projection) {
  console.error('❌ Projection failed — check plan mapping or principal input.');
  process.exit(1);
}

const toCurrency = (value) => Number.parseFloat(value).toFixed(2);

console.log('Fixed Daily Rate (%):', FIXED_DAILY_RATE_PERCENT);
console.log('Principal (USD):', principalUSD.toFixed(2));
console.log('Days Used:', projection.daysUsed);
console.log('Daily Earnings (USD):', toCurrency(projection.dailyEarnings));
console.log('Total Growth (USD):', toCurrency(projection.totalGrowth));
console.log('Final Value (USD):', toCurrency(projection.finalValue));

console.log('\nExpected Rounded Values → Daily: $0.27, Growth: $25.27, Final: $525.27');
