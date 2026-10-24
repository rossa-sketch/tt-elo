import { defineConfig } from 'drizzle-kit'
import { getDrizzleKitConnectionString } from './db/connection.js'

export default defineConfig({
  dialect: 'postgresql',
  schema: './db/schema.ts',
  out: 'netlify/database/migrations',
  dbCredentials: {
    // A single canonical sslmode is used so drizzle-kit works whether the
    // original URL used sslmode=require or uselibpqcompat=true&sslmode=require.
    url: getDrizzleKitConnectionString(),
  },
})
