# RoofTrack - Architecture, Technologies & Bug Report

---

## 1. TECHNOLOGY STACK

### Core Framework
| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | 16.1.6 | React meta-framework (App Router) - handles routing, SSR, bundling |
| **React** | 19.2.3 | UI component library |
| **TypeScript** | 5.9.3 | Static typing for JavaScript |
| **Tailwind CSS** | 4.x | Utility-first CSS framework |

### Backend / Database
| Technology | Purpose |
|---|---|
| **Supabase** (`@supabase/supabase-js` + `@supabase/ssr`) | Backend-as-a-service: PostgreSQL database, authentication, real-time subscriptions. Used for auth (signup/login/session), and all CRUD operations on `leads`, `inspections`, `profiles`, and `companies` tables. |

### Maps & Geolocation
| Technology | Purpose |
|---|---|
| **@react-google-maps/api** | Google Maps integration for territory mapping, pin dropping, and lead visualization |
| **Google Geocoding API** | Converts street addresses to lat/lng coordinates when creating leads via form |

### Animation Libraries
| Technology | Purpose |
|---|---|
| **GSAP** (GreenSock) + ScrollTrigger | Powers the scroll-based animations on the landing page: HeroSpotlight text zoom, DashboardDeepDive 3D card fan-out, DataEngine floating nodes, FinalCTA magnetic button, and LiveMetrics counter animation |
| **Framer Motion / Motion** | Listed as dependency but not actively imported in any component currently |

### UI Component Libraries
| Technology | Purpose |
|---|---|
| **shadcn/ui** (via `components.json`) | Pre-built accessible UI components. Currently uses: `Button`, `Popover`, `Particles`, `FlickeringGrid`, `GridPattern`, `AnimatedBeam` |
| **Radix UI** | Headless UI primitives (underlying shadcn). Used for `Popover` and `Slot` |
| **class-variance-authority (cva)** | Variant-based className management for the Button component |
| **clsx** + **tailwind-merge** | Utility for conditionally merging Tailwind classes without conflicts |
| **Lucide React** | Icon library (listed as dependency) |

### Notifications
| Technology | Purpose |
|---|---|
| **react-hot-toast** | Toast notification system for success/error messages throughout the app |

### Other
| Technology | Purpose |
|---|---|
| **Sass** | Listed as dependency, used for `style.css` (minimal usage) |
| **tw-animate-css** | Tailwind animation utilities |
| **MagicUI** | Registry configured in `components.json` for animated UI components (Particles, etc.) |

---

## 2. HOW THE APP WORKS (Architecture)

### 2.1 Routing (Next.js App Router)

```
src/app/
├── page.tsx                              → Landing/marketing page (public)
├── layout.tsx                            → Root layout (Header + Footer + Toaster)
├── login/page.tsx                        → Login page
├── signup/page.tsx                       → Signup page
├── dashboard/
│   ├── page.tsx                          → Main dashboard hub
│   ├── leads/
│   │   ├── page.tsx                      → Leads dashboard (tabs: Canvassing, Leads, Inspections)
│   │   └── [id]/page.tsx                 → Individual lead detail/edit page
│   └── territoryManagement/page.tsx      → Full-screen territory map
```

### 2.2 Authentication Flow

1. **Middleware** (`middleware.ts`): Runs on every request. Creates a Supabase server client, checks for a valid session via `supabase.auth.getUser()`.
   - Protected routes (`/dashboard/*`, `/leads/*`): Redirects unauthenticated users to `/login?redirect=<path>`
   - Auth routes (`/login`, `/signup`): Redirects authenticated users to `/dashboard`

2. **Signup** (`signup/page.tsx`): Creates a Supabase auth user, then creates/finds a `company` row, then creates a `profile` row linking the user to the company.

3. **Login** (`login/page.tsx`): Uses `supabase.auth.signInWithPassword()`. Checks for a `redirectTo` query param after login.

4. **Session persistence**: Supabase SSR cookies handle session across requests. The Header component listens for `onAuthStateChange` events to reactively update the UI.

### 2.3 Supabase Client Architecture

There are **three** Supabase client files:

| File | Type | Used By |
|---|---|---|
| `src/lib/supabase/client.ts` | Browser client (`createBrowserClient`) | All `'use client'` components |
| `src/lib/supabase/server.ts` | Server client (`createServerClient`) | Server Components & Route Handlers |
| `src/lib/supabase.ts` | Re-export of browser client | Legacy backward-compat shim |
| `middleware.ts` | Inline server client | Middleware auth checks |

### 2.4 Database Schema (inferred from code)

**Tables:**
- `companies` — `id`, `name`
- `profiles` — `id` (= auth user id), `company_id`, `full_name`, `role`
- `leads` — `id`, `company_id`, `user_id`, `full_name`, `email`, `phone_number`, `address`, `status`, `latitude`, `longitude`, `notes`, `preferred_contact_method`, `date_added`, `date_last_contacted`
- `inspections` — `id`, `lead_id`, `company_id`, `user_id`, `scheduled_date`, `scheduled_time`, `status`, `notes`, `created_at`

**Relationships:**
- `profiles.company_id` → `companies.id`
- `leads.company_id` → `companies.id`
- `inspections.lead_id` → `leads.id`
- `inspections.company_id` → `companies.id`

### 2.5 Data Flow Example: Creating a Lead from the Map

1. User clicks on the Google Map → `handleMapClick` fires
2. A temporary marker is created with `id: temp-<timestamp>`
3. User selects a status from dropdown
4. If status is `inspection`, `damages`, or `follow up` → full lead form appears
5. User fills in details and clicks "Create Lead"
6. `handleCreateLead` → inserts into Supabase `leads` table with lat/lng from map click
7. Marker is updated with the real database ID
8. If status is `inspection`, user is prompted to schedule one → navigates to lead detail page

### 2.6 Landing Page Animation Pipeline

The landing page uses a layered animation approach:

1. **Fixed Particles Background** — Canvas-based particle system (MagicUI) fixed behind all content
2. **HeroSpotlight** — GSAP ScrollTrigger scales "ROOF" text from 1x to 50x as user scrolls through 300vh, with a background video using `mix-blend-mode: screen` to create a knockout text effect
3. **DashboardDeepDive** — GSAP ScrollTrigger pins the section and fans out three product screenshot cards in 3D (rotateY, rotateX, z-depth)
4. **StressSlider** — Pure React mouse-tracking before/after slider comparing a messy desk photo vs. the RoofTrack dashboard
5. **DataEngine** — GSAP floating nodes with mouse-follow parallax rotation, SVG data stream animations
6. **LiveMetrics** — GSAP ScrollTrigger-based counter animation (numbers count up when scrolled into view)
7. **FinalCTA** — GSAP magnetic button effect (button follows cursor)

---

## 3. BUG REPORT

### CRITICAL BUGS

#### BUG 1: Hardcoded API Keys Exposed in Source Code
**Files:** `middleware.ts:5`, `src/lib/supabase/client.ts:3-4`, `src/lib/supabase/server.ts:4-5`, `src/lib/geocoding.ts:3`, `src/components/territoryMap.tsx:58`

**Issue:** Supabase anon key and Google Maps API key are hardcoded as string literals directly in source code, committed to git. While the Supabase anon key is designed to be public (with RLS enforcing security), the Google Maps API key should use environment variables and be restricted to specific domains/APIs in the Google Cloud Console to prevent unauthorized usage and billing.

**Fix:** Move all keys to `.env.local` and use `process.env.NEXT_PUBLIC_*` exclusively. The fallback `??` pattern should only be used in development.

---

#### BUG 2: Login Page Reads Wrong Query Parameter
**File:** `src/app/login/page.tsx:29`

**Issue:** The middleware sets the redirect path as `?redirect=<path>` (line 32 of `middleware.ts`), but the login page reads `searchParams.get('redirectTo')`. These don't match, so the redirect after login from a protected route **never works** — the user always goes to `/dashboard` instead of where they were trying to go.

**Middleware sets:**
```ts
loginUrl.searchParams.set('redirect', pathname);  // key is 'redirect'
```

**Login reads:**
```ts
const redirectTo = searchParams.get('redirectTo') || '/dashboard';  // key is 'redirectTo'
```

**Fix:** Change one to match the other. Simplest fix: change the login page to `searchParams.get('redirect')`.

---

#### BUG 3: `home.tsx` Contains Invalid JSX After the Component
**File:** `src/app/home.tsx:86-129`

**Issue:** After the `Home` component's closing `}` on line 82, there's raw JSX (`<main>...</main>`) that is not inside any function or component. This is a syntax error that would crash the build if this file were ever imported.

**Fix:** Delete lines 86-129 (the orphaned JSX), or delete the entire `home.tsx` file since it's a dead/legacy file not imported anywhere.

---

#### BUG 4: `LeadList` Missing `displayName` (React Warning)
**File:** `src/components/leads/LeadList.tsx:7`

**Issue:** `LeadList` uses `forwardRef` but never sets a `displayName`. React will emit a warning in development: "Component definition is missing display name."

**Fix:** Add `LeadList.displayName = 'LeadList';` before the export.

---

### MODERATE BUGS

#### BUG 5: `useEffect` Missing Dependencies (React Rules of Hooks)
**File:** `src/app/dashboard/leads/[id]/page.tsx:177-180`

```tsx
useEffect(() => {
    fetchLead();
    fetchInspections();
}, [leadId]);
```

**Issue:** `fetchLead` and `fetchInspections` are not wrapped in `useCallback` and are not listed in the dependency array. While this works because `leadId` is the only meaningful trigger, React's exhaustive-deps rule will flag this. Additionally, `fetchLeadsAsMarkers` in `territoryMap.tsx:91` has the same pattern.

---

#### BUG 6: `DashboardDeepDive` Uses `useLayoutEffect` on Server
**File:** `src/components/DashboardDeepDive.tsx:14`

**Issue:** `useLayoutEffect` fires a React warning during SSR: "useLayoutEffect does nothing on the server." Although the `isClient` guard prevents execution, React still warns about its mere presence. Same issue in `DataEngine.tsx:13`, `FinalCTA.tsx:13`, and `LiveMetric.tsx:19`.

**Fix:** Use `useEffect` instead (the `isClient` check already prevents premature execution), or use a custom `useIsomorphicLayoutEffect` hook that uses `useEffect` on server and `useLayoutEffect` on client.

---

#### BUG 7: Footer Has Incomplete CSS Classes
**File:** `src/components/Footer.tsx:122,132`

```tsx
className="text-gray-800 hover:text- transition-colors"
```

**Issue:** `hover:text-` is an incomplete Tailwind class — it's missing the color value (e.g., `hover:text-gray-600`). This results in no hover color change on the GitHub and LinkedIn social icons.

---

#### BUG 8: `DashboardStats` Mutates `today` Date Object
**File:** `src/components/dashboard/DashboardStats.tsx:48-52`

```tsx
const today = new Date();
const dayOfWeek = today.getDay();
const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
const monday = new Date(today.setDate(diff));  // ← mutates 'today'
```

**Issue:** `today.setDate(diff)` mutates the `today` object in place. If `today` were used after this line, it would have the wrong value. Same pattern exists in `LeadsSummary.tsx:77-80`. While it currently works because `today` isn't reused, it's fragile.

**Fix:** Use `new Date(today)` to clone before mutating: `const monday = new Date(new Date(today).setDate(diff));`

---

#### BUG 9: `CanvassingTab` Uses `any` Type for Router
**File:** `src/app/dashboard/leads/page.tsx:50`

```tsx
function CanvassingTab({ router }: { router: any }) {
```

**Issue:** The router is typed as `any`. Should use `AppRouterInstance` from `next/navigation`, or better yet, call `useRouter()` inside `CanvassingTab` directly instead of passing it as a prop.

---

#### BUG 10: `TerritoryPeek` GSAP Ping Animation Leaks
**File:** `src/components/TerritoryPeek.tsx:51-57`

```tsx
gsap.to(".data-ping", {
    scale: 2,
    opacity: 0,
    duration: 0.6,
    repeat: -1,
    ease: "power2.out"
});
```

**Issue:** This infinite-repeat GSAP tween is created inside a `mousemove` handler, meaning a **new infinite animation is created on every mouse move**. This causes a massive animation leak that will degrade performance over time.

**Fix:** Create the animation once (outside the mousemove handler or with a flag to prevent re-creation).

---

### LOW-PRIORITY ISSUES

#### ISSUE 11: Dead / Unused Files
- `src/app/home.tsx` — Old landing page, not imported anywhere
- `src/app/style.css` — Minimal CSS, not imported
- `src/app/new` — Mystery file (678 bytes), not a valid source file
- `src/components/Button.tsx` — Custom Button component, superseded by `src/components/ui/button.tsx` (shadcn)
- `src/components/leads/LeadCard.tsx` — Empty file
- `src/components/FilterBar.tsx` — Empty file
- `src/components/SearchBar.tsx` — Empty file
- `src/types/prospect.ts` — Defines `Prospect` interface but never imported
- `src/types/tailwind.config.ts` — Misplaced file in types directory
- `lib/config/.env.local` — Duplicate env file outside src

#### ISSUE 12: Branding Inconsistency
Throughout the codebase, the product is referred to as both **"RoofTrack"** and **"RoofStack"** interchangeably:
- Login page title: "Sign in to **RoofStack**" (`login/page.tsx:44`)
- Landing page body: "**RoofStack** helps you organize..." (`page.tsx:81`)
- Footer copyright: "**RoofStack**. All rights reserved." (`Footer.tsx:115`)
- But the actual product name, logo, and metadata all say **"RoofTrack"**

#### ISSUE 13: Excessive `console.log` Statements Left in Production Code
**File:** `src/components/leads/LeadList.tsx:26,30,43,52,53`

Multiple debug `console.log` statements that should be removed before production.

#### ISSUE 14: `phoneNumber` is `number` Type in Lead Interface But `string` Everywhere Else
**File:** `src/types/Lead.ts:34`

The `Lead` interface defines `phoneNumber: number` but every component that handles phone numbers treats them as strings. The interface is also not used anywhere — components use `any` for lead data.

#### ISSUE 15: Signup Page Doesn't Store `phoneNumber`
**File:** `src/app/signup/page.tsx:57-64`

The signup form collects `phoneNumber` but the profile insert only sends `id`, `company_id`, `full_name`, and `role`. The phone number is silently discarded.

---

## 4. HOW IT ALL CONNECTS

```
┌─────────────────────────────────────────────────────┐
│                    BROWSER                          │
│                                                     │
│  ┌──────────┐   ┌──────────┐   ┌───────────────┐   │
│  │ Landing  │   │  Auth    │   │   Dashboard   │   │
│  │  Page    │   │ (Login/  │   │  (Protected)  │   │
│  │          │   │  Signup) │   │               │   │
│  │ - GSAP   │   │          │   │ ┌───────────┐ │   │
│  │ - Particles  │          │   │ │ LeadsList │ │   │
│  │ - Videos │   │          │   │ │ LeadForm  │ │   │
│  └────┬─────┘   └────┬─────┘   │ │ Calendar  │ │   │
│       │              │         │ │ Map       │ │   │
│       │              │         │ └───────────┘ │   │
│       │              │         └───────┬───────┘   │
│       │              │                 │           │
└───────┼──────────────┼─────────────────┼───────────┘
        │              │                 │
        ▼              ▼                 ▼
┌─────────────────────────────────────────────────────┐
│              NEXT.JS MIDDLEWARE                     │
│    (Auth check → redirect if needed)                │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│                  SUPABASE                           │
│                                                     │
│  ┌──────────┐  ┌──────────┐  ┌───────────────────┐ │
│  │   Auth   │  │ Database │  │   Row Level       │ │
│  │ (Users)  │  │ (Postgres│  │   Security (RLS)  │ │
│  │          │  │  Tables) │  │                   │ │
│  └──────────┘  └──────────┘  └───────────────────┘ │
│                                                     │
│  Tables: companies, profiles, leads, inspections    │
└─────────────────────────────────────────────────────┘
                       │
                       │ (Geocoding requests)
                       ▼
┌─────────────────────────────────────────────────────┐
│              GOOGLE CLOUD APIS                      │
│  - Maps JavaScript API (territory map rendering)    │
│  - Geocoding API (address → lat/lng conversion)     │
└─────────────────────────────────────────────────────┘
```

**Request lifecycle:**
1. User navigates to a route
2. Next.js middleware intercepts → checks Supabase session cookie
3. If protected route + no session → redirect to `/login`
4. If auth route + valid session → redirect to `/dashboard`
5. Page component renders → client-side Supabase calls fetch data
6. All data is scoped to `company_id` (multi-tenant)
7. Google Maps renders territory with lead markers
8. CRUD operations go directly from browser → Supabase (no API routes)
