import { appClient } from "../client";
import { FastifyPluginAsync, FastifyRequest, FastifyReply } from "fastify";
import fp from "fastify-plugin";
import { getChallengeResponse } from "@utils/challengeResponse";
import { getEnv } from "@utils/getEnv";
import { FromSchema } from "json-schema-to-ts";
import { onFollow } from '@src/bot/endpoint'
import { accountActivitySchema } from "@src/bot/schema";
import fetch from 'node-fetch';

export interface routeOptions {
    prefix: string;
}

const twitterOauth: FastifyPluginAsync<routeOptions> = async (
    fastify,
    options
) => {
    const { prefix } = options;
    fastify.register(
        async function (fastify) {
            fastify.get("/twitter", { schema: challengeSchema }, handleOauth);
        },
        { prefix }
    );
};

const OauthRequestSchema = {
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
    query: OauthRequestSchema,
    response: challengeResponseSchema,
  };

const handleOauth = async (
    request: FastifyRequest<{
        Querystring: FromSchema<typeof OauthRequestSchema>;
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

async function getRequestToken() {
  const response = await fetch('https://api.twitter.com/oauth/request_token', {
    headers: {
      'Authorization': 
    },
  });
  const json = await response.json();
}


export default fp(twitterOauth, "3.x");