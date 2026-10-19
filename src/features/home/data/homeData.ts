export interface HomeListingItem {
  id: string;
  title: string;
  location: string;
  priceText: string;
  rating: number;
  isGuestFavorite: boolean;
  images: string[];
}

export interface DestinationItem {
  id: string;
  city: string;
  tagline: string;
  imageUrl: string;
}

export interface InspirationItem {
  city: string;
  type: string;
}

export const SOUTH_GOA_LISTINGS: HomeListingItem[] = [
  {
    id: 'benaulim-1',
    title: 'Home in Benaulim',
    location: 'Benaulim, South Goa',
    priceText: '₹24,383 for 2 nights',
    rating: 4.94,
    isGuestFavorite: true,
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 'colva-1',
    title: 'Home in Colva',
    location: 'Colva, South Goa',
    priceText: '₹32,000 for 2 nights',
    rating: 4.92,
    isGuestFavorite: true,
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 'benaulim-2',
    title: 'Home in Benaulim',
    location: 'Benaulim, South Goa',
    priceText: '₹18,998 for 2 nights',
    rating: 5.0,
    isGuestFavorite: true,
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 'dabolim-1',
    title: 'Flat in Dabolim',
    location: 'Dabolim, South Goa',
    priceText: '₹8,000 for 2 nights',
    rating: 4.9,
    isGuestFavorite: true,
    images: [
      'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 'ribandar-1',
    title: 'Home in Ribandar',
    location: 'Ribandar, Goa',
    priceText: '₹11,134 for 2 nights',
    rating: 4.96,
    isGuestFavorite: true,
    images: [
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 'benaulim-3',
    title: 'Villa in Benaulim',
    location: 'Benaulim, South Goa',
    priceText: '₹25,280 for 2 nights',
    rating: 4.94,
    isGuestFavorite: true,
    images: [
      'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 'varca-1',
    title: 'Villa in Varca',
    location: 'Varca, South Goa',
    priceText: '₹20,000 for 2 nights',
    rating: 5.0,
    isGuestFavorite: true,
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 'varca-2',
    title: 'Home in Varca',
    location: 'Varca, South Goa',
    priceText: '₹14,000 for 2 nights',
    rating: 5.0,
    isGuestFavorite: false,
    images: [
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    ],
  },
];

export const NOIDA_LISTINGS: HomeListingItem[] = [
  {
    id: 'noida-1',
    title: 'Room in Noida',
    location: 'Sector 50, Noida',
    priceText: '₹1,788 for 1 night',
    rating: 5.0,
    isGuestFavorite: true,
    images: [
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 'noida-2',
    title: 'Room in Noida',
    location: 'Sector 62, Noida',
    priceText: '₹1,375 for 1 night',
    rating: 4.89,
    isGuestFavorite: true,
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 'noida-3',
    title: 'Flat in Sector 75',
    location: 'Sector 75, Noida',
    priceText: '₹1,681 for 1 night',
    rating: 4.79,
    isGuestFavorite: true,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 'noida-4',
    title: 'Room in Sector 75',
    location: 'Sector 75, Noida',
    priceText: '₹1,809 for 1 night',
    rating: 4.93,
    isGuestFavorite: true,
    images: [
      'https://images.unsplash.com/photo-1540518614846-7ede433c4ef3?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 'noida-5',
    title: 'Flat in Sector 75',
    location: 'Sector 75, Noida',
    priceText: '₹1,450 for 1 night',
    rating: 4.99,
    isGuestFavorite: true,
    images: [
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 'noida-6',
    title: 'Flat in Sector 75',
    location: 'Sector 75, Noida',
    priceText: '₹1,816 for 1 night',
    rating: 4.94,
    isGuestFavorite: true,
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 'noida-7',
    title: 'Flat in Sector 75',
    location: 'Sector 75, Noida',
    priceText: '₹1,650 for 1 night',
    rating: 4.76,
    isGuestFavorite: false,
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    ],
  },
];

export const PUNE_LISTINGS: HomeListingItem[] = [
  {
    id: 'pune-1',
    title: 'Apartment in Koregaon Park',
    location: 'Koregaon Park, Pune',
    priceText: '₹3,200 for 1 night',
    rating: 4.95,
    isGuestFavorite: true,
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'],
  },
  {
    id: 'pune-2',
    title: 'Studio in Viman Nagar',
    location: 'Viman Nagar, Pune',
    priceText: '₹2,100 for 1 night',
    rating: 4.88,
    isGuestFavorite: true,
    images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'],
  },
  {
    id: 'pune-3',
    title: 'Villa in Baner',
    location: 'Baner, Pune',
    priceText: '₹6,500 for 1 night',
    rating: 4.98,
    isGuestFavorite: true,
    images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'],
  },
  {
    id: 'pune-4',
    title: 'Condo in Kalyani Nagar',
    location: 'Kalyani Nagar, Pune',
    priceText: '₹3,800 for 1 night',
    rating: 4.92,
    isGuestFavorite: true,
    images: ['https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80'],
  },
  {
    id: 'pune-5',
    title: 'Loft in Hinjawadi',
    location: 'Hinjawadi, Pune',
    priceText: '₹2,400 for 1 night',
    rating: 4.85,
    isGuestFavorite: false,
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'],
  },
];

export const DESTINATIONS_FOR_YOU: DestinationItem[] = [
  {
    id: 'dubai',
    city: 'Dubai',
    tagline: 'Prime beach spot',
    imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'bangkok',
    city: 'Bangkok',
    tagline: 'Vibrant nightlife',
    imageUrl: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'london',
    city: 'London',
    tagline: 'Epic architecture',
    imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'paris',
    city: 'Paris',
    tagline: 'For the Eiffel Tower',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'rome',
    city: 'Rome',
    tagline: 'World-class dining',
    imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'kuala-lumpur',
    city: 'Kuala Lumpur',
    tagline: 'Epic architecture',
    imageUrl: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'istanbul',
    city: 'Istanbul',
    tagline: 'Vibrant nightlife',
    imageUrl: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'edinburgh',
    city: 'Edinburgh',
    tagline: 'For a trip abroad',
    imageUrl: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'prague',
    city: 'Prague',
    tagline: 'Top destination',
    imageUrl: 'https://images.unsplash.com/photo-1541849546-216549ae216d?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'barcelona',
    city: 'Barcelona',
    tagline: 'Prime beach spot',
    imageUrl: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=600&q=80',
  },
];

export const INSPIRATION_TABS: Record<string, InspirationItem[]> = {
  Popular: [
    { city: 'Richmond', type: 'House rentals' },
    { city: 'Tokyo', type: 'House rentals' },
    { city: 'Cincinnati', type: 'Cabin rentals' },
    { city: 'Wilmington', type: 'House rentals' },
    { city: 'Key West', type: 'Villa rentals' },
    { city: 'Galveston', type: 'Flat rentals' },
    { city: 'Savannah', type: 'Flat rentals' },
    { city: 'Manhattan', type: 'Villa rentals' },
    { city: 'Kansas City', type: 'House rentals' },
    { city: 'Chicago', type: 'Holiday rentals' },
    { city: 'Dublin', type: 'Flat rentals' },
    { city: 'Nashville', type: 'Holiday rentals' },
    { city: 'West Palm Beach', type: 'Cottage rentals' },
    { city: 'Sacramento', type: 'Holiday rentals' },
    { city: 'Jersey City', type: 'Apartment rentals' },
    { city: 'St. Petersburg', type: 'Holiday rentals' },
    { city: 'Gulf Shores', type: 'Flat rentals' },
  ],
  'Arts & culture': [
    { city: 'Florence', type: 'Art lofts' },
    { city: 'Vienna', type: 'Historic apartments' },
    { city: 'Berlin', type: 'Studio rentals' },
    { city: 'New York', type: 'Loft rentals' },
    { city: 'Santa Fe', type: 'Adobe homes' },
    { city: 'Austin', type: 'Bungalow rentals' },
  ],
  Beach: [
    { city: 'Goa', type: 'Beachfront villas' },
    { city: 'Maldives', type: 'Overwater bungalows' },
    { city: 'Bali', type: 'Tropical villas' },
    { city: 'Phuket', type: 'Sea view suites' },
    { city: 'Santorini', type: 'Cliffside suites' },
    { city: 'Cancun', type: 'Resort rentals' },
  ],
  Mountains: [
    { city: 'Manali', type: 'Wooden chalets' },
    { city: 'Zermatt', type: 'Ski chalets' },
    { city: 'Banff', type: 'Mountain cabins' },
    { city: 'Aspen', type: 'Luxury lodges' },
    { city: 'Shimla', type: 'Heritage cottages' },
    { city: 'Innsbruck', type: 'Alpine chalets' },
  ],
  Outdoors: [
    { city: 'Yellowstone', type: 'Lodge rentals' },
    { city: 'Rishikesh', type: 'Camp & cottages' },
    { city: 'Lake Tahoe', type: 'Lakeside cabins' },
    { city: 'Queenstown', type: 'Adventure retreats' },
    { city: 'Moab', type: 'Desert glamping' },
    { city: 'Reykjavik', type: 'Northern lights cabins' },
  ],
  'Things to do': [
    { city: 'London', type: 'West End experiences' },
    { city: 'Kyoto', type: 'Tea ceremony retreats' },
    { city: 'Jaipur', type: 'Palace stays' },
    { city: 'Cape Town', type: 'Wine tour villas' },
    { city: 'Sydney', type: 'Harbour view stays' },
    { city: 'Dubai', type: 'Desert safari suites' },
  ],
};
