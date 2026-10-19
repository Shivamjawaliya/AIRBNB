'use client';

import { useMemo } from 'react';
import { calculateNights } from '@/lib/formatters';
import { DEFAULT_FEES } from '@/lib/constants';
import { PricingBreakdown } from '../types/booking.types';

interface UseBookingPricingParams {
  startDate: Date | null;
  endDate: Date | null;
  basePricePerNight: number;
}

export function useBookingPricing({
  startDate,
  endDate,
  basePricePerNight,
}: UseBookingPricingParams): PricingBreakdown {
  return useMemo(() => {
    const nights = calculateNights(startDate, endDate) || 5; // Default 5 nights if unselected
    const baseTotal = nights * basePricePerNight;
    const cleaningFee = DEFAULT_FEES.cleaningFee;
    const serviceFee = Math.round(baseTotal * DEFAULT_FEES.serviceFeeRate);
    const taxAmount = Math.round((baseTotal + cleaningFee + serviceFee) * DEFAULT_FEES.taxRate);
    const grandTotal = baseTotal + cleaningFee + serviceFee;

    return {
      nights,
      baseRatePerNight: basePricePerNight,
      baseTotal,
      cleaningFee,
      serviceFee,
      taxAmount,
      grandTotal,
    };
  }, [startDate, endDate, basePricePerNight]);
}
