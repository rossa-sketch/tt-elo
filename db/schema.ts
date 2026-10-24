import { pgTable, serial, text, timestamp, integer } from 'drizzle-orm/pg-core'

export const players = pgTable('players', {
  id: serial().primaryKey(),
  name: text().notNull().unique(),
  elo: integer().notNull().default(1200),
  matchesPlayed: integer('matches_played').notNull().default(0),
  wins: integer().notNull().default(0),
  losses: integer().notNull().default(0),
  currentStreak: integer('current_streak').notNull().default(0),
  highestElo: integer('highest_elo').notNull().default(1200),
  lowestElo: integer('lowest_elo').notNull().default(1200),
  avatarUrl: text('avatar_url'),
  isActive: integer('is_active').notNull().default(1),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const matches = pgTable('matches', {
  id: serial().primaryKey(),
  player1Id: integer('player1_id')
    .notNull()
    .references(() => players.id, { onDelete: 'cascade' }),
  player2Id: integer('player2_id')
    .notNull()
    .references(() => players.id, { onDelete: 'cascade' }),
  winnerId: integer('winner_id')
    .notNull()
    .references(() => players.id, { onDelete: 'cascade' }),
  player1EloBefore: integer('player1_elo_before').notNull(),
  player1EloAfter: integer('player1_elo_after').notNull(),
  player2EloBefore: integer('player2_elo_before').notNull(),
  player2EloAfter: integer('player2_elo_after').notNull(),
  eloDelta: integer('elo_delta').notNull(),
  score: text('score'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const appSettings = pgTable('app_settings', {
  key: text().primaryKey(),
  value: text().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
