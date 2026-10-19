'use client';

import React from 'react';
import { ListingPhoto } from '@/types';

interface PhotoBentoGridProps {
  photos: ListingPhoto[];
  onOpenPhotoTour: (category?: string) => void;
  onOpenLightbox?: (index: number) => void;
}

function getSectionForPhoto(photo: ListingPhoto): string {
  if (photo.roomLabel) {
    const label = photo.roomLabel.toLowerCase();
    if (label.includes('living room 1')) return 'living-room-1';
    if (label.includes('living room 2')) return 'living-room-2';
    if (label.includes('kitchen')) return 'full-kitchen';
    if (label.includes('bedroom')) return 'bedroom';
    if (label.includes('bathroom')) return 'full-bathroom';
    if (label.includes('gym')) return 'gym';
    if (label.includes('pool')) return 'pool';
    if (label.includes('exterior')) return 'exterior';
  }
  if (photo.category === 'bedroom') return 'bedroom';
  if (photo.category === 'bathroom') return 'full-bathroom';
  if (photo.category === 'kitchen') return 'full-kitchen';
  if (photo.category === 'exterior') return 'exterior';
  return 'living-room-1';
}

export function PhotoBentoGrid({
  photos,
  onOpenPhotoTour,
  onOpenLightbox,
}: PhotoBentoGridProps) {
  const heroPhotos = photos.slice(0, 5);

  return (
    <div className="relative rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-4 gap-2 h-[340px] sm:h-[420px] md:h-[460px] lg:h-[480px] bg-slate-100">
      
      {/* 1. Large Hero Photo (Left 2 columns, full height) */}
      {heroPhotos[0] && (
        <div
          onClick={() => {
            onOpenPhotoTour(getSectionForPhoto(heroPhotos[0]));
          }}
          className="md:col-span-2 h-full relative cursor-pointer group overflow-hidden"
        >
          <img
            src={heroPhotos[0].url}
            alt={heroPhotos[0].alt}
            className="w-full h-full object-cover group-hover:brightness-95 transition-all duration-300"
          />

          {/* Mobile "Show all photos" button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenPhotoTour('all');
            }}
            className="md:hidden absolute bottom-3 right-3 bg-white hover:bg-[#F7F7F7] active:scale-[0.98] text-[#222222] border border-[#222222] px-2.5 py-1 rounded-lg text-[12px] font-medium shadow-xs flex items-center gap-1.5 transition cursor-pointer select-none"
          >
            <svg
              viewBox="0 0 16 16"
              className="w-3.5 h-3.5 fill-current flex-shrink-0"
              aria-hidden="true"
            >
              <path d="m3 1.5a1.5 1.5 0 1 1 -3 0 1.5 1.5 0 0 1 3 0zm6.5 0a1.5 1.5 0 1 1 -3 0 1.5 1.5 0 0 1 3 0zm6.5 0a1.5 1.5 0 1 1 -3 0 1.5 1.5 0 0 1 3 0zm-13 6.5a1.5 1.5 0 1 1 -3 0 1.5 1.5 0 0 1 3 0zm6.5 0a1.5 1.5 0 1 1 -3 0 1.5 1.5 0 0 1 3 0zm6.5 0a1.5 1.5 0 1 1 -3 0 1.5 1.5 0 0 1 3 0zm-13 6.5a1.5 1.5 0 1 1 -3 0 1.5 1.5 0 0 1 3 0zm6.5 0a1.5 1.5 0 1 1 -3 0 1.5 1.5 0 0 1 3 0zm6.5 0a1.5 1.5 0 1 1 -3 0 1.5 1.5 0 0 1 3 0z" />
            </svg>
            <span>Show all photos</span>
          </button>
        </div>
      )}

      {/* 2x2 Grid of 4 Photos (Right 2 columns) */}
      <div className="hidden md:grid col-span-2 grid-cols-2 grid-rows-2 gap-2 h-full">
        {heroPhotos.slice(1, 5).map((photo, idx) => {
          const isLast = idx === 3;

          return (
            <div
              key={photo.id}
              onClick={() => {
                onOpenPhotoTour(getSectionForPhoto(photo));
              }}
              className="relative cursor-pointer group overflow-hidden h-full"
            >
              <img
                src={photo.url}
                alt={photo.alt}
                className="w-full h-full object-cover group-hover:brightness-95 transition-all duration-300"
              />

              {/* "Show all photos" Button pinned on 5th photo */}
              {isLast && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenPhotoTour('all');
                  }}
                  className="absolute bottom-3 right-3 sm:bottom-3.5 sm:right-3.5 bg-white hover:bg-[#F7F7F7] active:scale-[0.98] text-[#222222] border border-[#222222] px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-[12px] sm:text-[13px] font-medium shadow-xs flex items-center gap-1.5 transition cursor-pointer select-none"
                >
                  <svg
                    viewBox="0 0 16 16"
                    className="w-3.5 h-3.5 fill-current flex-shrink-0"
                    aria-hidden="true"
                  >
                    <path d="m3 1.5a1.5 1.5 0 1 1 -3 0 1.5 1.5 0 0 1 3 0zm6.5 0a1.5 1.5 0 1 1 -3 0 1.5 1.5 0 0 1 3 0zm6.5 0a1.5 1.5 0 1 1 -3 0 1.5 1.5 0 0 1 3 0zm-13 6.5a1.5 1.5 0 1 1 -3 0 1.5 1.5 0 0 1 3 0zm6.5 0a1.5 1.5 0 1 1 -3 0 1.5 1.5 0 0 1 3 0zm6.5 0a1.5 1.5 0 1 1 -3 0 1.5 1.5 0 0 1 3 0zm-13 6.5a1.5 1.5 0 1 1 -3 0 1.5 1.5 0 0 1 3 0zm6.5 0a1.5 1.5 0 1 1 -3 0 1.5 1.5 0 0 1 3 0zm6.5 0a1.5 1.5 0 1 1 -3 0 1.5 1.5 0 0 1 3 0z" />
                  </svg>
                  <span>Show all photos</span>
                </button>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
