# Consolidated Content Hub Dashboard

A production-grade, highly customizable, glassmorphic SaaS dashboard built using modern React and Next.js practices. The application consolidates real-time news headlines, TMDB movie recommendations, and community social feeds into a unified dashboard layout with drag-and-drop support.

## Key Features

1. **Personalized Feed**: Interleaves and normalizes articles, movies, and social posts. Boosts content matching user favorite categories.
2. **Interactive Drag-and-Drop**: Swaps card indexes within the feed using `react-dnd` and `framer-motion` layout animations. State persists in local storage.
3. **Real-time Synchronization**: Open Server-Sent Events (SSE) connections update community posts and notifications instantly.
4. **Theme Toggle**: Standard dark/light mode switching using CSS variables and `next-themes`.
5. **Localization**: English and Hindi dictionary lookups using `react-i18next`.
6. **Robust Fallbacks**: Operates out-of-the-box using mock datasets when API credentials are not supplied.

## Tech Stack

- **Framework**: Next.js 15+ (App Router), React 19+, TypeScript
- **Styling**: Tailwind CSS v4, Glassmorphism elements
- **State Management**: Redux Toolkit, Redux Persist (SSR-safe), RTK Query
- **Authentication**: NextAuth.js (Credentials, Google OAuth)
- **Validation**: React Hook Form, Zod
- **Testing**: Jest, React Testing Library, Playwright E2E

---

## Folder Structure

```
src/
├── app/                  # Route handlers and layout components
│   ├── (dashboard)/      # Protected dashboard page group
│   ├── api/              # API and Server-Sent Event routes
│   └── auth/             # Custom Signin pages
├── components/           # UI elements and form modules
│   ├── ui/               # Reusable buttons and inputs
│   ├── cards/            # News, Movie, Social, and DnD cards
│   ├── feed/             # UnifiedFeedList scroll container
│   ├── modals/           # QuickView details modal
│   └── dashboard/        # Sidebars, Navbars, and Settings
├── features/             # Feature-specific Redux state slices
├── services/             # Axios clients and adapter normalizers
├── hooks/                # Typed store selectors, debouncers, and SSE hooks
├── providers/            # AppProviders (Redux, Auth, DnD, and themes)
├── store/                # Redux store definition
└── types/                # Unified content and preference interfaces
```

---

## Setup & Installation

### 1. Pre-requisites
Ensure you have Node.js 18.x or above installed.

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory (based on `.env.example`):
```env
NEXT_PUBLIC_NEWS_API_KEY=your-news-api-key
NEXT_PUBLIC_TMDB_API_KEY=your-tmdb-api-key
NEXTAUTH_SECRET=a-secure-random-32-char-string
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
```

### 4. Running the Dev Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application. 
- *Test login credentials*: `admin@example.com` / `password`

---

## API Credentials Registration Guide

### NewsAPI Setup
1. Go to [https://newsapi.org](https://newsapi.org) and register for a free account.
2. Copy the generated API Key and assign it to `NEXT_PUBLIC_NEWS_API_KEY` in `.env`.

### TMDB Movie API Setup
1. Sign in to [https://www.themoviedb.org](https://www.themoviedb.org).
2. Navigate to your Account Settings -> API page.
3. Apply for an API key, copy the API key (v3 auth), and set it to `NEXT_PUBLIC_TMDB_API_KEY`.

### Google OAuth Configuration
1. Go to the [Google Cloud Console](https://console.cloud.google.com).
2. Create a new project. Navigate to APIs & Services -> Credentials.
3. Configure the OAuth Consent Screen and add a credential mapping for OAuth Client ID.
4. Set Authorized Redirect URIs to: `http://localhost:3000/api/auth/callback/google`.
5. Copy the Client ID and Client Secret, saving them to `.env`.

---

## Running Tests

### Unit Tests (Jest)
Run unit tests for slices, adapters, and normalizers:
```bash
npm run test
```

### E2E Integration Tests (Playwright)
Ensure the local dev server is running, then invoke Playwright:
```bash
npx playwright install chromium # If not already installed
npm run test:e2e
```
