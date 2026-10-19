# Project Setup, Architecture & Changelog

This document provides a comprehensive technical log of the project scaffolding, the industry-standard directory structure, every file created or modified, the architectural rationale behind each choice, and each component's functional role.

---

## 1. Executive Summary & Technical Stack

The project has been initialized and configured without touching the full business logic implementation. It compiles cleanly with zero TypeScript errors and static generation enabled.

| Layer | Technology | Version | Architectural Role |
|---|---|---|---|
| **Framework** | Next.js (App Router, Turbopack) | `16.4.2` | Server Components, routing, static optimization, edge rendering |
| **Runtime / Library** | React & React-DOM | `19.3.0` | Declarative UI, state management, transitions |
| **Language** | TypeScript | `5.x` | Strict typing, interface safety across domains |
| **Styling** | Tailwind CSS & Turbopack integration | `4.x` | Design system tokens, micro-interactions, responsive utility classes |
| **Icons** | Lucide React | `0.548+` | Clean, lightweight SVG icons matching Airbnb's exact iconography |
| **Animations** | Framer Motion | `12.x` | Smooth modal entries, photo slider transitions, tab sliding |
| **Date Utility** | date-fns | `4.x` | Tree-shakable date math for check-in/checkout & night counts |
| **Class Utilities** | clsx & tailwind-merge | Latest | Safe, collision-free conditional Tailwind class merging (`cn`) |

---

## 2. Industry-Standard Architecture (Feature-Sliced / Domain-Driven)

### Why This Architecture?
In enterprise codebases (such as Airbnb, Meta, and Vercel), organizing by purely technical roles (e.g., throwing all components into a single `components/` folder) leads to tight coupling, poor discoverability, and painful refactoring. 

We adopted a **Domain-Driven Feature-Sliced Architecture**:
1. **`src/features/`**: Code is grouped by business domain (`listing`, `booking`, `photo-tour`, `lightbox`, `reviews`). Each feature encapsulates its own components, custom hooks, and domain types.
2. **`src/components/ui/`**: Pure, stateless, reusable design primitives (Button, Modal, Badge, Divider) agnostic of any business domain.
3. **`src/components/layout/`**: Application shell elements (Navbar, Footer).
4. **`src/hooks/`**: Cross-cutting application state (view switching, modal scroll locks).
5. **`src/data/`**: Typed mock datasets simulating backend database records.
6. **`src/lib/`**: Generic pure helper functions, formatters, and brand constants.

---

## 3. Complete File & Directory Changelog

```
src/
├── app/
│   ├── layout.tsx                     [MODIFIED] Root layout with Airbnb listing metadata
│   ├── page.tsx                       [MODIFIED] Main view orchestrator & shell layout
│   ├── globals.css                    [MODIFIED] Tailwind v4 setup & brand design tokens
│   └── api/
│       └── listing/
│           └── route.ts               [CREATED] Mock API endpoint returning listing data
├── components/
│   ├── ui/
│   │   ├── Button.tsx                 [CREATED] Reusable button with variants & sizes
│   │   ├── Modal.tsx                  [CREATED] Accessible modal with scroll lock & backdrop
│   │   ├── Badge.tsx                  [CREATED] Guest favorite, superhost & rating badges
│   │   └── Divider.tsx                [CREATED] Standard horizontal separator rule
│   └── layout/
│       ├── Navbar.tsx                 [CREATED] Sticky header with search pill & user menu
│       └── Footer.tsx                 [CREATED] Multi-column Airbnb footer with currency/locale
├── features/
│   ├── listing/
│   │   ├── components/
│   │   │   ├── ListingHeader.tsx      [CREATED] Title with Share & Save heart action buttons
│   │   │   ├── PhotoBentoGrid.tsx     [CREATED] 5-photo bento grid + "Show all photos" button
│   │   │   └── PropertyOverview.tsx   [CREATED] Property type, specs, Guest Favorite, host snippet
│   │   └── types/
│   │       └── listing.types.ts       [CREATED] Type definitions for listing, photos, host, amenities
│   ├── booking/
│   │   ├── components/
│   │   │   └── StickyBookingWidget.tsx[CREATED] Pinned reservation card with dynamic price calculation
│   │   ├── hooks/
│   │   │   └── useBookingPricing.ts   [CREATED] Hook calculating nights, fees, taxes & grand total
│   │   └── types/
│   │       └── booking.types.ts       [CREATED] Type interfaces for dates, guests & price breakdown
│   ├── photo-tour/
│   │   └── components/
│   │       └── PhotoTourOverlay.tsx   [CREATED] Fullscreen gallery overlay with room filter tabs
│   ├── lightbox/
│   │   ├── components/
│   │   │   └── LightboxModal.tsx      [CREATED] Single-photo viewer with counter & arrow navigation
│   │   └── hooks/
│   │       └── useKeyboardNavigation.ts[CREATED] Hook listening for ArrowLeft, ArrowRight & Escape
│   └── reviews/
│       └── types/
│           └── review.types.ts        [CREATED] Type interfaces for reviews & category ratings
├── data/
│   └── mockListingData.ts             [CREATED] Full dataset for Terracotta Serene Candolim
├── hooks/
│   ├── useViewState.ts                [CREATED] Central state switcher ('listing' | 'photo-tour' | 'lightbox')
│   └── useScrollLock.ts               [CREATED] Body scroll lock when overlays/modals are active
├── lib/
│   ├── utils.ts                       [CREATED] Safe Tailwind class merging utility (`cn`)
│   ├── constants.ts                   [CREATED] Airbnb brand colors, fee rates, guest limits
│   └── formatters.ts                  [CREATED] Currency (INR), date range, and nights calculation
└── types/
    └── index.ts                       [CREATED] Central TypeScript barrel export
```

---

## 4. Detailed Breakdown: What was Changed, Why, and its Function

### A. Root Application & Configuration

#### 1. `src/app/layout.tsx`
* **What Changed**: Configured Next.js root layout with semantic HTML, Geist font variables, and real Airbnb metadata.
* **Why**: Provides proper document title (`"Terracotta Serene - 1BHK Candolim | Whirlpool/WiFi..."`), SEO tags, favicon, and baseline body styling.
* **Function**: Wraps the entire application, sets up font variables, and enforces `min-h-screen flex flex-col`.

#### 2. `src/app/page.tsx`
* **What Changed**: Set up the master view controller component without premature implementation of internal details.
* **Why**: Connects the 3 required views (`listing`, `photo-tour`, `lightbox`) via the `useViewState` hook and coordinates the desktop two-column grid.
* **Function**: Renders `Navbar`, `ListingHeader`, `PhotoBentoGrid`, `PropertyOverview`, `StickyBookingWidget`, and conditionally renders `PhotoTourOverlay` and `LightboxModal`.

#### 3. `src/app/api/listing/route.ts`
* **What Changed**: Added a Next.js App Router GET endpoint returning `MOCK_LISTING_DATA`.
* **Why**: Demonstrates clean client-server separation; frontend components or external tests can query `/api/listing` just like a real production REST API.
* **Function**: Returns JSON representation of the property listing with status 200.

---

### B. Core Utilities & Design Tokens (`src/lib/`)

#### 4. `src/lib/utils.ts`
* **What Changed**: Created `cn(...inputs)` utility leveraging `clsx` and `tailwind-merge`.
* **Why**: In component-driven UIs, combining conditional classes (e.g. active states) often produces duplicate or conflicting Tailwind utilities. `twMerge` eliminates conflicts reliably.
* **Function**: Exports `cn` for all components.

#### 5. `src/lib/constants.ts`
* **What Changed**: Defined `AIRBNB_BRAND`, `DEFAULT_FEES`, and `GUEST_LIMITS`.
* **Why**: Hardcoding hex values (`#FF385C`) or fee calculations throughout components creates maintenance debt. Centralizing ensures consistency with Airbnb's design system.
* **Function**: Provides read-only constants for colors, 14% service fee, ₹1,200 cleaning fee, and 4-guest capacity limit.

#### 6. `src/lib/formatters.ts`
* **What Changed**: Implemented `formatCurrency`, `formatDateRange`, and `calculateNights`.
* **Why**: Formats dynamic values consistently (e.g. ₹4,500 formatted using `Intl.NumberFormat('en-IN')`).
* **Function**: Converts raw numeric numbers and Date objects into human-readable strings.

---

### C. Domain Models & Mock Database (`src/data/` & `src/types/`)

#### 7. `src/features/listing/types/listing.types.ts` & `src/types/index.ts`
* **What Changed**: Created comprehensive TypeScript interfaces (`ListingDetail`, `ListingPhoto`, `HostInfo`, `AmenityItem`, `PropertyHighlight`).
* **Why**: Prevents runtime bugs by guaranteeing compile-time type safety across all components.
* **Function**: Defines the schema for listings, photos, rooms, host credentials, ratings, and policies.

#### 8. `src/features/booking/types/booking.types.ts`
* **What Changed**: Defined `DateRange`, `GuestCounts`, and `PricingBreakdown`.
* **Why**: Strongly types the reservation flow state and the dynamic cost calculator.
* **Function**: Ensures check-in/checkout dates, guest counts, and price items conform to exact schemas.

#### 9. `src/data/mockListingData.ts`
* **What Changed**: Created the complete typed dataset for *"Terracotta Serene - 1BHK Candolim | Whirlpool/WiFi"*.
* **Why**: The assignment requires a desktop clone of this specific listing. Having all specs, reviews, host credentials, and high-res categorized photos organized in one source of truth guarantees visual and functional fidelity.
* **Function**: Serves as the mock database for the entire app.

---

### D. Global State & Interaction Hooks (`src/hooks/`)

#### 10. `src/hooks/useViewState.ts`
* **What Changed**: Built a custom view manager hook handling `'listing' | 'photo-tour' | 'lightbox'`.
* **Why**: The assignment requires seamless navigation between 3 distinct screens:
  - Base listing page
  - Fullscreen photo tour overlay
  - Lightbox modal with active photo tracking
* **Function**: Maintains `activeView`, `activePhotoIndex`, and `activeRoomCategory`, exposing helper functions like `openPhotoTour()`, `openLightbox(index)`, `closeToPhotoTour()`, and `closeToListing()`.

#### 11. `src/hooks/useScrollLock.ts`
* **What Changed**: Built a hook that locks `document.body.style.overflow = 'hidden'`.
* **Why**: When fullscreen overlays (Photo Tour) or modals (Lightbox) are opened, background page scrolling must be prevented for production-level polish and accessibility.
* **Function**: Automatically locks scrolling on mount/activation and restores previous scroll behavior on unmount.

---

### E. Design System & Layout Components (`src/components/`)

#### 12. `src/components/ui/Button.tsx`
* **What Changed**: Created a reusable button with variants (`primary`, `secondary`, `outline`, `ghost`, `gradient`) and sizes (`sm`, `md`, `lg`).
* **Why**: Provides consistent button styling, hover states, and focus rings across the app.
* **Function**: Renders standard HTML button with merged Tailwind classes.

#### 13. `src/components/ui/Modal.tsx`
* **What Changed**: Created an accessible modal container with backdrop blur, centered card, and close button.
* **Why**: Used for "Show all 43 amenities", "Show all 28 reviews", and description modals.
* **Function**: Listens to open state, applies scroll lock, renders backdrop and dialog box.

#### 14. `src/components/ui/Badge.tsx` & `src/components/ui/Divider.tsx`
* **What Changed**: Created badge component for "Guest favourite", "Superhost", and ratings; created standard horizontal divider rule.
* **Why**: Standardizes micro-badges and section separation according to Airbnb UI guidelines.
* **Function**: Visual display components.

#### 15. `src/components/layout/Navbar.tsx`
* **What Changed**: Built the fixed top navigation bar.
* **Why**: Essential for Airbnb visual parity.
* **Function**: Displays Airbnb coral logo, compact center search pill (`"Anywhere | Any week | Add guests"`), and user profile dropdown pill.

#### 16. `src/components/layout/Footer.tsx`
* **What Changed**: Built multi-column footer with Support, Hosting, and Airbnb columns, plus copyright, language, and currency bar.
* **Why**: Completes the page structure matching the real Airbnb site.
* **Function**: Renders links, copyright, and locale triggers.

---

### F. Feature Components & Domain Hooks (`src/features/`)

#### 17. `src/features/listing/components/ListingHeader.tsx`
* **What Changed**: Created listing title and top action bar (`Share` and `Save` buttons).
* **Why**: Provides property heading and interactive buttons with clipboard copy feedback and heart toggle state.
* **Function**: Manages `isSaved` and `copied` states with interactive UI indicators.

#### 18. `src/features/listing/components/PhotoBentoGrid.tsx`
* **What Changed**: Built the 5-photo bento grid layout (1 large hero photo left, 2x2 grid right).
* **Why**: Central visual anchor of the Airbnb listing page. Includes the floating `"Show all photos"` button.
* **Function**: Renders photos with hover brightness transitions; clicking any photo opens the Lightbox; clicking the button opens the Photo Tour.

#### 19. `src/features/listing/components/PropertyOverview.tsx`
* **What Changed**: Built property type heading, capacity specs, Guest Favorite trophy card, and host snippet.
* **Why**: Displays core listing metadata and ratings summary.
* **Function**: Renders specs, rating score, review count, and host avatar.

#### 20. `src/features/booking/components/StickyBookingWidget.tsx`
* **What Changed**: Created the floating reservation card pinned with `sticky top-28`.
* **Why**: Key functional requirement of the take-home task.
* **Function**: Renders nightly price, interactive check-in/checkout dates, guest selector trigger, gradient Reserve button, and dynamic cost breakdown table.

#### 21. `src/features/booking/hooks/useBookingPricing.ts`
* **What Changed**: Built price calculation hook using `useMemo`.
* **Why**: Dynamically recalculates base rate, cleaning fee, 14% service fee, and total before taxes based on selected dates.
* **Function**: Returns `PricingBreakdown` object.

#### 22. `src/features/photo-tour/components/PhotoTourOverlay.tsx`
* **What Changed**: Created View 2 (Fullscreen Photo Tour) with room category filter tabs.
* **Why**: Required second view opened by `"Show all photos"`.
* **Function**: Fullscreen scrollable view with Back button (←), category filter carousel (`All`, `Living room`, `Bedroom`, etc.), and categorized photo tiles. Clicking any photo transitions to the Lightbox.

#### 23. `src/features/lightbox/components/LightboxModal.tsx`
* **What Changed**: Created View 3 (Lightbox viewer) with photo counter, room label, and navigation arrows.
* **Why**: Required third view providing single-photo focus with keyboard navigation.
* **Function**: Centers high-res photo against a 95% dark backdrop with prev/next buttons and photo counter (`3 / 25`).

#### 24. `src/features/lightbox/hooks/useKeyboardNavigation.ts`
* **What Changed**: Built keyboard listener hook for ArrowLeft (`←`), ArrowRight (`→`), and Escape (`Esc`).
* **Why**: Explicit requirement of the assignment for accessibility and behavioral parity.
* **Function**: Adds `keydown` event listener to `window` and calls appropriate navigation handlers.

---

## 5. Verification & Build Health

The project was verified using Next.js production build:
```bash
npm run build
```
**Result**:
- TypeScript type check: **Passed (0 errors)**
- Route compilation:
  - `○ /` (Static pre-rendered listing page)
  - `○ /_not-found` (Static 404 handler)
  - `○ /api/listing` (Static REST endpoint)
- Build time: **11.0s** with Turbopack

---

## 6. Airbnb Real Home Page Implementation (`/` Route)

Per user specifications and screenshots of the real `airbnb.co.in` home page, the root route (`/`) now renders the **exact Airbnb home page experience**, while the take-home task listing page is accessible at `/rooms/terracotta-serene-candolim` (or `/rooms/[id]`).

### Components Created for Home Page:
1. **`src/features/home/components/HomeHeader.tsx`**:
   - **Official Brand Assets**: Embeds the authentic Airbnb Bélo symbol and "airbnb" wordmark SVG (`fill-[#FF385C]`). Replaces emojis with official Airbnb 3D category illustration assets downloaded directly from the Airbnb CDN:
     - `All`: 3D Vintage glowing globe on stand (`/icons/categories/all.png`)
     - `Homes`: 3D Modern cabin with red door and tree (`/icons/categories/homes.png`)
     - `Experiences`: 3D Hot air balloon (`/icons/categories/experiences.png`)
     - `Services`: 3D Metallic concierge bell (`/icons/categories/services.png`)
     - `Compact Pill`: 3D Cabin icon beside "Anywhere"
   - **User Menu Parity**: Right navbar includes "Become a host" text, independent circular User Avatar button (`32x32 SVG circle`), and independent circular Hamburger button (`32x32 SVG lines`) matching screenshots.
   - **Deadband Hysteresis Endpoints**: Scroll down requires `> 30px` to collapse, and scroll up requires `<= 5px` to expand, preventing rapid oscillation or bouncing.
   - **Zero Animation on Initial Mount**: Set `initial={false}` and `duration: 0` on first load (`hasInteracted: false`). Renders statically at Endpoint 1 without mount flash or morphing until scrolled.
2. **`src/features/home/components/ListingCarousel.tsx`**:
   - **Horizontal Sliding Carousel**: Smooth horizontal scroll container controlled by `<` and `>` chevron buttons.
   - **Card Parity**: Displays high-res photos, "Guest favourite" badge, and interactive heart toggle with a scale-pop bounce animation. Clicking any card navigates to `/rooms/terracotta-serene-candolim`.
   - **"See all" Stacked Card**: Renders the exact 3-photo tilted fan-out card at the end of the South Goa carousel matching Screenshot 2.
3. **`src/features/home/components/DestinationCarousel.tsx`**:
   - Renders the "Destinations for you" carousel matching Screenshot 3 with rounded squircle city photos (Dubai, Bangkok, London, Paris, Rome, etc.) and taglines.
4. **`src/features/home/components/InspirationSection.tsx`**:
   - Multi-tab getaway inspiration section (`Popular`, `Arts & culture`, `Beach`, `Mountains`, `Outdoors`, `Things to do`) with a 6-column grid of destinations and a "Show more ∨" toggle matching Screenshot 3 & 4.
5. **`src/features/home/components/HomeFooter.tsx`**:
   - 3-column footer (`Support`, `Hosting`, `Airbnb`) + legal row with language (`English (IN)`), currency (`₹ INR`), and social icons (Facebook, X/Twitter, Instagram) matching Screenshot 4.
6. **`src/features/home/data/homeData.ts`**:
   - Strongly-typed dataset containing listings for South Goa, Noida, Pune, Destinations for You, and Inspiration tabs.

---

## 7. Verification & Build Health

The project was verified with:
```bash
npm run build
```
* **TypeScript Compilation**: Passed (0 errors)
* **Compiled Pages**:
  - `○ /` (Real Airbnb Home Page with scroll animations and carousels)
  - `◐ /rooms/[id]` (Listing Page with Bento Grid, Sticky Booking Widget, Photo Tour, Lightbox)
  - `○ /api/listing` (REST endpoint)
* **Build Time**: 2.2s with Next.js Turbopack

