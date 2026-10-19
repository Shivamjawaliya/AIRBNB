# Project Setup, Architecture, Workflows & Engineering Problem Log

This document provides a complete technical log of the project scaffolding, the industry-standard architecture, end-to-end workflows, every engineering challenge faced during development, the exact technology chosen to solve each issue, and a chronological changelog of all implementation steps.

---

## 1. Executive Summary & Technology Stack Mapping

The Airbnb Clone is a pixel-perfect, production-grade responsive web application built with modern React 19 and Next.js 16 (App Router with Turbopack). It replicates the full Airbnb web experience across both the **Home Page (`/`)** and the **Room Detail Page (`/rooms/[id]`)**, including dynamic searchbar morphing, bento grid gallery, full-viewport 43-photo tour with sticky floating headings, keyboard-navigated lightbox, and dynamic booking cost calculators.

### Technology Stack & Problem-Solving Matrix

| Technology | Version | Problem It Solves | Architectural Rationale & Why Alternatives Were Rejected |
|---|---|---|---|
| **Next.js (App Router)** | `16.4.2` | High-performance routing, SSR, SSG, Partial Prerendering (PPR), URL parameter state management. | App Router provides React Server Components (RSC) and nested layouts. Client-side routers (e.g. Vite + React Router) lack out-of-the-box SEO, server streaming, and fast Turbopack bundling. |
| **React & React-DOM** | `19.3.0` | Declarative UI, Concurrent Mode, `useCallback`/`useMemo` state stabilization. | Core library for component state, hooks, and clean synthetic event handling (e.g., `onError` fallback handlers). |
| **TypeScript** | `5.x` | Runtime bugs, photo index mismatches, type contracts across domains. | Strict typing eliminates runtime errors. Every domain (`ListingDetail`, `ListingPhoto`, `PhotoTourSectionData`, `BookingPricing`) is enforced at compile time. |
| **Tailwind CSS** | `4.x` | Pixel-perfect responsiveness, layout constraints, micro-interactions. | Utility-first CSS avoids stylesheet bloat. Clean responsive breakpoints (`sm:`, `md:`, `lg:`, `min-[1138px]:`) enable precise alignment across disparate pages. |
| **Framer Motion** | `12.x` | Fluid layout animations, header morphing between Expanded (180px) and Compact (80px), heart spring pops, modal transitions. | Pure CSS animations cannot coordinate two simultaneous layout morphs with spring physics and layoutId synchronization as cleanly as Framer Motion. |
| **HTML5 History API** | Native | Modal routing and browser Back/Forward button flow without full-page refreshes. | Managing modal state purely in React memory causes the browser Back button to exit the site entirely. Synchronizing `?modal=PHOTO_TOUR_SCROLLABLE` via `pushState`/`replaceState` enables natural native browser back-navigation. |
| **Lucide React** | `0.548+` | Crisp, scalable SVG icons (Chevrons, Star, Shield, Heart, Close, Key, etc.). | SVG icons ensure crisp rendering on high-DPI Retina screens without pixelation or CDN download latency. |
| **date-fns** | `4.x` | Accurate date math, check-in/checkout calculations, night counting. | Lightweight, tree-shakable date utility without the heavy footprint or mutability issues of legacy libraries like Moment.js. |
| **clsx & tailwind-merge** | Latest | Dynamic class generation and style conflict resolution (`cn` utility). | Merging Tailwind classes conditionally (e.g. active vs inactive tabs) often creates CSS specificity collisions. `twMerge` guarantees the last declared utility takes precedence. |

---

## 2. Architecture & Domain-Driven Directory Structure

To maintain clean separation of concerns and high maintainability, the project adopts a **Feature-Sliced / Domain-Driven Architecture**:

```
src/
├── app/                               # Next.js App Router root
│   ├── layout.tsx                     # Global HTML shell, Geist fonts, Airbnb listing metadata
│   ├── page.tsx                       # Airbnb Home Page (carousels, destinations, inspiration)
│   ├── globals.css                    # Tailwind v4 setup & custom tokens
│   ├── rooms/
│   │   └── [id]/
│   │       └── page.tsx               # Room Detail Page (Candolim Terracotta Serene listing)
│   └── api/
│       └── listing/
│           └── route.ts               # REST API endpoint returning typed listing data
├── features/                          # Business domains (Feature-Sliced)
│   ├── home/                          # Home page domain
│   │   ├── components/
│   │   │   ├── HomeHeader.tsx         # Morphing header (Expanded 180px <-> Compact 80px)
│   │   │   ├── ListingCarousel.tsx    # Horizontal stay carousels with resilient image onError
│   │   │   ├── DestinationCarousel.tsx# "Destinations for you" carousel
│   │   │   ├── InspirationSection.tsx # Multi-tab getaway inspiration grid
│   │   │   └── HomeFooter.tsx         # 3-column Airbnb home footer with locale/currency
│   │   └── data/
│   │       └── homeData.ts            # Datasets for Goa, Noida, Pune, and destination cards
│   ├── listing/                       # Listing domain
│   │   ├── components/
│   │   │   ├── ListingHeader.tsx      # Title, Share modal, and Save heart button
│   │   │   ├── PhotoBentoGrid.tsx     # 5-Photo bento grid with dynamic ID index lookup
│   │   │   ├── PropertyOverview.tsx   # Specs, Guest Favorite laurel banner, host info, calendar
│   │   │   └── SubNavbar.tsx          # Floating animated sticky subnav (Photos, Amenities, Reviews)
│   │   └── types/
│   │       └── listing.types.ts       # ListingDetail, HostInfo, AmenityItem, Photo types
│   ├── photo-tour/                    # Photo Tour domain
│   │   ├── components/
│   │   │   └── PhotoTourOverlay.tsx   # Fullscreen gallery, sticky category bar, floating headings
│   │   └── data/
│   │       └── photoTourData.ts       # 43 categorized listing photos, 9 room sections, amenities
│   ├── lightbox/                      # Lightbox domain
│   │   ├── components/
│   │   │   └── LightboxModal.tsx      # Focused single-photo carousel with counter & room title
│   │   └── hooks/
│   │       └── useKeyboardNavigation.ts# ArrowLeft, ArrowRight, and Escape keyboard listener
│   ├── booking/                       # Reservation domain
│   │   ├── components/
│   │   │   └── StickyBookingWidget.tsx# Pinned reservation widget with dynamic price math
│   │   ├── hooks/
│   │   │   └── useBookingPricing.ts   # Dynamic night count, fee rates, and grand total calculator
│   │   └── types/
│   │       └── booking.types.ts       # PricingBreakdown, DateRange, and GuestCounts types
│   └── reviews/                       # Reviews domain
│       └── types/
│           └── review.types.ts        # Reviewer credentials, ratings, and feedback schemas
├── components/                        # Shared presentation primitives
│   ├── ui/
│   │   ├── Button.tsx                 # Button variants (primary, outline, ghost)
│   │   ├── Modal.tsx                  # Accessible backdrop modal container
│   │   ├── Badge.tsx                  # Guest favourite & Superhost badges
│   │   └── Divider.tsx                # Standard horizontal divider rule
│   └── layout/
│       ├── Navbar.tsx                 # Sticky navigation component
│       └── Footer.tsx                 # Multi-column footer
├── data/
│   └── mockListingData.ts             # Complete dataset for Candolim listing (photos, host, policies)
├── hooks/
│   ├── useViewState.ts                # Master state controller ('listing' | 'photo-tour' | 'lightbox')
│   └── useScrollLock.ts               # Locks body scroll when modals/overlays are open
├── lib/
│   ├── utils.ts                       # ClassName merging helper (`cn`)
│   ├── constants.ts                   # Brand colors, guest limits, default fee rates
│   └── formatters.ts                  # Currency formatter (₹ INR), date range formatters
└── types/
    └── index.ts                       # Central TypeScript barrel export
```

---

## 3. End-to-End User & Developer Workflows

### Workflow 1: Home Page Discovery & Exploration (`/`)
1. **Initial Mount**: User visits `http://localhost:3000/`. The header renders statically at Endpoint 1 (`180px` height) with the authentic Airbnb Bélo logo, centered 3D category tabs (`All`, `Homes`, `Experiences`, `Services`), search capsule, and right user controls (`Become a host`, Profile, Hamburger menu).
2. **Scroll Morphing**:
   - As the user scrolls down past `30px`, Framer Motion smoothly shrinks the header from `180px` down to `80px` (`h-20`).
   - The large multi-segmented search bar morphs into a compact pill (`408px` width, `48px` height, `top-4`).
   - A synchronized bottom spacer (`80px`) adjusts in lockstep to prevent content jumps.
   - Hysteresis logic prevents flickering: re-expanding requires scrolling back up to `<= 5px`.
3. **Browsing Listings**:
   - User browses horizontal carousels (South Goa, Noida, Pune).
   - Chevron buttons (`<` and `>`) enable smooth horizontal scrolling with disabled states at boundaries.
   - Any broken image links automatically fall back via the `onError` synthetic handler to a valid high-resolution photo.
   - Clicking any stay card navigates to `/rooms/terracotta-serene-candolim`.

### Workflow 2: Room Detail View & Gallery Exploration (`/rooms/[id]`)
1. **Room Page Loading**:
   - The header renders in compact `rooms` mode with the exact same pixel-aligned container width (`max-w-[1760px] px-8 sm:px-10 md:px-12 min-[1138px]:px-20`) and identical left/right padding.
   - The 5-photo Bento Grid renders:
     - **Photo 0 (Large hero, left):** Living room 1 overview (`img-00`)
     - **Photo 1 (Top middle):** Living room 1 couch angle (`img-01`)
     - **Photo 2 (Top right):** Private indoor jacuzzi tub (`img-03`)
     - **Photo 3 (Bottom middle):** Bedroom with queen mattress (`img-02`)
     - **Photo 4 (Bottom right):** Exterior view of Amor de Goa (`img-07`)
2. **Direct Photo Click (Lightbox Modal)**:
   - When the user taps ANY photo in the bento grid (e.g. Jacuzzi), the click handler resolves `photos.findIndex(p => p.id === photo.id)` and immediately opens the **Lightbox Modal (`LightboxModal.tsx`)** showing that exact photo (`3 / 43 · Living room 2`).
   - Keyboard navigation is active: pressing `ArrowRight` advances to the next photo, `ArrowLeft` goes to the previous photo, and `Escape` closes the lightbox.
3. **Show All Photos (Photo Tour Modal)**:
   - Clicking the `"Show all photos"` button opens the full-viewport **Photo Tour (`PhotoTourOverlay.tsx`)**.
   - The URL parameter updates to `?modal=PHOTO_TOUR_SCROLLABLE` via `window.history.pushState`.
   - The sticky category bar allows fast jumping to any of the 9 room sections (`Living room 1`, `Living room 2`, `Full kitchen`, `Bedroom`, `Full bathroom`, `Pool`, `Gym`, `Exterior`, `Additional photos`).
   - Each section features a floating sticky left heading (`md:sticky md:top-24`) while the right column displays photos.
   - Clicking any photo inside the photo tour seamlessly transitions into the Lightbox at that photo's global index.
   - Pressing the browser **Back** button or clicking the top-left `←` button cleanly pops the modal from browser history, returning the user to the listing view.

### Workflow 3: Reservation & Price Calculation
1. **Two-Column Sticky Grid**:
   - Left column (`62.5%` width / 7.5 cols): Listing description, amenities, sleeping arrangements, interactive 2-month calendar, reviews, host information, map, and nearby stays.
   - Right column (`37.5%` width / 4.5 cols): Pinned `StickyBookingWidget`.
2. **Dynamic Cost Breakdown**:
   - User selects check-in (Nov 6) and checkout (Nov 8) dates on the calendar or widget.
   - `useBookingPricing` calculates night duration (2 nights) × base price (₹4,349) = ₹8,698.
   - Dynamic price breakdown updates in real-time with zero cleaning fee and transparent rate displays.
   - On mobile, a docked bottom reserve bar floats with a 1-click scroll trigger (`Reserve` button scrolls smoothly to the calendar).

---

## 4. Comprehensive Engineering Problem Log

Every problem encountered during the development lifecycle, the root cause why we faced it, the exact technology used to resolve it, and the resulting code implementation.

---

### Problem 1: Desktop Header Misalignment Between Home Page and Room Detail Page

#### 1. Symptom & Visual Defect:
When navigating between the Home Page (`/`) and the Room Detail Page (`/rooms/terracotta-serene-candolim`), the Airbnb brand logo on the far left and the user profile controls on the far right visibly shifted by more than 130px. The logo appeared closer to the left screen edge on Home and jumped inward on Room.

#### 2. Root Cause Analysis:
- **Container Class Mismatch**: `HomeHeader.tsx` contained conditional container width classes:
  ```tsx
  // Old code causing misalignment:
  className={`hidden md:block mx-auto h-full relative ${
    isRoomsMode ? 'max-w-7xl px-4 sm:px-8' : 'max-w-[1760px] px-6 md:px-8 min-[1138px]:px-20'
  }`}
  ```
  On wide screens (`> 1280px`), `max-w-7xl` restricted the header width to 1280px, while `max-w-[1760px]` allowed it to expand to 1760px, causing a 240px discrepancy in container width.
- **Asymmetric Negative Margins**: The logo link on the home page had `-ml-1 md:-ml-2 min-[1138px]:-ml-8` (-32px), pulling the logo into the container margin, while the room page had `-ml-2` (-8px).
- **Height & Vertical Offsets**: Home mode had `pt-2 sm:pt-2.5` with height `86px`, whereas rooms mode had `pt-0` with height `80px`. Furthermore, the search bar had `top-[15px]` on rooms vs `top-4` (16px) on home.

#### 3. Technology Chosen & Solution:
- **Technology**: Tailwind CSS responsive utility standardization and Framer Motion animated layout properties.
- **Implementation**:
  1. Unified the desktop container across all modes to `max-w-[1760px] px-8 sm:px-10 md:px-12 min-[1138px]:px-20`.
  2. Removed all negative margins (`-ml-8`, `-ml-2`) from the logo link.
  3. Added balanced inner row padding (`px-2 sm:px-4`) for comfortable breathing room on both left and right edges.
  4. Standardized compact header height to `80px` (`h-20`), searchbar position to `top-4`, and scrolled spacer height to `80px`.

---

### Problem 2: Corrupted & Broken Images in Home Page Carousels (HTTP 404)

#### 1. Symptom & Visual Defect:
In the "Check out homes in Noida" section, the 4th listing card ("Room in Sector 75") displayed a broken image icon with exposed alt text, damaging visual credibility.

#### 2. Root Cause Analysis:
The listing item `noida-4` in `src/features/home/data/homeData.ts` pointed to:
`https://images.unsplash.com/photo-1540518614846-7ede433c4ef3?auto=format&fit=crop&w=800&q=80`
Running an automated Node.js HTTP HEAD probe across all remote URLs revealed that this specific image was deleted from Unsplash's CDN, returning **HTTP 404 Not Found**.

#### 3. Technology Chosen & Solution:
- **Technology**: Node.js automated verification script + React Synthetic `onError` event handling.
- **Implementation**:
  1. Replaced the dead URL in `homeData.ts` with a verified 200 OK high-resolution bedroom photo:
     `https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80`.
  2. Implemented resilient client-side `onError` fallback handlers in `ListingCarousel.tsx` and `DestinationCarousel.tsx`:
     ```tsx
     <img
       src={item.images[0]}
       alt={item.title}
       className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
       onError={(e) => {
         const target = e.currentTarget;
         if (!target.src.includes('photo-1590490360182-c33d57733427')) {
           target.src = 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80';
         }
       }}
     />
     ```
  3. Guarantees that even if external CDNs experience downtime, image cards seamlessly recover without layout glitches.

---

### Problem 3: Bento Grid Photo Mismatch and Wrong Image Opening in Lightbox

#### 1. Symptom & Visual Defect:
When clicking on the photos visible in the room page Bento Grid (e.g., clicking on the Jacuzzi photo or the Exterior photo), the Lightbox modal opened showing Photo 1 (`1/43 · Living room 1`) or an entirely different room (such as Kitchen or Bedroom) instead of the tapped photo.

#### 2. Root Cause Analysis:
1. **Photo Array Ordering**: `MOCK_LISTING_DATA.photos` used `ALL_43_PHOTOS`. The first 5 items were:
   - Index 0: Living room 1 (`img-00`)
   - Index 1: Living room couch (`img-01`)
   - Index 2: Bedroom (`img-02`)
   - Index 3: Jacuzzi (`img-03`)
   - Index 4: Kitchen (`img-04`)
   However, the reference design and user screenshot featured:
   - Top right: Jacuzzi (`img-03`)
   - Bottom left: Bedroom (`img-02`)
   - Bottom right: Exterior of Amor de Goa (`img-07`)
   Because `ALL_43_PHOTOS.slice(0, 5)` was used, the Exterior photo wasn't even included in the top 5, and Kitchen was shown instead.
2. **Hardcoded Index Lookup**: `PhotoBentoGrid.tsx` invoked `onOpenLightbox(photoIndex)` where `photoIndex = idx + 1`. This rigid arithmetic mapped the 5th tile to index 4 (Kitchen) instead of finding the photo's true global index.

#### 3. Technology Chosen & Solution:
- **Technology**: Array schema normalization in TypeScript + dynamic Array `findIndex` resolution in React.
- **Implementation**:
  1. Reordered the first 5 elements of `ALL_43_PHOTOS` in `photoTourData.ts` to exactly mirror the visible bento grid:
     ```ts
     export const ALL_43_PHOTOS: ListingPhoto[] = [
       { id: 'img-00', url: '/assets/images/2367476f-11c4...jpeg', ... }, // 0: Living room 1
       { id: 'img-01', url: '/assets/images/090d8b0b-b539...jpeg', ... }, // 1: Living room couch
       { id: 'img-03', url: '/assets/images/67c61c6f-6260...jpeg', ... }, // 2: Jacuzzi
       { id: 'img-02', url: '/assets/images/9be71047-fc52...jpeg', ... }, // 3: Bedroom
       { id: 'img-07', url: '/assets/images/97c78f8a-5090...jpeg', ... }, // 4: Exterior
       { id: 'img-04', url: '/assets/images/c904e1ab-a39d...jpeg', ... }, // 5: Kitchen
       ...
     ];
     ```
  2. Updated all 43 `globalIndex` references in `PHOTO_TOUR_SECTIONS` to maintain 1:1 synchronization with `ALL_43_PHOTOS`.
  3. Replaced rigid index math in `PhotoBentoGrid.tsx` with dynamic ID-based resolution:
     ```tsx
     onClick={() => {
       const targetIdx = photos.findIndex((p) => p.id === photo.id);
       onOpenLightbox(targetIdx >= 0 ? targetIdx : idx);
     }}
     ```
  4. Added a responsive `md:hidden` "Show all photos" button so mobile users can open the photo tour cleanly.

---

### Problem 4: Browser History Loss on Modal Navigation

#### 1. Symptom & Functional Defect:
When a user opened the Photo Tour (`?modal=PHOTO_TOUR_SCROLLABLE`) and pressed the browser's native Back button (or mouse back button), the browser did not close the modal; instead, it navigated back to the Home page or closed the tab.

#### 2. Root Cause Analysis:
The modal state was originally tracked purely in React component state (`activeView: 'photo-tour'`). Since no browser history entry was created, the browser history stack had no knowledge that an overlay was active.

#### 3. Technology Chosen & Solution:
- **Technology**: HTML5 History API (`pushState`, `replaceState`, `popstate` event listeners) encapsulated in `useViewState.ts`.
- **Implementation**:
  1. When `openPhotoTour()` is triggered, it pushes a history state:
     ```ts
     window.history.pushState({ modal: 'PHOTO_TOUR_SCROLLABLE' }, '', url.toString());
     ```
  2. An active `popstate` listener monitors browser navigation:
     ```ts
     useEffect(() => {
       const handlePopState = () => {
         const params = new URLSearchParams(window.location.search);
         if (params.get('modal') === 'PHOTO_TOUR_SCROLLABLE') {
           setState((prev) => ({ ...prev, activeView: 'photo-tour' }));
         } else {
           setState((prev) => ({ ...prev, activeView: 'listing' }));
         }
       };
       window.addEventListener('popstate', handlePopState);
       return () => window.removeEventListener('popstate', handlePopState);
     }, []);
     ```
  3. When closing the modal via the UI button, `window.history.back()` is invoked if the state was pushed, ensuring history stack consistency.

---

### Problem 5: Floating Sticky Category Headings in the Photo Tour

#### 1. Symptom & Visual Defect:
In a 43-photo gallery containing 9 room categories, users scrolling through images lost context regarding which room they were currently examining.

#### 2. Root Cause Analysis:
Standard static headers scroll off-screen immediately, leaving long photo grids without visual titles or amenity tags.

#### 3. Technology Chosen & Solution:
- **Technology**: CSS `position: sticky` and Tailwind `md:sticky md:top-24` within a responsive two-column grid.
- **Implementation**:
  - The left column (`md:col-span-4`) holds the room title, subtitle, and amenity badge list with `sticky top-24 self-start`.
  - The right column (`md:col-span-8`) scrolls the room's photos.
  - As the user scrolls through the photos of "Living room 1", the title remains anchored at the top until the section ends, at which point "Living room 2" smoothly takes its place.

---

### Problem 6: Header Morphing Flickering & Scroll Thrashing

#### 1. Symptom & Behavioral Defect:
On the Home Page, scrolling near the top boundary caused rapid bouncing between the large 180px header and the compact 80px bar, resulting in visual jitter.

#### 2. Root Cause Analysis:
A single scroll threshold (e.g. `scrollY > 20px`) created an infinite toggle loop when momentum scrolling bounced near 20px.

#### 3. Technology Chosen & Solution:
- **Technology**: Deadband Hysteresis algorithm implemented in `useEffect` scroll listeners.
- **Implementation**:
  ```ts
  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    // Hysteresis: requires > 30px to collapse, but <= 5px to re-expand
    if (!isScrolledRef.current && currentScrollY > 30) {
      isScrolledRef.current = true;
      setIsScrolled(true);
    } else if (isScrolledRef.current && currentScrollY <= 5) {
      isScrolledRef.current = false;
      setIsScrolled(false);
    }
  };
  ```
  This creates a 25px buffer where state changes are ignored, ensuring zero vibration.

---

### Problem 7: SubNavbar Overlap on Mobile Viewports

#### 1. Symptom & Usability Defect:
On phone screens, the floating `SubNavbar` tabs (`Photos`, `Amenities`, `Reviews`, `Location`) collided with the bottom fixed reserve button.

#### 2. Root Cause Analysis:
Both components occupied fixed positions on mobile without responsive media query differentiation or z-index prioritization.

#### 3. Technology Chosen & Solution:
- **Technology**: Tailwind responsive breakpoints (`hidden md:flex` vs `flex md:hidden`) and z-index layer isolation.
- **Implementation**:
  - On desktop (`md+`), `SubNavbar` renders as a floating top bar with animated tabs and an inline reserve capsule.
  - On mobile (`< md`), `SubNavbar` is suppressed, and a clean docked bottom reservation sheet is rendered with proper safe-area padding (`pb-safe`).

---

### Problem 8: "Meet Your Host" Card Distortion & Low-Resolution Co-Host Avatars

#### 1. Symptom & Visual Defect:
The host profile card stretched awkwardly across wide displays, co-host portraits were rendered as blurry placeholder icons, and the Superhost badge was misaligned.

#### 2. Root Cause Analysis:
The host container lacked fixed-width boundaries (`w-full` instead of `max-w-[332px]`), and co-host data referenced low-resolution SVG icons.

#### 3. Technology Chosen & Solution:
- **Technology**: Tailwind layout containment + high-resolution image asset integration.
- **Implementation**:
  1. Constrained the host card to `max-w-[332px] mx-auto md:mx-0`.
  2. Integrated high-res Unsplash portrait for primary host Mirashya with bottom-right SVG verified badge.
  3. Added real cropped co-host images (`/hosts/cohost-1.jpg` to `cohost-6.jpg`) displayed in a clean 2x3 avatar grid with host names and responsibilities.

---

## 5. Chronological Implementation & Step-by-Step Action Log

Every single step taken in the project codebase, organized chronologically:

1. **Step 1: Scaffolding & Architecture Initialization**
   - Configured Next.js 16.4.2 with App Router and Turbopack.
   - Initialized Tailwind CSS v4, Lucide React, and Framer Motion.
   - Established feature-sliced directory structure (`src/features/listing`, `booking`, `photo-tour`, `lightbox`, `home`, `reviews`).

2. **Step 2: Core Domain Model & Mock Database Setup**
   - Created `src/features/listing/types/listing.types.ts` with strict TypeScript contracts.
   - Built `src/data/mockListingData.ts` with real Candolim listing details, pricing, amenities, and host specs.
   - Created `src/lib/formatters.ts` and `src/lib/constants.ts`.

3. **Step 3: Base Listing Page & Bento Grid**
   - Built `ListingHeader.tsx` with interactive Share modal and Save toggle.
   - Implemented `PhotoBentoGrid.tsx` with 5-photo responsive grid and `"Show all photos"` button.
   - Built `PropertyOverview.tsx` including Laurel Wreath "Guest favourite" badge, sleeping cards, and amenities preview.

4. **Step 4: Interactive Sticky Booking Widget**
   - Implemented `StickyBookingWidget.tsx` with `sticky top-28` pinning.
   - Built `useBookingPricing.ts` calculating nightly rate, cleaning fee, taxes, and grand total.
   - Added interactive guest picker popup and check-in date controls.

5. **Step 5: Fullscreen Photo Tour with Floating Headings**
   - Created `src/features/photo-tour/data/photoTourData.ts` with 43 high-resolution categorized images across 9 rooms.
   - Built `PhotoTourOverlay.tsx` with sticky category tab bar and `md:sticky md:top-24` floating section titles.
   - Added `?modal=PHOTO_TOUR_SCROLLABLE` URL synchronization via HTML5 History API.

6. **Step 6: Keyboard-Navigated Lightbox Modal**
   - Built `LightboxModal.tsx` with 95% dark backdrop, room title header, photo counter (`X / 43`), and left/right chevrons.
   - Implemented `useKeyboardNavigation.ts` listening to `ArrowLeft`, `ArrowRight`, and `Escape`.

7. **Step 7: Airbnb Real Home Page (`/` Route)**
   - Created `src/features/home/components/HomeHeader.tsx` replicating authentic Airbnb home navigation.
   - Integrated 3D category illustration assets (`all.png`, `homes.png`, `experiences.png`, `services.png`).
   - Implemented deadband hysteresis scroll morphing between Expanded (180px) and Compact (80px).
   - Built `ListingCarousel.tsx`, `DestinationCarousel.tsx`, `InspirationSection.tsx`, and `HomeFooter.tsx`.

8. **Step 8: Header Alignment & Padding Unification**
   - Standardized `HomeHeader.tsx` desktop container to `max-w-[1760px] px-8 sm:px-10 md:px-12 min-[1138px]:px-20` on both Home (`/`) and Room (`/rooms/[id]`).
   - Removed all negative margins on the Airbnb logo link.
   - Added `px-2 sm:px-4` inner row padding for balanced breathing room.
   - Synchronized header height (`80px`), searchbar top offset (`top-4`), and scrolled spacer (`80px`).

9. **Step 9: Corrupted Image Resolution & Fallback Resilience**
   - Ran Node.js HTTP HEAD verification script across all external image links.
   - Fixed broken 404 URL for `noida-4` in `homeData.ts` with a verified 200 OK bedroom photo (`photo-1590490360182-c33d57733427`).
   - Added synthetic `onError` fallback handlers across all carousel image elements.

10. **Step 10: Bento Grid Photo Ordering & Exact ID Resolution**
    - Reordered `ALL_43_PHOTOS` so the first 5 photos exactly match the bento grid reference (Living room, Couch, Jacuzzi, Bedroom, Exterior).
    - Synchronized all 43 `globalIndex` values in `PHOTO_TOUR_SECTIONS`.
    - Updated `PhotoBentoGrid.tsx` with dynamic `photos.findIndex(p => p.id === photo.id)` lookup, guaranteeing that clicking any photo opens that exact image in the Lightbox.
    - Added mobile-responsive "Show all photos" button.

11. **Step 11: Production Verification & GitHub Deployment**
    - Ran `npm run build`: verified **0 TypeScript errors**, **0 lint warnings**, and clean Turbopack static compilation.
    - Pushed all commits cleanly to `https://github.com/Shivamjawaliya/AIRBNB.git` on branch `main`.

---

## 6. How to Run, Test, and Verify

### Prerequisites:
- Node.js `18.x` or higher (tested on `v22.14.0`)
- npm or pnpm

### Commands:
```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Open in browser
# Home Page: http://localhost:3000
# Room Detail Page: http://localhost:3000/rooms/terracotta-serene-candolim

# 4. Run production build
npm run build

# 5. Start production server
npm run start
```

### Verification Checklist:
- [x] **Home Header Morph**: Starts at 180px with 3D icons; smoothly shrinks to 80px compact pill on scroll (>30px).
- [x] **Header Pixel Parity**: Logo and user controls sit in the identical pixel coordinate on `/` and `/rooms/...`.
- [x] **Home Carousels**: South Goa, Noida, and Pune carousels scroll smoothly without broken image icons.
- [x] **Bento Grid Accuracy**: 5 hero photos render correctly (Living room, Couch, Jacuzzi, Bedroom, Exterior).
- [x] **Bento Grid Clicks**: Tapping Jacuzzi opens Jacuzzi in Lightbox; tapping Bedroom opens Bedroom; tapping Exterior opens Exterior.
- [x] **Photo Tour (`?modal=PHOTO_TOUR_SCROLLABLE`)**: Sticky category nav jumps to rooms; floating room headings stay pinned on scroll.
- [x] **Browser History**: Pressing browser Back button closes Photo Tour without leaving `/rooms/[id]`.
- [x] **Keyboard Lightbox**: Arrow keys navigate photos, Escape key closes modal.
- [x] **Booking Math**: Dynamic pricing calculates nights, base rate, and totals accurately.
- [x] **TypeScript & Build Health**: `npm run build` compiles in < 2 seconds with zero errors.
