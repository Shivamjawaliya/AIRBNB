import { ListingDetail } from '@/types';

export const MOCK_LISTING_DATA: ListingDetail = {
  id: 'terracotta-serene-candolim',
  title: 'Terracotta Serene - 1BHK Candolim | Whirlpool/WiFi',
  propertyType: 'Entire rental unit',
  location: {
    city: 'Candolim',
    state: 'Goa',
    country: 'India',
    neighborhood: 'Candolim Beach Road, North Goa',
    coordinates: {
      lat: 15.518,
      lng: 73.763,
    },
  },
  capacity: {
    guests: 4,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
  },
  guestFavorite: true,
  ratings: {
    overall: 4.93,
    reviewCount: 28,
    categories: {
      cleanliness: 4.9,
      accuracy: 4.9,
      communication: 5.0,
      location: 4.8,
      checkIn: 5.0,
      value: 4.9,
    },
  },
  pricing: {
    basePricePerNight: 4500,
    currency: 'INR',
    cleaningFee: 1200,
    serviceFeeRate: 0.14,
  },
  highlights: [
    {
      id: 'h1',
      title: 'Private Whirlpool / Hot Tub',
      description: 'Relax in your own indoor hydromassage jacuzzi bath tub.',
      iconName: 'Bath',
    },
    {
      id: 'h2',
      title: 'Dedicated Workspace',
      description: 'A dedicated desk with ergonomic chair and 300+ Mbps high-speed WiFi.',
      iconName: 'Laptop',
    },
    {
      id: 'h3',
      title: 'Self check-in',
      description: 'Check yourself in smoothly with the secure digital keypad lockbox.',
      iconName: 'Key',
    },
    {
      id: 'h4',
      title: 'Free cancellation before 48 hours',
      description: 'Cancel up to 2 days before check-in and get a full refund.',
      iconName: 'ShieldCheck',
    },
  ],
  description: `Welcome to Terracotta Serene, a designer boutique 1BHK apartment tucked away in the vibrant heart of Candolim, North Goa. 

Crafted with artisanal terracotta tones, custom teakwood furnishings, and lush tropical indoor plants, this serene oasis is just 5 minutes away from the golden sands of Candolim Beach.

The Space:
• Master Suite: Plush Queen-size bed with orthopedic mattress, ambient warm lighting, and a modern wardrobe.
• Living Lounge: Spacious open-plan living room with a comfortable sofa-cum-bed, 55" 4K Smart TV with Netflix, and handcrafted decor.
• Private Jacuzzi / Whirlpool: Indulge in warm bubbles after a sun-kissed day at the beach.
• Gourmet Kitchenette: Fully equipped with induction cooktop, microwave, refrigerator, RO water purifier, toaster, and cookware.
• Balcony: Cozy private patio overlooking tropical greenery, perfect for morning coffee and sunset cocktails.`,
  sleepingArrangements: [
    {
      id: 's1',
      roomName: 'Bedroom 1',
      bedType: '1 queen bed',
      icon: 'BedDouble',
    },
    {
      id: 's2',
      roomName: 'Living room',
      bedType: '1 sofa bed',
      icon: 'Sofa',
    },
  ],
  amenities: [
    { id: 'a1', title: 'Private whirlpool / hot tub', category: 'Bathroom', available: true, iconName: 'Bath' },
    { id: 'a2', title: 'Fast Wifi – 300 Mbps', category: 'Internet & office', available: true, iconName: 'Wifi' },
    { id: 'a3', title: 'Dedicated workspace', category: 'Internet & office', available: true, iconName: 'Laptop' },
    { id: 'a4', title: 'Free parking on premises', category: 'Services', available: true, iconName: 'Car' },
    { id: 'a5', title: 'Air conditioning', category: 'Heating & cooling', available: true, iconName: 'Wind' },
    { id: 'a6', title: 'Kitchen & Cookware', category: 'Kitchen & dining', available: true, iconName: 'Utensils' },
    { id: 'a7', title: '55" HDTV with Netflix', category: 'Entertainment', available: true, iconName: 'Tv' },
    { id: 'a8', title: 'Washing machine', category: 'Bedroom & laundry', available: true, iconName: 'WashingMachine' },
    { id: 'a9', title: 'Private patio / balcony', category: 'Outdoor', available: true, iconName: 'Palmtree' },
    { id: 'a10', title: 'Smoke alarm & First aid', category: 'Home safety', available: true, iconName: 'ShieldAlert' },
  ],
  photos: [
    {
      id: 'p1',
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
      alt: 'Spacious living room with terracotta tones and ambient lighting',
      category: 'hero',
      roomLabel: 'Living room 1',
      caption: 'Main living room with custom furnishings and warm lighting',
    },
    {
      id: 'p2',
      url: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=800&q=80',
      alt: 'Artisanal dining area and cozy indoor seating',
      category: 'living',
      roomLabel: 'Living room 2',
      caption: 'Dining and social nook overlooking indoor greenery',
    },
    {
      id: 'p3',
      url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
      alt: 'Private whirlpool bath with hydromassage jets',
      category: 'amenities',
      roomLabel: 'Whirlpool Spa',
      caption: 'Indoor hydromassage jacuzzi tub',
    },
    {
      id: 'p4',
      url: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80',
      alt: 'Plush master bedroom with queen bed',
      category: 'bedroom',
      roomLabel: 'Bedroom',
      caption: 'Master bedroom with queen bed and cozy ambient accents',
    },
    {
      id: 'p5',
      url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
      alt: 'Exterior facade of Terracotta Serene condominium',
      category: 'exterior',
      roomLabel: 'Exterior',
      caption: 'Contemporary villa architecture situated in quiet Candolim lane',
    },
    {
      id: 'p6',
      url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
      alt: 'Modern kitchenette with induction and microwave',
      category: 'kitchen',
      roomLabel: 'Kitchen',
      caption: 'Fully equipped kitchenette with breakfast bar',
    },
    {
      id: 'p7',
      url: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=1200&q=80',
      alt: 'En-suite designer bathroom with rainfall shower',
      category: 'bathroom',
      roomLabel: 'Bathroom',
      caption: 'Bathroom with vanity mirror and rain shower',
    },
    {
      id: 'p8',
      url: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80',
      alt: 'Swimming pool inside the residential community',
      category: 'amenities',
      roomLabel: 'Pool & Gardens',
      caption: 'Shared swimming pool surrounded by tropical palm trees',
    },
  ],
  host: {
    id: 'host-101',
    name: 'Aarav & Meera',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    isSuperhost: true,
    yearsHosting: 3,
    rating: 4.93,
    reviewCount: 28,
    responseRate: '100%',
    responseTime: 'within an hour',
    bio: 'Hi, we are Aarav and Meera! We are passionate architects and hospitality hosts based in Goa. We love designing tranquil, aesthetic spaces that make travelers feel pampered and instantly at home.',
    work: 'Architect & Interior Designer',
  },
  policies: {
    checkInTime: '2:00 PM - 9:00 PM',
    checkoutTime: '11:00 AM',
    selfCheckIn: true,
    cancellation: 'Free cancellation for 48 hours. Cancel before check-in for partial refund.',
    houseRules: [
      'Check-in: 2:00 PM – 9:00 PM',
      'Checkout: 11:00 AM',
      'No smoking inside the apartment',
      'No loud parties after 10:00 PM',
      'Maximum 4 guests allowed',
    ],
    safetyRules: [
      'Carbon monoxide alarm installed',
      'Smoke detector active',
      'Exterior security cameras on common entryways',
      'First aid kit provided in kitchen cabinet',
    ],
  },
};
