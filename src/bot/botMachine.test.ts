import { botMachine, DirectMessage } from "./botMachine";

import { interpret } from "xstate";
describe("Given a bot", () => {
  describe("When I send it a message", () => {
    let myMessage: DirectMessage = { text: "hello", user: "fawaz" };
    it("should eventually store the sent response in the context", (done) => {
      const bot = interpret(botMachine).onTransition((state) => {
        if (state.context.outgoingDirectMessage === myMessage) {
          // expects here
          done();
        }
      });

      bot.start();

      // send zero or more events to the service that should
      // cause it to eventually reach its expected state
      bot.send("START");
      bot.send({ type: "INCOMING_DIRECT_MESSAGE", message: myMessage });
    });
  });
});
