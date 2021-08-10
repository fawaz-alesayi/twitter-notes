import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { getChallengeResponse } from "../../utils/challengeResponse";
import { getEnv } from "../../utils/getEnv";
import { FromSchema } from "json-schema-to-ts";

// using declaration merging, add your plugin props to the appropriate fastify interfaces
declare module "fastify" {
  interface FastifyRequest {}
  interface FastifyReply {}
}

// define options
export interface MyPluginOptions {
  prefix: string;
}

interface CrcRequestParams {
  crc_token: string;
}

const twitterWebHooks: FastifyPluginAsync<MyPluginOptions> = async (
  fastify,
  options
) => {
  const { prefix } = options;
  fastify.register(
    async function (fastify) {
      fastify.get<{ Params: FromSchema<typeof challengeRequestSchema> }>(
        "/twitter",
        { schema: challengeSchema },
        async (request, reply) => {
          let challengeSolution = getChallengeResponse(
            request.params.crc_token,
            getEnv("CONSUMER_SECRET")
          );
          const response = {
            response_token: `sha256=${challengeSolution}`,
          };
          return reply.status(200).send(response);
        }
      );
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
  "200": {
    type: "object",
    properties: {
      response_token: { type: "string" },
    },
  },
} as const;

const challengeSchema = {
  params: challengeRequestSchema,
  response: challengeResponseSchema,
  required: ["params", "response"],
};

export default fp(twitterWebHooks, "3.x");