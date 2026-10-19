'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ListingHeader } from '@/features/listing/components/ListingHeader';
import { PhotoBentoGrid } from '@/features/listing/components/PhotoBentoGrid';
import { PropertyOverview } from '@/features/listing/components/PropertyOverview';
import { StickyBookingWidget } from '@/features/booking/components/StickyBookingWidget';
import { PhotoTourOverlay } from '@/features/photo-tour/components/PhotoTourOverlay';
import { LightboxModal } from '@/features/lightbox/components/LightboxModal';
import { useViewState } from '@/hooks/useViewState';
import { MOCK_LISTING_DATA } from '@/data/mockListingData';

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

  // Booking date range state
  const [dateRange] = useState<{ startDate: Date | null; endDate: Date | null }>({
    startDate: new Date('2026-10-20'),
    endDate: new Date('2026-10-25'),
  });

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* 1. Global Navigation Bar */}
      <Navbar />

      {/* Main Page Container (Desktop-optimized max-w-7xl) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8">
        {/* 2. Listing Title & Action Bar */}
        <ListingHeader title={MOCK_LISTING_DATA.title} />

        {/* 3. 5-Photo Bento Grid */}
        <PhotoBentoGrid
          photos={MOCK_LISTING_DATA.photos}
          onOpenPhotoTour={openPhotoTour}
          onOpenLightbox={openLightbox}
        />

        {/* 4. Two-Column Layout: Left Details vs Right Sticky Widget */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-12 relative items-start">
          
          {/* Left Column (2 Cols): Property Information */}
          <div className="lg:col-span-2 space-y-8">
            <PropertyOverview listing={MOCK_LISTING_DATA} />

            {/* Placeholder sections for full implementation */}
            <div className="py-6 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-3">Key Highlights</h3>
              <p className="text-xs text-slate-500">
                Whirlpool/Jacuzzi, Dedicated workspace, Self check-in, and Free cancellation features will be wired here.
              </p>
            </div>

            <div className="py-6 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-3">What this place offers</h3>
              <p className="text-xs text-slate-500">
                Full 43 amenities modal and 2-column icon grid will be populated here.
              </p>
            </div>

            <div className="py-6 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-3">Interactive Calendar</h3>
              <p className="text-xs text-slate-500">
                Dual-month range picker syncing with the sticky booking box will be rendered here.
              </p>
            </div>
          </div>

          {/* Right Column (1 Col): Sticky Floating Reservation Card */}
          <div className="lg:col-span-1">
            <StickyBookingWidget
              listing={MOCK_LISTING_DATA}
              startDate={dateRange.startDate}
              endDate={dateRange.endDate}
            />
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
