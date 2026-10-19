'use client';

import { useState, useCallback, useEffect } from 'react';
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

  // Automatically open photo tour if ?modal=PHOTO_TOUR_SCROLLABLE is present in URL
  useEffect(() => {
    const checkUrlModal = () => {
      if (typeof window === 'undefined') return;
      const params = new URLSearchParams(window.location.search);
      if (params.get('modal') === 'PHOTO_TOUR_SCROLLABLE') {
        setState((prev) => (prev.activeView === 'photo-tour' ? prev : { ...prev, activeView: 'photo-tour' }));
      }
    };

    checkUrlModal();
    window.addEventListener('popstate', checkUrlModal);
    return () => window.removeEventListener('popstate', checkUrlModal);
  }, []);

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
