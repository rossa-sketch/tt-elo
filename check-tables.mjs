import { drizzle } from 'drizzle-orm/netlify-db'
import * as schema from './db/schema.js'

const db = drizzle({ schema })

// List all tables
try {
  const result = await db.execute(schema.$inferSelect)
  console.log('Tables found:', Object.keys(result))
} catch (err) {
  console.error('Error:', err)
}

// Try to select from players table specifically
try {
  const players = await db
    .select()
    .from(schema.players)
    .limit(1)
  console.log('players data:', JSON.stringify(players))
} catch (err) {
  console.error('SELECT players error:', err.message || err)
}

// Check information_schema for actual table existence
const [{ sql }] = await Promise.all([
  db.execute(
    "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE'",
  ),
])
console.log('Database tables:', sql)
