import { useData } from '../context';
import { calculateDailyRate, calculateCurrentValue, calculateDaysRemaining, calculateProgress, getROIBreakdown } from '../lib/investment-utils';
import { getPlanById } from '../lib/data';

/**
 * Hook for investment-related calculations
 * Moves complex computed functions out of context to reduce type complexity
 */
export function useInvestmentCalculations() {
  const { investments } = useData();

  const getInvestmentCurrentValue = (investmentId: string): number => {
    const investment = investments.find(inv => inv.id === investmentId);
    if (!investment || investment.status !== 'Active') return 0;
    
    const plan = getPlanById(investment.planId);
    if (!plan) {
      return investment.amount;
    }
    
    const dailyRate = calculateDailyRate(plan.roi_percent);
    return calculateCurrentValue(investment.amount, dailyRate, investment.startDate);
  };

  const getInvestmentProgress = (investmentId: string): number => {
    const investment = investments.find(inv => inv.id === investmentId);
    if (!investment || investment.status !== 'Active') return 0;

    const plan = getPlanById(investment.planId);
    if (!plan) {
      return 0;
    }

    return calculateProgress(investment.startDate, plan.duration_days);
  };

  const getInvestmentDaysRemaining = (investmentId: string): number => {
    const investment = investments.find(inv => inv.id === investmentId);
    if (!investment || investment.status !== 'Active') return 0;

    const plan = getPlanById(investment.planId);
    if (!plan) {
      return 0;
    }

    return calculateDaysRemaining(investment.startDate, plan.duration_days);
  };

  const getInvestmentROIBreakdown = (investmentId: string) => {
    const investment = investments.find(inv => inv.id === investmentId);
    if (!investment || investment.status !== 'Active') return null;

    const plan = getPlanById(investment.planId);
    if (!plan) {
      return null;
    }

    return getROIBreakdown(plan.roi_percent);
  };

  return {
    getInvestmentCurrentValue,
    getInvestmentProgress,
    getInvestmentDaysRemaining,
    getInvestmentROIBreakdown,
  };
}
