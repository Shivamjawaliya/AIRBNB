'use client';

import { useEffect } from 'react';

interface UseKeyboardNavigationProps {
  isOpen: boolean;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
}

/**
 * Hook to manage arrow keys and Escape key navigation in the Lightbox viewer.
 */
export function useKeyboardNavigation({
  isOpen,
  onPrev,
  onNext,
  onClose,
}: UseKeyboardNavigationProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          onPrev();
          break;
        case 'ArrowRight':
          e.preventDefault();
          onNext();
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onPrev, onNext, onClose]);
}
