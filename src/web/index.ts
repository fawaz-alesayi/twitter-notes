import { interpret } from "xstate";
import fastify from "fastify";
import { observerMachine } from "@src/observer/observerMachine";
import { default as twitterWebHooks } from "@src/twitter/webhooks/route";
import { getEnv } from "@utils/getEnv";
import { default as observer } from "@src/observer/endpoint";

export const server = fastify({
  logger: true,
});

server.register(twitterWebHooks, {
  prefix: "/webhook",
});

server.register(observer, {
  prefix: "/observer",
});

server.get("/", async (req, rep) => {
  rep.code(200).send();
});

server.get('/test', async (req, rep) => {
  // What would happen if we don't return anything?
  setTimeout(async () => {
    return {
      msg: "Hello!"
    }
  }, 1000);
  await rep
})

const start = async () => {
  try {
    await server.listen(getEnv("PORT"), getEnv("SOCKET_ADDR"));
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
