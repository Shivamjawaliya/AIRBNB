import { format, differenceInCalendarDays } from 'date-fns';

/**
 * Format numbers into currency strings (INR by default)
 */
export function formatCurrency(amount: number, currency: string = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format date range into readable string e.g. "Oct 20 – Oct 25"
 */
export function formatDateRange(startDate?: Date | null, endDate?: Date | null): string {
  if (!startDate) return 'Add dates';
  if (!endDate) return `${format(startDate, 'MMM d')} – Checkout`;
  return `${format(startDate, 'MMM d')} – ${format(endDate, 'MMM d, yyyy')}`;
}

/**
 * Calculate total nights between two dates
 */
export function calculateNights(startDate?: Date | null, endDate?: Date | null): number {
  if (!startDate || !endDate) return 0;
  const days = differenceInCalendarDays(endDate, startDate);
  return Math.max(0, days);
}
