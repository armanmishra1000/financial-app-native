// Investment utility functions for compound interest calculations

export interface ROIBreakdown {
  bond_percent: number;
  platform_percent: number;
  total_percent: number;
}

/**
 * Convert annual percentage rate to daily compound rate
 * Formula: dailyRate = (1 + annualRate)^(1/365) - 1
 * @param annualPercent Annual percentage rate (e.g., 20 for 20%)
 * @returns Daily compound rate as decimal (e.g., 0.0005479)
 */
export function calculateDailyRate(annualPercent: number): number {
  const annualRate = annualPercent / 100;
  const dailyRate = Math.pow(1 + annualRate, 1 / 365) - 1;
  return dailyRate;
}

/**
 * Calculate compound interest for a given period
 * Formula: futureValue = principal × (1 + dailyRate)^days
 * @param principal Initial investment amount
 * @param dailyRate Daily compound rate as decimal
 * @param days Number of days to calculate
 * @returns Total amount after compound interest
 */
export function calculateCompoundInterest(principal: number, dailyRate: number, days: number): number {
  return principal * Math.pow(1 + dailyRate, days);
}

/**
 * Calculate current value of investment since start date
 * @param principal Initial investment amount
 * @param dailyRate Daily compound rate as decimal
 * @param startDate Start date of investment (ISO string or Date)
 * @returns Current value including compound interest
 */
export function calculateCurrentValue(principal: number, dailyRate: number, startDate: string | Date): number {
  const start = new Date(startDate);
  const now = new Date();
  const daysPassed = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysPassed <= 0) return principal;
  
  return calculateCompoundInterest(principal, dailyRate, daysPassed);
}

/**
 * Get ROI breakdown showing bond and platform portions
 * @param totalPercent Total annual percentage (e.g., 20 for 20%)
 * @returns Object with bond, platform, and total percentages
 */
export function getROIBreakdown(totalPercent: number): ROIBreakdown {
  // For this app, we use 60% bond, 40% platform split
  // Example: 20% total = 12% bond + 8% platform
  const bond_percent = totalPercent * 0.6;
  const platform_percent = totalPercent * 0.4;
  
  return {
    bond_percent,
    platform_percent,
    total_percent: totalPercent
  };
}

/**
 * Format daily rate as percentage string
 * @param dailyRate Daily rate as decimal
 * @returns Formatted string (e.g., "0.05479%")
 */
export function formatDailyRate(dailyRate: number): string {
  const percent = dailyRate * 100;
  return `${percent.toFixed(5)}%`;
}

/**
 * Calculate expected total return for investment duration
 * @param principal Initial investment amount
 * @param annualPercent Annual percentage rate
 * @param durationDays Investment duration in days
 * @returns Object with principal, profit, and total
 */
export function calculateExpectedReturn(principal: number, annualPercent: number, durationDays: number) {
  const dailyRate = calculateDailyRate(annualPercent);
  const totalValue = calculateCompoundInterest(principal, dailyRate, durationDays);
  const profit = totalValue - principal;
  
  return {
    principal,
    profit,
    total: totalValue,
    dailyRate,
    dailyEarnings: principal * dailyRate
  };
}

/**
 * Calculate days remaining until investment maturity
 * @param startDate Investment start date
 * @param durationDays Total investment duration
 * @returns Days remaining (0 if matured)
 */
export function calculateDaysRemaining(startDate: string | Date, durationDays: number): number {
  const start = new Date(startDate);
  const now = new Date();
  const daysPassed = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const remaining = durationDays - daysPassed;
  return Math.max(0, remaining);
}

/**
 * Calculate progress percentage of investment
 * @param startDate Investment start date
 * @param durationDays Total investment duration
 * @returns Progress percentage (0-100)
 */
export function calculateProgress(startDate: string | Date, durationDays: number): number {
  const start = new Date(startDate);
  const now = new Date();
  const daysPassed = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const progress = (daysPassed / durationDays) * 100;
  return Math.min(100, Math.max(0, progress));
}
