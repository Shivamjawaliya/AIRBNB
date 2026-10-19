'use client';

import React from 'react';
import { LayoutGrid } from 'lucide-react';
import { ListingPhoto } from '@/types';

interface PhotoBentoGridProps {
  photos: ListingPhoto[];
  onOpenPhotoTour: (category?: string) => void;
  onOpenLightbox: (index: number) => void;
}

export function PhotoBentoGrid({
  photos,
  onOpenPhotoTour,
  onOpenLightbox,
}: PhotoBentoGridProps) {
  const heroPhotos = photos.slice(0, 5);

  return (
    <div className="relative rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-4 gap-2 h-[340px] sm:h-[420px] md:h-[460px] bg-slate-100">
      
      {/* 1. Large Hero Photo (Left 2 columns, full height) */}
      {heroPhotos[0] && (
        <div
          onClick={() => onOpenLightbox(0)}
          className="md:col-span-2 h-full relative cursor-pointer group overflow-hidden"
        >
          <img
            src={heroPhotos[0].url}
            alt={heroPhotos[0].alt}
            className="w-full h-full object-cover group-hover:brightness-95 transition-all duration-300"
          />
        </div>
      )}

      {/* 2x2 Grid of 4 Photos (Right 2 columns) */}
      <div className="hidden md:grid col-span-2 grid-cols-2 grid-rows-2 gap-2 h-full">
        {heroPhotos.slice(1, 5).map((photo, idx) => {
          const photoIndex = idx + 1;
          const isLast = photoIndex === 4;

          return (
            <div
              key={photo.id}
              onClick={() => onOpenLightbox(photoIndex)}
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
                    onOpenPhotoTour();
                  }}
                  className="absolute bottom-4 right-4 bg-white/95 hover:bg-white text-slate-900 border border-slate-900 px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-md flex items-center gap-2 transition hover:scale-102"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
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
