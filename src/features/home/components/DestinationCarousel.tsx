'use client';

import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DestinationItem } from '../data/homeData';

interface DestinationCarouselProps {
  destinations: DestinationItem[];
}

export function DestinationCarousel({ destinations }: DestinationCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 500;
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section className="py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-[22px] font-bold text-slate-900 tracking-tight">
          Destinations for you
        </h2>

        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => handleScroll('left')}
            className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-700 hover:scale-105 active:scale-95 hover:border-slate-800 transition shadow-xs"
            aria-label="Previous destinations"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleScroll('right')}
            className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-700 hover:scale-105 active:scale-95 hover:border-slate-800 transition shadow-xs"
            aria-label="Next destinations"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto pb-4 scroll-smooth no-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {destinations.map((dest) => (
          <div
            key={dest.id}
            className="group flex-shrink-0 w-[140px] sm:w-[160px] cursor-pointer"
          >
            {/* Image */}
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-100 mb-2">
              <img
                src={dest.imageUrl}
                alt={dest.city}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* City & Tagline */}
            <div>
              <div className="font-bold text-xs text-slate-900">{dest.city}</div>
              <div className="text-[11px] text-slate-500 font-medium truncate">
                {dest.tagline}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
