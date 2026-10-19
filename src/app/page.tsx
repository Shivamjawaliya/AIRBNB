'use client';

import React from 'react';
import Link from 'next/link';
import { Search, Heart } from 'lucide-react';
import { HomeHeader } from '@/features/home/components/HomeHeader';
import { ListingCarousel } from '@/features/home/components/ListingCarousel';
import { DestinationCarousel } from '@/features/home/components/DestinationCarousel';
import { InspirationSection } from '@/features/home/components/InspirationSection';
import { HomeFooter } from '@/features/home/components/HomeFooter';
import { useViewState } from '@/hooks/useViewState';
import { PhotoTourOverlay } from '@/features/photo-tour/components/PhotoTourOverlay';
import { LightboxModal } from '@/features/lightbox/components/LightboxModal';
import { ALL_43_PHOTOS } from '@/features/photo-tour/data/photoTourData';
import {
  SOUTH_GOA_LISTINGS,
  NOIDA_LISTINGS,
  PUNE_LISTINGS,
  DESTINATIONS_FOR_YOU,
} from '@/features/home/data/homeData';

export default function HomePage() {
  const {
    activeView,
    activePhotoIndex,
    activeRoomCategory,
    openLightbox,
    closeToPhotoTour,
    closeToListing,
    setActivePhotoIndex,
  } = useViewState();
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800 w-full pb-16 md:pb-0">
      
      {/* 1. Dynamic Animated Header (Morphs from Expanded to Compact on Scroll on desktop, floating pill on mobile) */}
      <HomeHeader />

      {/* Main Content Container (Max width matching real Airbnb 1760px) */}
      <main className="flex-1 max-w-[1760px] w-full mx-auto px-4 sm:px-6 md:px-8 min-[1138px]:px-20 space-y-6 pt-2 sm:pt-4 overflow-x-clip">
        
        {/* Section 1: South Goa (Matches Screenshot 1 & 2) */}
        <ListingCarousel
          title="Available next month in South Goa"
          subtitle="Indian coast with beach towns"
          listings={SOUTH_GOA_LISTINGS}
          showSeeAll={true}
        />

        {/* Section 2: Noida (Matches Screenshot 1 & 2) */}
        <ListingCarousel
          title="Check out homes in Noida"
          subtitle="Planned city near New Delhi"
          listings={NOIDA_LISTINGS}
          showSeeAll={false}
        />

        {/* Section 3: Pune (Matches Screenshot 2) */}
        <ListingCarousel
          title="Places to stay in Pune"
          listings={PUNE_LISTINGS}
          showSeeAll={false}
        />

        {/* Section 4: Destinations for you (Matches Screenshot 3) */}
        <DestinationCarousel destinations={DESTINATIONS_FOR_YOU} />

        {/* Section 5: Inspiration for future getaways (Matches Screenshot 3 & 4) */}
        <InspirationSection />

      </main>

      {/* 6. Footer matching Screenshot 4 */}
      <HomeFooter />

      {/* 7. Mobile Bottom Navigation Bar (Docked on phone viewports) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 flex items-center justify-around py-2 px-2 shadow-[0_-2px_10px_rgba(0,0,0,0.06)] select-none">
        <Link href="/" className="flex flex-col items-center gap-1 text-[#FF385C] flex-1">
          <Search className="w-5 h-5 stroke-[2.6]" />
          <span className="text-[10px] font-semibold">Explore</span>
        </Link>
        <Link href="/rooms/terracotta-serene-candolim" className="flex flex-col items-center gap-1 text-slate-500 hover:text-slate-900 flex-1">
          <Heart className="w-5 h-5 stroke-[2]" />
          <span className="text-[10px] font-medium">Wishlists</span>
        </Link>
        <button className="flex flex-col items-center gap-1 text-slate-500 hover:text-slate-900 flex-1 cursor-pointer">
          <svg viewBox="0 0 32 32" className="w-5 h-5 fill-none stroke-current stroke-[2.2]">
            <circle cx="16" cy="16" r="14" />
            <path d="m26.46 25.62c-1.58-2.81-4.26-4.9-7.46-5.73v-.72c1.79-1.04 3-2.96 3-5.17 0-3.31-2.69-6-6-6s-6 2.69-6 6c0 2.22 1.21 4.14 3 5.17v.72c-3.16.82-5.83 2.87-7.42 5.64" />
          </svg>
          <span className="text-[10px] font-medium">Log in</span>
        </button>
      </nav>

      {/* Fullscreen Photo Tour Overlay */}
      <PhotoTourOverlay
        isOpen={activeView === 'photo-tour'}
        photos={ALL_43_PHOTOS}
        initialSection={activeRoomCategory}
        onClose={closeToListing}
        onSelectPhoto={(idx) => openLightbox(idx)}
      />

      {/* Single-Photo Lightbox Modal */}
      <LightboxModal
        isOpen={activeView === 'lightbox'}
        photos={ALL_43_PHOTOS}
        currentIndex={activePhotoIndex}
        onClose={closeToPhotoTour}
        onNavigate={setActivePhotoIndex}
      />

    </div>
  );
}
