# CLAUDE.md — AI Engineering Guide & Architectural Standards

Welcome to the **Airbnb Full-Stack Clone** repository. This document defines the engineering standards, architecture constraints, quality assurance workflows, and Claude Code skills used across the project.

---

## 1. Project Overview & Tech Stack
* **Framework**: Next.js 16 (App Router)
* **Language**: TypeScript (strict mode enabled, zero implicit `any`)
* **Styling**: Tailwind CSS v4 (Mobile-first, responsive layouts)
* **Icons & Animation**: Lucide React, Framer Motion
* **Build System**: Next.js Turbopack compiler (`next build`)
* **Deployment**: Vercel CI/CD via GitHub webhooks

---

## 2. Strict Layered Architecture (Separation of Concerns)

Every feature in the application strictly follows a decoupled 3-tier boundary:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. ROUTERS (`src/app/`)                                     │
│    - Page entry points, dynamic params (`[id]`), metadata.  │
│    - ZERO inline business logic or heavy computations.       │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│ 2. CONTROLLERS & HOOKS (`src/hooks/`, `src/features/*/`)    │
│    - State machines (`useViewState` for modal tiers).       │
│    - Scroll boundary triggers & animation controllers.      │
│    - User interaction handling & event orchestration.        │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│ 3. SERVICES & DATA (`src/data/`, `src/types/`)              │
│    - Normalized listing data repositories.                  │
│    - Type definitions (`ListingDetail`, `PhotoTourPhoto`).   │
│    - Date calculation & pricing math utilities.             │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Claude Code Skills & Quality Rules

### `code-reviewer`
* Automatically audits modified files for anti-patterns, missing passive event listeners, memory leaks, and accessibility violations.
* Validates responsive breakpoints across mobile (`<640px`), tablet (`640px-1024px`), and desktop (`>1024px`).

### `simplify`
* Scans for redundant logic, unused imports, duplicate Tailwind utilities, and dead code.
* **MANDATORY POLICY**: Always prompt the developer for manual confirmation before deleting or altering existing code.

### `CodeRabbit` (Automated PR Reviews)
* Run automated second-opinion pull request reviews prior to merging into `main`.
* Checks for security vulnerabilities, exposed API keys, and edge cases in modal navigation.

---

## 4. Key Engineering Standards & UX Lifecycles

### A. Modal State Machine & History API Deep Linking
* View transitions strictly follow: `listing` $\leftrightarrow$ `photo-tour` $\leftrightarrow$ `lightbox`.
* Opening the Photo Tour executes `window.history.pushState({ modal: 'PHOTO_TOUR_SCROLLABLE' }, '', '?modal=PHOTO_TOUR_SCROLLABLE')`.
* Listening to `popstate` allows the browser back button to dismiss overlays cleanly back to the listing view without page reloads.

### B. Scroll-Triggered SubNavbar
* Must slide down with top-to-bottom entry transition (`translate-y-0 opacity-100`) at the exact point the sticky reservation card anchors (`rect.top <= 100`).
* Must smoothly unmount and fade out when scrolling back above the listing hero section.

### C. Defensive Asset Resiliency
* All profile avatars and listing photos must provide dual-layer fallbacks using native `onError` handlers:
  ```tsx
  <img
    src={cohost.avatarUrl}
    onError={(e) => { e.currentTarget.src = cohost.localFallback; }}
    alt={cohost.name}
    className="w-8 h-8 rounded-full object-cover"
  />
  ```

---

## 5. Development & Testing Commands

```bash
# Start local development server (Turbopack)
npm run dev

# Run strict production build and type checking
npm run build

# Run linting checks
npm run lint

# Headless visual verification (take snapshot of running server)
node -e "const { execSync } = require('child_process'); execSync('/Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome --headless --screenshot=screenshot.png http://localhost:3000/rooms/1');"
```

---

## 6. Pre-Push Security Checklist
1. `npm run build` exits with code 0.
2. Zero exposed tokens, API secrets, or `.env` files tracked in git.
3. No broken image links or unhandled async exceptions.
