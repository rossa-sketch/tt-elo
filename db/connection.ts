import { readFileSync } from 'node:fs'

/**
 * Connection configuration shared by the runtime client (node-postgres or the
 * Netlify Database driver) and drizzle-kit.
 *
 * The important detail is that `pg`/`drizzle-kit` parse the connection string
 * *after* applying the explicit config object. A URL such as
 * `?sslmode=require` produces `ssl: {}` (certificate verification enabled) and
 * overwrites any `ssl: { rejectUnauthorized: false }` passed by the caller.
 * The libpq-compatible variant `?uselibpqcompat=true&sslmode=require` has the
 * opposite problem: it is not understood by every driver.
 *
 * To make the connection work regardless of which connector is used, we strip
 * every TLS-related URL parameter and apply the TLS settings explicitly. For
 * URL-only consumers (drizzle-kit, Neon, Netlify) we write back one canonical
 * `sslmode` value that all pg-compatible parsers understand.
 */

export type DatabaseSslMode =
  | 'disable'
  | 'allow'
  | 'prefer'
  | 'require'
  | 'verify-ca'
  | 'verify-full'
  | 'no-verify'

export type DatabaseConnector = 'pg' | 'netlify'

export type DatabaseEnv = Record<string, string | undefined>

export interface DatabaseSslConfig {
  rejectUnauthorized: boolean
  ca?: string
  cert?: string
  key?: string
  checkServerIdentity?: () => undefined
}

export interface DatabaseConnectionSettings {
  configured: boolean
  source: string
  connector: DatabaseConnector
  rawUrl: string
  /** URL with all TLS query parameters removed. */
  connectionString: string
  /** URL with a single canonical TLS parameter, for URL-only drivers. */
  urlWithSslParams: string
  sslMode: DatabaseSslMode
  ssl: false | DatabaseSslConfig
  host: string
  database: string
}

const SSL_URL_PARAMS = new Set([
  'ssl',
  'sslmode',
  'uselibpqcompat',
  'channel_binding',
  'sslrootcert',
  'sslcert',
  'sslkey',
  'sslpassword',
  'sslcrl',
  'sslcrldir',
  'sslnegotiation',
  'ssl_min_protocol_version',
  'ssl_max_protocol_version',
])

const URL_SOURCES = [
  'DATABASE_URL',
  'NETLIFY_DB_URL',
  'NETLIFY_DATABASE_URL',
  'TEMP_NETLIFY_DATABASE_URL',
] as const

const LOCAL_HOSTS = new Set([
  'localhost',
  '127.0.0.1',
  '::1',
  '0.0.0.0',
  'host.docker.internal',
])

function parseUrl(value: string): URL | undefined {
  if (!value) return undefined
  if (value.startsWith('/')) return undefined // Unix socket path

  try {
    return new URL(value)
  } catch {
    return undefined
  }
}

function normalizeSslMode(
  value: string | null | undefined,
): DatabaseSslMode | undefined {
  if (!value) return undefined

  switch (value.trim().toLowerCase()) {
    case 'disable':
    case 'disabled':
    case 'off':
    case 'false':
    case '0':
      return 'disable'
    case 'allow':
      return 'allow'
    case 'prefer':
      return 'prefer'
    case 'require':
    case 'required':
    case 'on':
    case 'true':
    case '1':
      return 'require'
    case 'verify-ca':
    case 'verify_ca':
      return 'verify-ca'
    case 'verify-full':
    case 'verify_full':
      return 'verify-full'
    case 'no-verify':
    case 'no_verify':
    case 'noverify':
      return 'no-verify'
    default:
      return undefined
  }
}

function isLocalHost(url: URL): boolean {
  return LOCAL_HOSTS.has(url.hostname.toLowerCase())
}

function resolveSslMode(
  url: URL | undefined,
  env: DatabaseEnv,
): DatabaseSslMode {
  const explicitMode = normalizeSslMode(env.DATABASE_SSL_MODE)
  if (explicitMode) return explicitMode

  const sslFlag = normalizeSslMode(env.DATABASE_SSL)
  if (sslFlag) return sslFlag

  // The connection string is the most specific configuration and, like `pg`,
  // takes precedence over PGSSLMODE.
  const urlMode = normalizeSslMode(url?.searchParams.get('sslmode'))
  if (urlMode) return urlMode

  const pgMode = normalizeSslMode(env.PGSSLMODE)
  if (pgMode) return pgMode

  // Local development databases usually do not have TLS enabled. A remote
  // managed database (including Netlify Database) does, but commonly uses a
  // CA chain that is not in Node's trust store, hence the libpq-compatible
  // "encrypt without verification" default for `require`.
  if (!url || isLocalHost(url)) return 'disable'

  return 'require'
}

function readPemValue(value: string | null | undefined): string | undefined {
  if (!value) return undefined

  if (value.includes('-----BEGIN ')) return value

  // The value may be a path (libpq's sslrootcert/sslcert/sslkey behaviour).
  try {
    return readFileSync(value, 'utf8')
  } catch {
    // Not a readable path. Treat it as an inline value so malformed
    // configurations fail with a useful TLS error instead of silently
    // disabling verification.
    return value
  }
}

function buildSslConfig(
  url: URL | undefined,
  env: DatabaseEnv,
  mode: DatabaseSslMode,
): false | DatabaseSslConfig {
  if (mode === 'disable') return false

  const verifyCertificate = mode === 'verify-ca' || mode === 'verify-full'
  const config: DatabaseSslConfig = {
    // `require` (and `prefer`/`allow`) follow libpq semantics: encrypt the
    // connection but do not require a trusted CA. Use DATABASE_SSL_MODE or
    // sslmode=verify-full when strict certificate validation is wanted.
    rejectUnauthorized: verifyCertificate,
  }

  const ca = readPemValue(
    env.DATABASE_SSL_CA ??
      env.PGSSLROOTCERT ??
      url?.searchParams.get('sslrootcert'),
  )
  const cert = readPemValue(
    env.DATABASE_SSL_CERT ?? env.PGSSLCERT ?? url?.searchParams.get('sslcert'),
  )
  const key = readPemValue(
    env.DATABASE_SSL_KEY ?? env.PGSSLKEY ?? url?.searchParams.get('sslkey'),
  )

  if (ca) config.ca = ca
  if (cert) config.cert = cert
  if (key) config.key = key

  // Node verifies the hostname by default. `verify-ca` intentionally skips
  // hostname matching while still validating the certificate chain.
  if (mode === 'verify-ca') {
    config.checkServerIdentity = () => undefined
  }

  return config
}

function stripSslParams(rawUrl: string, url: URL | undefined): string {
  if (!url) return rawUrl

  const cleaned = new URL(url.toString())
  for (const key of [...cleaned.searchParams.keys()]) {
    if (SSL_URL_PARAMS.has(key.toLowerCase())) cleaned.searchParams.delete(key)
  }

  return cleaned.toString()
}

function canonicalUrlSslMode(mode: DatabaseSslMode): string {
  switch (mode) {
    case 'disable':
      return 'disable'
    case 'verify-ca':
      return 'verify-ca'
    case 'verify-full':
      return 'verify-full'
    // URL-only drivers get a single libpq-compatible value. `no-verify` is
    // recognised by node-postgres, @neondatabase/serverless and drizzle-kit.
    case 'allow':
    case 'prefer':
    case 'require':
    case 'no-verify':
      return 'no-verify'
  }
}

function addSslParams(
  connectionString: string,
  url: URL | undefined,
  env: DatabaseEnv,
  mode: DatabaseSslMode,
): string {
  if (!connectionString) return connectionString

  const parsed = parseUrl(connectionString)
  if (!parsed) return connectionString

  parsed.searchParams.set('sslmode', canonicalUrlSslMode(mode))

  // A CA supplied as a file path can travel in the URL. Inline PEM data
  // cannot, so it is only applied through the explicit TLS config.
  if (mode === 'verify-ca' || mode === 'verify-full') {
    const rootCert =
      env.DATABASE_SSL_CA ??
      env.PGSSLROOTCERT ??
      url?.searchParams.get('sslrootcert')
    if (rootCert && !rootCert.includes('-----BEGIN ')) {
      parsed.searchParams.set('sslrootcert', rootCert)
    }
  }

  return parsed.toString()
}

function resolveConnector(source: string, env: DatabaseEnv): DatabaseConnector {
  const requested = (env.DB_CONNECTOR ?? env.DATABASE_CONNECTOR ?? '')
    .trim()
    .toLowerCase()

  if (
    ['netlify', 'netlify-db', 'netlify_db', 'serverless', 'neon'].includes(
      requested,
    )
  ) {
    return 'netlify'
  }

  if (
    [
      'pg',
      'postgres',
      'postgresql',
      'node-postgres',
      'node_postgres',
      'tcp',
    ].includes(requested)
  ) {
    return 'pg'
  }

  if ((env.NETLIFY_DB_DRIVER ?? '').toLowerCase() === 'serverless') {
    return 'netlify'
  }

  // A Netlify-provided URL is normally consumed through the Netlify Database
  // driver. An explicitly configured DATABASE_URL keeps using node-postgres.
  if (source === 'NETLIFY_DB_URL' && !env.DATABASE_URL) {
    return 'netlify'
  }

  return 'pg'
}

export function resolveDatabaseConnection(
  rawUrl: string,
  options: { source?: string; env?: DatabaseEnv } = {},
): DatabaseConnectionSettings {
  const env = options.env ?? process.env
  const source = options.source ?? 'DATABASE_URL'

  if (!rawUrl) {
    return {
      configured: false,
      source,
      connector: 'pg',
      rawUrl: '',
      connectionString: '',
      urlWithSslParams: '',
      sslMode: 'disable',
      ssl: false,
      host: '',
      database: '',
    }
  }

  const url = parseUrl(rawUrl)
  const sslMode = resolveSslMode(url, env)
  const connectionString = stripSslParams(rawUrl, url)
  const ssl = buildSslConfig(url, env, sslMode)

  return {
    configured: true,
    source,
    connector: resolveConnector(source, env),
    rawUrl,
    connectionString,
    urlWithSslParams: addSslParams(connectionString, url, env, sslMode),
    sslMode,
    ssl,
    host: url?.hostname ?? '',
    database: url?.pathname.replace(/^\//, '') ?? '',
  }
}

export function getDatabaseConnectionSettings(
  env: DatabaseEnv = process.env,
): DatabaseConnectionSettings {
  for (const source of URL_SOURCES) {
    const rawUrl = env[source]?.trim()
    if (rawUrl) return resolveDatabaseConnection(rawUrl, { source, env })
  }

  return resolveDatabaseConnection('', { source: 'none', env })
}

/** Connection string for drizzle-kit, which only accepts a single URL value. */
export function getDrizzleKitConnectionString(
  env: DatabaseEnv = process.env,
): string {
  return getDatabaseConnectionSettings(env).urlWithSslParams
}

/** Password-free description suitable for logs. */
export function describeDatabaseConnection(
  settings: DatabaseConnectionSettings,
): string {
  if (!settings.configured) {
    return 'no connection string configured (using in-memory fallback until one is provided)'
  }

  const target = settings.host
    ? `${settings.host}${settings.database ? `/${settings.database}` : ''}`
    : 'local socket'
  return `${settings.connector} connector -> ${target} (ssl=${settings.sslMode}, source=${settings.source})`
}
