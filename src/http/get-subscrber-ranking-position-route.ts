import { z } from 'zod'
import { FastifyInstance } from 'fastify'
import { getSubscriberInviteRankingPosition } from '@/controllers/get-subscriber-ranking-position'

export async function getSubscriberInviteRankingPositionRoute(
  app: FastifyInstance
) {
  app.get(
    '/subscriber/:subscriberId/ranking/position',
    {
      schema: {
        summary: 'Get Subscriber Invite Ranking Position',
        tags: ['Subscription'],
        params: z.object({
          subscriberId: z.string(),
        }),
        response: {
          200: z.object({
            message: z.string(),
            position: z.number(),
          }),
        },
      },
    },
    async (request) => {
      const { subscriberId } = request.params as { subscriberId: string }

      const { position } = await getSubscriberInviteRankingPosition({
        subscriberId,
      })
      return {
        position,
      }
    }
  )
}
