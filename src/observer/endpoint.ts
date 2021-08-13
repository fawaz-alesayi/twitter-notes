import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { FromSchema } from "json-schema-to-ts";
import { observerSchema, observerRequestSchema } from "./schema";
import { interpret } from "xstate";
import { observer } from "./observerMachine";
import HttpStatusCode from "@src/utils/HttpStatusCodes";

export interface routeOptions {
  prefix: string;
}

const observerPlugin: FastifyPluginAsync<routeOptions> = async (fastify, options) => {
  const { prefix } = options;
  fastify.register(
    async function (fastify) {
      fastify.post<{ Body: FromSchema<typeof observerRequestSchema> }>(
        "/twitter",
        { schema: observerSchema },
        async (request, reply) => {
          const twitterHandle = request.body.user;

          observer.onTransition((state) => {
            if (state.matches("error")) {
              console.log(state.value);
              const rep = {
                message: `Could not observer user: ${twitterHandle}`,
              };
              reply.code(HttpStatusCode.BAD_REQUEST).send(rep);
            } else if (state.matches("observing")) {
              const rep = {
                message: `Observing ${state.context.user}...`,
              };
              reply.code(HttpStatusCode.OK).send(rep);
            }
          });

          observer.start();
          observer.send({
            type: "OBSERVE_FOLLOWING",
            user: twitterHandle,
          });
        }
      );
    },
    { prefix }
  );
};

export default fp(observerPlugin, "3.x");
