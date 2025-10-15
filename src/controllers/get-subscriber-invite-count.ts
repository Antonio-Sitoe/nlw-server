import { redis } from '@/lib/redis/client'
import { hashKey } from '@/lib/redis/keys'

interface GetSubscriberInviteCountParams {
  subscriberId: string
}

export async function getSubscriberInviteCount(
  params: GetSubscriberInviteCountParams
) {
  const { subscriberId } = params
  const count = await redis.zscore(hashKey, subscriberId)

  return { count: count ? parseInt(count) : 0 }
}
