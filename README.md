# EcoLog

A full-stack web application for tracking personal environmental impact and monitoring real-time air quality data around the world.

Built with Next.js 14, TypeScript, Prisma, and Zod — with full CRUD support and a 30-day CO2 impact chart.

---

## Features

- Search any city in the world and view real-time air quality data (AQI, PM2.5, PM10, NO2, Ozone)
- Save favourite cities to a personal dashboard with live AQI badges
- Log eco-friendly actions such as walking, cycling, plant-based meals, recycling, and more
- Track your CO2 savings over a 30-day chart, with zero-fill for days with no activity
- Full validation on every form and every API route using Zod

---

## Pages

| Route | Page | Description |
|---|---|---|
| `/` | Dashboard | Saved cities with live AQI data and summary stats |
| `/explore` | Explore | Search cities and view air quality before saving |
| `/log` | My Eco Log | Create, edit, and delete eco-actions |
| `/impact` | My Impact | 30-day CO2 savings chart |
| `/about` | About | Project information |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | SQLite |
| ORM | Prisma |
| Validation | Zod (frontend and backend) |
| Charts | Recharts |
| External API | Open-Meteo (free, no API key required) |

---

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm

### Installation

```bash
git clone https://github.com/Nawxtz/EcoLog.git
cd EcoLog
npm install
```

### Database Setup

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### Environment

Create a `.env` file in the project root:

```
DATABASE_URL="file:./dev.db"
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
ecolog/
├── app/
│   ├── layout.tsx                  Root layout (Header, Navbar, Footer)
│   ├── page.tsx                    Dashboard (server component)
│   ├── _components/
│   │   └── DashboardClient.tsx     Dashboard client interactions
│   ├── explore/
│   │   └── page.tsx                Explore page
│   ├── log/
│   │   └── page.tsx                Eco Log CRUD page
│   ├── impact/
│   │   └── page.tsx                Impact chart page
│   ├── about/
│   │   └── page.tsx                About page (static)
│   └── api/
│       ├── geocode/route.ts        City name search via Open-Meteo
│       ├── air-quality/route.ts    AQI data via Open-Meteo
│       ├── cities/
│       │   ├── route.ts            GET + POST saved cities
│       │   └── [id]/route.ts       DELETE saved city
│       └── actions/
│           ├── route.ts            GET + POST eco-actions
│           └── [id]/route.ts       PUT + DELETE eco-action
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── cities/
│   │   ├── CityCard.tsx
│   │   ├── CitySearchForm.tsx
│   │   └── AQIBadge.tsx
│   ├── actions/
│   │   ├── EcoActionForm.tsx
│   │   ├── EcoActionTable.tsx
│   │   └── EcoActionRow.tsx
│   └── impact/
│       └── ImpactChart.tsx
│
├── lib/
│   ├── prisma.ts                   Prisma client singleton
│   ├── co2Calculator.ts            CO2 factors and unit mapping
│   └── aqiHelpers.ts               AQI label and badge utilities
│
├── schemas/
│   ├── citySchema.ts               Zod schema for saved cities
│   └── actionSchema.ts             Zod schema for eco-actions
│
└── prisma/
    └── schema.prisma
```

---

## API Reference

### Cities

| Method | Endpoint | Description | Status Codes |
|---|---|---|---|
| GET | `/api/cities` | List all saved cities | 200, 500 |
| POST | `/api/cities` | Save a new city | 201, 400, 409, 500 |
| DELETE | `/api/cities/[id]` | Remove a saved city | 200, 400, 404, 500 |

### Eco Actions

| Method | Endpoint | Description | Status Codes |
|---|---|---|---|
| GET | `/api/actions` | List all eco-actions | 200, 500 |
| POST | `/api/actions` | Create a new eco-action | 201, 400, 500 |
| PUT | `/api/actions/[id]` | Update an eco-action | 200, 400, 404, 500 |
| DELETE | `/api/actions/[id]` | Delete an eco-action | 200, 400, 404, 500 |

### External

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/geocode` | Search city names via Open-Meteo Geocoding API |
| GET | `/api/air-quality` | Fetch real-time AQI data via Open-Meteo Air Quality API |

---

## CO2 Calculation

CO2 savings are calculated server-side based on action type and amount. Units are also derived server-side and are never accepted from the client.

| Action Type | Unit | CO2 Factor |
|---|---|---|
| Walking | km | 0.21 kg/km |
| Cycling | km | 0.21 kg/km |
| Public Transport | km | 0.089 kg/km |
| Plant-Based Meal | meal | 1.5 kg/meal |
| Recycling | kg | 0.5 kg/kg |
| Home Energy Saving | kWh | 0.233 kg/kWh |

---

## Database Schema

```
SavedCity
  id          Int       Primary key, autoincrement
  name        String
  country     String
  countryCode String    Two characters, e.g. "TH"
  latitude    Float
  longitude   Float
  createdAt   DateTime  Auto
  Unique constraint: (name, countryCode)

EcoAction
  id          Int       Primary key, autoincrement
  type        String    walking | cycling | public_transport | plant_based_meal | recycling | home_energy
  description String
  amount      Float
  unit        String    Derived server-side from type
  co2Saved    Float     Calculated server-side
  date        String    Format: YYYY-MM-DD
  createdAt   DateTime  Auto
  updatedAt   DateTime  Auto
```
