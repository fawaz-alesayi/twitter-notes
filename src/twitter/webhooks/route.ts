import { FastifyPluginAsync, FastifyRequest, FastifyReply } from "fastify";
import fp from "fastify-plugin";
import { getChallengeResponse } from "@utils/challengeResponse";
import { getEnv } from "@utils/getEnv";
import { FromSchema } from "json-schema-to-ts";
import { onAccountActivity } from '@src/bot/endpoint'
import { accountActivitySchema } from "@src/bot/schema";

// using declaration merging, add your plugin props to the appropriate fastify interfaces
declare module "fastify" {
  interface FastifyRequest {}
  interface FastifyReply {}
}

export interface routeOptions {
  prefix: string;
}

const twitterWebHooks: FastifyPluginAsync<routeOptions> = async (
  fastify,
  options
) => {
  const { prefix } = options;
  fastify.register(
    async function (fastify) {
      fastify.get("/twitter", { schema: challengeSchema }, handleChallenge);

      fastify.post("/twitter", { schema: accountActivitySchema }, onAccountActivity);
    },
    { prefix }
  );
};

const challengeRequestSchema = {
  type: "object",
  properties: {
    crc_token: { type: "string" },
  },
  required: ["crc_token"],
} as const;

const challengeResponseSchema = {
  200: {
    type: "object",
    properties: {
      response_token: { type: "string" },
    },
  },
} as const;

const challengeSchema = {
  query: challengeRequestSchema,
  response: challengeResponseSchema,
};

export default fp(twitterWebHooks, "3.x");

const handleChallenge = async (
  request: FastifyRequest<{
    Querystring: FromSchema<typeof challengeRequestSchema>;
  }>,
  reply: FastifyReply
) => {
  const challengeSolution = getChallengeResponse(
    request.query.crc_token,
    getEnv("CONSUMER_SECRET")
  );
  console.log(challengeSolution);
  reply.code(200).send({
    response_token: `sha256=${challengeSolution}`,
  });
};
