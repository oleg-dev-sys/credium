/**
 * Format number as Russian currency (₽)
 */
export function formatCurrency(
  amount: number,
  options?: {
    showSymbol?: boolean;
    decimals?: number;
  }
): string {
  const { showSymbol = true, decimals = 0 } = options || {};

  const formatted = new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);

  return showSymbol ? `${formatted} ₽` : formatted;
}

/**
 * Format percentage
 */
export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format APR display
 */
export function formatAPR(apr: number): string {
  if (apr === 0) return 'Без %';
  if (apr < 1) {
    return `${apr.toFixed(1)}% в день`;
  }
  return `${apr.toFixed(1)}% годовых`;
}
