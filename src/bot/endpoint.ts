import { clientV2 } from "@src/twitter/client";
import { FastifyEndpoint } from "@src/utils/fastifyEndpoint";
import HttpStatusCode from "@src/utils/HttpStatusCodes";
import { FastifyRequest, FastifyReply } from "fastify";
import { FromSchema } from "json-schema-to-ts";
import { botMachine } from "./botMachine";
import { accountActivityRequestSchema } from "./schema";
import { interpret } from "xstate";

export const onFollow = async (
  req: FastifyRequest<{
    Body: FromSchema<typeof accountActivityRequestSchema>;
  }>,
  rep: FastifyReply
) => {
  req.log.info("Recieved a follow")

  const bot = interpret(botMachine);

  bot.onTransition((state) => {
    console.info(state.value)
    if (state.matches("finish")) rep.code(HttpStatusCode.OK).send();
    else if (state.matches("error")) rep.code(HttpStatusCode.BAD_REQUEST).send();
  });

  const userId = req.body.for_user_id;

  bot.start()
  bot.send({type: 'OUTGOING_DIRECT_MESSAGE', message: {
    text: "Hello, I noticed you followed someone, put a note on why you followed them for future reference! \
    You can ignore this message if you don't want to do that",
    fromUserId: userId,
    toUserId: userId,
  }
  })
};

async function getUserIdFromUsername(username: string) {
  const reply = await clientV2.get(`users/by/username/${username}`, { screen_name: username })
  console.log(reply);
  return reply.data;
}

// const endpoint: FastifyEndpoint = {
//     handler: onAccountActivity,
//     inputSchema: accountActivityRequestSchema,
// }