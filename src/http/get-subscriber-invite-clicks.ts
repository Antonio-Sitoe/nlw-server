import { z } from 'zod'
import { FastifyInstance } from 'fastify'
import { getSubscriberInviteClicks } from '@/controllers/get-subscriber-invite-clicks'

export async function getSubscriberInviteClicksRoute(app: FastifyInstance) {
  app.get(
    '/subscriber/:subscriberId/ranking/clicks',
    {
      schema: {
        summary: 'Get Subscriber Invite Clicks',
        tags: ['Subscription'],
        params: z.object({
          subscriberId: z.string(),
        }),
        response: {
          200: z.object({
            message: z.string(),
            email: z.string(),
            name: z.string(),
          }),
        },
      },
    },
    async (request) => {
      const { subscriberId } = request.params as { subscriberId: string }

      const { count } = await getSubscriberInviteClicks({
        subscriberId,
      })
      return {
        count,
      }
    }
  )
}
