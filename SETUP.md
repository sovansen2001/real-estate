# Connecting the frontend and backend — what changed & how to run it

## What's connected now (no auth required)

- **Property listings & search** — `buy.html` and `rent.html` now render real
  properties from `GET /api/v1/properties/search` instead of `data/properties.json`.
  All existing filter/sort/pagination UI keeps working unchanged (it filters
  client-side, same as before — it just filters real data now).
- **Property detail page** — `property-detail.html` fetches the specific
  property from `GET /api/v1/properties/:id`.
- **Enquiry form** (on the property detail page) — posts to `POST /api/v1/enquiries`.
- **Contact form** (`contact.html`) — posts to `POST /api/v1/contact`.

## What's still on mock data (by design, for now)

- `index.html`'s "Featured Properties" section is static hand-written HTML in
  the page itself (it never was data-driven, even with the mock JSON) — left
  as-is.
- Services, brokers directory (`find-broker.html`), tours (`tours.html`),
  homepage stats/categories — the backend doesn't expose public endpoints for
  these yet, so they still come from `data/properties.json`.
- Everything auth-gated — login/register, buyer/seller/broker/admin
  dashboards, "post a property", favourites, saved searches, 360° tours —
  is **blocked until your senior's auth middleware exists**. Those routes are
  literally commented out in the backend (`auth.middleware.js` doesn't exist
  yet), so there's nothing real to connect to yet. Once it lands, wiring
  those up is the natural next step.

## Files changed

**Backend**
- `src/app.js` — CORS now accepts a comma-separated list of allowed origins
  (`CLIENT_URL`) plus `file://` pages (`Origin: null`), since the static
  frontend has no single fixed dev-server port.
- `.env` / `.env.example` — `CLIENT_URL` updated to a comma-separated list of
  common local static-server ports.

**Frontend**
- `js/script.js` — added `API_BASE_URL`, an `apiFetch()` wrapper, a
  `mapBackendProperty()` translator (backend document → the flat shape the
  existing rendering code expects), and `window.RE360API` with
  `searchProperties`, `getPropertyById`, `submitContact`, `submitEnquiry`.
  `loadData()` now pulls properties from the API (falls back to the mock
  JSON if the API is unreachable).
- `property-detail.html` — fetches the specific property from the API on
  load; the enquiry form now really submits (and requires email, since the
  backend does).
- `contact.html` — the contact form now really submits.

## Running it locally

**1. Start MongoDB** (the backend needs `MONGO_URI` in `.env` to be reachable
— defaults to `mongodb://127.0.0.1:27017/real_estate`).

**2. Start the backend**
```bash
cd real-estate-backend
npm install
npm run dev
```
It runs on `http://localhost:5000` by default (see `.env`).

**3. Serve the frontend as static files** (don't just double-click the HTML
files — `fetch()` from `file://` pages is flaky in some browsers, and it's
cleaner to keep the CORS allow-list simple). Any static server works, e.g.:
```bash
cd frontend
npx serve -l 5500
# or: python3 -m http.server 5500
```
Then open `http://localhost:5500`. Because `CLIENT_URL` in the backend's
`.env` already includes `http://localhost:5500`, CORS will just work. If you
serve on a different port, add it to `CLIENT_URL` (comma-separated) and
restart the backend.

**4. There's no seed data yet.** With a fresh database, `buy.html`/`rent.html`
will correctly show "No properties found" — that's expected, not a bug.
Properties only appear once a seller creates them (blocked until auth
exists) or you insert some directly into MongoDB for testing.

## Config

If your backend runs somewhere other than `http://localhost:5000`, change
`API_BASE_URL` at the top of `frontend/js/script.js`.
