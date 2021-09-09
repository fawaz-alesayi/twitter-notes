import { clientV2 } from "@src/twitter/client";
import { FastifyEndpoint } from "@src/utils/fastifyEndpoint";
import HttpStatusCode from "@src/utils/HttpStatusCodes";
import { FastifyRequest, FastifyReply } from "fastify";
import { FromSchema } from "json-schema-to-ts";
import { botMachine } from "./botMachine";
import { accountActivityRequestSchema } from "./schema";
import { interpret } from "xstate";
import { observingList } from "@src/observer/observerMachine";

export const onFollow = async (
  req: FastifyRequest<{
    Body: FromSchema<typeof accountActivityRequestSchema>;
  }>,
  rep: FastifyReply
) => {
  req.log.info("Recieved a follow");

  const followEvents = req.body.follow_events as {
    source: { id: string };
    target: { screen_name: string };
  }[];

  req.log.info(req.body);

  followEvents.forEach((followEvent) => {
    if (!observingList.includes(followEvent.source.id)) {
      console.log(
        "Error. Trying to receive events for a user that we don't observe"
      );
      rep.code(HttpStatusCode.BAD_REQUEST).send();
      return;
    }
  });

  const bot = interpret(botMachine);

  bot.onTransition((state) => {
    if (state.matches("finish")) rep.code(HttpStatusCode.NO_CONTENT).send();
    else if (state.matches("error"))
      rep.code(HttpStatusCode.BAD_REQUEST).send();
  });

  bot.start();
  bot.send({
    type: "OUTGOING_DIRECT_MESSAGE",
    message: {
      text: `Hello, I noticed you followed ${followEvents[0].target.screen_name}, put a note on why you followed them for future reference! \
    You can ignore this message if you don't want to do that`,
      fromUserId: followEvents[0].source.id,
      toUserId: followEvents[0].source.id,
    },
  });
  return rep;
};

async function getUserIdFromUsername(username: string) {
  const reply = await clientV2.get(`users/by/username/${username}`, {
    screen_name: username,
  });
  return reply.data;
}

// const endpoint: FastifyEndpoint = {
//     handler: onAccountActivity,
//     inputSchema: accountActivityRequestSchema,
// }
