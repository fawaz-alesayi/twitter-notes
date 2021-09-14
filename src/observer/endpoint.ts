import { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';
import { FromSchema } from 'json-schema-to-ts';
import { observerSchema, observerRequestSchema } from './schema';
import { observer } from './observerMachine';
import HttpStatusCode from '@src/utils/HttpStatusCodes';
import { routeOptions } from '@src/utils/fastifyEndpoint';

const observerPlugin: FastifyPluginAsync<routeOptions> = async (
  fastify,
  options,
) => {
  const { prefix } = options;
  fastify.register(
    async function (fastify) {
      fastify.post('/twitter', { schema: observerSchema }, handleObserve);
    },
    { prefix },
  );
};

const handleObserve = async (
  request: FastifyRequest<{ Body: FromSchema<typeof observerRequestSchema> }>,
  reply: FastifyReply,
) => {
  const twitterHandle = request.body.user;

  observer.onTransition((state) => {
    if (state.matches('error')) {
      const rep = {
        message: `Could not observer user: ${twitterHandle}`,
      };
      reply.code(HttpStatusCode.BAD_REQUEST).send(rep);
    } else if (state.matches('observing')) {
      const rep = {
        message: `Observing ${state.context.twitterHandles}...`,
      };
      reply.code(HttpStatusCode.OK).send(rep);
    }
  });


  observer.start();
  observer.send({
    type: 'OBSERVE_FOLLOWING',
    twitterHandles: [twitterHandle],
  });
  await reply;
};

export default fp(observerPlugin, '3.x');
