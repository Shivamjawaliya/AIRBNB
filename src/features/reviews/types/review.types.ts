/**
 * Review Domain Interfaces
 */

export interface ReviewItem {
  id: string;
  authorName: string;
  authorAvatar: string;
  rating: number;
  date: string;
  timeAgo: string;
  comment: string;
  stayDuration?: string;
}

export interface ReviewSummary {
  overallRating: number;
  totalReviews: number;
  cleanliness: number;
  accuracy: number;
  communication: number;
  location: number;
  checkIn: number;
  value: number;
}
