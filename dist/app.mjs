var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/app.ts
import fastify from "fastify";
import {
  validatorCompiler,
  serializerCompiler,
  jsonSchemaTransform
} from "fastify-type-provider-zod";

// src/lib/env.ts
import { z } from "zod";
var envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  POSTGRES_URL: z.url(),
  REDIS_URL: z.url(),
  APP_URL: z.url()
});
var ENV = envSchema.parse(process.env);

// src/app.ts
import { fastifyCors } from "@fastify/cors";
import { fastifySwagger } from "@fastify/swagger";

// src/lib/redis/keys.ts
var hashKey = "referral";

// src/lib/redis/client.ts
import { Redis } from "ioredis";
var redis = new Redis(ENV.REDIS_URL);

// src/db/db.ts
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

// src/db/schema/index.ts
var schema_exports = {};
__export(schema_exports, {
  subscription: () => subscription
});

// src/db/schema/subscriptions.ts
import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
var subscription = pgTable("subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});

// src/db/db.ts
var pg = postgres(ENV.POSTGRES_URL);
var db = drizzle(pg, { schema: schema_exports });

// src/controllers/get-ranking.ts
import { inArray } from "drizzle-orm";
async function getRanking() {
  const ranking = await redis.zrevrange(hashKey, 0, 2, "WITHSCORES");
  const subscriberAndScore = {};
  for (const [subscriberId, score] of ranking) {
    subscriberAndScore[subscriberId] = parseInt(score);
  }
  const subscribers = await db.select().from(subscription).where(inArray(subscription.id, Object.keys(subscriberAndScore)));
  const rankingWithScore = subscribers.map((subscriber) => ({
    id: subscriber.id,
    name: subscriber.name,
    score: subscriberAndScore[subscriber.id]
  })).sort((a, b) => b.score - a.score);
  return {
    ranking: rankingWithScore
  };
}

// src/http/get-ranking-route.ts
import { z as z2 } from "zod";
async function getRankingRoute(app2) {
  app2.get(
    "/ranking",
    {
      schema: {
        summary: "Get Ranking",
        tags: ["referral"],
        response: {
          200: z2.object({
            ranking: z2.array(
              z2.object({
                id: z2.string(),
                name: z2.string(),
                score: z2.number()
              })
            )
          })
        }
      }
    },
    async () => {
      const { ranking } = await getRanking();
      return {
        ranking
      };
    }
  );
}

// src/app.ts
import { fastifySwaggerUi } from "@fastify/swagger-ui";

// src/http/subscribe-to-event.ts
import { z as z3 } from "zod";

// src/controllers/subscribe-to-event.ts
import { eq } from "drizzle-orm";
async function CreateSubscribeToEvent(params) {
  const { name, email, referrerId } = params;
  const subscribers = await db.select().from(subscription).where(eq(subscription.email, email));
  if (subscribers.length > 0) {
    return {
      subscriberId: subscribers[0].id,
      subscriber: subscribers[0]
    };
  }
  const newSubscription = await db.insert(subscription).values({
    name,
    email
  }).returning();
  if (referrerId) {
    await redis.zincrby(hashKey, referrerId, 1);
  }
  const subscriber = newSubscription[0];
  return {
    subscriberId: subscriber.id,
    subscriber
  };
}

// src/http/subscribe-to-event.ts
var subscribeToEventSchema = z3.object({
  name: z3.string(),
  email: z3.email(),
  referrerId: z3.string().nullish()
});
async function subscribeToEvent(app2) {
  app2.post(
    "/subscriptions",
    {
      schema: {
        summary: "Subscribe Person to Event",
        tags: ["Subscription"],
        body: subscribeToEventSchema,
        response: {
          200: z3.object({
            message: z3.string(),
            email: z3.string(),
            name: z3.string()
          })
        }
      }
    },
    async (request, reply) => {
      const { email, name, referrerId } = subscribeToEventSchema.parse(
        request.body
      );
      const { subscriberId } = await CreateSubscribeToEvent({
        email,
        name,
        referrerId
      });
      return reply.status(200).send({
        subscriberId
      });
    }
  );
}

// src/http/access-invite-link.ts
import { z as z4 } from "zod";

// src/controllers/access-invite-link.ts
async function accessInviteLink({
  subscriberId
}) {
  await redis.hincrby(hashKey, subscriberId, 1);
}

// src/http/access-invite-link.ts
var accessInviteLinkSchema = z4.object({
  subscriberId: z4.string()
});
async function accessInviteLinkRoute(app2) {
  app2.get(
    "/invite/:subscriberId",
    {
      schema: {
        summary: "Access Invite Link",
        tags: ["referral"],
        params: z4.object({
          subscriberId: z4.string()
        })
      }
    },
    async (request, reply) => {
      const { subscriberId } = accessInviteLinkSchema.parse(request.params);
      await accessInviteLink({ subscriberId });
      const referral = await redis.hgetall(hashKey);
      console.log(referral);
      const redirectUrl = new URL(ENV.APP_URL);
      redirectUrl.searchParams.set("referral", subscriberId);
      return reply.redirect(redirectUrl.toString(), 302);
    }
  );
}

// src/http/get-subscriber-invite-clicks.ts
import { z as z5 } from "zod";

// src/controllers/get-subscriber-invite-clicks.ts
async function getSubscriberInviteClicks(params) {
  const { subscriberId } = params;
  const count = await redis.hget(hashKey, subscriberId);
  return { count: count ? parseInt(count) : 0 };
}

// src/http/get-subscriber-invite-clicks.ts
async function getSubscriberInviteClicksRoute(app2) {
  app2.get(
    "/subscriber/:subscriberId/ranking/clicks",
    {
      schema: {
        summary: "Get Subscriber Invite Clicks",
        tags: ["Subscription"],
        params: z5.object({
          subscriberId: z5.string()
        }),
        response: {
          200: z5.object({
            message: z5.string(),
            email: z5.string(),
            name: z5.string()
          })
        }
      }
    },
    async (request) => {
      const { subscriberId } = request.params;
      const { count } = await getSubscriberInviteClicks({
        subscriberId
      });
      return {
        count
      };
    }
  );
}

// src/http/get-subscriber-invites-count-route.ts
import { z as z6 } from "zod";

// src/controllers/get-subscriber-invite-count.ts
async function getSubscriberInviteCount(params) {
  const { subscriberId } = params;
  const count = await redis.zscore(hashKey, subscriberId);
  return { count: count ? parseInt(count) : 0 };
}

// src/http/get-subscriber-invites-count-route.ts
async function getSubscriberInviteCountRoute(app2) {
  app2.get(
    "/subscriber/:subscriberId/ranking/count",
    {
      schema: {
        summary: "Get Subscriber Invite Count",
        tags: ["Subscription"],
        params: z6.object({
          subscriberId: z6.string()
        }),
        response: {
          200: z6.object({
            message: z6.string(),
            count: z6.number()
          })
        }
      }
    },
    async (request) => {
      const { subscriberId } = request.params;
      const { count } = await getSubscriberInviteCount({
        subscriberId
      });
      return {
        count
      };
    }
  );
}

// src/http/get-subscrber-ranking-position-route.ts
import { z as z7 } from "zod";

// src/controllers/get-subscriber-ranking-position.ts
async function getSubscriberInviteRankingPosition(params) {
  const { subscriberId } = params;
  const position = await redis.zrevrank(hashKey, subscriberId);
  if (position === null) {
    return { position: null };
  }
  return { position: position + 1 };
}

// src/http/get-subscrber-ranking-position-route.ts
async function getSubscriberInviteRankingPositionRoute(app2) {
  app2.get(
    "/subscriber/:subscriberId/ranking/position",
    {
      schema: {
        summary: "Get Subscriber Invite Ranking Position",
        tags: ["Subscription"],
        params: z7.object({
          subscriberId: z7.string()
        }),
        response: {
          200: z7.object({
            message: z7.string(),
            position: z7.number()
          })
        }
      }
    },
    async (request) => {
      const { subscriberId } = request.params;
      const { position } = await getSubscriberInviteRankingPosition({
        subscriberId
      });
      return {
        position
      };
    }
  );
}

// src/app.ts
var app = fastify().withTypeProvider();
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.register(fastifyCors, {
  origin: "*"
});
app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "NLW Connect",
      description: "NLW Connect",
      version: "1.0.0"
    },
    servers: [{ url: "http://localhost:3333" }]
  },
  transform: jsonSchemaTransform
});
app.register(fastifySwaggerUi, {
  routePrefix: "/docs"
});
app.register(getRankingRoute);
app.register(subscribeToEvent);
app.register(accessInviteLinkRoute);
app.register(getSubscriberInviteCountRoute);
app.register(getSubscriberInviteClicksRoute);
app.register(getSubscriberInviteRankingPositionRoute);
app.listen({
  port: ENV.PORT
}).then(() => {
  console.log("Server is running on port http://localhost:3333");
  console.log("Swagger is running on port http://localhost:3333/docs");
});
