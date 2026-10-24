import { drizzle as drizzleNetlify } from 'drizzle-orm/netlify-db'
import { drizzle as drizzleNodePostgres } from 'drizzle-orm/node-postgres'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema.js'
import {
  describeDatabaseConnection,
  getDatabaseConnectionSettings,
  type DatabaseConnectionSettings,
} from './connection.js'

type Database = NodePgDatabase<typeof schema>

function intFromEnv(
  env: NodeJS.ProcessEnv,
  name: string,
  fallback: number,
): number {
  const raw = env[name]
  if (!raw) return fallback

  const value = Number.parseInt(raw, 10)
  return Number.isFinite(value) && value >= 0 ? value : fallback
}

function createNodePostgresDatabase(
  settings: DatabaseConnectionSettings,
): Database {
  const pool = new Pool({
    // The connection string is stripped of sslmode/uselibpqcompat so it cannot
    // override the explicit TLS configuration below.
    connectionString: settings.connectionString || undefined,
    ssl: settings.ssl,
    application_name: 'topspin-elo',
    max: intFromEnv(process.env, 'DATABASE_POOL_MAX', 10),
    idleTimeoutMillis: intFromEnv(
      process.env,
      'DATABASE_IDLE_TIMEOUT_MS',
      30_000,
    ),
    connectionTimeoutMillis: intFromEnv(
      process.env,
      'DATABASE_CONNECT_TIMEOUT_MS',
      10_000,
    ),
  })

  return drizzleNodePostgres({ client: pool, schema })
}

function createNetlifyDatabase(settings: DatabaseConnectionSettings): Database {
  // The Netlify driver parses the URL itself, so hand it the canonical
  // sslmode value instead of the original (connector-specific) parameters.
  return drizzleNetlify({
    connection: settings.urlWithSslParams,
    schema,
  }) as unknown as Database
}

function createDatabase(): Database {
  const settings = getDatabaseConnectionSettings()

  console.log('--- Database Configuration ---')
  console.log(describeDatabaseConnection(settings))
  console.log('------------------------------')

  if (!settings.configured) {
    console.warn(
      '[db] No DATABASE_URL or NETLIFY_DB_URL configured; queries will use the in-memory fallback.',
    )
    return createNodePostgresDatabase(settings)
  }

  return settings.connector === 'netlify'
    ? createNetlifyDatabase(settings)
    : createNodePostgresDatabase(settings)
}

export const db = createDatabase()
