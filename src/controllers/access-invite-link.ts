import { redis } from '@/lib/redis/client'
import { hashKey } from '@/lib/redis/keys'

interface AccessInviteLinkParams {
  subscriberId: string
}
export async function accessInviteLink({
  subscriberId,
}: AccessInviteLinkParams) {
  await redis.hincrby(hashKey, subscriberId, 1)
}
