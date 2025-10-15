import fastify from 'fastify'

import {
  validatorCompiler,
  serializerCompiler,
  ZodTypeProvider,
  jsonSchemaTransform,
} from 'fastify-type-provider-zod'

import { ENV } from './lib/env'
import { fastifyCors } from '@fastify/cors'
import { fastifySwagger } from '@fastify/swagger'
import { getRankingRoute } from './http/get-ranking-route'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import { subscribeToEvent } from './http/subscribe-to-event'
import { accessInviteLinkRoute } from './http/access-invite-link'
import { getSubscriberInviteClicksRoute } from './http/get-subscriber-invite-clicks'
import { getSubscriberInviteCountRoute } from './http/get-subscriber-invites-count-route'
import { getSubscriberInviteRankingPositionRoute } from './http/get-subscrber-ranking-position-route'

const app = fastify().withTypeProvider<ZodTypeProvider>()
app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifyCors, {
  origin: '*',
})

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'NLW Connect',
      description: 'NLW Connect',
      version: '1.0.0',
    },
    servers: [{ url: 'http://localhost:3333' }],
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

app.register(getRankingRoute)
app.register(subscribeToEvent)
app.register(accessInviteLinkRoute)
app.register(getSubscriberInviteCountRoute)
app.register(getSubscriberInviteClicksRoute)
app.register(getSubscriberInviteRankingPositionRoute)

app
  .listen({
    port: ENV.PORT,
  })
  .then(() => {
    console.log('Server is running on port http://localhost:3333')
    console.log('Swagger is running on port http://localhost:3333/docs')
  })
