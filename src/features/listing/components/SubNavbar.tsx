'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import { ListingDetail } from '@/types';

interface SubNavbarProps {
  listing?: ListingDetail;
  nights?: number;
  totalPrice?: number;
  onReserveClick?: () => void;
  onScrollToSection?: (sectionId: string) => void;
}

export function SubNavbar({
  listing,
  nights = 2,
  totalPrice = 8698,
  onReserveClick,
  onScrollToSection,
}: SubNavbarProps) {
  const [activeTab, setActiveTab] = useState<'photos' | 'amenities' | 'reviews' | 'location'>('photos');

  useEffect(() => {
    const handleScroll = () => {
      const amenitiesEl = document.getElementById('amenities');
      const reviewsEl = document.getElementById('reviews');
      const locationEl = document.getElementById('location');

      const scrollPos = window.scrollY + 120;

      if (locationEl && scrollPos >= locationEl.offsetTop) {
        setActiveTab('location');
      } else if (reviewsEl && scrollPos >= reviewsEl.offsetTop) {
        setActiveTab('reviews');
      } else if (amenitiesEl && scrollPos >= amenitiesEl.offsetTop) {
        setActiveTab('amenities');
      } else {
        setActiveTab('photos');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string, tab: 'photos' | 'amenities' | 'reviews' | 'location') => {
    setActiveTab(tab);
    if (onScrollToSection) {
      onScrollToSection(id);
      return;
    }

    if (id === 'photos') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const el = document.getElementById(id);
    if (el) {
      const yOffset = -76; // offset for the 64px floating bar
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const rating = listing?.ratings?.overall || 5.0;
  const reviewCount = listing?.ratings?.reviewCount || 9;

  return (
    <motion.header
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -70, opacity: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#dddddd] shadow-[0_2px_4px_rgba(0,0,0,0.04)] select-none"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Navigation Tabs with refined, smaller font size */}
        <div className="flex items-center gap-5 sm:gap-7 h-full">
          <button
            onClick={() => scrollTo('photos', 'photos')}
            className={`h-full flex items-center text-[13px] transition cursor-pointer relative ${
              activeTab === 'photos'
                ? 'text-[#222222] font-semibold'
                : 'text-[#717171] font-medium hover:text-[#222222]'
            }`}
          >
            Photos
            {activeTab === 'photos' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#222222] rounded-t-sm" />
            )}
          </button>

          <button
            onClick={() => scrollTo('amenities', 'amenities')}
            className={`h-full flex items-center text-[13px] transition cursor-pointer relative ${
              activeTab === 'amenities'
                ? 'text-[#222222] font-semibold'
                : 'text-[#717171] font-medium hover:text-[#222222]'
            }`}
          >
            Amenities
            {activeTab === 'amenities' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#222222] rounded-t-sm" />
            )}
          </button>

          <button
            onClick={() => scrollTo('reviews', 'reviews')}
            className={`h-full flex items-center text-[13px] transition cursor-pointer relative ${
              activeTab === 'reviews'
                ? 'text-[#222222] font-semibold'
                : 'text-[#717171] font-medium hover:text-[#222222]'
            }`}
          >
            Reviews
            {activeTab === 'reviews' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#222222] rounded-t-sm" />
            )}
          </button>

          <button
            onClick={() => scrollTo('location', 'location')}
            className={`h-full flex items-center text-[13px] transition cursor-pointer relative ${
              activeTab === 'location'
                ? 'text-[#222222] font-semibold'
                : 'text-[#717171] font-medium hover:text-[#222222]'
            }`}
          >
            Location
            {activeTab === 'location' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#222222] rounded-t-sm" />
            )}
          </button>
        </div>

        {/* Right: Floating mini reservation block with refined font sizes */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-[14px] leading-tight text-[#222222]">
              <span className="font-semibold">{formatCurrency(totalPrice)}</span>
              <span className="font-normal text-[12px] text-[#222222]">
                {' '}for {nights} night{nights > 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex items-center justify-end gap-1 text-[11px] font-medium text-[#222222] mt-0.5">
              <Star className="w-2.5 h-2.5 fill-current text-[#222222]" />
              <span className="font-semibold">{rating.toFixed(1)}</span>
              <span className="text-slate-400">·</span>
              <span className="underline font-normal text-[#717171]">
                {reviewCount} reviews
              </span>
            </div>
          </div>

          <button
            onClick={onReserveClick}
            className="px-6 py-2.5 sm:px-7 sm:py-2.5 rounded-full bg-gradient-to-r from-[#E61E4D] via-[#E31C5F] to-[#D70466] text-white font-semibold text-[14px] transition cursor-pointer active:scale-98 shadow-xs hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#E00B41]"
          >
            Reserve
          </button>
        </div>

      </div>
    </motion.header>
  );
}
