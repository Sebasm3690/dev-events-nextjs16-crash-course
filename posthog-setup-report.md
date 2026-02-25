<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your **DevEvent** Next.js 16 App Router project. Here's a summary of all changes made:

- **`instrumentation-client.ts`** *(new)* — Client-side PostHog initialization using the Next.js 15.3+ instrumentation file convention. Initializes PostHog with a reverse proxy (`/ingest`), automatic exception capture, and development debug mode. Environment variables are used for the API key and host.
- **`next.config.ts`** *(updated)* — Added PostHog reverse proxy rewrites (`/ingest` → `https://us.i.posthog.com`) and `skipTrailingSlashRedirect: true` to ensure events are not blocked by ad blockers and trailing-slash requests work correctly.
- **`app/components/ExploreBtn.tsx`** *(updated)* — Added `posthog.capture('explore_events_clicked')` inside the existing `onClick` handler.
- **`app/components/EventCard.tsx`** *(updated)* — Added `'use client'` directive and `posthog.capture('event_card_clicked')` with event metadata (title, slug, location, date) on the card link click.
- **`app/components/Navbar.tsx`** *(updated)* — Added `'use client'` directive and `posthog.capture('navbar_link_clicked')` with link label and href on each navigation link.
- **`.env.local`** *(updated)* — `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` set and covered by `.gitignore`.

## Events instrumented

| Event Name | Description | File |
|---|---|---|
| `explore_events_clicked` | User clicked the "Explore Events" CTA button on the homepage — top of the conversion funnel | `app/components/ExploreBtn.tsx` |
| `event_card_clicked` | User clicked on an event card to view details (properties: `event_title`, `event_slug`, `event_location`, `event_date`) | `app/components/EventCard.tsx` |
| `navbar_link_clicked` | User clicked a navigation link in the navbar (properties: `link_label`, `link_href`) | `app/components/Navbar.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- 📊 **Dashboard — Analytics basics**: https://us.posthog.com/project/322973/dashboard/1305966
- 🔽 **Event Exploration Funnel** (Explore Events → Event Card click conversion): https://us.posthog.com/project/322973/insights/j6ZztIpb
- 📈 **Daily Event Engagement Trend** (daily volume of explore & card click events): https://us.posthog.com/project/322973/insights/QCfRK4YB
- 🏆 **Most Clicked Events** (which event cards get the most clicks, by title): https://us.posthog.com/project/322973/insights/9RaQPoui
- 🧭 **Navbar Navigation Clicks** (which nav links users click most, by label): https://us.posthog.com/project/322973/insights/6Oll6BFj
- 👤 **Unique Active Users** (daily active users engaging with the platform): https://us.posthog.com/project/322973/insights/n9St9fwN

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
