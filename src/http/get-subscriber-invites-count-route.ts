import { z } from 'zod'
import { FastifyInstance } from 'fastify'
import { getSubscriberInviteCount } from '@/controllers/get-subscriber-invite-count'

export async function getSubscriberInviteCountRoute(app: FastifyInstance) {
  app.get(
    '/subscriber/:subscriberId/ranking/count',
    {
      schema: {
        summary: 'Get Subscriber Invite Count',
        tags: ['Subscription'],
        params: z.object({
          subscriberId: z.string(),
        }),
        response: {
          200: z.object({
            message: z.string(),
            count: z.number(),
          }),
        },
      },
    },
    async (request) => {
      const { subscriberId } = request.params as { subscriberId: string }

      const { count } = await getSubscriberInviteCount({
        subscriberId,
      })
      return {
        count,
      }
    }
  )
}
