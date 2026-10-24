import { describe, expect, it } from 'vitest'
import {
  resolveDatabaseConnection,
  getDatabaseConnectionSettings,
  getDrizzleKitConnectionString,
} from './connection.js'

const baseEnv = {}

describe('database connection TLS normalization', () => {
  it.each([
    'postgresql://user:pass@db.example.com:5432/app?sslmode=require',
    'postgresql://user:pass@db.example.com:5432/app?uselibpqcompat=true&sslmode=require',
  ])('normalizes sslmode variants from %s', (url) => {
    const settings = resolveDatabaseConnection(url, {
      source: 'DATABASE_URL',
      env: baseEnv,
    })

    expect(settings.configured).toBe(true)
    expect(settings.sslMode).toBe('require')
    expect(settings.ssl).toEqual({ rejectUnauthorized: false })
    expect(settings.connectionString).not.toContain('sslmode')
    expect(settings.connectionString).not.toContain('uselibpqcompat')
    expect(new URL(settings.urlWithSslParams).searchParams.get('sslmode')).toBe(
      'no-verify',
    )
  })

  it('keeps explicit certificate verification when requested', () => {
    const settings = resolveDatabaseConnection(
      'postgresql://user:pass@db.example.com:5432/app?sslmode=verify-full',
      { source: 'DATABASE_URL', env: baseEnv },
    )

    expect(settings.sslMode).toBe('verify-full')
    expect(settings.ssl).toMatchObject({ rejectUnauthorized: true })
    expect(new URL(settings.urlWithSslParams).searchParams.get('sslmode')).toBe(
      'verify-full',
    )
  })

  it('uses a supplied CA for verification', () => {
    const ca = '-----BEGIN CERTIFICATE-----\ntest\n-----END CERTIFICATE-----'
    const settings = resolveDatabaseConnection(
      'postgresql://user:pass@db.example.com:5432/app?sslmode=verify-full',
      { source: 'DATABASE_URL', env: { DATABASE_SSL_CA: ca } },
    )

    expect(settings.ssl).toMatchObject({ rejectUnauthorized: true, ca })
  })

  it('allows SSL to be explicitly disabled', () => {
    const settings = resolveDatabaseConnection(
      'postgresql://user:pass@db.example.com:5432/app?sslmode=require',
      { source: 'DATABASE_URL', env: { DATABASE_SSL_MODE: 'disable' } },
    )

    expect(settings.ssl).toBe(false)
    expect(new URL(settings.urlWithSslParams).searchParams.get('sslmode')).toBe(
      'disable',
    )
  })

  it('does not require TLS for local databases by default', () => {
    const settings = resolveDatabaseConnection(
      'postgresql://postgres:postgres@localhost:5432/app',
      {
        source: 'DATABASE_URL',
        env: {},
      },
    )

    expect(settings.ssl).toBe(false)
  })

  it('treats a remote database without sslmode as requiring TLS', () => {
    const settings = resolveConnectionWithoutSslMode()

    expect(settings.sslMode).toBe('require')
    expect(settings.ssl).toEqual({ rejectUnauthorized: false })
  })

  it('selects the Netlify adapter when only NETLIFY_DB_URL is configured', () => {
    const env = {
      NETLIFY_DB_URL:
        'postgres://user:pass@db.example.com:5432/app?sslmode=require',
    }
    const settings = readSettingsFromEnvironment(env)

    expect(settings.connector).toBe('netlify')
    expect(settings.source).toBe('NETLIFY_DB_URL')
    expect(getDrizzleKitConnectionString(env)).toContain('sslmode=no-verify')
  })

  it('keeps the pg adapter when DATABASE_URL is configured', () => {
    const env = {
      DATABASE_URL:
        'postgres://user:pass@db.example.com:5432/app?sslmode=require',
      NETLIFY_DB_URL:
        'postgres://user:pass@db.example.com:5432/other?sslmode=require',
    }

    expect(readSettingsFromEnvironment(env).connector).toBe('pg')
  })

  it('allows the connector to be overridden explicitly', () => {
    const env = {
      DATABASE_URL:
        'postgres://user:pass@db.example.com:5432/app?sslmode=require',
      DB_CONNECTOR: 'netlify',
    }

    expect(readSettingsFromEnvironment(env).connector).toBe('netlify')
  })
})

function resolveConnectionWithoutSslMode() {
  return resolveDatabaseConnection(
    'postgresql://user:pass@db.example.com:5432/app',
    {
      source: 'DATABASE_URL',
      env: {},
    },
  )
}

function readSettingsFromEnvironment(env: Record<string, string>) {
  return getDatabaseConnectionSettings(env)
}
