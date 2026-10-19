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
import { Star, ShieldCheck, Clock, MapPin } from 'lucide-react';

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

        {/* 4. Two-Column Layout Container: Left Details vs Right Sticky Widget */}
        {/* The sticky widget is bound strictly to this container and floats on display until after the calendar */}
        <div
          ref={mainSectionRef}
          className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14 relative"
        >
          
          {/* Left Column (7 Cols on desktop): Overview, Highlights, Description, Where you'll sleep, Amenities, Calendar */}
          <div className="lg:col-span-7">
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

          {/* Right Column (5 Cols on desktop): Floating Sticky Booking Widget */}
          <div className="hidden lg:block lg:col-span-5 relative">
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
          <div className="flex items-center gap-2 mb-6">
            <Star className="w-6 h-6 fill-[#222222] text-[#222222]" />
            <h3 className="text-[22px] font-semibold text-[#222222]">
              5.0 · 9 reviews
            </h3>
          </div>

          {/* Ratings breakdown */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 pb-8 mb-8 border-b border-slate-100 text-center">
            <div className="p-3 bg-slate-50 rounded-xl">
              <div className="text-[12px] text-slate-500 font-medium">Cleanliness</div>
              <div className="text-[18px] font-semibold text-[#222222] mt-1">5.0</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <div className="text-[12px] text-slate-500 font-medium">Accuracy</div>
              <div className="text-[18px] font-semibold text-[#222222] mt-1">5.0</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <div className="text-[12px] text-slate-500 font-medium">Communication</div>
              <div className="text-[18px] font-semibold text-[#222222] mt-1">5.0</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <div className="text-[12px] text-slate-500 font-medium">Location</div>
              <div className="text-[18px] font-semibold text-[#222222] mt-1">4.9</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <div className="text-[12px] text-slate-500 font-medium">Check-in</div>
              <div className="text-[18px] font-semibold text-[#222222] mt-1">5.0</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <div className="text-[12px] text-slate-500 font-medium">Value</div>
              <div className="text-[18px] font-semibold text-[#222222] mt-1">5.0</div>
            </div>
          </div>

          {/* Review Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                  alt="Sneha"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="text-[16px] font-semibold text-[#222222]">Sneha</div>
                  <div className="text-[13px] text-[#717171]">October 2026 · Stayed a few nights</div>
                </div>
              </div>
              <p className="text-[15px] leading-relaxed text-[#222222]">
                Hitesh&apos;s 2BHK was immaculate and super cozy! The private balcony was wonderful for morning tea and having the PS5 was an absolute bonus for my kids. Very convenient location near Phoenix Mall.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80"
                  alt="Rohit"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="text-[16px] font-semibold text-[#222222]">Rohit</div>
                  <div className="text-[13px] text-[#717171]">September 2026 · Stayed with pets</div>
                </div>
              </div>
              <p className="text-[15px] leading-relaxed text-[#222222]">
                Great place for remote working! High-speed WiFi and comfortable dedicated workspace. Hitesh was very responsive and helpful throughout our stay. Self check-in with the lockbox was smooth and effortless.
              </p>
            </div>
          </div>
        </div>

        {/* 7. Host Bio Section */}
        <div className="mt-16 pt-12 border-t border-[#dddddd]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img
                src={MOCK_LISTING_DATA.host.avatarUrl}
                alt={MOCK_LISTING_DATA.host.name}
                className="w-16 h-16 rounded-full object-cover border border-slate-200"
              />
              <div>
                <h3 className="text-[20px] font-semibold text-[#222222]">
                  Hosted by {MOCK_LISTING_DATA.host.name}
                </h3>
                <p className="text-[14px] text-[#717171] mt-0.5">
                  Superhost · 7 months hosting
                </p>
              </div>
            </div>

            <button className="px-6 py-3 rounded-lg border border-[#222222] font-semibold text-[14px] text-[#222222] hover:bg-neutral-50 transition cursor-pointer self-start sm:self-auto">
              Contact Host
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-[14px] text-[#222222]">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-[#222222]" />
              <span>Identity verified</span>
            </div>
            <div className="flex items-center gap-3">
              <Star className="w-5 h-5 fill-current text-[#222222]" />
              <span>9 Reviews · 5.0 Rating</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-[#222222]" />
              <span>Response rate: 100% · Within an hour</span>
            </div>
          </div>
        </div>

        {/* 8. Location Section (id="location") */}
        <div id="location" className="mt-16 pt-12 border-t border-[#dddddd]">
          <h3 className="text-[22px] font-semibold text-[#222222] mb-3">
            Where you&apos;ll be
          </h3>
          <p className="text-[16px] text-[#222222] font-medium flex items-center gap-2 mb-6">
            <MapPin className="w-5 h-5 text-[#222222]" />
            <span>Pune, Maharashtra, India</span>
          </p>

          <div className="relative rounded-2xl overflow-hidden h-[340px] sm:h-[400px] bg-slate-100 border border-slate-200">
            {/* Map styling representation */}
            <div
              className="w-full h-full bg-cover bg-center flex items-center justify-center relative"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80')`,
              }}
            >
              <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[0.5px]" />
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-[#E00B41] text-white flex items-center justify-center shadow-xl ring-4 ring-white animate-pulse">
                  <svg viewBox="0 0 32 32" className="w-7 h-7 fill-white">
                    <path d="M16 1C9.4 1 4 6.4 4 13c0 9.2 12 18 12 18s12-8.8 12-18c0-6.6-5.4-12-12-12zm0 17c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5z" />
                  </svg>
                </div>
                <div className="mt-3 bg-white px-4 py-1.5 rounded-full shadow-md text-xs font-semibold text-[#222222]">
                  Exact location provided after booking
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-[15px] leading-relaxed text-[#222222] max-w-3xl">
            Situated in an upscale, prime neighborhood of Pune City near Viman Nagar. Close proximity to Symbiosis International University, Pune International Airport, and Phoenix Marketcity shopping center, with convenient dining and cafe options.
          </div>
        </div>

        {/* 9. Things to know Section */}
        <div className="mt-16 pt-12 pb-16 border-t border-[#dddddd]">
          <h3 className="text-[22px] font-semibold text-[#222222] mb-6">
            Things to know
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-[15px]">
            <div>
              <h4 className="font-semibold text-[#222222] mb-3">House rules</h4>
              <ul className="space-y-2 text-[#717171]">
                <li>Check-in: 2:00 PM – 10:00 PM</li>
                <li>Checkout: 11:00 AM</li>
                <li>Pets allowed</li>
                <li>No smoking inside</li>
                <li>Maximum 6 guests</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-[#222222] mb-3">Safety &amp; property</h4>
              <ul className="space-y-2 text-[#717171]">
                <li>Carbon monoxide alarm installed</li>
                <li>Smoke alarm active</li>
                <li>Exterior security cameras on property</li>
                <li>First aid kit available</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-[#222222] mb-3">Cancellation policy</h4>
              <p className="text-[#717171] leading-relaxed">
                Free cancellation before 5 November. Review the Host&apos;s full cancellation policy for details.
              </p>
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
