import fastify from "fastify";
import { getEnv } from "./utils/getEnv";

let server = fastify({
  logger: true,
})

server.get("/", (req, rep) => {
  rep.send("Hello!");
})

const start = async () => {
  try {
    await server.listen(getEnv('PORT'), getEnv('SOCKET_ADDR'));
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}


start()
