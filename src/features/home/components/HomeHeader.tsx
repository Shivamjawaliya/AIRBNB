'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, Minus, Plus, SlidersHorizontal, X, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SUGGESTED_DESTINATIONS = [
  {
    name: 'Nearby',
    subtitle: "Find what's around you",
    bgColor: 'bg-[#F0F5FA]',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#2E79B9] fill-none stroke-current stroke-[2.2] stroke-linecap-round stroke-linejoin-round">
        <polygon points="3 11 22 2 13 21 11 13 3 11" fill="currentColor" fillOpacity="0.15" />
      </svg>
    ),
  },
  {
    name: 'North Goa, Goa',
    subtitle: 'Popular beach destination',
    bgColor: 'bg-[#FFF5EE]',
    icon: (
      <svg viewBox="0 0 32 32" className="w-5 h-5 text-[#C86400] fill-none stroke-current stroke-[2] stroke-linecap-round stroke-linejoin-round">
        <path d="M5 25c4 0 5-2 8-2s4 2 8 2 4-2 6-2" />
        <path d="M16 23c0-6 2-10 5-13" />
        <path d="M21 10c-3-2-6-1-8 1m8-1c2-3 5-3 7-2m-7 2c0-3 2-6 5-7" />
        <path d="M6 20h4v4H6z" />
      </svg>
    ),
  },
  {
    name: 'Bhopal, Madhya Pradesh',
    subtitle: 'Known for its lakes',
    bgColor: 'bg-[#FFF0F3]',
    icon: (
      <svg viewBox="0 0 32 32" className="w-5 h-5 text-[#D93B65] fill-none stroke-current stroke-[2] stroke-linecap-round stroke-linejoin-round">
        <path d="M4 25c4-1 6 1 12 1s7-2 12-1" />
        <path d="M4 21c4-1 6 1 12 1s7-2 12-1" />
        <path d="M7 17V8h6v9m4 0V11h8v6" />
      </svg>
    ),
  },
  {
    name: 'Mumbai, Maharashtra',
    subtitle: 'For sights like Gateway of India',
    bgColor: 'bg-[#EFF9F3]',
    icon: (
      <svg viewBox="0 0 32 32" className="w-5 h-5 text-[#1B8354] fill-none stroke-current stroke-[2] stroke-linecap-round stroke-linejoin-round">
        <path d="M6 25V8h20v17M11 25v-8a5 5 0 0 1 10 0v8M6 12h20M4 25h24" />
      </svg>
    ),
  },
  {
    name: 'Varanasi, Uttar Pradesh',
    subtitle: 'A hidden gem',
    bgColor: 'bg-[#FFF2EE]',
    icon: (
      <svg viewBox="0 0 32 32" className="w-5 h-5 text-[#E05638] fill-none stroke-current stroke-[2] stroke-linecap-round stroke-linejoin-round">
        <path d="M16 4v3m0 0a6 6 0 0 0-6 6v12h12V13a6 6 0 0 0-6-6zM6 25h20M13 25v-5a3 3 0 0 1 6 0v5" />
      </svg>
    ),
  },
  {
    name: 'New Delhi, Delhi',
    subtitle: 'For its stunning architecture',
    bgColor: 'bg-[#F0F8F5]',
    icon: (
      <svg viewBox="0 0 32 32" className="w-5 h-5 text-[#2C7A4D] fill-none stroke-current stroke-[2] stroke-linecap-round stroke-linejoin-round">
        <path d="M8 25V7h16v18M12 25v-8a4 4 0 0 1 8 0v8M7 11h18M5 25h22" />
        <circle cx="25" cy="18" r="2.5" fill="currentColor" fillOpacity="0.2" />
      </svg>
    ),
  },
  {
    name: 'Pune City, Maharashtra',
    subtitle: 'For sights like Dagdusheth Halwai Ganpati Temple',
    bgColor: 'bg-[#F6F6F6]',
    icon: (
      <svg viewBox="0 0 32 32" className="w-5 h-5 text-[#666666] fill-none stroke-current stroke-[2] stroke-linecap-round stroke-linejoin-round">
        <path d="M7 25V14h6v11m0-5h6v5m0-15h6v15M5 25h22" />
      </svg>
    ),
  },
];

export interface HomeHeaderProps {
  mode?: 'home' | 'rooms';
}

export function HomeHeader({ mode = 'home' }: HomeHeaderProps = {}) {
  const isRoomsMode = mode === 'rooms';

  // Viewport detection
  const [isMobile, setIsMobile] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1280);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      setWindowWidth(w);
      setIsMobile(w < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Two strict endpoints:
  // Endpoint 1: Top of page (window.scrollY <= 8) -> Big search bar + category tabs
  // Endpoint 2: Scrolled (window.scrollY > 8) -> Small compact search bar docked in navbar
  // On rooms page: Always starts in Endpoint 2 (compact), never scroll-morphs
  const [isScrolled, setIsScrolled] = useState(isRoomsMode);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'homes' | 'experiences' | 'services'>(
    isRoomsMode ? 'homes' : 'all'
  );
  
  // Track if user has interacted (scrolled or clicked) so first page load has ZERO animation
  const [hasInteracted, setHasInteracted] = useState(false);

  // Strict scroll state refs
  const isScrolledRef = useRef(isRoomsMode);
  const isExpandedRef = useRef(false);
  const prevScrollY = useRef(0);

  // Segment focus state inside Endpoint 1: 'where' | 'when' | 'who' | null
  const [activeSegment, setActiveSegment] = useState<'where' | 'when' | 'who' | null>(null);
  const [hoveredSegment, setHoveredSegment] = useState<'where' | 'when' | 'who' | null>(null);

  // Search input values
  const [destination, setDestination] = useState('');
  const [datesText, setDatesText] = useState('');
  const [guests, setGuests] = useState({ adults: 0, children: 0, infants: 0, pets: 0 });

  // When Calendar selection states
  const [whenTab, setWhenTab] = useState<'dates' | 'flexible'>('dates');
  const [checkInDate, setCheckInDate] = useState<string | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<string | null>(null);
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState(0); // 0 = Oct/Nov 2026

  const totalGuests = guests.adults + guests.children;
  let guestSummary = 'Add guests';
  if (totalGuests > 0) {
    guestSummary = `${totalGuests} guest${totalGuests > 1 ? 's' : ''}`;
    if (guests.infants > 0) {
      guestSummary += `, ${guests.infants} infant${guests.infants > 1 ? 's' : ''}`;
    }
    if (guests.pets > 0) {
      guestSummary += `, ${guests.pets} pet${guests.pets > 1 ? 's' : ''}`;
    }
  }

  // Base calendar data (October 2026 base)
  const baseYear = 2026;
  const baseMonth = 9; // 0-indexed for October

  const getCalendarMonthData = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth, year, month };
  };

  const month1Data = getCalendarMonthData(
    baseYear + Math.floor((baseMonth + currentCalendarMonth) / 12),
    (baseMonth + currentCalendarMonth) % 12
  );
  const month2Data = getCalendarMonthData(
    baseYear + Math.floor((baseMonth + currentCalendarMonth + 1) / 12),
    (baseMonth + currentCalendarMonth + 1) % 12
  );

  const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const handleDateClick = (dateStr: string) => {
    if (!checkInDate || (checkInDate && checkOutDate)) {
      setCheckInDate(dateStr);
      setCheckOutDate(null);
      const d = new Date(dateStr);
      setDatesText(`${MONTH_NAMES[d.getMonth()].slice(0, 3)} ${d.getDate()}`);
    } else {
      if (dateStr < checkInDate) {
        setCheckInDate(dateStr);
        setCheckOutDate(null);
        const d = new Date(dateStr);
        setDatesText(`${MONTH_NAMES[d.getMonth()].slice(0, 3)} ${d.getDate()}`);
      } else {
        setCheckOutDate(dateStr);
        const d1 = new Date(checkInDate);
        const d2 = new Date(dateStr);
        const m1 = MONTH_NAMES[d1.getMonth()].slice(0, 3);
        const m2 = MONTH_NAMES[d2.getMonth()].slice(0, 3);
        const formatted = d1.getMonth() === d2.getMonth()
          ? `${m1} ${d1.getDate()} – ${d2.getDate()}`
          : `${m1} ${d1.getDate()} – ${m2} ${d2.getDate()}`;
        setDatesText(formatted);
        setTimeout(() => {
          setActiveSegment('who');
        }, 350);
      }
    }
  };

  const formatBoxDate = (dateStr: string | null) => {
    if (!dateStr) return 'Exact date';
    const d = new Date(dateStr);
    return `${MONTH_NAMES[d.getMonth()].slice(0, 3)} ${d.getDate()}`;
  };

  const renderMonthGrid = (data: ReturnType<typeof getCalendarMonthData>) => {
    const { firstDay, daysInMonth, year, month } = data;
    const cells = [];

    // Empty cells before day 1
    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${i}`} className="h-10" />);
    }

    // Days 1..daysInMonth
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isPast = year === 2026 && month === 9 && day < 19;
      const isStart = checkInDate === dateStr;
      const isEnd = checkOutDate === dateStr;
      const inRange = Boolean(checkInDate && checkOutDate && dateStr > checkInDate && dateStr < checkOutDate);

      cells.push(
        <div key={dateStr} className="h-10 flex items-center justify-center relative select-none">
          {inRange && (
            <div className="absolute inset-y-0 inset-x-0 bg-[#F7F7F7]" />
          )}
          {isStart && checkOutDate && (
            <div className="absolute inset-y-0 right-0 left-1/2 bg-[#F7F7F7]" />
          )}
          {isEnd && checkInDate && (
            <div className="absolute inset-y-0 left-0 right-1/2 bg-[#F7F7F7]" />
          )}
          {isStart || isEnd ? (
            <button
              onClick={() => !isPast && handleDateClick(dateStr)}
              className="w-10 h-10 rounded-full bg-[#222222] text-white font-semibold flex items-center justify-center text-[14px] z-10 cursor-pointer shadow-xs"
            >
              {day}
            </button>
          ) : isPast ? (
            <span className="w-10 h-10 flex items-center justify-center text-[#B0B0B0] font-normal text-[14px] cursor-not-allowed">
              {day}
            </span>
          ) : (
            <button
              onClick={() => handleDateClick(dateStr)}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-[#222222] font-semibold text-[14px] cursor-pointer transition z-10 hover:border hover:border-[#222222] hover:bg-slate-50 ${
                inRange ? 'text-[#222222]' : ''
              }`}
            >
              {day}
            </button>
          )}
        </div>
      );
    }

    return cells;
  };

  const headerRef = useRef<HTMLDivElement>(null);

  // Close active dropdown on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setActiveSegment(null);
        if (isScrolled) {
          isExpandedRef.current = false;
          setIsExpanded(false);
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveSegment(null);
        if (isScrolled) {
          isExpandedRef.current = false;
          setIsExpanded(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isScrolled]);

  // Synchronous Wheel and Scroll listeners
  useEffect(() => {
    prevScrollY.current = window.scrollY;
    const TOP_THRESHOLD = 40;

    const handleWheel = (e: WheelEvent) => {
      if (window.innerWidth < 768) return;

      // In rooms mode: Never auto-morph on scroll; if user opened search bar, close it on wheel
      if (isRoomsMode) {
        if (isExpandedRef.current) {
          isExpandedRef.current = false;
          setIsExpanded(false);
          setActiveSegment(null);
        }
        return;
      }

      // 1. One rotation DOWN (e.deltaY > 0): immediately collapse to Endpoint 2 (compact)
      if (e.deltaY > 4) {
        if (!isScrolledRef.current || isExpandedRef.current) {
          if (!hasInteracted) setHasInteracted(true);
          isScrolledRef.current = true;
          isExpandedRef.current = false;
          setIsScrolled(true);
          setIsExpanded(false);
          setActiveSegment(null);
        }
      }
      // 2. One rotation UP (e.deltaY < 0): ONLY expand when page is at the TOP (<= 40px)
      else if (e.deltaY < -4) {
        if (isScrolledRef.current && window.scrollY <= TOP_THRESHOLD) {
          if (!hasInteracted) setHasInteracted(true);
          isScrolledRef.current = false;
          isExpandedRef.current = false;
          setIsScrolled(false);
          setIsExpanded(false);
        }
      }
    };

    const handleScroll = () => {
      if (window.innerWidth < 768) return;

      // In rooms mode: Never auto-morph on scroll; if user opened search bar, close it on scroll
      if (isRoomsMode) {
        if (isExpandedRef.current) {
          isExpandedRef.current = false;
          setIsExpanded(false);
          setActiveSegment(null);
        }
        return;
      }

      const currentScroll = window.scrollY;
      const delta = currentScroll - prevScrollY.current;

      // When reaching top of page (currentScroll <= TOP_THRESHOLD) while scrolling UP: expand back to Endpoint 1
      if (currentScroll <= TOP_THRESHOLD && delta <= 0) {
        if (isScrolledRef.current) {
          if (!hasInteracted) setHasInteracted(true);
          isScrolledRef.current = false;
          isExpandedRef.current = false;
          setIsScrolled(false);
          setIsExpanded(false);
        }
      } else if (currentScroll > TOP_THRESHOLD) {
        // Scrolling down past top: ensure compact
        if (!isScrolledRef.current && delta > 0) {
          if (!hasInteracted) setHasInteracted(true);
          isScrolledRef.current = true;
          isExpandedRef.current = false;
          setIsScrolled(true);
          setIsExpanded(false);
          setActiveSegment(null);
        }
      }

      prevScrollY.current = currentScroll;
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasInteracted, isRoomsMode]);

  // Active state: True if Endpoint 2 (compact), False if Endpoint 1 (big)
  const isEndpoint2 = isScrolled && !isExpanded;
  const isTablet = windowWidth >= 768 && windowWidth < 1138;
  const searchBarWidth = isEndpoint2
    ? (isTablet ? 340 : 408)
    : (isTablet ? Math.min(680, windowWidth - 48) : 848);

  // GPU-accelerated cubic-bezier transition matching real Airbnb
  const easeTransition = {
    duration: 0.42,
    ease: [0.16, 1, 0.3, 1] as const,
  };

  // Zero animation on initial page load; only animate after user has scrolled/interacted
  const activeTransition = hasInteracted ? easeTransition : { duration: 0 };
  const innerFadeTransition = hasInteracted ? { duration: 0.25 } : { duration: 0 };

  const updateGuests = (type: keyof typeof guests, delta: number) => {
    setGuests((prev) => {
      const updated = Math.max(0, prev[type] + delta);
      let newAdults = prev.adults;
      if (type !== 'adults' && delta > 0 && prev.adults === 0) {
        newAdults = 1;
      }
      return { ...prev, adults: newAdults, [type]: updated };
    });
  };

  return (
    <>
      {/* Backdrop overlay when expanded while scrolled or when a segment dropdown is open */}
      <AnimatePresence>
        {((isScrolled && isExpanded) || activeSegment) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => {
              setActiveSegment(null);
              if (isScrolled) {
                isExpandedRef.current = false;
                setIsExpanded(false);
              }
            }}
            className="fixed inset-0 z-30 bg-black/25 backdrop-blur-[1px]"
          />
        )}
      </AnimatePresence>

      {/* Header Container that transitions height smoothly between Endpoint 1 (180px) and Endpoint 2 (80px) on desktop */}
      <motion.header
        ref={headerRef}
        initial={false}
        animate={{
          height: isMobile ? 'auto' : (isEndpoint2 ? 80 : 180),
        }}
        transition={activeTransition}
        style={{
          background: isRoomsMode
            ? '#ffffff'
            : 'var(--search-input_background, linear-gradient(in srgb, var(--palette-bg-primary) 39.9%, color-mix(in srgb, var(--palette-bg-primary)) 100%))',
        }}
        className={`${isRoomsMode ? 'relative' : 'fixed top-0 left-0 right-0'} z-40 border-b border-slate-200 select-none overflow-visible w-full ${
          isScrolled ? 'shadow-[0_2px_4px_rgba(0,0,0,0.06)]' : ''
        }`} 
      >
        {/* ========================================================================= */}
        {/* 1. DESKTOP HEADER (hidden on mobile, visible on desktop md+)              */}
        {/* ========================================================================= */}
        <div className="hidden md:block mx-auto h-full relative max-w-[1760px] px-8 sm:px-10 md:px-12 min-[1138px]:px-20">
          
          {/* Top Bar Row (80px height) with comfortable left & right padding */}
          <div className="h-20 flex items-center justify-between relative px-2 sm:px-4">
            
            {/* Left: Airbnb Brand Logo */}
            <Link
              href="/"
              className="flex items-center gap-1.5 cursor-pointer z-20 flex-shrink-0 group"
              aria-label="Airbnb homepage"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="3.5 12 113.5 36"
                className="h-7 sm:h-[35px] w-auto group-hover:opacity-90 transition-opacity"
              >
                {/* Bélo Symbol - full silhouette without clipping */}
                <path
                  d="M36.14 37.335l-.526-1.253-.802-1.78-.034-.034a359.93 359.93 0 0 0-7.696-15.748l-.108-.2-.83-1.67a10.02 10.02 0 0 0-1.253-1.914 5.627 5.627 0 0 0-4.461-2.129 5.849 5.849 0 0 0-4.461 2.089 12.015 12.015 0 0 0-1.253 1.914l-.943 1.846c-2.695 5.23-5.297 10.52-7.702 15.748l-.034.067c-.2.573-.485 1.16-.768 1.786q-.263.573-.526 1.253a7.83 7.83 0 0 0-.418 3.76 7.413 7.413 0 0 0 4.528 5.782 7.156 7.156 0 0 0 2.824.559 7.911 7.911 0 0 0 .903-.067 9.205 9.205 0 0 0 3.484-1.186 17.642 17.642 0 0 0 4.319-3.625 18.302 18.302 0 0 0 4.319 3.625 9.198 9.198 0 0 0 3.484 1.186 7.925 7.925 0 0 0 .903.067 7.042 7.042 0 0 0 2.824-.559 7.413 7.413 0 0 0 4.528-5.782 6.584 6.584 0 0 0-.317-3.726zm-15.708 1.813c-1.88-2.372-3.1-4.596-3.518-6.483a5.62 5.62 0 0 1-.108-2.123 3.369 3.369 0 0 1 .559-1.462 3.7 3.7 0 0 1 3.066-1.536 3.565 3.565 0 0 1 3.066 1.53 3.369 3.369 0 0 1 .559 1.462 5.6 5.6 0 0 1-.108 2.123c-.418 1.846-1.637 4.043-3.518 6.483zm13.902 1.637a5.175 5.175 0 0 1-3.174 4.043 5.276 5.276 0 0 1-2.642.384 6.853 6.853 0 0 1-2.648-.903 16.274 16.274 0 0 1-3.969-3.369c2.298-2.824 3.693-5.4 4.218-7.702a8.76 8.76 0 0 0 .175-2.965 5.654 5.654 0 0 0-.943-2.372 5.869 5.869 0 0 0-4.919-2.5 5.964 5.964 0 0 0-4.912 2.473 5.654 5.654 0 0 0-.943 2.372 7.237 7.237 0 0 0 .175 2.965c.526 2.298 1.954 4.912 4.218 7.736a15.654 15.654 0 0 1-3.969 3.369 6.853 6.853 0 0 1-2.655.93 5.573 5.573 0 0 1-2.648-.35 5.175 5.175 0 0 1-3.174-4.043 5.768 5.768 0 0 1 .317-2.695c.108-.35.276-.674.45-1.112.243-.56.526-1.152.802-1.745l.034-.067c2.406-5.2 4.98-10.485 7.67-15.647l.1-.25.836-1.604a7.642 7.642 0 0 1 1.004-1.543 3.659 3.659 0 0 1 5.573 0 7.655 7.655 0 0 1 .95 1.53l.836 1.604.1.2c2.648 5.196 5.236 10.485 7.635 15.68v.034c.276.56.526 1.186.802 1.745.175.418.35.768.45 1.112a5.883 5.883 0 0 1 .243 2.695z"
                  fill="#FF385C"
                  fillRule="evenodd"
                />
                {/* Refined lighter-weight "airbnb" wordmark */}
                <path
                  d="M63.042 21.358a2.264 2.264 0 1 1-2.264-2.264 2.257 2.257 0 0 1 2.264 2.264zm-9.34 4.55v.56a4.353 4.353 0 0 0-3.369-1.395 6.671 6.671 0 0 0-6.739 6.9 6.671 6.671 0 0 0 6.732 6.907 4.232 4.232 0 0 0 3.369-1.429v.593a.478.478 0 0 0 .485.485h2.824V25.4h-2.8a.499.499 0 0 0-.485.485zm0 8.396a3.464 3.464 0 0 1-2.824 1.429c-2.23 0-3.935-1.395-3.935-3.76s1.705-3.76 3.935-3.76a3.558 3.558 0 0 1 2.824 1.429v4.67zm5.4-8.882h3.37v13.1h-3.37V25.4zm49.967-.35a4.353 4.353 0 0 0-3.369 1.395v-7.352h-3.37V38.52h2.823a.499.499 0 0 0 .485-.485v-.593A4.313 4.313 0 0 0 109 38.871a6.691 6.691 0 0 0 6.739-6.9 6.685 6.685 0 0 0-6.739-6.9zM108.5 35.7a3.41 3.41 0 0 1-2.824-1.429V29.6a3.78 3.78 0 0 1 2.824-1.429c2.23 0 3.935 1.395 3.935 3.76s-1.705 3.76-3.935 3.76zm-7.878-4.946v7.803h-3.37v-7.413c0-2.163-.674-3.032-2.58-3.032a3.74 3.74 0 0 0-2.695 1.287v9.124h-3.37V25.4h2.648a.499.499 0 0 1 .485.485v.56a4.798 4.798 0 0 1 3.551-1.395 5.391 5.391 0 0 1 3.659 1.253c1.186.977 1.637 2.23 1.637 4.427zm-20.1-5.68a4.353 4.353 0 0 0-3.369 1.395v-7.352h-3.37V38.52h2.824a.499.499 0 0 0 .485-.485v-.593a4.313 4.313 0 0 0 3.369 1.429 6.691 6.691 0 0 0 6.739-6.9 6.644 6.644 0 0 0-6.739-6.9zM79.96 35.7a3.41 3.41 0 0 1-2.824-1.429V29.6a3.78 3.78 0 0 1 2.824-1.429c2.23 0 3.935 1.395 3.935 3.76s-1.705 3.76-3.935 3.76zm-9.08-10.63a5.344 5.344 0 0 1 1.536.175v3.1s-2.8-.923-4.528 1.044v9.165h-3.37V25.4h2.824a.499.499 0 0 1 .485.485v.56a4.576 4.576 0 0 1 3.032-1.395z"
                  fill="#FF385C"
                  stroke="#FFFFFF"
                  strokeWidth="0.55"
                  strokeLinejoin="round"
                  fillRule="evenodd"
                />
              </svg>
            </Link>

            {/* Center: Category Tabs (Pinned to true center of page with absolute left-1/2) */}
            <motion.div
              initial={false}
              animate={{
                opacity: isEndpoint2 ? 0 : 1,
                y: isEndpoint2 ? -38 : 0,
                scale: isEndpoint2 ? 0.94 : 1,
                pointerEvents: isEndpoint2 ? 'none' : 'auto',
              }}
              transition={activeTransition}
              className="hidden md:flex items-center gap-3.5 md:gap-4 lg:gap-6 min-[1138px]:gap-9 absolute left-1/2 -translate-x-1/2 z-10"
            >
              {!isRoomsMode && (
                <button
                  onClick={() => setActiveTab('all')}
                  className={`flex items-center gap-1.5 sm:gap-2 min-[1138px]:gap-2.5 pb-2 relative transition-colors cursor-pointer group ${
                    activeTab === 'all' ? 'text-[#222222] font-semibold' : 'text-[#717171] font-medium hover:text-[#222222]'
                  }`}
                >
                  <img src="/icons/categories/all.png" alt="All" className="w-7 h-7 sm:w-8 sm:h-8 min-[1138px]:w-[44px] min-[1138px]:h-[34px] object-contain flex-shrink-0 transition-transform group-hover:scale-105" />
                  <span className="text-[13px] sm:text-[14px] min-[1138px]:text-[16px] tracking-tight">All</span>
                  {activeTab === 'all' && (
                    <motion.div
                      layoutId="activeHeaderTabLine"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      className="absolute -bottom-2 left-0 right-0 h-[2.5px] bg-[#222222] rounded-full"
                    />
                  )}
                </button>
              )}

              <button
                onClick={() => setActiveTab('homes')}
                className={`flex items-center gap-1.5 sm:gap-2 min-[1138px]:gap-2.5 pb-2 relative transition-colors cursor-pointer group ${
                  activeTab === 'homes' ? 'text-[#222222] font-semibold' : 'text-[#717171] font-medium hover:text-[#222222]'
                }`}
              >
                <img src="/icons/categories/homes.png" alt="Homes" className="w-7 h-7 sm:w-8 sm:h-8 min-[1138px]:w-[44px] min-[1138px]:h-[34px] object-contain flex-shrink-0 transition-transform group-hover:scale-105" />
                <span className="text-[13px] sm:text-[14px] min-[1138px]:text-[16px] tracking-tight">Homes</span>
                {activeTab === 'homes' && (
                  <motion.div
                    layoutId="activeHeaderTabLine"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    className="absolute -bottom-2 left-0 right-0 h-[2.5px] bg-[#222222] rounded-full"
                  />
                )}
              </button>

              <button
                onClick={() => setActiveTab('experiences')}
                className={`flex items-center gap-1.5 sm:gap-2 min-[1138px]:gap-2.5 pb-2 relative transition-colors cursor-pointer group ${
                  activeTab === 'experiences' ? 'text-[#222222] font-semibold' : 'text-[#717171] font-medium hover:text-[#222222]'
                }`}
              >
                <img src="/icons/categories/experiences.png" alt="Experiences" className="w-7 h-7 sm:w-8 sm:h-8 min-[1138px]:w-[44px] min-[1138px]:h-[34px] object-contain flex-shrink-0 transition-transform group-hover:scale-105" />
                <span className="text-[13px] sm:text-[14px] min-[1138px]:text-[16px] tracking-tight">Experiences</span>
                {activeTab === 'experiences' && (
                  <motion.div
                    layoutId="activeHeaderTabLine"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    className="absolute -bottom-2 left-0 right-0 h-[2.5px] bg-[#222222] rounded-full"
                  />
                )}
              </button>

              <button
                onClick={() => setActiveTab('services')}
                className={`flex items-center gap-1.5 sm:gap-2 min-[1138px]:gap-2.5 pb-2 relative transition-colors cursor-pointer group ${
                  activeTab === 'services' ? 'text-[#222222] font-semibold' : 'text-[#717171] font-medium hover:text-[#222222]'
                }`}
              >
                <img src="/icons/categories/services.png" alt="Services" className="w-7 h-7 sm:w-8 sm:h-8 min-[1138px]:w-[44px] min-[1138px]:h-[34px] object-contain flex-shrink-0 transition-transform group-hover:scale-105" />
                <span className="text-[13px] sm:text-[14px] min-[1138px]:text-[16px] tracking-tight">Services</span>
                {activeTab === 'services' && (
                  <motion.div
                    layoutId="activeHeaderTabLine"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    className="absolute -bottom-2 left-0 right-0 h-[2.5px] bg-[#222222] rounded-full"
                  />
                )}
              </button>
            </motion.div>

            {/* Right: User Actions matching Screenshot 1 & 2 */}
            <div className="flex items-center gap-2.5 z-20 flex-shrink-0">
              {/* Become a host button: hidden on 767px-1137px, visible on web >= 1138px */}
              <button className="hidden min-[1138px]:block text-[14px] font-semibold text-[#222222] py-2 px-3.5 rounded-full hover:bg-slate-100 transition cursor-pointer">
                Become a host
              </button>

              {/* User Avatar Circle */}
              <button
                className="w-10 h-10 rounded-full border border-slate-200 hover:shadow-md flex items-center justify-center transition cursor-pointer bg-white"
                aria-label="User profile"
              >
                <svg viewBox="0 0 32 32" className="w-5 h-5 fill-none stroke-[#222222] stroke-[2.4]">
                  <circle cx="16" cy="16" r="14" />
                  <path d="m26.46 25.62c-1.58-2.81-4.26-4.9-7.46-5.73v-.72c1.79-1.04 3-2.96 3-5.17 0-3.31-2.69-6-6-6s-6 2.69-6 6c0 2.22 1.21 4.14 3 5.17v.72c-3.16.82-5.83 2.87-7.42 5.64" />
                </svg>
              </button>

              {/* Hamburger Menu Circle */}
              <button
                className="w-10 h-10 rounded-full border border-slate-200 hover:shadow-md flex items-center justify-center transition cursor-pointer bg-white"
                aria-label="Navigation menu"
              >
                <svg viewBox="0 0 32 32" className="w-4 h-4 fill-none stroke-[#222222] stroke-[2.8]">
                  <path d="M2 16h28M2 24h28M2 8h28" />
                </svg>
              </button>
            </div>

          </div>

          {/* ========================================================================= */}
          {/* THE SINGLE SEARCHBAR BLOCK: ANIMATES PRECISELY BETWEEN THE TWO ENDPOINTS */}
          {/* Endpoint 1: top: 16px, y: 88px, width: 848px, height: 66px                */}
          {/* Endpoint 2: top: 16px, y: 0px,  width: 408px, height: 48px                */}
          {/* ========================================================================= */}
          <motion.div
            initial={false}
            animate={{
              y: isEndpoint2 ? 0 : 74,
              width: searchBarWidth,
              height: isEndpoint2 ? 48 : 66,
              boxShadow: isEndpoint2
                ? '0 2px 4px rgba(0,0,0,0.08)'
                : '0 3px 12px rgba(0,0,0,0.08)',
              backgroundColor: !isEndpoint2 && activeSegment ? '#EBEBEB' : '#FFFFFF',
            }}
            transition={activeTransition}
            onClick={() => {
              if (isEndpoint2) {
                setHasInteracted(true);
                isExpandedRef.current = true;
                setIsExpanded(true);
                setActiveSegment(null);
              }
            }}
            className={`absolute top-4 left-1/2 -translate-x-1/2 rounded-full border border-slate-200 flex items-center z-30 cursor-pointer overflow-visible transition-colors duration-150 ${
              isEndpoint2 ? 'hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)]' : ''
            }`}
          >

            {/* -------------------------------------------------------------------- */}
            {/* INNER CONTENT LAYER 1: COMPACT STATE (Endpoint 2)                    */}
            {/* -------------------------------------------------------------------- */}
            <motion.div
              initial={false}
              animate={{
                opacity: isEndpoint2 ? 1 : 0,
                pointerEvents: isEndpoint2 ? 'auto' : 'none',
              }}
              transition={innerFadeTransition}
              className="absolute inset-0 flex items-center justify-between pl-3.5 pr-13 text-[14px] select-none"
            >
              <div
                onClick={(e) => {
                  if (isEndpoint2) {
                    e.stopPropagation();
                    setHasInteracted(true);
                    isExpandedRef.current = true;
                    setIsExpanded(true);
                    setActiveSegment(null);
                  }
                }}
                className="flex items-center gap-2.5 flex-shrink-0 pl-0.5 cursor-pointer"
              >
                <img src="/icons/categories/homes.png" alt="Homes" className="w-7 h-7 sm:w-7 sm:h-7 object-contain flex-shrink-0" />
                <span className="truncate max-w-[100px] text-[14px] font-semibold text-[#222222]">{destination || 'Anywhere'}</span>
              </div>

              <div className="h-5 w-px bg-slate-300 flex-shrink-0 mx-1" />

              <div
                onClick={(e) => {
                  if (isEndpoint2) {
                    e.stopPropagation();
                    setHasInteracted(true);
                    isExpandedRef.current = true;
                    setIsExpanded(true);
                    setActiveSegment(null);
                  }
                }}
                className="px-1 truncate font-semibold text-[14px] text-[#222222] flex-shrink-0 cursor-pointer"
              >
                <span>{datesText || 'Anytime'}</span>
              </div>

              <div className="h-5 w-px bg-slate-300 flex-shrink-0 mx-1" />

              <div
                onClick={(e) => {
                  if (isEndpoint2) {
                    e.stopPropagation();
                    setHasInteracted(true);
                    isExpandedRef.current = true;
                    setIsExpanded(true);
                    setActiveSegment(null);
                  }
                }}
                className="pl-1 truncate font-semibold text-[14px] text-[#222222] flex-shrink-0 cursor-pointer"
              >
                <span>{guestSummary}</span>
              </div>
            </motion.div>

            {/* -------------------------------------------------------------------- */}
            {/* INNER CONTENT LAYER 2: EXPANDED STATE (Endpoint 1: Where, When, Who) */}
            {/* -------------------------------------------------------------------- */}
            <motion.div
              initial={false}
              animate={{
                opacity: isEndpoint2 ? 0 : 1,
                pointerEvents: isEndpoint2 ? 'none' : 'auto',
              }}
              transition={innerFadeTransition}
              className="absolute inset-0 flex items-center p-1.5"
            >
              {/* 1. WHERE SEGMENT */}
              <div
                onMouseEnter={() => setHoveredSegment('where')}
                onMouseLeave={() => setHoveredSegment(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSegment('where');
                }}
                className="relative flex-1 h-full pl-5 pr-2 min-[1138px]:pl-8 min-[1138px]:pr-6 flex flex-col justify-center rounded-full cursor-pointer z-10"
              >
                {/* Sliding White Capsule Indicator */}
                {(activeSegment === 'where' || (hoveredSegment === 'where' && !activeSegment)) && (
                  <motion.div
                    layoutId="active-segment-highlight"
                    transition={easeTransition}
                    className={`absolute inset-0 rounded-full -z-10 ${
                      activeSegment === 'where'
                        ? 'bg-white shadow-[0_6px_20px_rgba(0,0,0,0.14)]'
                        : 'bg-slate-200/60'
                    }`}
                  />
                )}

                <div className="text-[12px] font-bold text-[#222222] leading-tight">Where</div>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Search destinations"
                  className="w-full bg-transparent text-[13px] min-[1138px]:text-[14px] text-slate-900 placeholder:text-slate-400 font-normal focus:outline-none truncate"
                />
              </div>

              {/* Divider 1 */}
              <div
                className={`h-8 w-px bg-slate-300/80 transition-opacity duration-150 flex-shrink-0 ${
                  hoveredSegment === 'where' ||
                  hoveredSegment === 'when' ||
                  activeSegment === 'where' ||
                  activeSegment === 'when'
                    ? 'opacity-0'
                    : 'opacity-100'
                }`}
              />

              {/* 2. WHEN SEGMENT */}
              <div
                onMouseEnter={() => setHoveredSegment('when')}
                onMouseLeave={() => setHoveredSegment(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSegment('when');
                }}
                className="relative flex-1 h-full px-3 min-[1138px]:px-6 flex flex-col justify-center rounded-full cursor-pointer z-10"
              >
                {(activeSegment === 'when' || (hoveredSegment === 'when' && !activeSegment)) && (
                  <motion.div
                    layoutId="active-segment-highlight"
                    transition={easeTransition}
                    className={`absolute inset-0 rounded-full -z-10 ${
                      activeSegment === 'when'
                        ? 'bg-white shadow-[0_6px_20px_rgba(0,0,0,0.14)]'
                        : 'bg-slate-200/60'
                    }`}
                  />
                )}

                <div className="text-[12px] font-bold text-[#222222] leading-tight">When</div>
                <div className="text-[13px] min-[1138px]:text-[14px] text-slate-500 font-normal truncate">
                  {datesText || 'Add dates'}
                </div>
              </div>

              {/* Divider 2 */}
              <div
                className={`h-8 w-px bg-slate-300/80 transition-opacity duration-150 flex-shrink-0 ${
                  hoveredSegment === 'when' ||
                  hoveredSegment === 'who' ||
                  activeSegment === 'when' ||
                  activeSegment === 'who'
                    ? 'opacity-0'
                    : 'opacity-100'
                }`}
              />

              {/* 3. WHO SEGMENT */}
              <div
                onMouseEnter={() => setHoveredSegment('who')}
                onMouseLeave={() => setHoveredSegment(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSegment('who');
                }}
                className="relative flex-1 h-full pl-3 pr-2 min-[1138px]:pl-6 flex items-center justify-between rounded-full cursor-pointer z-10"
              >
                {(activeSegment === 'who' || (hoveredSegment === 'who' && !activeSegment)) && (
                  <motion.div
                    layoutId="active-segment-highlight"
                    transition={easeTransition}
                    className={`absolute inset-0 rounded-full -z-10 ${
                      activeSegment === 'who'
                        ? 'bg-white shadow-[0_6px_20px_rgba(0,0,0,0.14)]'
                        : 'bg-slate-200/60'
                    }`}
                  />
                )}

                <div className="flex flex-col justify-center">
                  <div className="text-[12px] font-bold text-[#222222] leading-tight">Who</div>
                  <div className="text-[14px] text-slate-500 font-normal truncate">
                    {guestSummary}
                  </div>
                </div>
                {/* Spacer so text does not overlap with search button */}
                <div className="w-12 h-12 flex-shrink-0" />
              </div>
            </motion.div>

            {/* -------------------------------------------------------------------- */}
            {/* SEARCH BUTTON: LOCKED TO THE RIGHT EDGE AT ALL TIMES (NO HORIZONTAL DRIFT) */}
            {/* Scales between 48px/104px (Endpoint 1) and 32px (Endpoint 2) in place */}
            {/* -------------------------------------------------------------------- */}
            <motion.div
              initial={false}
              animate={{
                width: isEndpoint2 ? 32 : (activeSegment ? 108 : 48),
                height: isEndpoint2 ? 32 : 48,
              }}
              transition={activeTransition}
              onClick={(e) => {
                e.stopPropagation();
                if (isEndpoint2) {
                  setHasInteracted(true);
                  isExpandedRef.current = true;
                  setIsExpanded(true);
                  setActiveSegment(null);
                } else {
                  setActiveSegment(null);
                  if (isScrolled) {
                    isExpandedRef.current = false;
                    setIsExpanded(false);
                  }
                }
              }}
              className={`rounded-full bg-[#FF385C] hover:bg-[#E00B41] text-white flex items-center justify-center flex-shrink-0 ml-auto mr-2 z-20 cursor-pointer transition-colors shadow-md hover:scale-104 active:scale-96 ${
                !isEndpoint2 && activeSegment ? 'px-4.5 gap-2' : ''
              }`}
            >
              <Search className={isEndpoint2 ? 'w-3.5 h-3.5 stroke-[2.8]' : 'w-4 h-4 stroke-[2.8]'} />
              {!isEndpoint2 && activeSegment && (
                <span className="text-[14px] font-semibold text-white tracking-tight select-none pr-1">Search</span>
              )}
            </motion.div>

            {/* Popovers anchored under the searchbar in Endpoint 1 */}
            <AnimatePresence>
              {/* WHERE POPOVER (Matches Screenshot 1) */}
              {!isEndpoint2 && activeSegment === 'where' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 12 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-[76px] left-0 w-[490px] bg-white rounded-[32px] p-6 sm:p-7 shadow-[0_8px_28px_rgba(0,0,0,0.18)] border border-slate-100 z-50 text-left"
                >
                  <div className="text-[14px] font-semibold text-[#222222] mb-3 px-2">
                    Suggested destinations
                  </div>
                  <div className="max-h-[380px] overflow-y-auto custom-scrollbar pr-1 space-y-1">
                    {SUGGESTED_DESTINATIONS.map((dest, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          setDestination(dest.name);
                          setActiveSegment('when');
                        }}
                        className="flex items-center gap-4 p-2.5 rounded-2xl hover:bg-slate-100/80 cursor-pointer transition"
                      >
                        <div className={`w-12 h-12 rounded-2xl ${dest.bgColor} flex items-center justify-center flex-shrink-0`}>
                          {dest.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[15px] font-semibold text-[#222222] leading-snug truncate">
                            {dest.name}
                          </div>
                          <div className="text-[13px] text-[#717171] font-normal leading-snug truncate">
                            {dest.subtitle}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* WHEN POPOVER (Matches Screenshot 2) */}
              {!isEndpoint2 && activeSegment === 'when' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 12 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-[76px] left-1/2 -translate-x-1/2 w-[848px] bg-white rounded-[32px] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.18)] border border-slate-100 z-50 text-left"
                >
                  {/* Top Switcher: Dates / Flexible */}
                  <div className="bg-[#EBEBEB] p-1 rounded-full flex gap-1 w-fit mx-auto mb-8">
                    <button
                      onClick={() => setWhenTab('dates')}
                      className={`text-[14px] font-semibold py-2 px-6 rounded-full transition cursor-pointer ${
                        whenTab === 'dates'
                          ? 'bg-white text-[#222222] shadow-xs'
                          : 'text-[#222222] hover:bg-slate-200/50'
                      }`}
                    >
                      Dates
                    </button>
                    <button
                      onClick={() => setWhenTab('flexible')}
                      className={`text-[14px] font-semibold py-2 px-6 rounded-full transition cursor-pointer ${
                        whenTab === 'flexible'
                          ? 'bg-white text-[#222222] shadow-xs'
                          : 'text-[#222222] hover:bg-slate-200/50'
                      }`}
                    >
                      Flexible
                    </button>
                  </div>

                  {whenTab === 'dates' ? (
                    <div>
                      {/* Two Months Side-by-Side */}
                      <div className="grid grid-cols-2 gap-12">
                        {/* Month 1 */}
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <button
                              onClick={() => setCurrentCalendarMonth((prev) => Math.max(0, prev - 1))}
                              disabled={currentCalendarMonth === 0}
                              className="p-2 rounded-full hover:bg-slate-100 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed transition"
                              aria-label="Previous month"
                            >
                              <ChevronLeft className="w-4 h-4 text-[#222222]" />
                            </button>
                            <span className="text-[16px] font-semibold text-[#222222]">
                              {MONTH_NAMES[month1Data.month]} {month1Data.year}
                            </span>
                            <div className="w-8" />
                          </div>

                          <div className="grid grid-cols-7 text-center mb-2">
                            {WEEKDAYS.map((day, i) => (
                              <div key={i} className="text-[12px] font-semibold text-[#717171]">
                                {day}
                              </div>
                            ))}
                          </div>

                          <div className="grid grid-cols-7 gap-y-1">
                            {renderMonthGrid(month1Data)}
                          </div>
                        </div>

                        {/* Month 2 */}
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <div className="w-8" />
                            <span className="text-[16px] font-semibold text-[#222222]">
                              {MONTH_NAMES[month2Data.month]} {month2Data.year}
                            </span>
                            <button
                              onClick={() => setCurrentCalendarMonth((prev) => prev + 1)}
                              className="p-2 rounded-full hover:bg-slate-100 cursor-pointer transition"
                              aria-label="Next month"
                            >
                              <ChevronRight className="w-4 h-4 text-[#222222]" />
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
                            {renderMonthGrid(month2Data)}
                          </div>
                        </div>
                      </div>

                      {/* Bottom Check-in & Checkout boxes */}
                      <div className="grid grid-cols-2 gap-4 mt-8 pt-4 border-t border-slate-100">
                        <div className="border border-slate-300 rounded-2xl p-2.5 px-4 flex items-center justify-between cursor-pointer hover:border-slate-800 transition">
                          <div>
                            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                              Check-in
                            </div>
                            <div className="text-[14px] font-semibold text-[#222222]">
                              {formatBoxDate(checkInDate)}
                            </div>
                          </div>
                          <ChevronDown className="w-4 h-4 text-slate-700" />
                        </div>

                        <div className="border border-slate-300 rounded-2xl p-2.5 px-4 flex items-center justify-between cursor-pointer hover:border-slate-800 transition">
                          <div>
                            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                              Checkout
                            </div>
                            <div className="text-[14px] font-semibold text-[#222222]">
                              {formatBoxDate(checkOutDate)}
                            </div>
                          </div>
                          <ChevronDown className="w-4 h-4 text-slate-700" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Flexible tab */
                    <div className="py-6 text-center space-y-4">
                      <div className="text-[16px] font-semibold text-[#222222]">Stay for a week or weekend</div>
                      <div className="grid grid-cols-3 gap-3 text-xs max-w-lg mx-auto">
                        {[
                          { label: 'Weekend getaway', val: 'Oct 24 – Oct 26' },
                          { label: 'Next 5 days', val: 'Oct 20 – Oct 25' },
                          { label: 'Any week in Nov', val: 'Nov 10 – Nov 17' },
                        ].map((opt, i) => (
                          <div
                            key={i}
                            onClick={() => {
                              setDatesText(opt.val);
                              setActiveSegment('who');
                            }}
                            className="p-3.5 rounded-2xl border border-slate-200 hover:border-slate-800 hover:bg-slate-50 cursor-pointer transition font-medium text-left"
                          >
                            <div className="font-bold text-slate-900">{opt.label}</div>
                            <div className="text-[11px] text-slate-500 mt-1">{opt.val}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* WHO POPOVER (Matches Screenshot 3) */}
              {!isEndpoint2 && activeSegment === 'who' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 12 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-[76px] right-0 w-[400px] bg-white rounded-[32px] p-6 sm:p-7 shadow-[0_8px_32px_rgba(0,0,0,0.18)] border border-slate-100 z-50 divide-y divide-slate-100 text-left"
                >
                  {/* Adults */}
                  <div className="py-4 flex items-center justify-between first:pt-0">
                    <div>
                      <div className="text-[16px] font-semibold text-[#222222]">Adults</div>
                      <div className="text-[14px] text-[#717171] font-normal mt-0.5">Ages 13 or above</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateGuests('adults', -1)}
                        disabled={guests.adults <= 0}
                        className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 disabled:opacity-25 disabled:border-slate-200 hover:border-slate-800 cursor-pointer disabled:cursor-not-allowed transition"
                      >
                        <Minus className="w-3.5 h-3.5 stroke-[2.2]" />
                      </button>
                      <span className="w-6 text-center text-[16px] font-normal text-[#222222]">{guests.adults}</span>
                      <button
                        onClick={() => updateGuests('adults', 1)}
                        className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 hover:border-slate-800 cursor-pointer transition"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[2.2]" />
                      </button>
                    </div>
                  </div>

                  {/* Children */}
                  <div className="py-4 flex items-center justify-between">
                    <div>
                      <div className="text-[16px] font-semibold text-[#222222]">Children</div>
                      <div className="text-[14px] text-[#717171] font-normal mt-0.5">Ages 2–12</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateGuests('children', -1)}
                        disabled={guests.children <= 0}
                        className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 disabled:opacity-25 disabled:border-slate-200 hover:border-slate-800 cursor-pointer disabled:cursor-not-allowed transition"
                      >
                        <Minus className="w-3.5 h-3.5 stroke-[2.2]" />
                      </button>
                      <span className="w-6 text-center text-[16px] font-normal text-[#222222]">{guests.children}</span>
                      <button
                        onClick={() => updateGuests('children', 1)}
                        className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 hover:border-slate-800 cursor-pointer transition"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[2.2]" />
                      </button>
                    </div>
                  </div>

                  {/* Infants */}
                  <div className="py-4 flex items-center justify-between">
                    <div>
                      <div className="text-[16px] font-semibold text-[#222222]">Infants</div>
                      <div className="text-[14px] text-[#717171] font-normal mt-0.5">Under 2</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateGuests('infants', -1)}
                        disabled={guests.infants <= 0}
                        className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 disabled:opacity-25 disabled:border-slate-200 hover:border-slate-800 cursor-pointer disabled:cursor-not-allowed transition"
                      >
                        <Minus className="w-3.5 h-3.5 stroke-[2.2]" />
                      </button>
                      <span className="w-6 text-center text-[16px] font-normal text-[#222222]">{guests.infants}</span>
                      <button
                        onClick={() => updateGuests('infants', 1)}
                        className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 hover:border-slate-800 cursor-pointer transition"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[2.2]" />
                      </button>
                    </div>
                  </div>

                  {/* Pets */}
                  <div className="py-4 flex items-center justify-between last:pb-0">
                    <div>
                      <div className="text-[16px] font-semibold text-[#222222]">Pets</div>
                      <a
                        href="#service-animal"
                        onClick={(e) => e.preventDefault()}
                        className="text-[14px] text-[#717171] font-normal mt-0.5 underline cursor-pointer hover:text-slate-900 block"
                      >
                        Bringing a service animal?
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateGuests('pets', -1)}
                        disabled={guests.pets <= 0}
                        className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 disabled:opacity-25 disabled:border-slate-200 hover:border-slate-800 cursor-pointer disabled:cursor-not-allowed transition"
                      >
                        <Minus className="w-3.5 h-3.5 stroke-[2.2]" />
                      </button>
                      <span className="w-6 text-center text-[16px] font-normal text-[#222222]">{guests.pets}</span>
                      <button
                        onClick={() => updateGuests('pets', 1)}
                        className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 hover:border-slate-800 cursor-pointer transition"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[2.2]" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>

        </div>

        {/* ========================================================================= */}
        {/* 2. MOBILE HEADER (visible on mobile < 768px, hidden on desktop md+)       */}
        {/* ========================================================================= */}
        <div className="block md:hidden w-full px-3.5 pt-3 pb-1">
          {/* Floating Mobile Search Pill */}
          <div
            onClick={() => setIsMobileSearchOpen(true)}
            className="w-full bg-white rounded-full border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.08)] flex items-center justify-between p-2 pl-3.5 cursor-pointer active:scale-98 transition-transform"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <Search className="w-4.5 h-4.5 text-[#222222] stroke-[2.4] flex-shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-[13px] font-semibold text-[#222222] leading-tight truncate">
                  {destination || 'Where to?'}
                </span>
                <span className="text-[11px] text-[#717171] leading-tight truncate">
                  {datesText || 'Anywhere'} · {datesText ? 'Selected dates' : 'Any week'} · {guestSummary}
                </span>
              </div>
            </div>

            <div className="w-8.5 h-8.5 rounded-full border border-slate-200 flex items-center justify-center flex-shrink-0 text-[#222222] ml-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 stroke-[2.2]" />
            </div>
          </div>

          {/* Mobile Category Tabs */}
          {!isRoomsMode && (
            <div className="flex items-center justify-around px-1 pt-2 pb-0.5 mt-0.5 border-t border-slate-100/60">
              <button
                onClick={() => setActiveTab('all')}
                className={`flex flex-col items-center gap-1 py-1 px-2.5 relative cursor-pointer ${
                  activeTab === 'all' ? 'text-[#222222] font-semibold' : 'text-[#717171]'
                }`}
              >
                <img src="/icons/categories/all.png" alt="All" className="w-7 h-7 object-contain flex-shrink-0" />
                <span className="text-[11px] font-medium leading-tight tracking-tight">All</span>
                {activeTab === 'all' && (
                  <div className="absolute -bottom-1 left-1.5 right-1.5 h-[2px] bg-[#222222] rounded-full" />
                )}
              </button>

              <button
                onClick={() => setActiveTab('homes')}
                className={`flex flex-col items-center gap-1 py-1 px-2.5 relative cursor-pointer ${
                  activeTab === 'homes' ? 'text-[#222222] font-semibold' : 'text-[#717171]'
                }`}
              >
                <img src="/icons/categories/homes.png" alt="Homes" className="w-7 h-7 object-contain flex-shrink-0" />
                <span className="text-[11px] font-medium leading-tight tracking-tight">Homes</span>
                {activeTab === 'homes' && (
                  <div className="absolute -bottom-1 left-1.5 right-1.5 h-[2px] bg-[#222222] rounded-full" />
                )}
              </button>

              <button
                onClick={() => setActiveTab('experiences')}
                className={`flex flex-col items-center gap-1 py-1 px-2.5 relative cursor-pointer ${
                  activeTab === 'experiences' ? 'text-[#222222] font-semibold' : 'text-[#717171]'
                }`}
              >
                <img src="/icons/categories/experiences.png" alt="Experiences" className="w-7 h-7 object-contain flex-shrink-0" />
                <span className="text-[11px] font-medium leading-tight tracking-tight">Experiences</span>
                {activeTab === 'experiences' && (
                  <div className="absolute -bottom-1 left-1.5 right-1.5 h-[2px] bg-[#222222] rounded-full" />
                )}
              </button>

              <button
                onClick={() => setActiveTab('services')}
                className={`flex flex-col items-center gap-1 py-1 px-2.5 relative cursor-pointer ${
                  activeTab === 'services' ? 'text-[#222222] font-semibold' : 'text-[#717171]'
                }`}
              >
                <img src="/icons/categories/services.png" alt="Services" className="w-7 h-7 object-contain flex-shrink-0" />
                <span className="text-[11px] font-medium leading-tight tracking-tight">Services</span>
                {activeTab === 'services' && (
                  <div className="absolute -bottom-1 left-1.5 right-1.5 h-[2px] bg-[#222222] rounded-full" />
                )}
              </button>
            </div>
          )}
        </div>
      </motion.header>

      {/* Animated spacer in lockstep with header height so distance to page content remains identical before and after scrolling */}
      <motion.div
        initial={false}
        animate={{
          height: isRoomsMode ? 0 : (isMobile ? 126 : (isScrolled ? 80 : 180)),
        }}
        transition={activeTransition}
        className="w-full flex-shrink-0"
      />

      {/* ========================================================================= */}
      {/* 3. FULL-SCREEN MOBILE SEARCH DRAWER (Animated Sheet)                      */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isMobileSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 bg-[#F7F7F7] flex flex-col md:hidden overflow-y-auto"
          >
            {/* Top Bar with Close button */}
            <div className="flex items-center justify-between p-4 bg-white border-b border-slate-200">
              <button
                onClick={() => setIsMobileSearchOpen(false)}
                className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-700 active:scale-95 transition cursor-pointer"
                aria-label="Close search"
              >
                <X className="w-4 h-4" />
              </button>
              <span className="font-semibold text-[15px] text-[#222222]">Search</span>
              <div className="w-8" />
            </div>

            <div className="flex-1 p-4 space-y-4">
              {/* Where Card */}
              <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200">
                <div className="text-[17px] font-bold text-[#222222] mb-3">Where to?</div>
                <div className="flex items-center gap-3 p-3 bg-slate-100 rounded-xl">
                  <Search className="w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Search destinations"
                    className="w-full bg-transparent text-[14px] text-slate-900 placeholder:text-slate-500 focus:outline-none"
                  />
                </div>
                {/* Quick location chips */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {['South Goa', 'Noida', 'Pune', 'Candolim'].map((loc) => (
                    <button
                      key={loc}
                      onClick={() => setDestination(loc)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition cursor-pointer ${
                        destination === loc
                          ? 'border-[#222222] bg-[#222222] text-white font-medium'
                          : 'border-slate-200 text-slate-700 hover:border-slate-400 bg-white'
                      }`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>

              {/* When Card */}
              <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200">
                <div className="text-[17px] font-bold text-[#222222] mb-3">When?</div>
                <div className="flex gap-2">
                  {['Any week', 'Next weekend', 'Next month'].map((dt) => (
                    <button
                      key={dt}
                      onClick={() => setDatesText(dt)}
                      className={`flex-1 text-xs py-2.5 rounded-xl border font-medium text-center transition cursor-pointer ${
                        datesText === dt
                          ? 'border-[#222222] bg-[#222222] text-white'
                          : 'border-slate-200 text-slate-700 hover:border-slate-400 bg-white'
                      }`}
                    >
                      {dt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Who Card */}
              <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200 space-y-4">
                <div className="text-[17px] font-bold text-[#222222]">Who&apos;s coming?</div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-[#222222]">Adults</div>
                    <div className="text-xs text-slate-500">Ages 13 or above</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateGuests('adults', -1)}
                      disabled={guests.adults === 0}
                      className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-700 disabled:opacity-30 cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-sm font-medium w-4 text-center">{guests.adults}</span>
                    <button
                      onClick={() => updateGuests('adults', 1)}
                      className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-700 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                  <div>
                    <div className="text-sm font-semibold text-[#222222]">Children</div>
                    <div className="text-xs text-slate-500">Ages 2–12</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateGuests('children', -1)}
                      disabled={guests.children === 0}
                      className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-700 disabled:opacity-30 cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-sm font-medium w-4 text-center">{guests.children}</span>
                    <button
                      onClick={() => updateGuests('children', 1)}
                      className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-700 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Action Footer */}
            <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => {
                  setDestination('');
                  setDatesText('');
                  setGuests({ adults: 0, children: 0, infants: 0, pets: 0 });
                }}
                className="text-sm font-semibold text-[#222222] underline cursor-pointer"
              >
                Clear all
              </button>
              <button
                onClick={() => setIsMobileSearchOpen(false)}
                className="bg-[#FF385C] hover:bg-[#E00B41] text-white font-semibold text-sm px-6 py-3 rounded-xl flex items-center gap-2 cursor-pointer shadow-md active:scale-96 transition"
              >
                <Search className="w-4 h-4 stroke-[2.5]" />
                <span>Search</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
