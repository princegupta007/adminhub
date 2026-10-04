# AdminHub

> AdminHub is a responsive admin dashboard built with Next.js, TypeScript, and modern React tooling.

## 1. Project Status

### Currently implemented

- AdminHub dashboard (metrics, charts, system health)
- Users directory with filters and detail views
- Transactions list with payment summaries
- Bookings management with schedule and pricing
- Responsive desktop and mobile views
- Reusable component architecture
- React Query server-state management
- Redux client/UI state management
- Demo/guest login experience
- DummyJSON-backed demo data mapping
- Comprehensive error/loading/empty states
- Production build configuration

### Not yet implemented

- Real authentication
- Authorization
- Persistent backend/database
- Production API integration
- Comprehensive automated testing

## 2. Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Redux Toolkit
- TanStack React Query v5
- Radix UI Primitives
- Recharts
- lucide-react
- ESLint 9
- Prettier
- Husky

## 3. Project Structure

```text
src/
├── app/                  # Next.js App Router pages (dashboard, users, login, etc.)
├── components/
│   ├── common/           # Shared generic UI (DataTable, Pagination, Cards...)
│   ├── layout/           # Global layouts (AppShell, Sidebar, Topbar)
│   └── ui/               # Radix-based primitives (Button, Input, Select...)
├── features/             # Domain-specific modules (auth, users, transactions, bookings, dashboard)
├── lib/                  # Utilities, constants, and React Query configurations
├── services/             # API client and DummyJSON integration layer
└── store/                # Redux store and UI/Table state slices
```

The application relies on a strict feature-oriented data architecture:

```text
Component
   ↓
Feature Hook
   ↓
Feature API
   ↓
API Client
   ↓
Data Source
```

## 4. Local Development

### Prerequisites

- Node.js (v20+ recommended)
- npm (v10+ recommended)

### Installation

Clone the repository and install the dependencies:

```bash
npm install
```

### Environment

Copy the example environment file to create your local environment:

```bash
cp .env.example .env.local
```

### Environment Variables

| Variable                   | Required | Purpose             | Example                 |
| -------------------------- | -------- | ------------------- | ----------------------- |
| `NEXT_PUBLIC_API_BASE_URL` | Yes      | API/data source URL | `https://dummyjson.com` |

_Note: `.env.local` should not be committed to version control. Secrets must not be placed in source code. `NEXT_PUBLIC_*` variables are exposed to the browser._

## 5. Available Scripts

The following scripts are available via `npm run`:

```text
npm run dev            Start the development server
npm run build          Create an optimized production build
npm run start          Start the production server
npm run lint           Run ESLint checks
npm run typecheck      Run TypeScript validation
npm run format         Format source files using Prettier
npm run format:check   Verify code formatting
```

## 6. Husky / Pre-commit

This project uses Husky to maintain code quality. Before every commit, the following automated workflow runs:

```text
git commit
   ↓
format:check
   ↓
lint
   ↓
typecheck
```

Husky prevents commits if any of the configured checks fail.

## 7. Demo Login & DummyJSON Limitation

The current login experience (`/login`) provides demo/guest access for exploring the dashboard. **Production authentication and authorization are not yet implemented.**

The dashboard currently utilizes [DummyJSON](https://dummyjson.com) mapped through the application's service abstraction layer. This is intended solely for demonstration and frontend development purposes; it is **not** a persistent production backend.

## 8. Vercel Deployment

AdminHub can be deployed using Vercel's standard Next.js deployment flow. No custom `vercel.json` configuration is required.

1. Connect the repository to Vercel.
2. Ensure the framework preset is set to **Next.js**.
3. Configure the environment variables (see below).
4. Deploy.

### Vercel Environment Variables

- **Local**: Managed via `.env.local`.
- **Vercel Preview / Production**: For this demo phase, set `NEXT_PUBLIC_API_BASE_URL` to `https://dummyjson.com` in your Vercel project settings.

## 9. Production Build

You can verify the production build locally by running:

```bash
npm run build
npm run start
```

_Note: A successful build indicates frontend readiness, but does not imply that backend authentication or persistent storage has been implemented._

## 10. Current Limitations

- Demo/guest authentication only
- No real authorization
- No persistent application database
- DummyJSON is the current data source
- Automated test coverage is not yet implemented

---

License: Assignment project — for evaluation purposes.
