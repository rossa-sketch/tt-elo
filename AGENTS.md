# AGENTS.md

This document describes the project for developers and AI agents working on this codebase.

## Project Overview

TopSpin Elo is a full-stack table tennis leaderboard and rating tracker built with TanStack Start and Netlify Database. It implements a Rocket League inspired competitive ranking system where:
- Elo rating adjustments scale based on the difference between competitors' ranks.
- A win against a higher-ranked player awards a large upset rating bonus.
- A loss against a lower-ranked player inflicts a severe rating deduction.
- The leaderboard is public for anyone to view and simulate matches, while mutations (adding players, recording matches, reverting games) require admin authentication.

### Tech Stack

| Layer         | Technology                                          |
| ------------- | --------------------------------------------------- |
| Framework     | TanStack Start (React 19, TanStack Router)          |
| Database      | Netlify Database (managed Postgres) via Drizzle ORM |
| Migrations    | `drizzle-kit@beta` in `netlify/database/migrations` |
| Styling       | Tailwind CSS 4 with dark theme in `src/styles.css`  |
| UI Components | Radix UI + shadcn/ui primitives                     |
| Toasts        | sonner                                              |
| Icons         | lucide-react                                        |
| Testing       | vitest                                              |

## Directory Structure & Key Files

```
├── db/
│   ├── index.ts               # Initializes Drizzle ORM with drizzle-orm/netlify-db adapter
│   └── schema.ts              # Database schema definitions (players, matches, app_settings)
├── netlify/
│   └── database/migrations/   # SQL migration files generated via drizzle-kit
├── src/
│   ├── components/
│   │   ├── AdminBar.tsx       # Top bar showing visitor vs admin status with action buttons
│   │   ├── AdminLoginDialog.tsx # Modal for entering the admin passcode
│   │   ├── AdminSettingsDialog.tsx # Settings for changing passcode or resetting seed data
│   │   ├── AddPlayerDialog.tsx # Form to register a player with an initial rating
│   │   ├── RecordMatchDialog.tsx # Form to select competitors, pick winner, and update ratings
│   │   ├── EditPlayerDialog.tsx # Form to update player name or remove player
│   │   ├── LeaderboardTable.tsx # Searchable, sortable leaderboard with tier badges & stats
│   │   ├── MatchHistoryView.tsx # Chronological match feed with Elo point swings and revert action
│   │   ├── MatchPredictor.tsx # Interactive calculator comparing win odds and prospective Elo deltas
│   │   ├── PlayerProfileModal.tsx # Career stat modal with head-to-head match history
│   │   ├── RankBadge.tsx      # Renders Rocket League tier badges with icons and division colors
│   │   ├── RankTiersGuide.tsx # Visual guide explaining tier thresholds and Elo mathematics
│   │   └── ui/                # shadcn/ui components (dialog, button, input, badge, sonner)
│   ├── lib/
│   │   ├── elo.ts             # Mathematical Elo formulas, expected score curves, and rank tiers
│   │   ├── elo.test.ts        # Unit tests verifying upset bonuses, penalties, and zero-sum math
│   │   ├── types.ts           # Shared TypeScript interfaces for players, matches, and payloads
│   │   ├── server-db.ts       # Database access layer with fallback cache for zero-downtime start
│   │   ├── server-actions.ts  # TanStack Start server functions (createServerFn)
│   │   └── admin-context.tsx  # React context for client-side admin session state
│   ├── routes/
│   │   ├── __root.tsx         # Root layout, HTML shell, meta tags, Toaster, AdminProvider
│   │   └── index.tsx          # Main leaderboard view with tabs and stats banner
│   ├── styles.css             # Tailwind 4 theme variables with dark sports arena palette
│   └── router.tsx             # TanStack Start router setup
├── drizzle.config.ts          # Configures Drizzle migration output to netlify/database/migrations
└── netlify.toml               # Netlify build and preview server configuration
```

## Non-Obvious Architectural Decisions

1. **Elo Formula & Zero-Sum Invariance**:
   - Win probability follows standard logistic curve: $E_A = 1 / (1 + 10^{(R_B - R_A)/400})$.
   - Winner delta: $\Delta = \max(1, \text{round}(K \times (1 - E_W)))$.
   - Loser delta: $-\Delta$. This ensures zero-sum conservation of total Elo points across the leaderboard.
   - Initial 10 matches use placement K-factor ($K=48$), stabilizing to $K=32$ for calibrated players.
2. **Resilient Database Layer (`src/lib/server-db.ts`)**:
   - Queries execute against Netlify Database (managed Postgres) via Drizzle ORM.
   - If the database is provisioning or initializing on first deploy, queries automatically use an in-memory seed store populated with sample competitors and matches so the UI remains interactive and never renders a 500 error.
3. **Admin Authentication**:
   - General visitors browse in Read-Only Spectator Mode.
   - Admin access is protected by an admin passcode stored in the database `app_settings` table, with environment variable override (`ADMIN_PASSWORD`) and default fallback (`spinmaster`).
   - Every mutation server function (`recordMatchFn`, `createPlayerFn`, `deleteMatchFn`, etc.) verifies the passcode on the server before applying changes.
4. **Hydration Protection**:
   - `localStorage` checks for admin session tokens occur strictly inside `useEffect` in `AdminProvider` to avoid SSR hydration mismatches.
