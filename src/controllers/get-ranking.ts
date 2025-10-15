import { hashKey } from '@/lib/redis/keys'
import { redis } from '@/lib/redis/client'

export async function getRanking() {
  const ranking = await redis.zrevrange(hashKey, 0, 2, 'WITHSCORES')
  const subscriberAndScore: Record<string, number> = {}

  for (const [subscriberId, score] of ranking) {
    subscriberAndScore[subscriberId] = parseInt(score)
  }

  return subscriberAndScore
}
