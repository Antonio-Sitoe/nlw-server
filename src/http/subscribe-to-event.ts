import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { CreateSubscribeToEvent } from '../controllers/subscribe-to-event'

const subscribeToEventSchema = z.object({
  name: z.string(),
  email: z.email(),
})

export async function subscribeToEvent(app: FastifyInstance) {
  app.post(
    '/subscriptions',
    {
      schema: {
        summary: 'Subscribe Person to Event',
        tags: ['Subscription'],
        body: subscribeToEventSchema,
        response: {
          200: z.object({
            message: z.string(),
            email: z.string(),
            name: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { email, name } = subscribeToEventSchema.parse(request.body)
      const { subscriberId } = await CreateSubscribeToEvent({
        email,
        name,
      })
      return reply.status(200).send({
        subscriberId,
      })
    }
  )
}
