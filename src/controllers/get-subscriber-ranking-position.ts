import { redis } from '@/lib/redis/client'
import { hashKey } from '@/lib/redis/keys'

interface GetSubscriberInviteRankingPositionParams {
  subscriberId: string
}

export async function getSubscriberInviteRankingPosition(
  params: GetSubscriberInviteRankingPositionParams
) {
  const { subscriberId } = params
  const position = await redis.zrevrank(hashKey, subscriberId)

  if (position === null) {
    return { position: null }
  }

  return { position: position + 1 }
}
