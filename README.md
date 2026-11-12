# Teein' It Up

Website and member portal for Teein' It Up, a private TrackMan iO studio in Southgate, MI.
Same stack as our other apps: React + Vite, Express, Firebase, Railway.

## What's here

- **Public site** — home, memberships, waiver, gift cards, FAQ. Copy lives in `src/content.js`.
- **Booking** (`/book`) — four-step flow (Tee → Fairway → Green → Hole) wrapped around
  TrackMan's booking calendar (yourgolfbooking.com), which handles payment and door/bay PINs.
- **Waiver** (`/waiver`) — full legal text (`src/waiverText.js`, verbatim from the old site) and signing form.
- **Member portal** (`/portal`) — hours left this cycle, visits, stats (driver carry, carry by club,
  scores), account.
- **Admin** (`/admin`) — add/edit members, log hours, search waivers. Access via `ADMIN_EMAILS`.

Stats show **sample data** until TrackMan API access is set up; plug it in at
`fetchTrackmanSessions` in `lib/stats.js`.

## Run locally

```bash
npm install
npm run build
DEV_AUTH=1 ADMIN_EMAILS=owner@teeinitup.net npm start   # http://localhost:3000
```

Preview mode signs in with any email (try `demo@teeinitup.net`, seeded as a Gold member;
`owner@teeinitup.net` for admin) and stores data in `data/`.

For live reload: `npm run dev` (Vite on :5173) alongside `npm start` (API on :3000).

## Deploy (Railway)

Set the variables in `.env.example` — at minimum `FIREBASE_SERVICE_ACCOUNT`,
`FIREBASE_WEB_CONFIG` and `ADMIN_EMAILS`. Don't set `DEV_AUTH` in production.
Health check: `/api/health`.
