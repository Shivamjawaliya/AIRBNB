'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, Flag, Minus, Plus } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import { ListingDetail } from '@/types';

interface StickyBookingWidgetProps {
  listing: ListingDetail;
  startDate: Date | null;
  endDate: Date | null;
  onOpenCalendar?: () => void;
  onDatesChange?: (start: Date | null, end: Date | null) => void;
}

export function StickyBookingWidget({
  listing,
  startDate,
  endDate,
  onOpenCalendar,
}: StickyBookingWidgetProps) {
  const [guests, setGuests] = useState({ adults: 1, children: 0, infants: 0, pets: 0 });
  const [isGuestOpen, setIsGuestOpen] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const guestMenuRef = useRef<HTMLDivElement>(null);

  // Close guest dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (guestMenuRef.current && !guestMenuRef.current.contains(e.target as Node)) {
        setIsGuestOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalGuests = guests.adults + guests.children;
  let guestText = `${totalGuests} guest${totalGuests > 1 ? 's' : ''}`;
  if (guests.infants > 0) guestText += `, ${guests.infants} infant${guests.infants > 1 ? 's' : ''}`;
  if (guests.pets > 0) guestText += `, ${guests.pets} pet${guests.pets > 1 ? 's' : ''}`;

  // Date formatting matching screenshot: 11/6/2026
  const formatBoxDate = (d: Date | null) => {
    if (!d) return 'Add date';
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
  };

  // Calculate nights
  const nights = startDate && endDate
    ? Math.max(1, Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)))
    : 2;

  const basePricePerNight = listing.pricing?.basePricePerNight || 4349;
  const totalPrice = nights * basePricePerNight;

  const updateGuestCount = (type: 'adults' | 'children' | 'infants' | 'pets', delta: number) => {
    setGuests((prev) => {
      const current = prev[type];
      const updated = Math.max(type === 'adults' ? 1 : 0, current + delta);
      return { ...prev, [type]: updated };
    });
  };

  return (
    <div className="w-full">
      {/* 1. Promo / Seasonal Incentive Card (Screenshot 1, 2, 3) */}
      <div className="mb-6 p-4 rounded-xl border border-[#dddddd] shadow-xs bg-white flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* Green Discount Tag Icon */}
          <div className="flex-shrink-0 text-[#008A05]">
            <svg viewBox="0 0 32 32" className="w-6 h-6 fill-current" aria-hidden="true">
              <path d="M12.6 2.3a3 3 0 0 1 2.1.9l14.4 14.4a3 3 0 0 1 0 4.2l-8.6 8.6a3 3 0 0 1-4.2 0L1.9 16a3 3 0 0 1-.9-2.1V6a3 3 0 0 1 3-3h8.6zm-4.1 6.2a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
            </svg>
          </div>
          <div className="text-[14px] leading-tight truncate">
            <span className="font-normal text-[#222222]">Take 10% off your next stay. </span>
            <a
              href="https://www.airbnb.co.in/e/seasonal_incentive_y26_sep_auto_claim_in"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-[#222222] font-medium hover:text-black cursor-pointer inline-block"
            >
              Terms apply
            </a>
          </div>
        </div>

        <button
          onClick={() => setIsClaimed(true)}
          className={`flex-shrink-0 px-4 py-2 rounded-lg border text-[13px] font-semibold transition cursor-pointer ${
            isClaimed
              ? 'bg-[#008A05] text-white border-[#008A05]'
              : 'border-[#222222] text-[#222222] hover:bg-neutral-50 active:scale-98'
          }`}
        >
          {isClaimed ? 'Claimed' : 'Claim'}
        </button>
      </div>

      {/* 2. Main Reservation Floating Card */}
      <div className="bg-white rounded-2xl p-6 border border-[#dddddd] shadow-[0_6px_16px_rgba(0,0,0,0.12)] space-y-4">
        
        {/* Price Header matching Screenshot */}
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-[22px] font-semibold text-[#222222] tracking-tight">
              {formatCurrency(totalPrice)}
            </span>
            <span className="text-[16px] text-[#222222] font-normal">
              {' '}for {nights} night{nights > 1 ? 's' : ''}
            </span>
          </div>

          <button
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="text-[12px] underline text-[#717171] hover:text-[#222222] font-medium cursor-pointer"
          >
            {showBreakdown ? 'Hide details' : 'Show breakdown'}
          </button>
        </div>

        {/* Price Breakdown dropdown if opened */}
        {showBreakdown && (
          <div className="py-3 px-3.5 bg-[#f7f7f7] rounded-xl text-xs space-y-2 border border-slate-200">
            <div className="flex justify-between text-slate-700">
              <span>{formatCurrency(basePricePerNight)} × {nights} nights</span>
              <span>{formatCurrency(totalPrice)}</span>
            </div>
            <div className="flex justify-between text-slate-700">
              <span>Cleaning fee</span>
              <span className="text-emerald-700 font-medium">Free</span>
            </div>
            <div className="flex justify-between text-slate-700">
              <span>Airbnb service fee</span>
              <span className="text-emerald-700 font-medium">₹0</span>
            </div>
            <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-slate-900">
              <span>Total before taxes</span>
              <span>{formatCurrency(totalPrice)}</span>
            </div>
          </div>
        )}

        {/* Segmented Booking Box matching Screenshot */}
        <div className="border border-[#b0b0b0] rounded-xl overflow-visible relative text-xs">
          {/* Check-in & Checkout 2-column row */}
          <div
            onClick={onOpenCalendar}
            className="grid grid-cols-2 divide-x divide-[#b0b0b0] border-b border-[#b0b0b0] cursor-pointer"
          >
            <div className="p-3 hover:bg-neutral-50 rounded-tl-xl transition">
              <span className="block text-[10px] font-extrabold uppercase text-[#222222] tracking-wider">
                CHECK-IN
              </span>
              <span className="text-[14px] text-[#222222] font-normal block mt-0.5">
                {formatBoxDate(startDate)}
              </span>
            </div>

            <div className="p-3 hover:bg-neutral-50 rounded-tr-xl transition">
              <span className="block text-[10px] font-extrabold uppercase text-[#222222] tracking-wider">
                CHECKOUT
              </span>
              <span className="text-[14px] text-[#222222] font-normal block mt-0.5">
                {formatBoxDate(endDate)}
              </span>
            </div>
          </div>

          {/* Guests Selector Row with dropdown */}
          <div ref={guestMenuRef} className="relative">
            <div
              onClick={() => setIsGuestOpen(!isGuestOpen)}
              className="p-3 flex justify-between items-center cursor-pointer hover:bg-neutral-50 rounded-b-xl transition"
            >
              <div>
                <span className="block text-[10px] font-extrabold uppercase text-[#222222] tracking-wider">
                  GUESTS
                </span>
                <span className="text-[14px] text-[#222222] font-normal block mt-0.5 truncate">
                  {guestText}
                </span>
              </div>
              {isGuestOpen ? (
                <ChevronUp className="w-5 h-5 text-[#222222]" />
              ) : (
                <ChevronDown className="w-5 h-5 text-[#222222]" />
              )}
            </div>

            {/* Guest Popover Menu */}
            {isGuestOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl p-4 shadow-[0_6px_20px_rgba(0,0,0,0.18)] border border-[#dddddd] z-50 space-y-4">
                {/* Adults */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[14px] font-semibold text-[#222222]">Adults</div>
                    <div className="text-[12px] text-[#717171]">Age 13+</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateGuestCount('adults', -1)}
                      disabled={guests.adults <= 1}
                      className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-700 disabled:opacity-30 cursor-pointer hover:border-black"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-sm font-semibold w-4 text-center">{guests.adults}</span>
                    <button
                      onClick={() => updateGuestCount('adults', 1)}
                      disabled={totalGuests >= 6}
                      className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-700 cursor-pointer hover:border-black"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Children */}
                <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                  <div>
                    <div className="text-[14px] font-semibold text-[#222222]">Children</div>
                    <div className="text-[12px] text-[#717171]">Ages 2–12</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateGuestCount('children', -1)}
                      disabled={guests.children <= 0}
                      className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-700 disabled:opacity-30 cursor-pointer hover:border-black"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-sm font-semibold w-4 text-center">{guests.children}</span>
                    <button
                      onClick={() => updateGuestCount('children', 1)}
                      disabled={totalGuests >= 6}
                      className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-700 cursor-pointer hover:border-black"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Close Button */}
                <div className="border-t border-slate-100 pt-3 text-right">
                  <button
                    onClick={() => setIsGuestOpen(false)}
                    className="text-[13px] font-semibold text-[#222222] underline cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Free Cancellation Capsule matching Screenshot */}
        <div className="py-2.5 px-3 rounded-lg bg-[#f7f7f7] text-center text-[12px] text-[#222222] font-medium">
          Free cancellation before 5 November
        </div>

        {/* Reserve Button matching Screenshot */}
        <button className="w-full py-3.5 rounded-lg bg-[#E00B41] hover:bg-[#D70466] text-white font-semibold text-[16px] transition cursor-pointer active:scale-[0.99] shadow-xs">
          Reserve
        </button>

        {/* Caption */}
        <p className="text-center text-[12px] text-[#717171] pt-1">
          You won&apos;t be charged yet
        </p>
      </div>

      {/* 3. Report this listing link with Flag Icon */}
      <div className="mt-6 text-center">
        <button className="inline-flex items-center gap-2 text-[14px] text-[#717171] hover:text-[#222222] underline font-medium transition cursor-pointer">
          <Flag className="w-4 h-4 fill-current text-[#717171]" />
          <span>Report this listing</span>
        </button>
      </div>
    </div>
  );
}
