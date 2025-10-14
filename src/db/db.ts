import { ENV } from '../lib/env'
import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
import * as schema from './schema'

export const pg = postgres(ENV.POSTGRES_URL)
export const db = drizzle(pg, { schema })
