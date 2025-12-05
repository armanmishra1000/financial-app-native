// Investment utility functions for compound interest calculations

export interface ROIBreakdown {
  bond_percent: number;
  platform_percent: number;
  total_percent: number;
}

export interface FixedDailyReturnProjection {
  principal: number;
  dailyRate: number;
  dailyEarnings: number;
  totalGrowth: number;
  finalValue: number;
  daysUsed: number;
}

export const FIXED_DAILY_RATE_PERCENT = 0.05479;
const FIXED_DAILY_RATE_DECIMAL = FIXED_DAILY_RATE_PERCENT / 100;

const PLAN_DAYS_BY_ID: Record<string, number> = {
  p1: 90,
  p2: 180,
  p3: 365,
};

const NORMALIZED_PLAN_ID_MAP: Record<string, string> = Object.keys(PLAN_DAYS_BY_ID).reduce(
  (accumulator, planId) => {
    accumulator[planId.toLowerCase()] = planId;
    return accumulator;
  },
  {} as Record<string, string>,
);

export function getFixedPlanDays(planId: string, fallbackDays = 0): number {
  if (!planId) {
    return fallbackDays;
  }

  const normalizedId = planId.toLowerCase();
  const canonicalId = NORMALIZED_PLAN_ID_MAP[normalizedId];
  if (canonicalId) {
    return PLAN_DAYS_BY_ID[canonicalId];
  }

  return fallbackDays;
}

export function calculateFixedDailyReturns(
  principalUSD: number,
  planId: string,
  fallbackDays = 0,
): FixedDailyReturnProjection | null {
  if (!Number.isFinite(principalUSD) || principalUSD <= 0) {
    return null;
  }

  const daysUsed = getFixedPlanDays(planId, fallbackDays);
  if (daysUsed <= 0) {
    return null;
  }

  const dailyRate = FIXED_DAILY_RATE_DECIMAL;
  const finalValue = principalUSD * Math.pow(1 + dailyRate, daysUsed);
  const totalGrowth = finalValue - principalUSD;
  const dailyEarnings = principalUSD * dailyRate;

  return {
    principal: principalUSD,
    dailyRate,
    dailyEarnings,
    totalGrowth,
    finalValue,
    daysUsed,
  };
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

/**
 * Calculate lock expiry date (30 days from start date)
 * @param startDate Investment start date
 * @returns ISO string for lock expiry date
 */
export function calculateLockExpiry(startDate: string | Date): string {
  const start = new Date(startDate);
  const lockExpiry = new Date(start.getTime() + 30 * 24 * 60 * 60 * 1000);
  return lockExpiry.toISOString();
}

/**
 * Check if investment is currently locked
 * @param lockedUntil Lock expiry date
 * @returns true if locked, false if unlocked
 */
export function isInvestmentLocked(lockedUntil: string): boolean {
  const now = new Date();
  const lockExpiry = new Date(lockedUntil);
  return now < lockExpiry;
}

/**
 * Get remaining days until unlock
 * @param lockedUntil Lock expiry date
 * @returns Number of days remaining (0 if unlocked)
 */
export function getDaysUntilUnlock(lockedUntil: string): number {
  const now = new Date();
  const lockExpiry = new Date(lockedUntil);
  const msRemaining = lockExpiry.getTime() - now.getTime();
  const daysRemaining = Math.ceil(msRemaining / (1000 * 60 * 60 * 24));
  return Math.max(0, daysRemaining);
}

/**
 * Format lock expiry date for display
 * @param lockedUntil Lock expiry date
 * @returns Formatted date string (e.g., "Oct 28, 2025")
 */
export function formatLockExpiry(lockedUntil: string): string {
  const lockExpiry = new Date(lockedUntil);
  return lockExpiry.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
}
