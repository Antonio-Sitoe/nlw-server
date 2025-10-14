import { z } from 'zod'
import { ENV } from '@/lib/env'
import { redis } from '@/lib/redis/client'
import { hashKey } from '@/lib/redis/keys'
import { FastifyInstance } from 'fastify'
import { accessInviteLink } from '@/controllers/access-invite-link'

const accessInviteLinkSchema = z.object({
  subscriberId: z.string(),
})

export async function accessInviteLinkRoute(app: FastifyInstance) {
  app.get(
    '/invite/:subscriberId',
    {
      schema: {
        summary: 'Access Invite Link',
        tags: ['referral'],
        params: z.object({
          subscriberId: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { subscriberId } = accessInviteLinkSchema.parse(request.params)
      await accessInviteLink({ subscriberId })
      const referral = await redis.hgetall(hashKey)
      console.log(referral)

      const redirectUrl = new URL(ENV.APP_URL)
      redirectUrl.searchParams.set('referral', subscriberId)
      return reply.redirect(redirectUrl.toString(), 302)
    }
  )
}
