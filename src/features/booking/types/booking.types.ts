/**
 * Booking & Pricing Domain Interfaces
 */

export interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

export interface GuestCounts {
  adults: number;
  children: number;
  infants: number;
  pets: number;
}

export interface PricingBreakdown {
  nights: number;
  baseRatePerNight: number;
  baseTotal: number;
  cleaningFee: number;
  serviceFee: number;
  taxAmount: number;
  grandTotal: number;
}
