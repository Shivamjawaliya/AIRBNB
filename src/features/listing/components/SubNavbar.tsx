'use client';

import React, { useState, useEffect } from 'react';

interface SubNavbarProps {
  onScrollToSection?: (sectionId: string) => void;
}

export function SubNavbar({ onScrollToSection }: SubNavbarProps) {
  const [activeTab, setActiveTab] = useState<'photos' | 'amenities' | 'reviews' | 'location'>('photos');

  useEffect(() => {
    const handleScroll = () => {
      const amenitiesEl = document.getElementById('amenities');
      const reviewsEl = document.getElementById('reviews');
      const locationEl = document.getElementById('location');

      const scrollPos = window.scrollY + 100;

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
      const yOffset = -70; // offset for sticky sub-navbar
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <nav className="sticky top-0 z-30 bg-white border-b border-[#dddddd] transition-all duration-200">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 flex items-center justify-between h-12 sm:h-14">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-6 sm:gap-8 h-full">
          <button
            onClick={() => scrollTo('photos', 'photos')}
            className={`h-full flex items-center text-[14px] font-semibold transition cursor-pointer relative ${
              activeTab === 'photos'
                ? 'text-[#222222]'
                : 'text-[#717171] hover:text-[#222222]'
            }`}
          >
            Photos
            {activeTab === 'photos' && (
              <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#222222] rounded-t-sm" />
            )}
          </button>

          <button
            onClick={() => scrollTo('amenities', 'amenities')}
            className={`h-full flex items-center text-[14px] font-semibold transition cursor-pointer relative ${
              activeTab === 'amenities'
                ? 'text-[#222222]'
                : 'text-[#717171] hover:text-[#222222]'
            }`}
          >
            Amenities
            {activeTab === 'amenities' && (
              <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#222222] rounded-t-sm" />
            )}
          </button>

          <button
            onClick={() => scrollTo('reviews', 'reviews')}
            className={`h-full flex items-center text-[14px] font-semibold transition cursor-pointer relative ${
              activeTab === 'reviews'
                ? 'text-[#222222]'
                : 'text-[#717171] hover:text-[#222222]'
            }`}
          >
            Reviews
            {activeTab === 'reviews' && (
              <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#222222] rounded-t-sm" />
            )}
          </button>

          <button
            onClick={() => scrollTo('location', 'location')}
            className={`h-full flex items-center text-[14px] font-semibold transition cursor-pointer relative ${
              activeTab === 'location'
                ? 'text-[#222222]'
                : 'text-[#717171] hover:text-[#222222]'
            }`}
          >
            Location
            {activeTab === 'location' && (
              <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#222222] rounded-t-sm" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
