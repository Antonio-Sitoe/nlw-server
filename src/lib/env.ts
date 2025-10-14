import { z } from 'zod'

export const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  POSTGRES_URL: z.url(),
  REDIS_URL: z.url(),
  APP_URL: z.url(),
})

export const ENV = envSchema.parse(process.env)
