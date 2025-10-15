import { eq } from 'drizzle-orm'
import { db } from '../db/db'
import { subscription } from '../db/schema'
import { redis } from '@/lib/redis/client'
import { hashKey } from '@/lib/redis/keys'

interface SubscribeToEventParams {
  name: string
  email: string
  referrerId?: string | null
}
export async function CreateSubscribeToEvent(params: SubscribeToEventParams) {
  const { name, email, referrerId } = params

  const subscribers = await db
    .select()
    .from(subscription)
    .where(eq(subscription.email, email))

  if (subscribers.length > 0) {
    return {
      subscriberId: subscribers[0].id,
      subscriber: subscribers[0],
    }
  }

  const newSubscription = await db
    .insert(subscription)
    .values({
      name,
      email,
    })
    .returning()

  if (referrerId) {
    await redis.zincrby(hashKey, referrerId, 1)
  }

  const subscriber = newSubscription[0]
  return {
    subscriberId: subscriber.id,
    subscriber,
  }
}
