import HttpStatusCode from "@src/utils/HttpStatusCodes";
import { FastifyRequest, FastifyReply } from "fastify";
import { FromSchema } from "json-schema-to-ts";
import { bot } from "./botMachine";
import { accountActivityRequestSchema } from "./schema";
export const onAccountActivity = async (
  req: FastifyRequest<{
    Body: FromSchema<typeof accountActivityRequestSchema>;
  }>,
  rep: FastifyReply
) => {
  req.log.info("Recieved an event")

  bot.onTransition((state) => {
    if (state.matches("finish")) rep.code(HttpStatusCode.OK).send();
    else if (state.matches("error")) rep.code(HttpStatusCode.BAD_REQUEST).send();
  });

  bot.start();
};
