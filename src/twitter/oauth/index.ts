import { users } from "@src/databaseTypes";
import { supabase } from "@src/utils/dataClient";
import { routeOptions } from "@src/utils/fastifyEndpoint";
import { FastifyPluginAsync, FastifyRequest, FastifyReply } from "fastify";
import fp from "fastify-plugin";
import { FromSchema } from "json-schema-to-ts";
import { err, ok, Result } from "neverthrow";
import { appClient } from "../client";

const twitterOauth: FastifyPluginAsync<routeOptions> = async (
  fastify,
  options
) => {
  const { prefix } = options;
  fastify.register(
    async function (fastify) {
      fastify.get(
        "/twitter",
        { schema: OauthTwitterSchema },
        handleCallbackRedirect
      );
    },
    { prefix }
  );
};

const OauthRequestSchema = {
  type: "object",
  properties: {
    oauth_token: { type: "string" },
    oauth_verifier: { type: "string" },
  },
  required: ["oauth_token", "oauth_verifier"],
} as const;

const challengeResponseSchema = {
  200: {
    type: "object",
    properties: {},
  },
} as const;

const OauthTwitterSchema = {
  query: OauthRequestSchema,
  response: challengeResponseSchema,
};

const handleCallbackRedirect = async (
  request: FastifyRequest<{
    Querystring: FromSchema<typeof OauthRequestSchema>;
  }>,
  reply: FastifyReply
) => {
};

export const saveUserAccessToken = async (oauthToken: string, oauthVerifier: string): Promise<
  Result<null, null>
> => {
  try {
    const accessToken = await appClient.getAccessToken({
      oauth_token: oauthToken,
      oauth_verifier: oauthVerifier,
    });

    supabase.from<users>("users").insert({
      oauth_secret: accessToken.oauth_token_secret,
      oauth_token: accessToken.oauth_token,
      twitter_id: accessToken.user_id,
    }, {returning: "minimal"});

    return ok(null);
  } catch (error) {
    return err(null);
  }
};


export default fp(twitterOauth, "3.x");
