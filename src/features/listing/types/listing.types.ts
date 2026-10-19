/**
 * Listing Domain Interfaces
 */

export interface ListingPhoto {
  id: string;
  url: string;
  alt: string;
  category: 'hero' | 'living' | 'bedroom' | 'bathroom' | 'kitchen' | 'amenities' | 'exterior';
  roomLabel: string;
  caption?: string;
}

export interface AmenityItem {
  id: string;
  title: string;
  category: 'Popular' | 'Bathroom' | 'Bedroom & laundry' | 'Entertainment' | 'Heating & cooling' | 'Home safety' | 'Internet & office' | 'Kitchen & dining' | 'Outdoor' | 'Services';
  available: boolean;
  iconName: string;
  description?: string;
}

export interface HostInfo {
  id: string;
  name: string;
  avatarUrl: string;
  isSuperhost: boolean;
  yearsHosting: number;
  rating: number;
  reviewCount: number;
  responseRate: string;
  responseTime: string;
  bio: string;
  work?: string;
}

export interface BedroomInfo {
  id: string;
  roomName: string;
  bedType: string;
  icon: string;
}

export interface PropertyHighlight {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface ListingDetail {
  id: string;
  title: string;
  propertyType: string;
  location: {
    city: string;
    state: string;
    country: string;
    neighborhood: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  capacity: {
    guests: number;
    bedrooms: number;
    beds: number;
    bathrooms: number;
  };
  guestFavorite: boolean;
  ratings: {
    overall: number;
    reviewCount: number;
    categories: {
      cleanliness: number;
      accuracy: number;
      communication: number;
      location: number;
      checkIn: number;
      value: number;
    };
  };
  pricing: {
    basePricePerNight: number;
    currency: string;
    cleaningFee: number;
    serviceFeeRate: number;
  };
  highlights: PropertyHighlight[];
  description: string;
  sleepingArrangements: BedroomInfo[];
  amenities: AmenityItem[];
  photos: ListingPhoto[];
  host: HostInfo;
  policies: {
    checkInTime: string;
    checkoutTime: string;
    selfCheckIn: boolean;
    cancellation: string;
    houseRules: string[];
    safetyRules: string[];
  };
}
