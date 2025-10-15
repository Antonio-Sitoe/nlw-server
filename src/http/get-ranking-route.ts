import { FastifyInstance } from 'fastify'
import { getRanking } from '@/controllers/get-ranking'

export async function getRankingRoute(app: FastifyInstance) {
  app.get(
    '/ranking',
    {
      schema: {
        summary: 'Get Ranking',
        tags: ['referral'],
      },
    },
    async () => {
      const ranking = await getRanking()
      return {
        ranking,
      }
    }
  )
}
