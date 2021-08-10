import fastify from "fastify";
import { default as twitterWebHooks } from "../twitter/webhooks/route";
import { getEnv } from "../utils/getEnv";

export const server = fastify({
  logger: true,
});

server.register(twitterWebHooks, {
  prefix: "/webhook",
});

server.get("/hello", async (req, res) => {});

const start = async () => {
  try {
    await server.listen(getEnv("PORT"), getEnv("SOCKET_ADDR"));
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
