# DevEvent — Product Requirements Document

## 1. Overview
**Product Name:** DevEvent
**Description:** A web application that serves as a centralized hub for developers to discover, explore, and book tickets for tech events — hackathons, conferences, meetups, and more.
**Current Version:** 0.1.0 (early development)
**Repository:** `next-js-course` on GitHub (org: Sebasm3690)

## 2. Problem Statement
Developers often miss relevant tech events because information is scattered across multiple platforms (Eventbrite, Meetup, Luma, Twitter, etc.). DevEvent consolidates developer-focused events into a single, well-designed platform where users can browse, filter, and register for events.

## 3. Target Users
- **Primary:** Software developers looking for conferences, hackathons, and meetups.
- **Secondary:** Event organizers who want to create and promote tech events.

## 4. Tech Stack
- **Framework:** Next.js 16.1.6 (App Router)
- **Language:** TypeScript 5
- **UI:** React 19.2.3, Tailwind CSS 4, shadcn/ui (Radix UI), Lucide React icons
- **Animations:** GSAP, OGL (WebGL light-ray background effect)
- **Analytics:** PostHog (event tracking, error tracking, reverse-proxied via `/ingest`)
- **Fonts:** Schibsted Grotesk (body), Martian Mono (monospace accents)
- **Database:** TBD — currently on the `database-models` branch, indicating active work to move from hardcoded data to a persistent store.

## 5. Current State (as of v0.1.0)

### 5.1 Implemented
- **Homepage (`/`):** Hero section with gradient heading, subheading, "Explore Events" CTA button, and a "Featured Events" grid (3-column responsive layout).
- **Navbar:** Sticky glass-morphism header with logo, Home / Events / Create Event links.
- **EventCard component:** Displays event poster image, location, date, time, and title. Links to `/events/[slug]`.
- **LightRays component:** Full-screen WebGL animated light-ray background (OGL-based shader), mouse-following, configurable color/speed/spread.
- **PostHog analytics:** Initialized in `instrumentation-client.ts` (Next.js 15.3+ pattern). Tracks `event_card_clicked`, `explore_events_clicked`, and `navbar_link_clicked`.
- **Responsive design:** Mobile-friendly via Tailwind breakpoints.
- **Dark theme:** Dark background (`#030708`), light text, teal/green primary (`#59deca`).

### 5.2 Not Yet Implemented (inferred from CSS and route structure)
- **Event Detail Page (`/events/[slug]`):** CSS exists for `#event` with `.header`, `.details`, `.content`, `.banner`, `.agenda`, and `.booking` sections — but the page component does not exist yet.
- **Event Booking Form:** CSS exists for `#book-event` with form inputs and a submit button — not yet built.
- **Events Listing Page (`/events`):** The "Explore Events" button links to `/events`, but no page exists for that route.
- **Create Event Page:** Nav link exists but points to `/` as a placeholder.
- **Database Models:** The active branch `database-models` signals work-in-progress to replace the hardcoded `lib/constants.ts` events array with a real database.

## 6. Feature Requirements

### P0 — Must Have (MVP)

**F1 — Database-backed Events**
- Replace the static `lib/constants.ts` array with a database (e.g., PostgreSQL via Prisma, or a serverless DB like PlanetScale / Supabase).
- Event model fields (minimum): `id`, `title`, `slug`, `description`, `image`, `location`, `date`, `time`, `agenda` (list of items), `capacity`, `organizer`, `createdAt`, `updatedAt`.

**F2 — Event Detail Page (`/events/[slug]`)**
- Display full event details: banner image, title, date/time, location, description, agenda.
- Sidebar with booking/sign-up card.
- "pill" tags for event type (conference, hackathon, meetup, etc.).

**F3 — Events Listing Page (`/events`)**
- Display all events in a searchable, filterable grid.
- Filters: date range, location, event type.
- Pagination or infinite scroll.

**F4 — Event Booking / Registration**
- Booking form collecting user info (name, email at minimum).
- Store bookings in the database (Booking model: `id`, `eventId`, `name`, `email`, `createdAt`).
- Confirmation feedback upon successful registration.

### P1 — Should Have

**F5 — Create Event Page (`/events/create`)**
- Form for organizers to submit new events (title, description, date, time, location, image upload, agenda).
- Validation and error handling.

**F6 — Authentication**
- User sign-up / sign-in (e.g., NextAuth.js or Clerk).
- Protect the Create Event and Booking flows behind auth.

**F7 — Image Uploads**
- Allow organizers to upload event banner images (e.g., via Cloudinary, UploadThing, or S3).

### P2 — Nice to Have

**F8 — Search**
- Full-text search across event titles, descriptions, and locations.

**F9 — User Dashboard**
- View booked events, created events, and profile settings.

**F10 — Email Notifications**
- Confirmation email after booking.
- Reminder emails before the event.

**F11 — Social Sharing**
- Share event links to Twitter/LinkedIn/etc.

## 7. Non-Functional Requirements
- **Performance:** Leverage Next.js server components and static generation where possible. Target Lighthouse score ≥ 90.
- **SEO:** Dynamic `<meta>` tags per event page (Open Graph, Twitter cards).
- **Accessibility:** WCAG 2.1 AA compliance — keyboard navigation, ARIA labels, sufficient contrast.
- **Analytics:** Continue expanding PostHog event tracking to cover all user interactions (bookings, search, filters).
- **Security:** Sanitize all user inputs, use CSRF protection on forms, validate server-side.

## 8. Data Models (Proposed)

**Event**
`id` (UUID/PK), `title`, `slug` (unique), `description`, `image` (URL), `location`, `date` (DateTime), `time` (string), `eventType` (enum: conference | hackathon | meetup | workshop), `agenda` (JSON array), `capacity` (int), `organizerId` (FK → User), `createdAt`, `updatedAt`.

**User**
`id` (UUID/PK), `name`, `email` (unique), `passwordHash` (or OAuth), `role` (enum: user | organizer | admin), `createdAt`.

**Booking**
`id` (UUID/PK), `eventId` (FK → Event), `userId` (FK → User), `name`, `email`, `createdAt`.

## 9. Design Guidelines
- **Color Palette:** Dark background (`#030708`), primary teal (`#59deca`), blue accent (`#94eaff`), light text (`#e7f2ff`, `#bdbdbd`), dark cards (`#0d161a`, `#182830`).
- **Typography:** Schibsted Grotesk for headings/body, Martian Mono for code/monospace.
- **Effects:** Glass-morphism navbar, gradient text, card shadows (`0px 4px 40px #00000066`), WebGL light rays background.
- **Layout:** Container-based, responsive grid (1 / 2 / 3 columns), consistent spacing via Tailwind.

## 10. Success Metrics
- **Engagement:** Number of event detail page views, event card click-through rate (via PostHog).
- **Conversion:** Booking form completion rate.
- **Growth:** Number of events created, number of registered users.
- **Performance:** Core Web Vitals within "good" thresholds.
