'use client';

import React, { useState } from 'react';
import { Star, ChevronDown, ChevronUp } from 'lucide-react';
import { useBookingPricing } from '../hooks/useBookingPricing';
import { formatCurrency } from '@/lib/formatters';
import { ListingDetail } from '@/types';

interface StickyBookingWidgetProps {
  listing: ListingDetail;
  startDate: Date | null;
  endDate: Date | null;
  onOpenCalendar?: () => void;
}

export function StickyBookingWidget({
  listing,
  startDate,
  endDate,
  onOpenCalendar,
}: StickyBookingWidgetProps) {
  const [guests] = useState({ adults: 2, children: 0, infants: 0, pets: 0 });
  const [isGuestOpen, setIsGuestOpen] = useState(false);

  const pricing = useBookingPricing({
    startDate,
    endDate,
    basePricePerNight: listing.pricing.basePricePerNight,
  });

  const totalGuests = guests.adults + guests.children;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-[0_6px_16px_rgba(0,0,0,0.12)] sticky top-28 space-y-4">
      
      {/* Price Header */}
      <div className="flex items-baseline justify-between">
        <div>
          <span className="text-2xl font-extrabold text-slate-900">
            {formatCurrency(listing.pricing.basePricePerNight)}
          </span>
          <span className="text-xs text-slate-500 font-normal"> / night</span>
        </div>

        <div className="flex items-center gap-1 text-xs font-semibold text-slate-800">
          <Star className="w-3.5 h-3.5 fill-current text-slate-900" />
          <span>{listing.ratings.overall}</span>
          <span className="text-slate-400">·</span>
          <span className="underline text-slate-500 font-normal">{listing.ratings.reviewCount} reviews</span>
        </div>
      </div>

      {/* Segmented Booking Box */}
      <div className="border border-slate-300 rounded-xl overflow-hidden text-xs">
        {/* Date Row */}
        <div
          onClick={onOpenCalendar}
          className="grid grid-cols-2 border-b border-slate-300 cursor-pointer divide-x divide-slate-300"
        >
          <div className="p-2.5 hover:bg-slate-50 transition">
            <span className="block text-[9px] font-extrabold uppercase text-slate-600">Check-in</span>
            <span className="font-semibold text-slate-900">
              {startDate ? startDate.toLocaleDateString() : 'Add date'}
            </span>
          </div>
          <div className="p-2.5 hover:bg-slate-50 transition">
            <span className="block text-[9px] font-extrabold uppercase text-slate-600">Checkout</span>
            <span className="font-semibold text-slate-900">
              {endDate ? endDate.toLocaleDateString() : 'Add date'}
            </span>
          </div>
        </div>

        {/* Guest Selector Trigger */}
        <div
          onClick={() => setIsGuestOpen(!isGuestOpen)}
          className="p-2.5 flex justify-between items-center cursor-pointer hover:bg-slate-50 transition"
        >
          <div>
            <span className="block text-[9px] font-extrabold uppercase text-slate-600">Guests</span>
            <span className="font-semibold text-slate-900">
              {totalGuests} guest{totalGuests > 1 ? 's' : ''}
              {guests.infants > 0 && `, ${guests.infants} infant${guests.infants > 1 ? 's' : ''}`}
            </span>
          </div>
          {isGuestOpen ? <ChevronUp className="w-4 h-4 text-slate-600" /> : <ChevronDown className="w-4 h-4 text-slate-600" />}
        </div>
      </div>

      {/* Reserve Button */}
      <button className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FF385C] via-[#E00B41] to-[#D70466] text-white font-bold text-sm shadow-md hover:opacity-95 transition cursor-pointer">
        Reserve
      </button>

      <p className="text-center text-xs text-slate-500">
        You won&apos;t be charged yet
      </p>

      {/* Dynamic Price Breakdown */}
      <div className="space-y-3 pt-3 border-t border-slate-100 text-xs text-slate-700">
        <div className="flex justify-between">
          <span className="underline">
            {formatCurrency(pricing.baseRatePerNight)} x {pricing.nights} nights
          </span>
          <span>{formatCurrency(pricing.baseTotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="underline">Cleaning fee</span>
          <span>{formatCurrency(pricing.cleaningFee)}</span>
        </div>
        <div className="flex justify-between">
          <span className="underline">Airbnb service fee</span>
          <span>{formatCurrency(pricing.serviceFee)}</span>
        </div>
        <div className="flex justify-between font-bold text-slate-900 pt-3 border-t border-slate-200 text-sm">
          <span>Total before taxes</span>
          <span>{formatCurrency(pricing.grandTotal)}</span>
        </div>
      </div>

      {/* Report Listing */}
      <div className="pt-2 text-center">
        <button className="text-[11px] text-slate-400 hover:text-slate-600 underline transition">
          Report this listing
        </button>
      </div>

    </div>
  );
}
