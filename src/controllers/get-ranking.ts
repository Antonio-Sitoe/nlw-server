import { hashKey } from '@/lib/redis/keys'
import { redis } from '@/lib/redis/client'
import { db } from '@/db/db'
import { subscription } from '@/db/schema'
import { inArray } from 'drizzle-orm'

export async function getRanking() {
  const ranking = await redis.zrevrange(hashKey, 0, 2, 'WITHSCORES')
  const subscriberAndScore: Record<string, number> = {}

  for (const [subscriberId, score] of ranking) {
    subscriberAndScore[subscriberId] = parseInt(score)
  }

  const subscribers = await db
    .select()
    .from(subscription)
    .where(inArray(subscription.id, Object.keys(subscriberAndScore)))

  const rankingWithScore = subscribers
    .map((subscriber) => ({
      id: subscriber.id,
      name: subscriber.name,
      score: subscriberAndScore[subscriber.id],
    }))
    .sort((a, b) => b.score - a.score)

  return {
    ranking: rankingWithScore,
  }
}
