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

  // Listen to browser popstate (back / forward buttons) and initial URL on mount
  useEffect(() => {
    const handlePopState = () => {
      if (typeof window === 'undefined') return;
      const params = new URLSearchParams(window.location.search);
      if (params.get('modal') === 'PHOTO_TOUR_SCROLLABLE') {
        setState((prev) => (prev.activeView === 'photo-tour' ? prev : { ...prev, activeView: 'photo-tour' }));
      } else {
        // When modal param is absent, return cleanly to listing view
        setState((prev) => (prev.activeView === 'listing' ? prev : { ...prev, activeView: 'listing' }));
      }
    };

    handlePopState();
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const openPhotoTour = useCallback((category: string = 'all') => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (url.searchParams.get('modal') !== 'PHOTO_TOUR_SCROLLABLE') {
        url.searchParams.set('modal', 'PHOTO_TOUR_SCROLLABLE');
        window.history.pushState({ modal: 'PHOTO_TOUR_SCROLLABLE' }, '', url.toString());
      }
    }
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
    if (typeof window !== 'undefined') {
      // If modal was opened via history.pushState, navigate back so the modal history entry is cleanly popped
      if (window.history.state?.modal === 'PHOTO_TOUR_SCROLLABLE') {
        window.history.back();
        return; // handlePopState will set activeView to 'listing' when popstate fires
      }
      // If opened directly without history entry, replace URL without pushing a duplicate entry
      const url = new URL(window.location.href);
      if (url.searchParams.has('modal')) {
        url.searchParams.delete('modal');
        const nextUrl = url.pathname + (url.search ? url.search : '');
        window.history.replaceState({}, '', nextUrl);
      }
    }
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
