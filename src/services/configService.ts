import { ListingConfigResponse } from '@/features/booking/types/booking.types';

export const CONFIG_API_URL =
  'https://candidate-disabled-dates.suketuppl.chatgpt.site/api/playpower/airbnb-clone/config';

export const DEFAULT_LISTING_CONFIG: ListingConfigResponse = {
  disabledDates: [
    '2026-10-08',
    '2026-10-12',
    '2026-10-19',
    '2026-10-20',
    '2026-10-27',
    '2026-11-03',
    '2026-11-07',
    '2026-11-15',
    '2026-11-21',
    '2026-11-26',
  ],
  guestConstraints: {
    min: 1,
    max: 6,
  },
  stayConstraints: {
    minNights: 2,
    maxNights: 14,
  },
  pricing: {
    currency: 'INR',
    nightlyRate: 4500,
    cleaningFee: 750,
  },
  houseRules: {
    petsAllowed: false,
    smokingAllowed: false,
    partiesAllowed: false,
  },
};

/**
 * Fetches dynamic listing configuration including pricing, disabled dates,
 * and stay constraints from the API endpoint.
 * Gracefully falls back to default configuration if network fails.
 */
export async function fetchListingConfig(): Promise<ListingConfigResponse> {
  try {
    const res = await fetch(CONFIG_API_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      // Revalidate or fetch fresh
      cache: 'no-store',
    });

    if (!res.ok) {
      console.warn(`[configService] API responded with status ${res.status}. Using default config.`);
      return DEFAULT_LISTING_CONFIG;
    }

    const data: ListingConfigResponse = await res.json();
    return data;
  } catch (error) {
    console.error('[configService] Failed to fetch listing configuration from API:', error);
    return DEFAULT_LISTING_CONFIG;
  }
}

