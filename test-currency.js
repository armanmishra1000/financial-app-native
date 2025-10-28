// Simple test to verify currency conversion works
const { convertFromUSD, convertToUSD, formatCurrencyAmount, getExchangeRateString } = require('./src/lib/currency-utils.ts');

console.log('Testing Currency Conversion:');
console.log('===========================');

// Test USD to MXN conversion
const usdAmount = 100;
const mxnAmount = convertFromUSD(usdAmount, 'MXN');
console.log(`$${usdAmount} USD = ${formatCurrencyAmount(mxnAmount, 'MXN')} MXN`);

// Test MXN to USD conversion
const backToUSD = convertToUSD(mxnAmount, 'MXN');
console.log(`${formatCurrencyAmount(mxnAmount, 'MXN')} MXN = $${backToUSD.toFixed(2)} USD`);

// Test exchange rate string
console.log(getExchangeRateString('USD', 'MXN'));

// Test EUR conversion
const eurAmount = convertFromUSD(usdAmount, 'EUR');
console.log(`$${usdAmount} USD = ${formatCurrencyAmount(eurAmount, 'EUR')} EUR`);

console.log('✅ Currency conversion test completed');
