'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { HomeHeader } from '@/features/home/components/HomeHeader';
import { Footer } from '@/components/layout/Footer';
import { ListingHeader } from '@/features/listing/components/ListingHeader';
import { PhotoBentoGrid } from '@/features/listing/components/PhotoBentoGrid';
import { SubNavbar } from '@/features/listing/components/SubNavbar';
import { PropertyOverview } from '@/features/listing/components/PropertyOverview';
import { StickyBookingWidget } from '@/features/booking/components/StickyBookingWidget';
import { PhotoTourOverlay } from '@/features/photo-tour/components/PhotoTourOverlay';
import { LightboxModal } from '@/features/lightbox/components/LightboxModal';
import { useViewState } from '@/hooks/useViewState';
import { MOCK_LISTING_DATA } from '@/data/mockListingData';
import {
  Star,
  ShieldCheck,
  Shield,
  Key,
  Calendar,
  Search,
  CheckCircle2,
  MessageSquare,
  Map,
  Tag,
  ChevronRight,
  ChevronLeft,
  Lightbulb,
  GraduationCap,
} from 'lucide-react';

export default function ListingPage() {
  const {
    activeView,
    activePhotoIndex,
    openPhotoTour,
    openLightbox,
    closeToPhotoTour,
    closeToListing,
    setActivePhotoIndex,
  } = useViewState();

  // Booking date range state matching user screenshots: Nov 6, 2026 – Nov 8, 2026 (2 nights)
  const [dateRange, setDateRange] = useState<{ startDate: Date | null; endDate: Date | null }>({
    startDate: new Date('2026-11-06'),
    endDate: new Date('2026-11-08'),
  });

  const [showStickyNav, setShowStickyNav] = useState(false);
  const mainSectionRef = useRef<HTMLDivElement>(null);

  const nights = dateRange.startDate && dateRange.endDate
    ? Math.max(1, Math.round((dateRange.endDate.getTime() - dateRange.startDate.getTime()) / (1000 * 60 * 60 * 24)))
    : 2;
  const totalPrice = nights * (MOCK_LISTING_DATA.pricing?.basePricePerNight || 4349);

  // Trigger sticky top bar with top-to-bottom slide/fade-in animation
  // at the exact moment the reservation template fixes its position
  useEffect(() => {
    const handleScroll = () => {
      if (!mainSectionRef.current) return;
      const rect = mainSectionRef.current.getBoundingClientRect();
      setShowStickyNav(rect.top <= 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Support deep link or testing scroll parameter
    const params = new URLSearchParams(window.location.search);
    const scrollVal = params.get('scroll');
    if (scrollVal) {
      window.scrollTo(0, parseInt(scrollVal, 10));
    }

    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToCalendar = () => {
    const el = document.getElementById('amenities');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* 1. Global Navigation Bar with smooth expandable search */}
      <HomeHeader mode="rooms" />

      {/* Floating Animated SubNavbar (Photos, Amenities, Reviews, Location + Mini Reserve Block) */}
      <AnimatePresence>
        {showStickyNav && (
          <SubNavbar
            listing={MOCK_LISTING_DATA}
            nights={nights}
            totalPrice={totalPrice}
            onReserveClick={handleScrollToCalendar}
          />
        )}
      </AnimatePresence>

      {/* Main Page Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8">
        {/* 2. Listing Title & Action Bar */}
        <ListingHeader title={MOCK_LISTING_DATA.title} />

        {/* 3. 5-Photo Bento Grid */}
        <div id="photos">
          <PhotoBentoGrid
            photos={MOCK_LISTING_DATA.photos}
            onOpenPhotoTour={openPhotoTour}
            onOpenLightbox={openLightbox}
          />
        </div>

        {/* 4. Two-Column Layout Container: Left Details (7.5 cols) vs Right Sticky Widget (4.5 cols) */}
        {/* The sticky widget is bound strictly to this container and floats on display until after the calendar */}
        <div
          ref={mainSectionRef}
          className="mt-8 grid grid-cols-1 lg:grid-cols-[7.5fr_4.5fr] gap-8 lg:gap-10 xl:gap-14 relative"
        >
          
          {/* Left Column (7.5 of 12 cols = 62.5%): Overview, Highlights, Description, Where you'll sleep, Amenities, Calendar */}
          <div className="w-full min-w-0">
            <PropertyOverview
              listing={MOCK_LISTING_DATA}
              startDate={dateRange.startDate}
              endDate={dateRange.endDate}
              onDatesChange={(start, end) => setDateRange({ startDate: start, endDate: end })}
            />

            {/* Mobile Booking Widget (visible on small screens only) */}
            <div className="lg:hidden mt-8">
              <StickyBookingWidget
                listing={MOCK_LISTING_DATA}
                startDate={dateRange.startDate}
                endDate={dateRange.endDate}
                onDatesChange={(start, end) => setDateRange({ startDate: start, endDate: end })}
                onOpenCalendar={handleScrollToCalendar}
              />
            </div>
          </div>

          {/* Right Column (4.5 of 12 cols = 37.5%): Floating Sticky Booking Widget */}
          <div className="hidden lg:block relative">
            <div className="sticky top-20">
              <StickyBookingWidget
                listing={MOCK_LISTING_DATA}
                startDate={dateRange.startDate}
                endDate={dateRange.endDate}
                onDatesChange={(start, end) => setDateRange({ startDate: start, endDate: end })}
                onOpenCalendar={handleScrollToCalendar}
              />
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* SECTIONS OUTSIDE THE STICKY BOUNDARY (Scrolls naturally after calendar)   */}
        {/* ========================================================================= */}

        {/* 6. Reviews Section (id="reviews") */}
        <div id="reviews" className="mt-16 pt-12 border-t border-[#dddddd]">
          
          {/* A. Giant 4.95 Laurel Header matching Screenshot 1 */}
          <div className="flex flex-col items-center justify-center text-center py-6 sm:py-8">
            <div className="flex items-center justify-center gap-6 sm:gap-8">
              <img
                src="/icons/laurel-left.png"
                alt=""
                className="h-16 sm:h-20 w-auto object-contain select-none pointer-events-none"
              />
              <span className="text-[76px] sm:text-[96px] md:text-[104px] font-bold text-[#222222] tracking-tighter leading-none select-none">
                4.95
              </span>
              <img
                src="/icons/laurel-right.png"
                alt=""
                className="h-16 sm:h-20 w-auto object-contain select-none pointer-events-none"
              />
            </div>

            <h3 className="text-[20px] sm:text-[22px] font-semibold text-[#222222] mt-3">
              Guest favourite
            </h3>
            <p className="text-[15px] sm:text-[16px] text-[#717171] mt-1 max-w-md text-center leading-relaxed">
              This home is a guest favourite based on ratings, reviews and reliability
            </p>
            <button className="text-[14px] text-[#222222] font-semibold underline underline-offset-4 mt-3 cursor-pointer hover:text-black">
              How reviews work
            </button>
          </div>

          {/* B. 7-Column Rating Breakdown Strip */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-y-6 text-left py-6">
            {/* 1. Overall rating */}
            <div className="pr-4 md:pr-6 md:border-r md:border-[#dddddd] flex flex-col justify-between h-[115px]">
              <div className="text-[14px] font-semibold text-[#222222]">Overall rating</div>
              <div className="space-y-1 text-[11px] text-[#717171] pb-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 font-medium text-[#222222]">5</span>
                  <div className="flex-1 h-[3.5px] bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#222222] rounded-full w-[90%]" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 font-medium text-[#222222]">4</span>
                  <div className="flex-1 h-[3.5px] bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#222222] rounded-full w-[10%]" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 font-medium text-[#222222]">3</span>
                  <div className="flex-1 h-[3.5px] bg-slate-100 rounded-full overflow-hidden" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 font-medium text-[#222222]">2</span>
                  <div className="flex-1 h-[3.5px] bg-slate-100 rounded-full overflow-hidden" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 font-medium text-[#222222]">1</span>
                  <div className="flex-1 h-[3.5px] bg-slate-100 rounded-full overflow-hidden" />
                </div>
              </div>
            </div>

            {/* 2. Cleanliness */}
            <div className="px-4 md:px-6 md:border-r md:border-[#dddddd] flex flex-col justify-between h-[115px]">
              <div>
                <div className="text-[14px] font-semibold text-[#222222]">Cleanliness</div>
                <div className="text-[18px] font-bold text-[#222222] mt-0.5">5.0</div>
              </div>
              <div className="pb-1">
                <svg
                  viewBox="0 0 24 33"
                  className="w-6 h-6 text-[#222222]"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M4,1h15v1h-15zM2,2h17v1h-17zM2,3h4v1h-4zM12,3h3v1h-3zM16,3h3v1h-3zM21,3h2v1h-2zM1,4h3v1h-3zM11,4h7v1h-7zM19,4h1v1h-1zM1,5h3v1h-3zM11,5h8v1h-8zM21,5h2v1h-2zM2,6h4v1h-4zM9,6h9v1h-9zM21,6h2v1h-2zM4,7h4v1h-4zM10,7h6v1h-6zM5,8h8v1h-8zM14,8h2v1h-2zM6,9h7v1h-7zM15,9h3v1h-3zM6,10h3v1h-3zM10,10h3v1h-3zM15,10h2v1h-2zM6,11h2v1h-2zM10,11h3v1h-3zM15,11h2v1h-2zM6,12h2v1h-2zM10,12h3v1h-3zM6,13h2v1h-2zM10,13h3v1h-3zM5,14h3v1h-3zM11,14h4v1h-4zM4,15h3v1h-3zM11,15h4v1h-4zM3,16h4v1h-4zM11,16h4v1h-4zM3,17h3v1h-3zM11,17h4v1h-4zM2,18h4v1h-4zM11,18h4v1h-4zM2,19h7v1h-7zM11,19h3v1h-3zM1,20h9v1h-9zM11,20h2v1h-2zM1,21h11v1h-11zM11,21h2v1h-2zM1,22h3v1h-3zM7,22h4v1h-4zM11,22h2v1h-2zM1,23h3v1h-3zM8,23h9v1h-9zM1,24h3v1h-3zM9,24h8v1h-8zM1,25h3v1h-3zM12,25h5v1h-5zM1,26h3v1h-3zM14,26h2v1h-2zM1,27h3v1h-3zM14,27h2v1h-2zM1,28h3v1h-3zM14,28h2v1h-2zM1,29h18v1h-18zM2,30h16v1h-16zM4,31h13v1h-13z" />
                </svg>
              </div>
            </div>

            {/* 3. Accuracy */}
            <div className="px-4 md:px-6 md:border-r md:border-[#dddddd] flex flex-col justify-between h-[115px]">
              <div>
                <div className="text-[14px] font-semibold text-[#222222]">Accuracy</div>
                <div className="text-[18px] font-bold text-[#222222] mt-0.5">5.0</div>
              </div>
              <div className="pb-1">
                <CheckCircle2 className="w-6 h-6 stroke-[#222222] stroke-[1.8]" />
              </div>
            </div>

            {/* 4. Check-in */}
            <div className="px-4 md:px-6 md:border-r md:border-[#dddddd] flex flex-col justify-between h-[115px]">
              <div>
                <div className="text-[14px] font-semibold text-[#222222]">Check-in</div>
                <div className="text-[18px] font-bold text-[#222222] mt-0.5">5.0</div>
              </div>
              <div className="pb-1">
                <Key className="w-6 h-6 stroke-[#222222] stroke-[1.8]" />
              </div>
            </div>

            {/* 5. Communication */}
            <div className="px-4 md:px-6 md:border-r md:border-[#dddddd] flex flex-col justify-between h-[115px]">
              <div>
                <div className="text-[14px] font-semibold text-[#222222]">Communication</div>
                <div className="text-[18px] font-bold text-[#222222] mt-0.5">5.0</div>
              </div>
              <div className="pb-1">
                <MessageSquare className="w-6 h-6 stroke-[#222222] stroke-[1.8]" />
              </div>
            </div>

            {/* 6. Location */}
            <div className="px-4 md:px-6 md:border-r md:border-[#dddddd] flex flex-col justify-between h-[115px]">
              <div>
                <div className="text-[14px] font-semibold text-[#222222]">Location</div>
                <div className="text-[18px] font-bold text-[#222222] mt-0.5">4.8</div>
              </div>
              <div className="pb-1">
                <Map className="w-6 h-6 stroke-[#222222] stroke-[1.8]" />
              </div>
            </div>

            {/* 7. Value */}
            <div className="pl-4 md:pl-6 flex flex-col justify-between h-[115px]">
              <div>
                <div className="text-[14px] font-semibold text-[#222222]">Value</div>
                <div className="text-[18px] font-bold text-[#222222] mt-0.5">4.8</div>
              </div>
              <div className="pb-1">
                <Tag className="w-6 h-6 stroke-[#222222] stroke-[1.8]" />
              </div>
            </div>
          </div>

          {/* D. Review Cards matching Screenshot 2 */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-x-16 lg:gap-x-24 gap-y-10">
            {/* Review 1: Amit */}
            <div className="space-y-3">
              <div className="flex items-center gap-3.5">
                <img
                  src="/reviews/amit.jpg"
                  alt="Amit"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-[16px] font-semibold text-[#222222]">Amit</h4>
                  <p className="text-[13px] text-[#717171]">2 months on Airbnb</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[13px] font-medium text-[#222222]">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#222222] text-[#222222]" />
                  ))}
                </div>
                <span>·</span>
                <span>1 week ago</span>
              </div>
              <p className="text-[15px] leading-relaxed text-[#222222]">
                Very helpful and responsive team. Safe and peaceful stay. loved everything about the property.
              </p>
            </div>

            {/* Review 2: Aheesh */}
            <div className="space-y-3">
              <div className="flex items-center gap-3.5">
                <img
                  src="/reviews/aheesh.jpg"
                  alt="Aheesh"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-[16px] font-semibold text-[#222222]">Aheesh</h4>
                  <p className="text-[13px] text-[#717171]">3 years on Airbnb</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[13px] font-medium text-[#222222]">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#222222] text-[#222222]" />
                  ))}
                </div>
                <span>·</span>
                <span>2 weeks ago</span>
              </div>
              <p className="text-[15px] leading-relaxed text-[#222222]">
                We had a wonderful stay. The apartment was clean, comfortable, and exactly as shown in the photos. The host was very responsive and helpful throughout our stay. We would definitely recommend this place and would love to stay here again.
              </p>
              <button className="text-[14px] font-semibold text-[#222222] underline underline-offset-4 cursor-pointer hover:text-black">
                Show more
              </button>
            </div>

            {/* Review 3: Samiksha */}
            <div className="space-y-3">
              <div className="flex items-center gap-3.5">
                <img
                  src="/reviews/samiksha.jpg"
                  alt="Samiksha"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-[16px] font-semibold text-[#222222]">Samiksha</h4>
                  <p className="text-[13px] text-[#717171]">8 months on Airbnb</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[13px] font-medium text-[#222222]">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#222222] text-[#222222]" />
                  ))}
                </div>
                <span>·</span>
                <span>May 2026</span>
              </div>
              <p className="text-[15px] leading-relaxed text-[#222222]">
                the host nitish was really great help
              </p>
            </div>

            {/* Review 4: Vedant */}
            <div className="space-y-3">
              <div className="flex items-center gap-3.5">
                <img
                  src="/reviews/vedant.jpg"
                  alt="Vedant"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-[16px] font-semibold text-[#222222]">Vedant</h4>
                  <p className="text-[13px] text-[#717171]">4 years on Airbnb</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[13px] font-medium text-[#222222]">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#222222] text-[#222222]" />
                  ))}
                </div>
                <span>·</span>
                <span>May 2026</span>
              </div>
              <p className="text-[15px] leading-relaxed text-[#222222]">
                We had an amazing stay at this property in Goa! The entire home was spotless and exceptionally well-maintained, making us feel comfortable from the moment we arrived. The cleanliness standards were truly impressive, with every corner of the house looking fresh and pristine....
              </p>
              <button className="text-[14px] font-semibold text-[#222222] underline underline-offset-4 cursor-pointer hover:text-black">
                Show more
              </button>
            </div>

            {/* Review 5: Vaibhav S */}
            <div className="space-y-3">
              <div className="flex items-center gap-3.5">
                <img
                  src="/reviews/vaibhav.jpg"
                  alt="Vaibhav S"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-[16px] font-semibold text-[#222222]">Vaibhav S</h4>
                  <p className="text-[13px] text-[#717171]">3 years on Airbnb</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[13px] font-medium text-[#222222]">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#222222] text-[#222222]" />
                  ))}
                </div>
                <span>·</span>
                <span>May 2026</span>
              </div>
              <p className="text-[15px] leading-relaxed text-[#222222]">
                Great great experience living out there , can&apos;t expect more , will always look for it in the future and will recommend my friends too.
              </p>
            </div>

            {/* Review 6: Mohd */}
            <div className="space-y-3">
              <div className="flex items-center gap-3.5">
                <img
                  src="/reviews/mohd.jpg"
                  alt="Mohd"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-[16px] font-semibold text-[#222222]">Mohd</h4>
                  <p className="text-[13px] text-[#717171]">5 years on Airbnb</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[13px] font-medium text-[#222222]">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#222222] text-[#222222]" />
                  ))}
                </div>
                <span>·</span>
                <span>May 2026</span>
              </div>
              <p className="text-[15px] leading-relaxed text-[#222222]">
                Great place. Exactly as described in the listing.
              </p>
            </div>
          </div>

          {/* Show all 19 reviews Button */}
          <div className="mt-10">
            <button className="px-6 py-3.5 rounded-xl border border-[#222222] text-[15px] font-semibold text-[#222222] hover:bg-neutral-50 transition cursor-pointer select-none">
              Show all 19 reviews
            </button>
          </div>
        </div>

        {/* 7. Where you'll be Section (id="location") matching Screenshots 3 & 4 */}
        <div id="location" className="mt-14 pt-12 border-t border-[#dddddd]">
          <h3 className="text-[22px] font-semibold text-[#222222] mb-1">
            Where you&apos;ll be
          </h3>
          <p className="text-[16px] text-[#222222] font-normal mb-6">
            Candolim, Goa, India
          </p>

          {/* Custom Interactive Map Visual */}
          <div className="relative rounded-2xl overflow-hidden h-[420px] sm:h-[480px] border border-slate-200 shadow-xs select-none bg-[#EBF4EA]">
            <svg
              className="w-full h-full object-cover"
              viewBox="0 0 1000 500"
              preserveAspectRatio="xMidYMid slice"
            >
              {/* Land */}
              <rect width="1000" height="500" fill="#E4EFE3" />
              {/* Water / Sea on west side */}
              <polygon points="0,0 425,0 265,500 0,500" fill="#B4D3E5" />
              {/* Coastline beach accent line */}
              <line x1="425" y1="0" x2="265" y2="500" stroke="#F5ECD0" strokeWidth="4" />

              {/* Faint Grid Lines */}
              {[...Array(12)].map((_, i) => (
                <line key={`v-${i}`} x1={i * 85} y1="0" x2={i * 85} y2="500" stroke="#DAE7D8" strokeWidth="1" />
              ))}
              {[...Array(7)].map((_, i) => (
                <line key={`h-${i}`} x1="0" y1={i * 80} x2="1000" y2={i * 80} stroke="#DAE7D8" strokeWidth="1" />
              ))}

              {/* Soft Green Neighborhood Circles */}
              <circle cx="340" cy="275" r="35" fill="#CCE8C7" opacity="0.85" />
              <circle cx="645" cy="335" r="45" fill="#CCE8C7" opacity="0.85" />
            </svg>

            {/* Center Home Pin */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
              <div className="w-12 h-12 rounded-full bg-[#222222] text-white flex items-center justify-center shadow-xl ring-4 ring-white/90">
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-white stroke-[2.2]">
                  <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1V9.5z" />
                </svg>
              </div>
            </div>

            {/* Search Button (Top Left) */}
            <div className="absolute top-4 left-4">
              <button className="w-9 h-9 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition cursor-pointer">
                <Search className="w-4 h-4 text-[#222222]" />
              </button>
            </div>

            {/* Zoom Controls (Top Right) */}
            <div className="absolute top-4 right-4 flex flex-col rounded-lg bg-white shadow-md border border-slate-200 overflow-hidden divide-y divide-slate-100">
              <button className="w-8 h-8 flex items-center justify-center hover:bg-slate-50 transition font-bold text-[#222222] text-lg select-none cursor-pointer">
                +
              </button>
              <button className="w-8 h-8 flex items-center justify-center hover:bg-slate-50 transition font-bold text-[#222222] text-lg select-none cursor-pointer">
                −
              </button>
            </div>
          </div>

          <p className="text-[14px] text-[#717171] mt-3">
            Exact location will be provided after booking.
          </p>

          <div className="mt-8 pt-2">
            <h4 className="text-[18px] font-semibold text-[#222222] mb-2">
              Neighbourhood highlights
            </h4>
            <p className="text-[15px] text-[#222222] leading-relaxed max-w-4xl">
              Located in the heart of Candolim, Amor de Goa offers a peaceful stay with easy access to beaches, cafés, and popular attractions.
            </p>
            <button className="text-[14px] font-semibold text-[#222222] underline underline-offset-4 mt-3 inline-flex items-center gap-1 cursor-pointer hover:text-black">
              Show more <ChevronRight className="w-4 h-4 inline" />
            </button>
          </div>
        </div>

        {/* 8. Meet your host Section matching Screenshot 2 */}
        <div className="mt-14 pt-12 border-t border-[#dddddd]">
          <h3 className="text-[22px] font-semibold text-[#222222] mb-6">
            Meet your host
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-start">
            {/* Left Card Column */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl p-7 sm:p-8 border border-[#dddddd] shadow-[0_6px_16px_rgba(0,0,0,0.08)] flex items-center justify-between">
                <div>
                  <img
                    src="/icons/mirashya-logo.png"
                    alt="Mirashya Homes"
                    className="w-18 h-18 rounded-full object-cover"
                  />
                  <h4 className="text-[22px] font-bold text-[#222222] mt-3 leading-tight">
                    Mirashya Homes
                  </h4>
                  <p className="text-[14px] text-[#717171] mt-0.5 font-normal">
                    Host
                  </p>
                </div>

                <div className="text-right space-y-2">
                  <div>
                    <div className="text-[20px] font-bold text-[#222222] leading-none">1,463</div>
                    <div className="text-[10px] text-[#717171] uppercase tracking-tight mt-1 font-semibold">Reviews</div>
                  </div>
                  <div className="h-[1px] bg-slate-100" />
                  <div>
                    <div className="text-[20px] font-bold text-[#222222] leading-none">4.68★</div>
                    <div className="text-[10px] text-[#717171] uppercase tracking-tight mt-1 font-semibold">Rating</div>
                  </div>
                  <div className="h-[1px] bg-slate-100" />
                  <div>
                    <div className="text-[20px] font-bold text-[#222222] leading-none">2</div>
                    <div className="text-[10px] text-[#717171] uppercase tracking-tight mt-1 font-semibold">Years hosting</div>
                  </div>
                </div>
              </div>

              {/* Host details under card */}
              <div className="mt-6 space-y-3.5 text-[15px] text-[#222222]">
                <div className="flex items-center gap-3">
                  <Lightbulb className="w-5 h-5 text-[#222222] flex-shrink-0" />
                  <span>Born in the 80s</span>
                </div>
                <div className="flex items-center gap-3">
                  <GraduationCap className="w-5 h-5 text-[#222222] flex-shrink-0" />
                  <span>Where I went to school: NICMAR GOA</span>
                </div>
              </div>
            </div>

            {/* Right Details Column */}
            <div className="lg:col-span-7">
              <h4 className="text-[18px] font-semibold text-[#222222] mb-4">
                Co-Hosts
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-6">
                <div className="flex items-center gap-3 text-[14px] font-medium text-[#222222]">
                  <img src="/hosts/cohost-1.jpg" alt="Sharath" className="w-8 h-8 rounded-full object-cover" />
                  <span>Sharath</span>
                </div>
                <div className="flex items-center gap-3 text-[14px] font-medium text-[#222222]">
                  <img src="/hosts/cohost-2.jpg" alt="Aman Dev Pahwa" className="w-8 h-8 rounded-full object-cover" />
                  <span>Aman Dev Pahwa</span>
                </div>
                <div className="flex items-center gap-3 text-[14px] font-medium text-[#222222]">
                  <img src="/hosts/cohost-3.jpg" alt="Maria Karen Priyanka" className="w-8 h-8 rounded-full object-cover" />
                  <span>Maria Karen Priyanka</span>
                </div>
                <div className="flex items-center gap-3 text-[14px] font-medium text-[#222222]">
                  <img src="/hosts/cohost-4.jpg" alt="Simran" className="w-8 h-8 rounded-full object-cover" />
                  <span>Simran</span>
                </div>
                <div className="flex items-center gap-3 text-[14px] font-medium text-[#222222]">
                  <img src="/hosts/cohost-5.jpg" alt="Pallavi" className="w-8 h-8 rounded-full object-cover" />
                  <span>Pallavi</span>
                </div>
                <div className="flex items-center gap-3 text-[14px] font-medium text-[#222222]">
                  <img src="/hosts/cohost-6.jpg" alt="Sanyukta" className="w-8 h-8 rounded-full object-cover" />
                  <span>Sanyukta</span>
                </div>
                <div className="flex items-center gap-3 text-[14px] font-medium text-[#222222]">
                  <span className="w-8 h-8 rounded-full bg-pink-100 text-pink-700 font-semibold text-[13px] flex items-center justify-center">S</span>
                  <span>Shruti</span>
                </div>
                <div className="flex items-center gap-3 text-[14px] font-medium text-[#222222]">
                  <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-semibold text-[13px] flex items-center justify-center">A</span>
                  <span>Amisha</span>
                </div>
              </div>

              <div className="mt-8 pt-2">
                <h4 className="text-[18px] font-semibold text-[#222222] mb-3">
                  Host details
                </h4>
                <div className="space-y-1 text-[15px] text-[#222222]">
                  <p>Response rate: 100%</p>
                  <p>Responds within an hour</p>
                </div>

                <button className="mt-6 px-6 py-3 rounded-xl bg-[#F7F7F7] hover:bg-[#EBEBEB] text-[#222222] font-semibold text-[15px] transition cursor-pointer border border-[#222222] active:scale-98">
                  Message host
                </button>

                <div className="mt-6 flex items-start gap-3 text-[12px] text-[#717171] max-w-lg">
                  <ShieldCheck className="w-6 h-6 text-[#717171] flex-shrink-0" />
                  <span>To help protect your payment, always use Airbnb to send money and communicate with hosts.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 9. Things to know Section matching Screenshot 5 */}
        <div className="mt-14 pt-12 border-t border-[#dddddd]">
          <h3 className="text-[22px] font-semibold text-[#222222] mb-6">
            Things to know
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-[15px]">
            <div>
              <Calendar className="w-6 h-6 text-[#222222] mb-3 stroke-[1.8]" />
              <h4 className="font-semibold text-[#222222] mb-2">Cancellation policy</h4>
              <p className="text-[#717171] leading-relaxed">
                Free cancellation before 17 October. Cancel before check-in on 18 October for a partial refund.
              </p>
              <p className="text-[#717171] mt-2">
                Review this host&apos;s full policy for details.
              </p>
              <button className="font-semibold text-[#222222] underline underline-offset-4 mt-3 block hover:text-black cursor-pointer">
                Learn more
              </button>
            </div>

            <div>
              <Key className="w-6 h-6 text-[#222222] mb-3 stroke-[1.8]" />
              <h4 className="font-semibold text-[#222222] mb-2">House rules</h4>
              <ul className="space-y-1.5 text-[#717171]">
                <li>Check-in after 2:00 pm</li>
                <li>Checkout before 11:00 am</li>
                <li>3 guests maximum</li>
              </ul>
              <button className="font-semibold text-[#222222] underline underline-offset-4 mt-3 block hover:text-black cursor-pointer">
                Learn more
              </button>
            </div>

            <div>
              <Shield className="w-6 h-6 text-[#222222] mb-3 stroke-[1.8]" />
              <h4 className="font-semibold text-[#222222] mb-2">Safety &amp; property</h4>
              <ul className="space-y-1.5 text-[#717171]">
                <li>Carbon monoxide alarm not reported</li>
                <li>Smoke alarm not reported</li>
                <li>Exterior security cameras on property</li>
              </ul>
              <button className="font-semibold text-[#222222] underline underline-offset-4 mt-3 block hover:text-black cursor-pointer">
                Learn more
              </button>
            </div>
          </div>
        </div>

        {/* 10. More stays nearby Section matching Screenshot 5 */}
        <div className="mt-14 pt-12 pb-16 border-t border-[#dddddd]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[22px] font-semibold text-[#222222]">
              More stays nearby
            </h3>
            <div className="flex items-center gap-3">
              <span className="text-[14px] text-[#222222] font-medium">1 / 2</span>
              <button className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-700 hover:border-black transition cursor-pointer">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-700 hover:border-black transition cursor-pointer">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {/* Stay 1 */}
            <div className="group cursor-pointer">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 mb-2.5">
                <img src="/stays/stay-1.jpg" alt="Beautiful Studio with a view to die for" className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-200" />
              </div>
              <h4 className="text-[14px] font-semibold text-[#222222] truncate leading-tight">
                Beautiful Studio with a view to die for
              </h4>
              <div className="text-[13px] text-[#222222] mt-1 flex items-center justify-between">
                <span><strong className="font-semibold">₹23,600</strong></span>
                <span className="flex items-center gap-0.5"><Star className="w-3 h-3 fill-[#222222] text-[#222222]" /> 4.91</span>
              </div>
            </div>

            {/* Stay 2 */}
            <div className="group cursor-pointer">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 mb-2.5">
                <img src="/stays/stay-2.jpg" alt="NAQAB - 1bhk with private pool" className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-200" />
              </div>
              <h4 className="text-[14px] font-semibold text-[#222222] truncate leading-tight">
                NAQAB - 1bhk with private pool
              </h4>
              <div className="text-[13px] text-[#222222] mt-1 flex items-center justify-between">
                <span><strong className="font-semibold">₹42,218</strong></span>
                <span className="flex items-center gap-0.5"><Star className="w-3 h-3 fill-[#222222] text-[#222222]" /> 4.95</span>
              </div>
            </div>

            {/* Stay 3 */}
            <div className="group cursor-pointer">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 mb-2.5">
                <img src="/stays/stay-3.jpg" alt="Greentique Luxury Flat with plunge pool, Calangute" className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-200" />
              </div>
              <h4 className="text-[14px] font-semibold text-[#222222] truncate leading-tight">
                Greentique Luxury Flat with plunge pool, Calangute
              </h4>
              <div className="text-[13px] text-[#222222] mt-1 flex items-center justify-between">
                <span><strong className="font-semibold">₹44,506</strong></span>
                <span className="flex items-center gap-0.5"><Star className="w-3 h-3 fill-[#222222] text-[#222222]" /> 4.94</span>
              </div>
            </div>

            {/* Stay 4 */}
            <div className="group cursor-pointer">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 mb-2.5">
                <img src="/stays/stay-4.jpg" alt="The Tropical Studio | 5 mins to Beach" className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-200" />
              </div>
              <h4 className="text-[14px] font-semibold text-[#222222] truncate leading-tight">
                The Tropical Studio | 5 mins to Beach
              </h4>
              <div className="text-[13px] text-[#222222] mt-1 flex items-center justify-between">
                <span><strong className="font-semibold">₹22,824</strong></span>
                <span className="flex items-center gap-0.5"><Star className="w-3 h-3 fill-[#222222] text-[#222222]" /> 4.96</span>
              </div>
            </div>

            {/* Stay 5 */}
            <div className="group cursor-pointer">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 mb-2.5">
                <img src="/stays/stay-5.jpg" alt="Luxury Casa Bella 1BHK with plunge pool, Calangute" className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-200" />
              </div>
              <h4 className="text-[14px] font-semibold text-[#222222] truncate leading-tight">
                Luxury Casa Bella 1BHK with plunge pool, Calangute
              </h4>
              <div className="text-[13px] text-[#222222] mt-1 flex items-center justify-between">
                <span><strong className="font-semibold">₹39,942</strong></span>
                <span className="flex items-center gap-0.5"><Star className="w-3 h-3 fill-[#222222] text-[#222222]" /> 4.95</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* View 2: Fullscreen Photo Tour Overlay */}
      <PhotoTourOverlay
        isOpen={activeView === 'photo-tour'}
        photos={MOCK_LISTING_DATA.photos}
        onClose={closeToListing}
        onSelectPhoto={(idx) => openLightbox(idx)}
      />

      {/* View 3: Single-Photo Lightbox Modal */}
      <LightboxModal
        isOpen={activeView === 'lightbox'}
        photos={MOCK_LISTING_DATA.photos}
        currentIndex={activePhotoIndex}
        onClose={closeToPhotoTour}
        onNavigate={setActivePhotoIndex}
      />

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
