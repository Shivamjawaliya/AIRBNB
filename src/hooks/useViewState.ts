'use client';

import { useState, useCallback } from 'react';
import { ViewState } from '@/types';

/**
 * Global Hook to manage view transitions:
 * - 'listing' (Base view)
 * - 'photo-tour' (Fullscreen categorized gallery)
 * - 'lightbox' (Single-photo carousel modal)
 */
export function useViewState(initialPhotoIndex: number = 0) {
  const [state, setState] = useState<ViewState>({
    activeView: 'listing',
    activePhotoIndex: initialPhotoIndex,
    activeRoomCategory: 'all',
  });

  const openPhotoTour = useCallback((category: string = 'all') => {
    setState((prev) => ({
      ...prev,
      activeView: 'photo-tour',
      activeRoomCategory: category,
    }));
  }, []);

  const openLightbox = useCallback((photoIndex: number) => {
    setState((prev) => ({
      ...prev,
      activeView: 'lightbox',
      activePhotoIndex: photoIndex,
    }));
  }, []);

  const closeToPhotoTour = useCallback(() => {
    setState((prev) => ({
      ...prev,
      activeView: 'photo-tour',
    }));
  }, []);

  const closeToListing = useCallback(() => {
    setState((prev) => ({
      ...prev,
      activeView: 'listing',
    }));
  }, []);

  const setActivePhotoIndex = useCallback((index: number) => {
    setState((prev) => ({
      ...prev,
      activePhotoIndex: index,
    }));
  }, []);

  return {
    ...state,
    openPhotoTour,
    openLightbox,
    closeToPhotoTour,
    closeToListing,
    setActivePhotoIndex,
  };
}
