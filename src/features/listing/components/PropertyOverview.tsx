'use client';

import React, { useState } from 'react';
import {
  Utensils,
  Wifi,
  Laptop,
  Car,
  Tv,
  Wind,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  X,
  BedDouble,
  Check,
} from 'lucide-react';
import { ListingDetail } from '@/types';

interface PropertyOverviewProps {
  listing: ListingDetail;
  startDate: Date | null;
  endDate: Date | null;
  onDatesChange: (start: Date | null, end: Date | null) => void;
}

export function PropertyOverview({
  listing,
  startDate,
  endDate,
  onDatesChange,
}: PropertyOverviewProps) {
  const [calendarMonthOffset, setCalendarMonthOffset] = useState(0); // 0 = Nov/Dec 2026
  const [isAmenitiesModalOpen, setIsAmenitiesModalOpen] = useState(false);

  // November 2026 base
  const baseYear = 2026;
  const baseMonth = 10; // 0-indexed: 10 = November

  const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const getMonthData = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth, year, month };
  };

  const month1Data = getMonthData(
    baseYear + Math.floor((baseMonth + calendarMonthOffset) / 12),
    (baseMonth + calendarMonthOffset) % 12
  );
  const month2Data = getMonthData(
    baseYear + Math.floor((baseMonth + calendarMonthOffset + 1) / 12),
    (baseMonth + calendarMonthOffset + 1) % 12
  );

  const formatDateStr = (d: Date | null) => {
    if (!d) return null;
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const startStr = formatDateStr(startDate);
  const endStr = formatDateStr(endDate);

  const handleDateClick = (dateStr: string) => {
    const clickedDate = new Date(dateStr);
    if (!startDate || (startDate && endDate)) {
      onDatesChange(clickedDate, null);
    } else if (startDate && !endDate) {
      if (clickedDate.getTime() < startDate.getTime()) {
        onDatesChange(clickedDate, null);
      } else {
        onDatesChange(startDate, clickedDate);
      }
    }
  };

  const clearDates = () => {
    onDatesChange(null, null);
  };

  const nights = startDate && endDate
    ? Math.max(1, Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)))
    : 2;

  const renderMonthCalendar = (data: ReturnType<typeof getMonthData>) => {
    const { firstDay, daysInMonth, year, month } = data;
    const cells = [];

    // Empty lead cells
    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${i}`} className="h-10" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isStart = startStr === dateStr;
      const isEnd = endStr === dateStr;
      const inRange = Boolean(startStr && endStr && dateStr > startStr && dateStr < endStr);

      cells.push(
        <div key={dateStr} className="h-10 flex items-center justify-center relative select-none">
          {inRange && (
            <div className="absolute inset-y-0 inset-x-0 bg-[#F7F7F7]" />
          )}
          {isStart && endStr && (
            <div className="absolute inset-y-0 right-0 left-1/2 bg-[#F7F7F7]" />
          )}
          {isEnd && startStr && (
            <div className="absolute inset-y-0 left-0 right-1/2 bg-[#F7F7F7]" />
          )}

          <button
            onClick={() => handleDateClick(dateStr)}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-[14px] z-10 transition cursor-pointer ${
              isStart || isEnd
                ? 'bg-[#222222] text-white font-semibold'
                : inRange
                ? 'font-medium text-[#222222] hover:bg-slate-200'
                : 'text-[#222222] font-normal hover:bg-slate-100'
            }`}
          >
            {day}
          </button>
        </div>
      );
    }

    return cells;
  };

  return (
    <div className="space-y-8">
      {/* 1. Entire rental unit in Pune City, India & Capacity Subtitle */}
      <div className="pt-2 sm:pt-4">
        <h2 className="text-[24px] sm:text-[26px] md:text-[28px] font-semibold text-[#222222] tracking-tight leading-snug">
          {listing.propertyType} in {listing.location.city}, {listing.location.country}
        </h2>
        <p className="text-[16px] text-[#222222] mt-1 font-normal">
          {listing.capacity.guests} guests · {listing.capacity.bedrooms} bedrooms · {listing.capacity.beds} beds · {listing.capacity.bathrooms} bathrooms
        </p>

        {/* Free Cancellation Capsule Badge */}
        <div className="mt-3">
          <span className="inline-block px-3 py-1 rounded-full bg-[#f7f7f7] text-[#222222] text-[12px] font-semibold">
            Free cancellation
          </span>
        </div>
      </div>

      {/* 2. Laurel Wreath "Guest favourite" Banner (Matches Screenshot 1) */}
      <div className="p-5 sm:p-6 rounded-2xl border border-[#dddddd] flex items-center justify-between gap-4 bg-white">
        {/* Left: Laurel branches framing "Guest favourite" */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Left Laurel Branch */}
          <svg viewBox="0 0 24 36" className="w-5 h-8 text-[#222222] fill-current">
            <path d="M11.5 2C10.8 7.2 8.4 12.3 5 16.5c-3.1 3.9-3.9 8.2-2.5 12.8 1.4 4.5 4.8 6.7 8.5 6.7.7 0 1-.3 1-.9 0-.6-.3-.9-1-.9-3.2 0-6-1.9-7.2-5.7-1.2-3.9-.4-7.5 2.2-10.8 3.2-4 5.4-8.7 6.1-13.6.1-.7-.4-1.2-1.1-1.3-.8-.1-1.4.3-1.5 1z" />
          </svg>
          <div className="text-[15px] sm:text-[16px] font-semibold text-[#222222] leading-tight text-center">
            Guest<br />favourite
          </div>
          {/* Right Laurel Branch (Mirrored) */}
          <svg viewBox="0 0 24 36" className="w-5 h-8 text-[#222222] fill-current -scale-x-100">
            <path d="M11.5 2C10.8 7.2 8.4 12.3 5 16.5c-3.1 3.9-3.9 8.2-2.5 12.8 1.4 4.5 4.8 6.7 8.5 6.7.7 0 1-.3 1-.9 0-.6-.3-.9-1-.9-3.2 0-6-1.9-7.2-5.7-1.2-3.9-.4-7.5 2.2-10.8 3.2-4 5.4-8.7 6.1-13.6.1-.7-.4-1.2-1.1-1.3-.8-.1-1.4.3-1.5 1z" />
          </svg>
        </div>

        {/* Center: Descriptive text */}
        <div className="hidden sm:block text-[14px] sm:text-[15px] text-[#222222] font-normal leading-snug max-w-[280px]">
          One of the most loved homes on Airbnb, according to guests
        </div>

        {/* Right: 5.0 Rating with 5 stars & 9 Reviews */}
        <div className="flex items-center gap-3 sm:gap-5 flex-shrink-0">
          {/* Rating */}
          <div className="text-center">
            <div className="text-[20px] sm:text-[22px] font-semibold text-[#222222] leading-none">
              5.0
            </div>
            <div className="flex items-center justify-center gap-0.5 mt-1.5">
              {[...Array(5)].map((_, i) => (
                <svg key={i} viewBox="0 0 32 32" className="w-2.5 h-2.5 fill-[#222222]">
                  <path d="M16 2l4.5 9.1 10 1.5-7.3 7.1 1.7 10-8.9-4.7-8.9 4.7 1.7-10-7.3-7.1 10-1.5z" />
                </svg>
              ))}
            </div>
          </div>

          {/* Vertical subtle divider */}
          <div className="h-8 w-[1px] bg-[#dddddd]" />

          {/* Reviews */}
          <div className="text-center">
            <div className="text-[20px] sm:text-[22px] font-semibold text-[#222222] leading-none">
              9
            </div>
            <div className="text-[12px] underline font-semibold text-[#222222] mt-1 cursor-pointer">
              Reviews
            </div>
          </div>
        </div>
      </div>

      {/* 3. Host Profile Snippet (Matches Screenshot 1) */}
      <div className="flex items-center gap-4 pt-2">
        <div className="relative">
          <img
            src={listing.host.avatarUrl}
            alt={listing.host.name}
            className="w-12 h-12 rounded-full object-cover border border-slate-200"
          />
          {listing.host.isSuperhost && (
            <div
              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#E00B41] text-white flex items-center justify-center shadow-xs"
              title="Superhost"
            >
              <svg viewBox="0 0 16 16" className="w-3 h-3 fill-current">
                <path d="M8 0a3 3 0 0 1 3 3v2h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h1V3a3 3 0 0 1 3-3zm0 2a1 1 0 0 0-1 1v2h2V3a1 1 0 0 0-1-1z" />
              </svg>
            </div>
          )}
        </div>
        <div>
          <div className="text-[16px] font-semibold text-[#222222]">
            Hosted by {listing.host.name}
          </div>
          <div className="text-[14px] text-[#717171] mt-0.5">
            Superhost · {listing.host.yearsHosting} years hosting
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-b border-[#dddddd]" />

      {/* 4. Highlights (3 items matching Screenshot 1) */}
      <div className="space-y-6">
        {/* Self check-in */}
        <div className="flex items-start gap-4">
          <div className="text-[#222222] pt-0.5">
            <svg viewBox="0 0 32 32" className="w-6 h-6 stroke-[#222222] stroke-[2] fill-none">
              <path d="M24 18v-4a8 8 0 0 0-16 0v4H6v12h20V18zM12 14a4 4 0 0 1 8 0v4H12z" />
            </svg>
          </div>
          <div>
            <div className="text-[16px] font-semibold text-[#222222]">Self check-in</div>
            <div className="text-[14px] text-[#717171] mt-0.5">
              Check yourself in with the lockbox.
            </div>
          </div>
        </div>

        {/* Superhost highlight */}
        <div className="flex items-start gap-4">
          <div className="text-[#222222] pt-0.5">
            <svg viewBox="0 0 32 32" className="w-6 h-6 stroke-[#222222] stroke-[2] fill-none">
              <circle cx="16" cy="11" r="7" />
              <path d="m11 17-3 13 8-4 8 4-3-13" />
            </svg>
          </div>
          <div>
            <div className="text-[16px] font-semibold text-[#222222]">{listing.host.name} is a Superhost</div>
            <div className="text-[14px] text-[#717171] mt-0.5">
              Superhosts are experienced, highly rated hosts.
            </div>
          </div>
        </div>

        {/* Furry friends welcome */}
        <div className="flex items-start gap-4">
          <div className="text-[#222222] pt-0.5">
            <svg viewBox="0 0 32 32" className="w-6 h-6 fill-[#222222]">
              <circle cx="9" cy="8" r="3" />
              <circle cx="23" cy="8" r="3" />
              <circle cx="5" cy="16" r="3" />
              <circle cx="27" cy="16" r="3" />
              <path d="M16 12c-5 0-9 4-9 9 0 3 2.5 5 5 5 2 0 3-1 4-1s2 1 4 1c2.5 0 5-2 5-5 0-5-4-9-9-9z" />
            </svg>
          </div>
          <div>
            <div className="text-[16px] font-semibold text-[#222222]">Furry friends welcome</div>
            <div className="text-[14px] text-[#717171] mt-0.5">
              Bring your pets along for the stay.
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-b border-[#dddddd]" />

      {/* 5. Listing Description (Matches Screenshot 1 & 2) */}
      <div className="space-y-4 text-[16px] leading-[24px] text-[#222222] font-normal">
        <p>
          Welcome to this cozy and stylish 2BHK, perfect for families, couples, and business travellers.
          Enjoy comfortable bedrooms, a well-equipped kitchen, a spacious living area with Netflix, and
          a private balcony for relaxing. Ideally located near the airport, Symbiosis, and Phoenix Mall,
          making it convenient for travel, shopping, dining, and work. A comfortable home away from home.
        </p>
        <p>
          PS5 is also available on request at an additional charge.
        </p>
      </div>

      {/* Divider */}
      <div className="border-b border-[#dddddd]" />

      {/* 6. Where you'll sleep (Matches Screenshot 2) */}
      <div>
        <h3 className="text-[22px] font-semibold text-[#222222] mb-6">
          Where you&apos;ll sleep
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Bedroom 1 */}
          <div className="p-4 rounded-2xl border border-[#dddddd] bg-white">
            <img
              src="https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80"
              alt="Bedroom 1"
              className="w-full h-44 object-cover rounded-xl"
            />
            <div className="mt-3">
              <div className="text-[16px] font-semibold text-[#222222]">Bedroom 1</div>
              <div className="text-[14px] text-[#717171] mt-0.5">1 queen bed</div>
            </div>
          </div>

          {/* Bedroom 2 */}
          <div className="p-4 rounded-2xl border border-[#dddddd] bg-white">
            <img
              src="https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80"
              alt="Bedroom 2"
              className="w-full h-44 object-cover rounded-xl"
            />
            <div className="mt-3">
              <div className="text-[16px] font-semibold text-[#222222]">Bedroom 2</div>
              <div className="text-[14px] text-[#717171] mt-0.5">1 queen bed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-b border-[#dddddd]" />

      {/* 7. What this place offers (Matches Screenshot 3) */}
      <div id="amenities">
        <h3 className="text-[22px] font-semibold text-[#222222] mb-6">
          What this place offers
        </h3>

        {/* 2-column icon grid matching screenshot */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
          <div className="flex items-center gap-4 text-[16px] text-[#222222]">
            <Utensils className="w-6 h-6 stroke-[1.8] text-[#222222] flex-shrink-0" />
            <span>Kitchen</span>
          </div>

          <div className="flex items-center gap-4 text-[16px] text-[#222222]">
            <Wifi className="w-6 h-6 stroke-[1.8] text-[#222222] flex-shrink-0" />
            <span>Wifi</span>
          </div>

          <div className="flex items-center gap-4 text-[16px] text-[#222222]">
            <Laptop className="w-6 h-6 stroke-[1.8] text-[#222222] flex-shrink-0" />
            <span>Dedicated workspace</span>
          </div>

          <div className="flex items-center gap-4 text-[16px] text-[#222222]">
            <Car className="w-6 h-6 stroke-[1.8] text-[#222222] flex-shrink-0" />
            <span>Free parking on premises</span>
          </div>

          <div className="flex items-center gap-4 text-[16px] text-[#222222]">
            <svg viewBox="0 0 32 32" className="w-6 h-6 fill-[#222222] flex-shrink-0">
              <circle cx="9" cy="8" r="3" />
              <circle cx="23" cy="8" r="3" />
              <circle cx="5" cy="16" r="3" />
              <circle cx="27" cy="16" r="3" />
              <path d="M16 12c-5 0-9 4-9 9 0 3 2.5 5 5 5 2 0 3-1 4-1s2 1 4 1c2.5 0 5-2 5-5 0-5-4-9-9-9z" />
            </svg>
            <span>Pets allowed</span>
          </div>

          <div className="flex items-center gap-4 text-[16px] text-[#222222]">
            <Tv className="w-6 h-6 stroke-[1.8] text-[#222222] flex-shrink-0" />
            <span>TV</span>
          </div>

          <div className="flex items-center gap-4 text-[16px] text-[#222222]">
            <svg viewBox="0 0 32 32" className="w-6 h-6 stroke-[#222222] stroke-[1.8] fill-none flex-shrink-0">
              <rect x="5" y="4" width="22" height="24" rx="3" />
              <circle cx="16" cy="17" r="7" />
              <circle cx="10" cy="8" r="1.5" fill="currentColor" />
              <circle cx="15" cy="8" r="1.5" fill="currentColor" />
            </svg>
            <span>Washing machine</span>
          </div>

          <div className="flex items-center gap-4 text-[16px] text-[#222222]">
            <svg viewBox="0 0 32 32" className="w-6 h-6 stroke-[#222222] stroke-[1.8] fill-none flex-shrink-0">
              <path d="M5 11l14-6 6 14-14 6zM25 19l4 2v-4z" />
            </svg>
            <span>Exterior security cameras on property</span>
          </div>

          <div className="flex items-center gap-4 text-[16px] text-[#222222] line-through text-[#717171]">
            <ShieldAlert className="w-6 h-6 stroke-[1.8] text-[#717171] flex-shrink-0" />
            <span>Carbon monoxide alarm</span>
          </div>

          <div className="flex items-center gap-4 text-[16px] text-[#222222] line-through text-[#717171]">
            <ShieldAlert className="w-6 h-6 stroke-[1.8] text-[#717171] flex-shrink-0" />
            <span>Smoke alarm</span>
          </div>
        </div>

        {/* Show all 31 amenities button */}
        <button
          onClick={() => setIsAmenitiesModalOpen(true)}
          className="mt-6 px-6 py-3 rounded-lg border border-[#222222] text-[#222222] font-semibold text-[14px] hover:bg-neutral-50 transition cursor-pointer"
        >
          Show all 31 amenities
        </button>
      </div>

      {/* Divider */}
      <div className="border-b border-[#dddddd]" />

      {/* 8. Interactive Calendar Section (Matches Screenshot 3 & 4) */}
      <div>
        <h3 className="text-[22px] font-semibold text-[#222222]">
          {nights} nights in Pune City
        </h3>
        <p className="text-[14px] text-[#717171] mt-1 mb-6">
          {startDate && endDate
            ? `${startDate.getDate()} ${MONTH_NAMES[startDate.getMonth()].slice(0, 3)} ${startDate.getFullYear()} – ${endDate.getDate()} ${MONTH_NAMES[endDate.getMonth()].slice(0, 3)} ${endDate.getFullYear()}`
            : 'Select check-in and checkout dates'}
        </p>

        {/* Dual Calendar Month Grids */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Month 1 */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setCalendarMonthOffset((prev) => prev - 1)}
                className="p-2 rounded-full hover:bg-slate-100 cursor-pointer transition text-[#222222]"
                aria-label="Previous month"
              >
                <ChevronLeft className="w-4 h-4 stroke-[2.2]" />
              </button>
              <span className="text-[16px] font-semibold text-[#222222]">
                {MONTH_NAMES[month1Data.month]} {month1Data.year}
              </span>
              <div className="w-8 md:hidden" />
            </div>

            <div className="grid grid-cols-7 text-center mb-2">
              {WEEKDAYS.map((day, i) => (
                <div key={i} className="text-[12px] font-semibold text-[#717171]">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-y-1">
              {renderMonthCalendar(month1Data)}
            </div>
          </div>

          {/* Month 2 */}
          <div className="hidden md:block">
            <div className="flex items-center justify-between mb-4">
              <div className="w-8" />
              <span className="text-[16px] font-semibold text-[#222222]">
                {MONTH_NAMES[month2Data.month]} {month2Data.year}
              </span>
              <button
                onClick={() => setCalendarMonthOffset((prev) => prev + 1)}
                className="p-2 rounded-full hover:bg-slate-100 cursor-pointer transition text-[#222222]"
                aria-label="Next month"
              >
                <ChevronRight className="w-4 h-4 stroke-[2.2]" />
              </button>
            </div>

            <div className="grid grid-cols-7 text-center mb-2">
              {WEEKDAYS.map((day, i) => (
                <div key={i} className="text-[12px] font-semibold text-[#717171]">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-y-1">
              {renderMonthCalendar(month2Data)}
            </div>
          </div>
        </div>

        {/* Clear dates link */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={clearDates}
            className="text-[14px] font-semibold underline text-[#222222] hover:text-black cursor-pointer"
          >
            Clear dates
          </button>
        </div>
      </div>

      {/* All 31 Amenities Modal */}
      {isAmenitiesModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 relative shadow-2xl">
            <button
              onClick={() => setIsAmenitiesModalOpen(false)}
              className="w-8 h-8 rounded-full border border-slate-300 hover:border-black flex items-center justify-center text-slate-700 transition cursor-pointer mb-4"
              aria-label="Close amenities modal"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-[22px] font-semibold text-[#222222] mb-6">
              What this place offers
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-[18px] font-semibold text-[#222222] mb-4">
                  Bathroom
                </h3>
                <div className="space-y-3">
                  {listing.amenities
                    .filter((a) => a.category === 'Bathroom')
                    .map((a) => (
                      <div key={a.id} className="flex items-center gap-3 text-[16px] text-[#222222] border-b border-slate-100 pb-3">
                        <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        <span>{a.title}</span>
                      </div>
                    ))}
                </div>
              </div>

              <div>
                <h3 className="text-[18px] font-semibold text-[#222222] mb-4">
                  Bedroom and laundry
                </h3>
                <div className="space-y-3">
                  {listing.amenities
                    .filter((a) => a.category === 'Bedroom & laundry')
                    .map((a) => (
                      <div key={a.id} className="flex items-center gap-3 text-[16px] text-[#222222] border-b border-slate-100 pb-3">
                        <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        <span>{a.title}</span>
                      </div>
                    ))}
                </div>
              </div>

              <div>
                <h3 className="text-[18px] font-semibold text-[#222222] mb-4">
                  Kitchen and dining
                </h3>
                <div className="space-y-3">
                  {listing.amenities
                    .filter((a) => a.category === 'Kitchen & dining')
                    .map((a) => (
                      <div key={a.id} className="flex items-center gap-3 text-[16px] text-[#222222] border-b border-slate-100 pb-3">
                        <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        <span>{a.title}</span>
                      </div>
                    ))}
                </div>
              </div>

              <div>
                <h3 className="text-[18px] font-semibold text-[#222222] mb-4">
                  Internet and office
                </h3>
                <div className="space-y-3">
                  {listing.amenities
                    .filter((a) => a.category === 'Internet & office')
                    .map((a) => (
                      <div key={a.id} className="flex items-center gap-3 text-[16px] text-[#222222] border-b border-slate-100 pb-3">
                        <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        <span>{a.title}</span>
                      </div>
                    ))}
                </div>
              </div>

              <div>
                <h3 className="text-[18px] font-semibold text-[#222222] mb-4">
                  Home safety
                </h3>
                <div className="space-y-3">
                  {listing.amenities
                    .filter((a) => a.category === 'Home safety')
                    .map((a) => (
                      <div key={a.id} className="flex items-center gap-3 text-[16px] text-[#222222] border-b border-slate-100 pb-3">
                        <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        <span>{a.title}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
