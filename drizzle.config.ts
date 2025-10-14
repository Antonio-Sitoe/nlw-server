import { Config, defineConfig } from 'drizzle-kit'
import { ENV } from './src/lib/env'

export default defineConfig({
  schema: './src/db/schema',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: ENV.POSTGRES_URL,
  },
}) satisfies Config
