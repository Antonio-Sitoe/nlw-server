import { FastifyInstance } from 'fastify'
import { z } from 'zod'

export async function subscribeToEvent(app: FastifyInstance) {
  app.post(
    '/subscriptions',
    {
      schema: {
        summary: 'Subscribe Person to Event',
        tags: ['Subscription'],
        body: z.object({
          name: z.string(),
          email: z.email(),
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
    (request, reply) => {
      const { email, name } = request.body
      console.log(request.body)
      return reply.status(200).send({
        message: 'Hello World',
        email,
        name,
      })
    }
  )
}
