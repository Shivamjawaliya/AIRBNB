'use client';

import React from 'react';
import { X, ChevronLeft, ChevronRight, Share, Heart } from 'lucide-react';
import { ListingPhoto } from '@/types';
import { useScrollLock } from '@/hooks/useScrollLock';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';

interface LightboxModalProps {
  isOpen: boolean;
  photos: ListingPhoto[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function LightboxModal({
  isOpen,
  photos,
  currentIndex,
  onClose,
  onNavigate,
}: LightboxModalProps) {
  useScrollLock(isOpen);

  const totalPhotos = photos.length;
  const currentPhoto = photos[currentIndex] || photos[0];

  const handlePrev = () => {
    onNavigate((currentIndex - 1 + totalPhotos) % totalPhotos);
  };

  const handleNext = () => {
    onNavigate((currentIndex + 1) % totalPhotos);
  };

  useKeyboardNavigation({
    isOpen,
    onPrev: handlePrev,
    onNext: handleNext,
    onClose,
  });

  if (!isOpen || !currentPhoto) return null;

  return (
    <div className="fixed inset-0 z-60 bg-black/95 text-white flex flex-col justify-between select-none">
      
      {/* Top Header Controls */}
      <div className="p-6 flex items-center justify-between z-20">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-white/10 transition text-white/80 hover:text-white"
          aria-label="Close Lightbox"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Photo Counter & Room Name */}
        <div className="text-xs font-semibold text-white/90">
          <span>{currentIndex + 1} / {totalPhotos}</span>
          <span className="mx-2 text-white/40">·</span>
          <span className="text-white/70">{currentPhoto.roomLabel}</span>
        </div>

        {/* Share & Save */}
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-full hover:bg-white/10 transition text-white/80 hover:text-white" aria-label="Share">
            <Share className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-full hover:bg-white/10 transition text-white/80 hover:text-white" aria-label="Save">
            <Heart className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Focused Photo Carousel Area */}
      <div className="relative flex-1 flex items-center justify-center px-4 sm:px-16 overflow-hidden">
        
        {/* Left Arrow Button */}
        <button
          onClick={handlePrev}
          className="absolute left-4 sm:left-8 z-20 p-3 rounded-full bg-black/40 hover:bg-black/80 border border-white/20 text-white transition hover:scale-110"
          aria-label="Previous photo"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Focused Image */}
        <div className="relative max-w-5xl max-h-[75vh] w-full h-full flex items-center justify-center p-2">
          <img
            src={currentPhoto.url}
            alt={currentPhoto.alt}
            className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl transition-all duration-200"
          />
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={handleNext}
          className="absolute right-4 sm:right-8 z-20 p-3 rounded-full bg-black/40 hover:bg-black/80 border border-white/20 text-white transition hover:scale-110"
          aria-label="Next photo"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Bottom Caption Bar */}
      <div className="p-6 text-center text-xs text-white/60">
        {currentPhoto.caption && <p>{currentPhoto.caption}</p>}
        <p className="text-[10px] text-white/40 mt-1">
          Use ← and → arrow keys to navigate · Press Esc to close
        </p>
      </div>

    </div>
  );
}
