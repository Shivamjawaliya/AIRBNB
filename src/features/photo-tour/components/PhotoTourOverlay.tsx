'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, Share, Heart } from 'lucide-react';
import { ListingPhoto } from '@/types';
import { useScrollLock } from '@/hooks/useScrollLock';
import {
  PHOTO_TOUR_SECTIONS,
  PhotoTourSectionData,
  PhotoTourPhoto,
} from '../data/photoTourData';

interface PhotoTourOverlayProps {
  isOpen: boolean;
  photos?: ListingPhoto[];
  initialSection?: string;
  onClose: () => void;
  onSelectPhoto: (index: number) => void;
}

export function PhotoTourOverlay({
  isOpen,
  photos,
  initialSection,
  onClose,
  onSelectPhoto,
}: PhotoTourOverlayProps) {
  useScrollLock(isOpen);
  const [isSaved, setIsSaved] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Auto-scroll to requested section on open if specified and not 'all'
  useEffect(() => {
    if (isOpen && initialSection && initialSection !== 'all') {
      const timer = setTimeout(() => {
        const el = document.getElementById(`section-${initialSection}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, initialSection]);

  // Handle Escape key listener
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleShare = useCallback(() => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  }, []);

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(`section-${sectionId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
      {/* 1. Top Fixed/Sticky Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-[#EBEBEB] px-4 sm:px-8 lg:px-12 h-16 flex items-center justify-between select-none">
        {/* Back Button */}
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-neutral-100 transition text-[#222222] cursor-pointer"
          aria-label="Back to listing"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
        </button>

        {/* Center Title */}
        <h1 className="font-semibold text-[14px] text-[#222222]">
          Photo tour
        </h1>

        {/* Action Buttons: Share & Save */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={handleShare}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-neutral-100 transition text-[#222222] cursor-pointer"
            aria-label="Share photo tour"
          >
            <Share className="w-4 h-4 stroke-[2]" />
          </button>
          <button
            onClick={() => setIsSaved(!isSaved)}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-neutral-100 transition text-[#222222] cursor-pointer"
            aria-label="Save listing"
          >
            <Heart
              className={`w-4 h-4 stroke-[2] transition-colors ${
                isSaved ? 'fill-[#FF385C] stroke-[#FF385C]' : 'stroke-[#222222]'
              }`}
            />
          </button>
        </div>
      </header>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#222222] text-white px-4 py-2 rounded-full text-xs font-medium shadow-lg animate-fade-in">
          Link copied to clipboard
        </div>
      )}

      {/* 2. Top Overview Thumbnail Navigation Grid (Matches Screenshot 1) */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-8 lg:px-12 pt-8 pb-10 border-b border-[#EBEBEB]">
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 sm:gap-4">
          {PHOTO_TOUR_SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className="group flex flex-col text-left cursor-pointer focus:outline-none"
            >
              <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-neutral-100 mb-2 border border-black/5 shadow-xs">
                <img
                  src={section.thumbnailUrl}
                  alt={section.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <span className="text-[12px] sm:text-[13px] font-medium text-[#222222] leading-tight group-hover:underline line-clamp-2">
                {section.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Main Photo Tour Feed with Floating / Sticky Headings */}
      <main className="max-w-[1240px] mx-auto px-4 sm:px-8 lg:px-12 py-6">
        {PHOTO_TOUR_SECTIONS.map((section) => (
          <section
            key={section.id}
            id={`section-${section.id}`}
            className="pt-10 pb-12 border-b border-[#EBEBEB] last:border-b-0 scroll-mt-20"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start relative">
              {/* Left Column: Floating Sticky Heading & Amenities List */}
              <div className="md:col-span-4 lg:col-span-4 self-start md:sticky md:top-24 z-10">
                <h2 className="text-2xl sm:text-[26px] font-semibold text-[#222222] tracking-tight mb-2">
                  {section.title}
                </h2>
                {section.amenities && section.amenities.length > 0 && (
                  <p className="text-[14px] leading-relaxed text-[#717171]">
                    {section.amenities.join(' · ')}
                  </p>
                )}
              </div>

              {/* Right Column: Photos Grid */}
              <div className="md:col-span-8 lg:col-span-8">
                {renderSectionPhotos(section, onSelectPhoto)}
              </div>
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}

/**
 * Renders photos for a specific section following Airbnb's layout patterns
 */
function renderSectionPhotos(
  section: PhotoTourSectionData,
  onSelectPhoto: (globalIndex: number) => void
) {
  const photos = section.photos;

  if (photos.length === 1) {
    return (
      <PhotoCard
        photo={photos[0]}
        onClick={() => onSelectPhoto(photos[0].globalIndex)}
        aspect="wide"
      />
    );
  }

  // Full kitchen starts with 2 side-by-side photos as in screenshot 3
  if (section.id === 'full-kitchen') {
    return (
      <div className="space-y-3 sm:space-y-4">
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <PhotoCard
            photo={photos[0]}
            onClick={() => onSelectPhoto(photos[0].globalIndex)}
            aspect="square"
          />
          <PhotoCard
            photo={photos[1]}
            onClick={() => onSelectPhoto(photos[1].globalIndex)}
            aspect="square"
          />
        </div>
        {photos[2] && (
          <PhotoCard
            photo={photos[2]}
            onClick={() => onSelectPhoto(photos[2].globalIndex)}
            aspect="wide"
          />
        )}
        {photos.length > 3 && (
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {photos.slice(3, 5).map((p) => (
              <PhotoCard
                key={p.id}
                photo={p}
                onClick={() => onSelectPhoto(p.globalIndex)}
                aspect="square"
              />
            ))}
          </div>
        )}
        {photos[5] && (
          <PhotoCard
            photo={photos[5]}
            onClick={() => onSelectPhoto(photos[5].globalIndex)}
            aspect="wide"
          />
        )}
      </div>
    );
  }

  // Living room 2 starts with wide jacuzzi lounge photo and wide dining photo
  if (section.id === 'living-room-2') {
    return (
      <div className="space-y-3 sm:space-y-4">
        <PhotoCard
          photo={photos[0]}
          onClick={() => onSelectPhoto(photos[0].globalIndex)}
          aspect="wide"
        />
        {photos[1] && (
          <PhotoCard
            photo={photos[1]}
            onClick={() => onSelectPhoto(photos[1].globalIndex)}
            aspect="wide"
          />
        )}
        {photos.length > 2 && (
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {photos.slice(2, 4).map((p) => (
              <PhotoCard
                key={p.id}
                photo={p}
                onClick={() => onSelectPhoto(p.globalIndex)}
                aspect="square"
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Standard room layout (Living room 1, Bedroom, Bathroom, Gym, Exterior, Pool)
  return (
    <div className="space-y-3 sm:space-y-4">
      {/* 1. Large Hero Photo in section */}
      <PhotoCard
        photo={photos[0]}
        onClick={() => onSelectPhoto(photos[0].globalIndex)}
        aspect="wide"
      />

      {/* 2. Side-by-side photos */}
      {photos.length > 1 && (
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {photos.slice(1, 3).map((p) => (
            <PhotoCard
              key={p.id}
              photo={p}
              onClick={() => onSelectPhoto(p.globalIndex)}
              aspect="square"
            />
          ))}
        </div>
      )}

      {/* 3. 4th photo if 4 photos total */}
      {photos[3] && photos.length === 4 && (
        <PhotoCard
          photo={photos[3]}
          onClick={() => onSelectPhoto(photos[3].globalIndex)}
          aspect="wide"
        />
      )}

      {/* 4. Additional side-by-side pair if 5 or 6 photos */}
      {photos.length > 4 && (
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {photos.slice(3, 5).map((p) => (
            <PhotoCard
              key={p.id}
              photo={p}
              onClick={() => onSelectPhoto(p.globalIndex)}
              aspect="square"
            />
          ))}
        </div>
      )}

      {/* 5. 6th photo wide */}
      {photos[5] && (
        <PhotoCard
          photo={photos[5]}
          onClick={() => onSelectPhoto(photos[5].globalIndex)}
          aspect="wide"
        />
      )}
    </div>
  );
}

/**
 * Individual clickable photo card with zoom effect on hover
 */
function PhotoCard({
  photo,
  onClick,
  aspect = 'wide',
}: {
  photo: PhotoTourPhoto;
  onClick: () => void;
  aspect?: 'wide' | 'square';
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative group cursor-pointer overflow-hidden rounded-2xl bg-neutral-100 border border-black/5 block text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#222222] ${
        aspect === 'wide'
          ? 'w-full aspect-[16/10] sm:aspect-[16/10]'
          : 'w-full aspect-[4/3]'
      }`}
      aria-label={`View photo ${photo.globalIndex + 1} in Lightbox: ${photo.alt}`}
    >
      <img
        src={photo.url}
        alt={photo.alt}
        className="w-full h-full object-cover group-hover:scale-[1.015] transition-transform duration-300"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-200" />
    </button>
  );
}
