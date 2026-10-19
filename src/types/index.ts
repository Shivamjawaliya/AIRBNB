/**
 * Central Type Definitions Barrel
 */

export * from '@/features/listing/types/listing.types';
export * from '@/features/booking/types/booking.types';
export * from '@/features/reviews/types/review.types';

export type ActiveView = 'listing' | 'photo-tour' | 'lightbox';

export interface ViewState {
  activeView: ActiveView;
  activePhotoIndex: number;
  activeRoomCategory: string;
}
