# Airbnb Clone — AI Engineering & Prompt Execution Logs

> A comprehensive log of technical prompts and implementation workflows used to engineer, structure, review, test, and deploy the Airbnb Full-Stack Clone using **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **Turbopack**.

---

## Architecture & Prompt Engineering Methodology

Every prompt in this log follows a structured engineering pattern:
1. **Context & Tech Stack Constraints**: Defining framework versions, styling rules, and architectural boundaries.
2. **Layered Separation of Concerns**: Enforcing decoupled boundaries where **Routers** handle routing and request parsing, **Controllers** execute business logic, and **Services** manage data fetching/state.
3. **Behavioral & Animation Endpoints**: Explicitly specifying state machines, scroll bounds, animation triggers, and transition lifecycles.
4. **Defensive Programming & Resiliency**: Type safety (`strict: true`), error boundaries, and asset fallbacks (`onError`).
5. **Code Review & Auditing**: Utilizing Claude Code skills (`code-reviewer`, `simplify`) and automated PR auditing (`CodeRabbit`).

---

## Table of Contents
- [Phase 1: PRD, Architecture & Layered System Design](#phase-1-prd-architecture--layered-system-design)
- [Phase 2: Domain Schema & Strict TypeScript Modeling](#phase-2-domain-schema--strict-typescript-modeling)
- [Phase 3: Dynamic Morphing Header Navigation](#phase-3-dynamic-morphing-header-navigation)
- [Phase 4: Responsive Bento Photo Grid & Hover States](#phase-4-responsive-bento-photo-grid--hover-states)
- [Phase 5: Categorized Photo Tour Modal & History API Deep Linking](#phase-5-categorized-photo-tour-modal--history-api-deep-linking)
- [Phase 6: Two-Column Listing Layout & Interactive Calendar](#phase-6-two-column-listing-layout--interactive-calendar)
- [Phase 7: Floating Sticky Reservation Widget with Dynamic Pricing](#phase-7-floating-sticky-reservation-widget-with-dynamic-pricing)
- [Phase 8: Scroll-Bound Animated SubNavbar with Entry/Exit Bounds](#phase-8-scroll-bound-animated-subnavbar-with-entryexit-bounds)
- [Phase 9: Reviews Breakdown & Co-Host Resilient Fallback Grid](#phase-9-reviews-breakdown--co-host-resilient-fallback-grid)
- [Phase 10: "More Stays Nearby" Paginated Carousel](#phase-10-more-stays-nearby-paginated-carousel)
- [Phase 11: Route Interaction Bug Triage (Bento Grid to Photo Tour)](#phase-11-route-interaction-bug-triage-bento-grid-to-photo-tour)
- [Phase 12: Code Quality Auditing (`simplify`, `code-reviewer`, `CodeRabbit`)](#phase-12-code-quality-auditing-simplify-code-reviewer-coderabit)
- [Phase 13: Pre-Push Security Scan & Turbopack CI/CD Deployment](#phase-13-pre-push-security-scan--turbopack-cicd-deployment)

---

### Phase 1: PRD, Architecture & Layered System Design

#### Prompt 1.1: Reverse-Engineering PRD & Architectural Boundaries
```markdown
You are a Principal Software Architect specializing in Next.js App Router and high-fidelity consumer web applications. 

Review the attached Airbnb room listing screenshots and reverse-engineer a detailed Product Requirements Document (PRD) and Technical Specification.

### Technical Requirements:
1. Tech Stack: Next.js 16 (App Router), TypeScript (strict mode), Tailwind CSS v4, Lucide React, Framer Motion.
2. Architecture Boundaries:
   - Enforce a strict 3-tier layered architecture:
     * Routers (`app/`): Handle route parameters, metadata, and page entry points only.
     * Controllers/Hooks (`hooks/`, `features/*/controllers`): Handle user interaction state, modal lifecycle, and business logic.
     * Services/Data (`data/`, `services/`): Pure data normalization, query logic, and mock repositories.
3. Feature Scope:
   - Dynamic morphing navigation header.
   - 5-photo bento grid leading to a full-screen categorized photo tour modal.
   - Two-column responsive layout (62.5% content / 37.5% sticky widget).
   - Dual-month interactive booking calendar with night-count calculation.
   - Floating sticky reservation card bounded strictly to the listing details section.
   - Slide-in sub-navigation bar with scroll-boundary triggers.
   - Reviews, host verification, co-hosts grid, and nearby stays carousel.

Output the architectural file tree, state machine diagrams, and component hierarchy before writing code.
```
* **Implementation Flow**: Generates `PRD.md`, directory scaffolding (`src/features/*`, `src/hooks`, `src/data`), and sets up Next.js configuration.

---

### Phase 2: Domain Schema & Strict TypeScript Modeling

#### Prompt 2.1: Domain Modeling & Normalized Data Schema
```markdown
Define strict TypeScript interfaces and normalized mock datasets for an Airbnb room listing in `src/types/` and `src/data/mockListingData.ts`.

### Constraints & Types Required:
1. `ListingPhoto`: `id: string`, `url: string`, `alt: string`, `category: 'hero' | 'living' | 'bedroom' | 'bathroom' | 'kitchen' | 'exterior' | 'amenities'`, `roomLabel: string`, `caption: string`.
2. `PhotoTourSectionData`: `id: string`, `title: string`, `amenities: string[]`, `thumbnailUrl: string`, `photos: PhotoTourPhoto[]`.
3. `ListingDetail`: Capacity parameters (`guests`, `bedrooms`, `beds`, `bathrooms`), rating breakdowns (cleanliness, accuracy, communication, location, check-in, value), host object, policies, and pricing rules (`basePricePerNight: 4349`, currency: `'INR'`).
4. `ViewState`: Discriminated union for modal navigation: `activeView: 'listing' | 'photo-tour' | 'lightbox'`, `activePhotoIndex: number`, `activeRoomCategory: string`.
5. Prohibit any usage of `any`. Ensure all props and data exports are strictly typed and immutable (`readonly` where applicable).
```
* **Implementation Flow**: Creates type contracts in `src/types/index.ts` and `src/features/photo-tour/data/photoTourData.ts` with 43 categorized room photos.

---

### Phase 3: Dynamic Morphing Header Navigation

#### Prompt 3.1: Header Morphing with Scroll Listeners
```markdown
Build the `HomeHeader` component in `src/features/home/components/HomeHeader.tsx` supporting two distinct display modes: `'home'` and `'rooms'`.

### Technical Specifications:
1. Layout: Max-width container (`isRoomsMode ? 'max-w-7xl px-4 sm:px-8' : 'max-w-[1760px]'`) to ensure perfect vertical and horizontal alignment with the main listing content.
2. Behavior:
   - When in `'rooms'` mode: Render the compact search pill vertically centered at exact 15px top/bottom padding with three distinct segmented sections: "Anywhere" | "Anytime" | "Add guests" + circular red search icon button (`#FF385C`).
   - Vertically align the Airbnb logo on the left (`text-[#FF385C] font-bold text-[20px]`) and the user menu controls ("Become a host", Globe currency button, Profile avatar dropdown) on the right.
3. Mobile View: Collapse into a floating mobile search bar with subtle box-shadow (`shadow-sm`) and border radius `rounded-full`.
```
* **Implementation Flow**: Creates `HomeHeader.tsx`, verifies responsive breakpoints, and checks alignment using headless screenshots.

---

### Phase 4: Responsive Bento Photo Grid & Hover States

#### Prompt 4.1: Bento Grid Layout with Proportional Sizing
```markdown
Implement the 5-photo bento grid in `src/features/listing/components/PhotoBentoGrid.tsx` matching Airbnb's desktop and mobile presentation.

### Technical Specifications:
1. Grid Structure:
   - Outer container: `grid grid-cols-1 md:grid-cols-4 gap-2 rounded-2xl overflow-hidden`.
   - Height scaling: `h-[340px] sm:h-[420px] md:h-[460px] lg:h-[480px]`.
   - Hero Photo (Photo 0): Occupies left 2 columns, full height (`md:col-span-2 h-full`).
   - Secondary Photos (Photos 1–4): Right 2 columns rendered in a nested 2x2 grid (`col-span-2 grid-cols-2 grid-rows-2 gap-2 h-full`).
2. Visual Micro-interactions:
   - Apply `group-hover:brightness-95 transition-all duration-300` on each photo.
3. Action Button:
   - Overlay a floating "Show all photos" button on the bottom-right of the 5th photo with a 3x3 grid SVG icon, `bg-white hover:bg-[#F7F7F7] border border-[#222222] rounded-lg px-3 py-1.5 text-[13px] font-medium shadow-xs`.
```
* **Implementation Flow**: Builds `PhotoBentoGrid.tsx` and mounts it inside `src/app/rooms/[id]/page.tsx`.

---

### Phase 5: Categorized Photo Tour Modal & History API Deep Linking

#### Prompt 5.1: Fullscreen Photo Tour with Browser History Synchronization
```markdown
Create the `PhotoTourOverlay` modal in `src/features/photo-tour/components/PhotoTourOverlay.tsx` and wire state management via `useViewState` hook in `src/hooks/useViewState.ts`.

### Technical Specifications:
1. Modal State & History Sync:
   - Opening the tour must execute `window.history.pushState({ modal: 'PHOTO_TOUR_SCROLLABLE' }, '', '?modal=PHOTO_TOUR_SCROLLABLE')`.
   - Listen to `popstate` events: clicking the browser back button must smoothly pop the overlay back to the `'listing'` view without reloading the page.
   - Pressing `Esc` or clicking the top-left `<` Chevron must invoke `closeToListing()`.
2. Categorized Overview Grid:
   - At the top of the tour, render a grid of room category cards (`PHOTO_TOUR_SECTIONS`: Living room 1, Living room 2, Bedroom, Full kitchen, Full bathroom, Pool, Exterior).
   - Clicking a category thumbnail must smoothly scroll the feed directly to that section (`element.scrollIntoView({ behavior: 'smooth' })`).
3. Photo Feed & Layout:
   - Left column: Sticky section heading with room title and amenity pills.
   - Right column: Room photos displayed in Airbnb's alternating wide and 2-column square card layouts.
```
* **Implementation Flow**: Constructs `useViewState.ts`, `useScrollLock.ts`, and `PhotoTourOverlay.tsx`.

---

### Phase 6: Two-Column Listing Layout & Interactive Calendar

#### Prompt 6.1: Two-Column Layout Ratio & 2-Month Calendar
```markdown
Configure the main listing body in `src/app/rooms/[id]/page.tsx` using a 12-column responsive layout ratio.

### Technical Specifications:
1. Layout Split:
   - Container: `grid grid-cols-1 lg:grid-cols-[7.5fr_4.5fr] gap-8 lg:gap-10 xl:gap-14 relative`.
   - Left column (62.5%): Listing title, badges ("Guest favourite", 5.0 rating, 9 reviews), host overview, property highlights, room sleeping arrangements, amenities list with modal, and the 2-month date picker calendar.
   - Right column (37.5%): Sticky reservation container.
2. Dual-Month Date Picker:
   - Display two consecutive months side-by-side (e.g., November 2026 and December 2026).
   - Manage `dateRange: { startDate: Date | null, endDate: Date | null }` state.
   - Support range selection: highlight selected days in black with rounded pill endpoints, and middle days with light grey background.
   - Compute dynamic night count: `Math.round((endDate - startDate) / (1000 * 60 * 60 * 24))`.
```
* **Implementation Flow**: Implements `PropertyOverview.tsx` and custom calendar logic with date range calculations.

---

### Phase 7: Floating Sticky Reservation Widget with Dynamic Pricing

#### Prompt 7.1: Floating Reservation Card with Boundary Lock
```markdown
Build the sticky floating reservation card in `src/features/listing/components/ReservationWidget.tsx`.

### Technical Specifications:
1. Sticky Floating Position:
   - Stick to the top on scroll: `sticky top-28 self-start`.
   - Strictly bound inside the 2-column layout container so it scrolls with the page and stops after the calendar section.
2. Visual Styling:
   - Border radius: `rounded-3xl` with `border border-[#dddddd]` and floating shadow: `shadow-[0_6px_20px_rgba(0,0,0,0.12)]`.
3. Pricing & Booking Block:
   - Incentive badge: "Take 10% off your next stay. Terms apply" with green tag icon and outline "Claim" button.
   - Dynamic total: Render formatted price `₹{basePrice * nights}` for the calculated night duration.
   - Input Box: 2x2 grid for Check-in, Checkout, and Guests selection.
   - Call to Action: Gradient button (`bg-gradient-to-r from-[#E61E4F] to-[#D70466]`) with text "Reserve", rounded corners (`rounded-xl`), and caption "You won't be charged yet".
```
* **Implementation Flow**: Integrates dynamic price calculation and mounts `ReservationWidget` inside the 4.5fr right column.

---

### Phase 8: Scroll-Bound Animated SubNavbar with Entry/Exit Bounds

#### Prompt 8.1: Slide-Down SubNavbar Triggered by Reservation Anchor
```markdown
Implement the floating `SubNavbar` in `src/features/listing/components/SubNavbar.tsx` and wire its scroll-boundary lifecycle in `src/app/rooms/[id]/page.tsx`.

### Technical Specifications:
1. Animation & Triggers:
   - The sub-navbar must slide down from the top (`translate-y-0 opacity-100`) via Framer Motion / CSS transitions.
   - Trigger Point: Must appear at the exact moment the sticky reservation card fixes its position on screen (`rect.top <= 100` of the main container).
   - Exit Point: Must remain visible down the page and fade out smoothly when scrolling back to the top hero section.
2. Content & Navigation:
   - Left side: Navigation tab buttons: "Photos", "Amenities", "Reviews", "Location" with smooth scroll triggers (`document.getElementById(id).scrollIntoView({ behavior: 'smooth' })`).
   - Right side: Mini reservation summary showing pricing per night, star rating, and a compact "Reserve" button that smoothly scrolls to the calendar.
   - Container padding: Ensure horizontal alignment matches `max-w-6xl px-4 sm:px-8` perfectly.
```
* **Implementation Flow**: Implements scroll observer hook, Framer Motion entry/exit transitions, and section scroll triggers.

---

### Phase 9: Reviews Breakdown & Co-Host Resilient Fallback Grid

#### Prompt 9.1: Host Card, Co-Hosts Grid & Defensive Image Fallbacks
```markdown
Implement the "Meet your host" and "Reviews" sections in `src/app/rooms/[id]/page.tsx` with defensive image loading fallbacks.

### Technical Specifications:
1. Host Overview Card:
   - Fixed card (`max-w-[332px] rounded-3xl border border-[#dddddd] shadow-md p-6`) with host avatar, Superhost verified badge, and 3-tier stat breakdown: 1,463 Reviews | 4.68 Rating | 2 Years hosting.
2. Co-Hosts Grid:
   - Render 8 co-hosts (Sharath, Aman Dev Pahwa, Maria Karen Priyanka, Simran, Pallavi, Sanyukta, Shruti, Amisha) in a responsive grid (`grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-6`).
   - Every co-host must render a rounded avatar (`w-8 h-8 rounded-full object-cover`).
3. Resilient Image Fallbacks:
   - Attach native `onError={(e) => { e.currentTarget.src = cohost.localFallback; }}` handlers on all avatar images, pointing to permanent local backup assets in `public/hosts/`.
   - Prevent broken image icons across all network conditions.
```
* **Implementation Flow**: Configures `CO_HOSTS` dataset with Unsplash URLs and local fallback paths in `public/hosts/`.

---

### Phase 10: "More Stays Nearby" Paginated Carousel

#### Prompt 10.1: Paginated Cards with Ultra-HD Interior Photography
```markdown
Implement the "More stays nearby" section at the bottom of `src/app/rooms/[id]/page.tsx`.

### Technical Specifications:
1. Interactive Pagination:
   - Header with title "More stays nearby", current page indicator (`1 / 2`), and Previous/Next circular arrow buttons.
   - Previous button disabled on page 1 (`opacity-30 cursor-not-allowed`); Next button disabled on page 2.
2. Stay Card Components:
   - 5-column grid (`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4`).
   - Photo container: `aspect-[4/3] rounded-2xl overflow-hidden` with `group-hover:scale-105 transition-transform duration-300`.
   - Floating heart save button on top right of each card with toggleable state (`isSaved ? 'fill-[#FF385C]' : 'fill-black/25 stroke-white'`).
   - Listing details: truncated title, formatted price (e.g., `₹23,600`), and star rating with star icon.
```
* **Implementation Flow**: Adds `NEARBY_STAYS_PAGE_1` and `NEARBY_STAYS_PAGE_2` datasets with high-definition interior photographs.

---

### Phase 11: Route Interaction Bug Triage (Bento Grid to Photo Tour)

#### Prompt 11.1: Diagnosing & Redirecting Photo Click Handlers
```markdown
### Bug Report:
When clicking on any photo in the 5-photo Bento Grid on the listing page (`/rooms/[id]`), the application currently launches the single-photo Lightbox modal directly instead of opening the full categorized Photo Tour.

### Triage & Resolution Instructions:
1. Inspect `src/features/listing/components/PhotoBentoGrid.tsx`:
   - Replace the `onClick={() => onOpenLightbox(idx)}` handlers on the hero photo and 2x2 grid photos.
   - Map each photo's `roomLabel` or `category` to its corresponding section ID (`living-room-1`, `living-room-2`, `bedroom`, `full-kitchen`, `full-bathroom`, `exterior`).
   - Trigger `onOpenPhotoTour(sectionId)` upon clicking any photo.
2. Update `src/features/photo-tour/components/PhotoTourOverlay.tsx`:
   - Accept `initialSection?: string` in `PhotoTourOverlayProps`.
   - Add a `useEffect` that auto-scrolls to `document.getElementById('section-' + initialSection)` smoothly when opened with a section target.
   - Keep "Show all photos" opening at the top overview grid (`initialSection: 'all'`).
```
* **Implementation Flow**: Updates `PhotoBentoGrid.tsx`, `PhotoTourOverlay.tsx`, and verifies via headless browser screenshot.

---

### Phase 12: Code Quality Auditing (`simplify`, `code-reviewer`, `CodeRabbit`)

#### Prompt 12.1: Code Review & Dead Code Elimination
```markdown
Run a comprehensive code quality and refactoring audit across the codebase using Claude Code skills: `code-reviewer` and `simplify`, in preparation for CodeRabbit PR analysis.

### Audit Directives:
1. Architectural Layering:
   - Verify strict separation: Ensure `app/` routes contain zero inline business logic, controllers handle interaction state, and services handle data queries.
2. Skill Execution — `code-reviewer`:
   - Scan for anti-patterns, memory leaks in scroll event listeners, missing passive event flags, and unnecessary re-renders.
3. Skill Execution — `simplify`:
   - Detect dead variables, unused icon imports, or duplicate Tailwind classes.
   - REQUIREMENT: Always prompt for manual developer confirmation before removing or modifying any code.
4. Type Safety Check:
   - Ensure all props, states, and event handlers are fully typed without any implicit `any` assertions.
```
* **Implementation Flow**: Audits components, removes redundant state listeners, and formats codebase cleanly.

---

### Phase 13: Pre-Push Security Scan & Turbopack CI/CD Deployment

#### Prompt 13.1: Pre-Push Security Audit & Vercel Production Build
```markdown
Execute pre-push security verification and compile the production build using Next.js Turbopack before pushing to GitHub for Vercel deployment.

### Tasks:
1. Security & Hygiene Check:
   - Scan codebase for exposed API keys, secret tokens, or hardcoded sensitive URLs.
   - Run `npm audit` to verify zero high or critical dependency vulnerabilities.
   - Check `.gitignore` to ensure environment files (`.env*.local`) and build artifacts (`.next/`) are untracked.
2. Build Verification:
   - Execute `npm run build` using Next.js Turbopack.
   - Verify zero TypeScript compiler errors and zero SSR hydration warnings.
3. Git Commit & Push:
   - Stage modified files with atomic commit message: `fix(photos): route bento grid photo clicks to open Photo Tour with section auto-scroll`.
   - Push to `origin/main` to trigger automated Vercel production deployment webhook.
```
* **Implementation Flow**: Runs `next build`, verifies exit code 0, commits changes, and pushes to GitHub `main` for instant Vercel deployment.

---

## Summary of Key Prompts & Output Artifacts

| Phase | Prompt Objective | Key Technical Files Modified / Created |
|---|---|---|
| **Phase 1** | PRD & Layered Architecture | `PRD.md`, `src/types/index.ts` |
| **Phase 2** | Domain Modeling & Types | `src/features/photo-tour/data/photoTourData.ts`, `src/data/mockListingData.ts` |
| **Phase 3** | Morphing Header | `src/features/home/components/HomeHeader.tsx` |
| **Phase 4** | 5-Photo Bento Grid | `src/features/listing/components/PhotoBentoGrid.tsx` |
| **Phase 5** | Photo Tour & History Sync | `src/features/photo-tour/components/PhotoTourOverlay.tsx`, `src/hooks/useViewState.ts` |
| **Phase 6** | Two-Column Grid & Calendar | `src/app/rooms/[id]/page.tsx`, `src/features/listing/components/PropertyOverview.tsx` |
| **Phase 7** | Sticky Reservation Widget | `src/features/listing/components/ReservationWidget.tsx` |
| **Phase 8** | Animated SubNavbar | `src/features/listing/components/SubNavbar.tsx` |
| **Phase 9** | Host & Co-Host Fallbacks | `src/app/rooms/[id]/page.tsx`, `public/hosts/*.jpg` |
| **Phase 10** | Paginated Nearby Stays | `src/app/rooms/[id]/page.tsx`, `public/stays/*.jpg` |
| **Phase 11** | Route Click Triage | `src/features/listing/components/PhotoBentoGrid.tsx`, `PhotoTourOverlay.tsx` |
| **Phase 12** | Claude Code Quality Audit | Codebase refactoring with `code-reviewer`, `simplify`, `CodeRabbit` |
| **Phase 13** | Pre-Push Security & Vercel Deploy | `npm run build`, GitHub `main` push, Vercel CI/CD pipeline |
