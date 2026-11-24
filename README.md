# Car Dealers UI

React frontend for the [Car Dealers](../../back-end/car-dealers) Laravel API: manage **Manufacturers**,
**Dealers** and **Cars** (full CRUD) with **live filtering** by any combination of filters on the
"All cars" and "All dealers" pages.

## Stack

| Concern | Library |
|---|---|
| Build | Vite 8, React 19, TypeScript |
| Routing | React Router (lazy-loaded pages) |
| Server state | TanStack Query + ofetch |
| Forms | React Hook Form + zod |
| Styling | Tailwind CSS 4 |
| Lint | oxlint |

## Getting started

The backend must be running (Docker: `http://localhost:8080`, or `php artisan serve`: `http://127.0.0.1:8000`).

```bash
npm install
cp .env.example .env
npm run dev
```

Open <http://localhost:5173>.

| Script | Description |
|---|---|
| `npm run dev` | Dev server with HMR |
| `npm run build` | Type-check (`tsc -b`) + production build to `dist/` |
| `npm run preview` | Serve the production build |
| `npm run lint` | oxlint |

### Environment

| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `/api` | Base URL the browser calls |
| `VITE_API_PROXY_TARGET` | `http://localhost:8080` | Where the Vite dev proxy forwards `/api` |

In development the app calls `/api/*` and Vite proxies it to the backend, so there are no CORS issues.

## Features

### Live filtering

- **All cars:** search by model, fuel, size, color (chips), manufacturer, dealer (checkbox lists).
- **All dealers:** search by name, manufacturer, country, city (only cities of the selected countries),
  amount of cars and number of employees (min / max).
- Every change is applied immediately — no "Apply" button. Text and number inputs are debounced (300 ms).
- Values of one filter are combined with OR, different filters with AND (same as the API).
- Filters, sorting and page live in the URL (`/cars?fuel=electric&color=red`), so a filtered view can be
  shared or reloaded. Any filter change resets to page 1; "Reset" clears everything.
- While a new combination loads, the previous results stay on screen (dimmed) instead of flashing a spinner.

### CRUD

- Create / edit in a modal form, delete with a confirmation dialog — for all three entities.
- Client-side validation with zod; server 422 errors (e.g. duplicate manufacturer name) are shown under the field.
- Dealer **amount of cars** is read-only: the backend keeps it in sync with the dealer's cars.
- Delete dialogs warn about cascades (a dealer's cars; a manufacturer's dealers and cars).
- After any change all cached data is refetched, so counts (`cars_amount`, `dealers_count`) are always current.

## Project structure

Feature-based: each entity owns its API layer, types and UI; `shared/` holds what features reuse.

```
src/
├── app/                    App shell
│   ├── App.tsx             providers + router
│   ├── providers.tsx       TanStack Query client
│   ├── router.tsx          routes (lazy pages)
│   └── layout/             AppLayout (nav), NotFoundPage
├── features/
│   ├── cars/
│   │   ├── api/            cars.api.ts (HTTP), cars.queries.ts (query/mutation hooks)
│   │   ├── model/          types.ts (entity, enums, filters), filters.ts (URL ⇄ filters)
│   │   ├── components/     CarFilters, CarsTable, CarForm, ColorDot
│   │   └── pages/          CarsPage
│   ├── dealers/            same layout
│   └── manufacturers/      same layout
└── shared/
    ├── api/                client.ts (ofetch + ApiError), types.ts (Paginated, Resource…)
    ├── config/             env.ts
    ├── lib/                useUrlFilters, query-string (Laravel `key[]=` arrays), form-errors, plural, cx
    └── ui/                 Button, Modal, ConfirmDialog, form (Field/Input/Select),
                            filters (CheckboxList, ChipGroup, RangeFilter, DebouncedInput), table, PageHeader, QueryState
```

Data flow: page → `useUrlFilters` (state in URL) → `useCars(filters)` (TanStack Query) →
`carsApi.list` → `api()` (ofetch, errors normalized to `ApiError`) → Laravel.
