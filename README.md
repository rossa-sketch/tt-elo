# TopSpin Elo — Table Tennis Leaderboard & Rating System

A full-stack, real-time table tennis leaderboard and match tracker featuring an Elo rating system inspired by competitive games like Rocket League. Wins against higher-ranked opponents grant generous upset bonuses, while losses against lower-ranked opponents inflict severe rating penalties.

## Key Features

- **Rocket League Rank Tiers**: Players progress through Bronze, Silver, Gold, Platinum, Diamond, Champion, Grand Champion, and Supersonic Legend tiers based on their current Elo rating.
- **Asymmetric Elo Engine**: Implements the official Elo logistic curve where upsets reward more points (+30 ELO) and expected wins reward modest points (+2 ELO), preserving zero-sum balance.
- **Role-Based Admin Control**:
  - **Spectators / Visitors**: Freely view rankings, examine player career statistics, view the match history feed, and simulate head-to-head matchups.
  - **Admins**: Enter an admin passcode to unlock full management — register new players, record game outcomes, edit player profiles, and revert accidental matches.
- **Live Matchup Predictor & Elo Calculator**: Compare any two players to preview expected win percentages and see exactly what rating points both stand to gain or lose before playing.
- **Match History Feed & Revert**: Chronological record of games played with date, set scores, Elo swings, upset callouts, and an admin revert button that cleanly restores pre-match ratings.
- **Zero-Config Persistent Storage**: Powered by Netlify Database (managed Postgres) with Drizzle ORM and automatic migrations.

## Tech Stack

- **Framework**: TanStack Start (React 19 SSR, TanStack Router)
- **Database**: Netlify Database (managed Postgres) via Drizzle ORM
- **Styling**: Tailwind CSS 4 with custom dark tournament arena theme
- **UI Components**: Radix UI, shadcn/ui, Sonner toasts
- **Icons**: Lucide React
- **Language**: TypeScript 6 (strict mode)

## Getting Started Locally

### Prerequisites

- Node.js 22+
- `pnpm` (or `npm`)

### Installation

```bash
# Install dependencies
pnpm install

# Run the local development server
pnpm run dev
```

Or run via the Netlify CLI to emulate full Netlify platform features:

```bash
/opt/buildhome/node-deps/node_modules/.bin/netlify dev --port 8889
```

Open `http://localhost:3000` (or `http://localhost:8889`) in your browser.

### Database Connection & TLS

The connection is configured in `db/connection.ts` and works with either the
standard `pg` driver or the Netlify Database driver:

- `DATABASE_URL` is preferred; `NETLIFY_DB_URL` (injected on Netlify) is the fallback.
- SSL parameters (`sslmode`, `uselibpqcompat`, `sslrootcert`, ...) are removed from
the URL and applied explicitly. This prevents `sslmode=require` from silently
overwriting `ssl.rejectUnauthorized` inside `pg`.
- For URL-only drivers, the URL is rewritten to a single canonical `sslmode`
value (`no-verify` for libpq-style `require`, or `verify-full`).
- `require` encrypts without requiring a trusted CA, matching libpq behaviour
and working with managed providers that use private CA chains.
- Local databases use no TLS by default.

Optional overrides:

| Variable | Values | Description |
| --- | --- | --- |
| `DB_CONNECTOR` | `pg`, `netlify` | Force a connector (default: `pg` for `DATABASE_URL`) |
| `DATABASE_SSL_MODE` | `disable`, `require`, `no-verify`, `verify-ca`, `verify-full` | Overrides the URL's `sslmode` |
| `DATABASE_SSL_CA` | path or inline PEM | CA bundle used by `verify-ca`/`verify-full` |
| `DATABASE_POOL_MAX` | number | Maximum pool size (default `10`) |
| `DATABASE_CONNECT_TIMEOUT_MS` | number | Connection timeout (default `10000`) |

### Admin Access

- Click **Admin Login** in the top navigation bar.
- Default Admin Passcode: `spinmaster`
- Passcode can be updated at any time in **Admin Settings**.
