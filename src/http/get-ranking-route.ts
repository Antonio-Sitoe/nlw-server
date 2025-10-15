import { FastifyInstance } from 'fastify'
import { getRanking } from '@/controllers/get-ranking'
import { z } from 'zod'

export async function getRankingRoute(app: FastifyInstance) {
  app.get(
    '/ranking',
    {
      schema: {
        summary: 'Get Ranking',
        tags: ['referral'],
        response: {
          200: z.object({
            ranking: z.array(
              z.object({
                id: z.string(),
                name: z.string(),
                score: z.number(),
              })
            ),
          }),
        },
      },
    },
    async () => {
      const { ranking } = await getRanking()
      return {
        ranking,
      }
    }
  )
}
