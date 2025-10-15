import { redis } from '@/lib/redis/client'
import { hashKey } from '@/lib/redis/keys'

interface GetSubscriberInviteClicksParams {
  subscriberId: string
}

export async function getSubscriberInviteClicks(
  params: GetSubscriberInviteClicksParams
) {
  const { subscriberId } = params
  const count = await redis.hget(hashKey, subscriberId)

  return { count: count ? parseInt(count) : 0 }
}
