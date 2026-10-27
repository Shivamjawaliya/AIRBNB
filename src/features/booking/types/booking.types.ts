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

export interface ConfigPricing {
  currency: string;
  nightlyRate: number;
  cleaningFee: number;
}

export interface GuestConstraints {
  min: number;
  max: number;
}

export interface StayConstraints {
  minNights: number;
  maxNights: number;
}

export interface HouseRulesConfig {
  petsAllowed: boolean;
  smokingAllowed: boolean;
  partiesAllowed: boolean;
}

export interface ListingConfigResponse {
  disabledDates: string[];
  guestConstraints: GuestConstraints;
  stayConstraints: StayConstraints;
  pricing: ConfigPricing;
  houseRules: HouseRulesConfig;
}

