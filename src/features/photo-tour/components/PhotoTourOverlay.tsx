'use client';

import React, { useState } from 'react';
import { ArrowLeft, Share, Heart } from 'lucide-react';
import { ListingPhoto } from '@/types';
import { useScrollLock } from '@/hooks/useScrollLock';

interface PhotoTourOverlayProps {
  isOpen: boolean;
  photos: ListingPhoto[];
  onClose: () => void;
  onSelectPhoto: (index: number) => void;
}

export function PhotoTourOverlay({
  isOpen,
  photos,
  onClose,
  onSelectPhoto,
}: PhotoTourOverlayProps) {
  useScrollLock(isOpen);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'All photos' },
    { id: 'living', label: 'Living room' },
    { id: 'bedroom', label: 'Bedroom' },
    { id: 'bathroom', label: 'Bathroom' },
    { id: 'kitchen', label: 'Kitchen' },
    { id: 'amenities', label: 'Whirlpool & Amenities' },
    { id: 'exterior', label: 'Exterior' },
  ];

  const filteredPhotos =
    selectedCategory === 'all'
      ? photos
      : photos.filter((p) => p.category === selectedCategory);

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
      
      {/* Top Fixed Header */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-slate-100 transition flex items-center gap-2 text-xs font-semibold text-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <h3 className="font-bold text-sm text-slate-900">Photo tour</h3>

        <div className="flex items-center gap-3">
          <button className="p-2 rounded-full hover:bg-slate-100 transition" aria-label="Share">
            <Share className="w-4 h-4 text-slate-700" />
          </button>
          <button className="p-2 rounded-full hover:bg-slate-100 transition" aria-label="Save">
            <Heart className="w-4 h-4 text-slate-700" />
          </button>
        </div>
      </div>

      {/* Category Filter Carousel / Tabs */}
      <div className="max-w-5xl mx-auto px-6 py-4 flex gap-2 overflow-x-auto border-b border-slate-100">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Categorized Photos Grid */}
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-12">
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-4 capitalize">
            {selectedCategory === 'all' ? 'All Listing Photos' : selectedCategory}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPhotos.map((photo, idx) => (
              <div
                key={photo.id}
                onClick={() => onSelectPhoto(idx)}
                className="group relative cursor-pointer overflow-hidden rounded-xl bg-slate-100 aspect-4/3"
              >
                <img
                  src={photo.url}
                  alt={photo.alt}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-end p-4">
                  <span className="text-xs text-white font-medium drop-shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                    {photo.roomLabel}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
