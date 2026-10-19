/**
 * Application Constants
 * Design tokens, pricing rates, and Airbnb brand specifications.
 */

export const AIRBNB_BRAND = {
  primary: '#FF385C',
  primaryHover: '#E00B41',
  dark: '#222222',
  muted: '#717171',
  border: '#DDDDDD',
  borderLight: '#EBEBEB',
  surfaceLight: '#F7F7F7',
} as const;

export const DEFAULT_FEES = {
  cleaningFee: 1200, // INR
  serviceFeeRate: 0.14, // 14% platform service fee
  taxRate: 0.18, // 18% GST / occupancy tax
} as const;

export const GUEST_LIMITS = {
  maxGuests: 4,
  maxAdults: 4,
  maxChildren: 3,
  maxInfants: 2,
  maxPets: 1,
} as const;
