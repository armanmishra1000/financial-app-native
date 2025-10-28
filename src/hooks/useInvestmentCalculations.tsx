import { useData } from '../context';
import { calculateDailyRate, calculateCurrentValue, calculateDaysRemaining, calculateProgress, getROIBreakdown } from '../lib/investment-utils';

/**
 * Hook for investment-related calculations
 * Moves complex computed functions out of context to reduce type complexity
 */
export function useInvestmentCalculations() {
  const { investments } = useData();

  const getInvestmentCurrentValue = (investmentId: string): number => {
    const investment = investments.find(inv => inv.id === investmentId);
    if (!investment || investment.status !== 'Active') return 0;
    
    // Find the plan to get ROI percentage
    const plans = [
      { id: "p1", roi_percent: 2.0 },
      { id: "p2", roi_percent: 10.0 },
      { id: "p3", roi_percent: 40.0 },
      { id: "p4", roi_percent: 90.0 }
    ];
    const plan = plans.find((p: any) => p.id === investment.planId);
    if (!plan) return investment.amount;
    
    const dailyRate = calculateDailyRate(plan.roi_percent);
    return calculateCurrentValue(investment.amount, dailyRate, investment.startDate);
  };

  const getInvestmentProgress = (investmentId: string): number => {
    const investment = investments.find(inv => inv.id === investmentId);
    if (!investment || investment.status !== 'Active') return 0;
    
    const plans = [
      { id: "p1", duration: 7 },
      { id: "p2", duration: 30 },
      { id: "p3", duration: 180 },
      { id: "p4", duration: 365 }
    ];
    const plan = plans.find((p: any) => p.id === investment.planId);
    if (!plan) return 0;
    
    return calculateProgress(investment.startDate, plan.duration);
  };

  const getInvestmentDaysRemaining = (investmentId: string): number => {
    const investment = investments.find(inv => inv.id === investmentId);
    if (!investment || investment.status !== 'Active') return 0;
    
    const plans = [
      { id: "p1", duration: 7 },
      { id: "p2", duration: 30 },
      { id: "p3", duration: 180 },
      { id: "p4", duration: 365 }
    ];
    const plan = plans.find((p: any) => p.id === investment.planId);
    if (!plan) return 0;
    
    return calculateDaysRemaining(investment.startDate, plan.duration);
  };

  const getInvestmentROIBreakdown = (investmentId: string) => {
    const investment = investments.find(inv => inv.id === investmentId);
    if (!investment || investment.status !== 'Active') return null;
    
    const plans = [
      { id: "p1", roi_percent: 2.0 },
      { id: "p2", roi_percent: 10.0 },
      { id: "p3", roi_percent: 40.0 },
      { id: "p4", roi_percent: 90.0 }
    ];
    const plan = plans.find((p: any) => p.id === investment.planId);
    if (!plan) return null;
    
    return getROIBreakdown(plan.roi_percent);
  };

  return {
    getInvestmentCurrentValue,
    getInvestmentProgress,
    getInvestmentDaysRemaining,
    getInvestmentROIBreakdown,
  };
}
