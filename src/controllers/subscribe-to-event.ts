import { db } from '../db/db'
import { subscription } from '../db/schema'

interface SubscribeToEventParams {
  name: string
  email: string
}
export async function CreateSubscribeToEvent(params: SubscribeToEventParams) {
  const { name, email } = params
  const newSubscription = await db
    .insert(subscription)
    .values({
      name,
      email,
    })
    .returning()
  const subscriber = newSubscription[0]
  return {
    subscriberId: subscriber.id,
    subscriber,
  }
}
