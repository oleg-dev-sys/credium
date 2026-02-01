/**
 * Calculate approval probability based on user parameters
 * This is a client-side estimation helper
 */
export function calculateApprovalChance(params: {
  amount: number;
  income: number;
  creditScore: number;
  existingDebt?: number;
  employmentYears?: number;
}): number {
  const { amount, income, creditScore, existingDebt = 0, employmentYears = 1 } = params;

  // Base calculation
  let chance = 50;

  // Income factor (up to +25)
  const monthlyIncome = income;
  const requestedMonthly = amount / 12;
  const debtToIncome = (requestedMonthly + existingDebt) / monthlyIncome;

  if (debtToIncome < 0.3) {
    chance += 25;
  } else if (debtToIncome < 0.5) {
    chance += 15;
  } else if (debtToIncome < 0.7) {
    chance += 5;
  } else {
    chance -= 10;
  }

  // Credit score factor (up to +25)
  if (creditScore >= 80) {
    chance += 25;
  } else if (creditScore >= 60) {
    chance += 15;
  } else if (creditScore >= 40) {
    chance += 5;
  } else {
    chance -= 5;
  }

  // Employment stability (up to +10)
  if (employmentYears >= 3) {
    chance += 10;
  } else if (employmentYears >= 1) {
    chance += 5;
  }

  // Clamp to valid range
  return Math.max(5, Math.min(99, chance));
}

/**
 * Get approval chance label
 */
export function getApprovalLabel(chance: number): {
  label: string;
  color: 'success' | 'warning' | 'danger';
} {
  if (chance >= 75) {
    return { label: 'Высокий шанс', color: 'success' };
  }
  if (chance >= 50) {
    return { label: 'Средний шанс', color: 'warning' };
  }
  return { label: 'Низкий шанс', color: 'danger' };
}
