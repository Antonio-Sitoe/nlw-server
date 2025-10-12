import fastify from 'fastify'
import { fastifyCors } from '@fastify/cors'
import { fastifySwagger } from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'

import {
  validatorCompiler,
  serializerCompiler,
  ZodTypeProvider,
  jsonSchemaTransform,
} from 'fastify-type-provider-zod'
import { subscribeToEvent } from './http/subscribe-to-event'
import { ENV } from './lib/env'

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

app.register(subscribeToEvent)

app
  .listen({
    port: ENV.PORT,
  })
  .then(() => {
    console.log('Server is running on port http://localhost:3333')
    console.log('Swagger is running on port http://localhost:3333/docs')
  })
