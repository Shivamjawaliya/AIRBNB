'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Heart, ArrowRight, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { HomeListingItem } from '../data/homeData';

interface ListingCarouselProps {
  title: string;
  subtitle?: string;
  listings: HomeListingItem[];
  showSeeAll?: boolean;
}

export function ListingCarousel({
  title,
  subtitle,
  listings,
  showSeeAll = true,
}: ListingCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [savedIds, setSavedIds] = useState<Record<string, boolean>>({});
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollBounds = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScrollBounds();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollBounds, { passive: true });
      return () => container.removeEventListener('scroll', checkScrollBounds);
    }
  }, []);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 380;
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const toggleSave = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSavedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="py-6">
      
      {/* Section Header with Title & Arrow Navigation */}
      <div className="flex items-end justify-between mb-4">
        <div>
          <Link
            href="/rooms/terracotta-serene-candolim"
            className="flex items-center gap-2 group cursor-pointer inline-flex"
          >
            <h2 className="text-xl sm:text-[22px] font-bold text-[#222222] tracking-tight group-hover:underline">
              {title}
            </h2>
            <ArrowRight className="w-4 h-4 text-[#222222] group-hover:translate-x-1 transition-transform" />
          </Link>
          {subtitle && (
            <p className="text-[14px] text-[#717171] font-normal mt-0.5">{subtitle}</p>
          )}
        </div>

        {/* Carousel Arrow Buttons */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => handleScroll('left')}
            disabled={!canScrollLeft}
            className={`w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-800 transition-all shadow-xs ${
              canScrollLeft
                ? 'hover:scale-104 active:scale-96 hover:border-slate-800 cursor-pointer bg-white'
                : 'opacity-30 cursor-not-allowed bg-slate-50'
            }`}
            aria-label="Previous items"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleScroll('right')}
            disabled={!canScrollRight}
            className={`w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-800 transition-all shadow-xs ${
              canScrollRight
                ? 'hover:scale-104 active:scale-96 hover:border-slate-800 cursor-pointer bg-white'
                : 'opacity-30 cursor-not-allowed bg-slate-50'
            }`}
            aria-label="Next items"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Carousel Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto pb-4 scroll-smooth no-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {listings.map((item) => {
          const isSaved = !!savedIds[item.id];

          return (
            <Link
              key={item.id}
              href="/rooms/terracotta-serene-candolim"
              className="group flex-shrink-0 w-[210px] sm:w-[180px] cursor-pointer"
            >
              {/* Photo Card Container */}
              <div className="relative aspect-[20/19] w-full rounded-2xl overflow-hidden bg-slate-100 mb-2">
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.includes('photo-1590490360182-c33d57733427')) {
                      target.src = 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80';
                    }
                  }}
                />

                {/* Guest Favourite Badge */}
                {item.isGuestFavorite && (
                  <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-[2px] text-[#222222] text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs border border-black/5">
                    Guest favourite
                  </div>
                )}

                {/* Heart Button with Bouncy Spring Animation */}
                <motion.button
                  whileTap={{ scale: 0.8 }}
                  onClick={(e) => toggleSave(item.id, e)}
                  className="absolute top-2 right-2 p-1 rounded-full hover:scale-110 active:scale-90 transition-transform"
                  aria-label="Save listing"
                >
                  <Heart
                    className={`w-5 h-5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] transition-colors ${
                      isSaved
                        ? 'fill-[#FF385C] stroke-[#FF385C]'
                        : 'fill-black/30 stroke-white stroke-[2]'
                    }`}
                  />
                </motion.button>
              </div>

              {/* Title & Metadata */}
              <div className="space-y-0.5">
                <div className="font-bold text-[13px] sm:text-[13.5px] text-[#222222] truncate leading-tight">
                  {item.title}
                </div>
                <div className="text-[12px] sm:text-[12.5px] text-[#717171] font-normal flex items-center justify-between gap-1">
                  <span className="truncate">{item.priceText}</span>
                  <span className="flex items-center gap-0.5 text-[#222222] font-semibold text-[11px] flex-shrink-0">
                    <Star className="w-3 h-3 fill-current text-[#222222]" />
                    <span>{item.rating}</span>
                  </span>
                </div>
              </div>
            </Link>
          );
        })}

        {/* Optional "See all" card at the end of carousel (Matches Screenshot 2) */}
        {showSeeAll && (
          <Link
            href="/rooms/terracotta-serene-candolim"
            className="flex-shrink-0 w-[210px] sm:w-[180px] aspect-[20/19] rounded-2xl border border-slate-200 bg-white flex flex-col items-center justify-center p-3 text-center cursor-pointer hover:shadow-md transition group"
          >
            {/* 3 Stacked Angled Photos */}
            <div className="relative w-20 h-14 mb-2.5">
              <div className="absolute inset-0 bg-slate-300 rounded-lg transform -rotate-6 shadow-sm overflow-hidden border border-white">
                <img
                  src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=300&q=80"
                  alt="Thumb"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-slate-300 rounded-lg transform rotate-3 shadow-md overflow-hidden border border-white">
                <img
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=300&q=80"
                  alt="Thumb"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-slate-300 rounded-lg transform rotate-0 shadow-lg overflow-hidden border border-white">
                <img
                  src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=300&q=80"
                  alt="Thumb"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="font-bold text-[13px] text-[#222222] group-hover:underline">
              See all
            </div>
          </Link>
        )}

      </div>
    </section>
  );
}
