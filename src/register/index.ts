import { appClient } from "@src/twitter/client";
import { FastifyPluginAsync, FastifyRequest, FastifyReply } from "fastify";
import fp from "fastify-plugin";
import HttpStatusCode from "@src/utils/HttpStatusCodes";
import { err, ok, Result } from "neverthrow";
import { routeOptions } from "./registration.test";

// /register/twitter
const register: FastifyPluginAsync<routeOptions> = async (fastify, options) => {
  const { prefix } = options;
  fastify.register(
    async function (fastify) {
      fastify.get(
        "/twitter",
        adaptRegisterRequest
      );
    },
    { prefix }
  );
};

// extracts relevent information from the FastifyRequest
async function adaptRegisterRequest(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const result = await handleRegistration();
  if (result.isOk()) {
    reply.redirect(
      `https://api.twitter.com/oauth/authorize?oauth_token=${result.value}`
    );
    return;
  }
  reply.code(HttpStatusCode.BAD_REQUEST).send();
}

export const handleRegistration = async (): Promise<
  Result<string, RegistrationError>
> => {
  try {
    let requestToken = await appClient.getRequestToken(
      "https://twitter-notes-dev.up.railway.app/oauth/twitter"
    );
    if (requestToken.oauth_callback_confirmed === "true") {
      const oauthRequestToken = requestToken.oauth_token;
      return ok(oauthRequestToken);
    }
    return err(RegistrationError.CALLL_BACK_NOT_CONFIRMED);
  } catch (error) {
    return err(RegistrationError.COULD_NOT_SEND_REQUEST);
  }
};

enum RegistrationError {
  CALLL_BACK_NOT_CONFIRMED,
  COULD_NOT_SEND_REQUEST,
}

export default fp(register, "3.x");
