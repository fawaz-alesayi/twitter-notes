import { botMachine, DirectMessage } from "./botMachine";

import { interpret } from "xstate";
describe("Given a bot in the 'listeningForDirectMessages' state", () => {
  describe("When I send it an 'INCOMING_DIRECT_MESSAGE' event", () => {
    let myMessage: DirectMessage = { text: "hello", user: "fawaztsa" };
    it("should eventually reach the 'finish' state", (done) => {
      const mockBotMachine = botMachine.withContext({
        incomingDirectMessage: {
          text: "",
          user: "",
        },
        outgoingDirectMessage: {
          text: "",
          user: "",
        },
        parseDirectMessage: (message: DirectMessage) => {
          return message;
        },
        sendDirectMessage: (message: DirectMessage) => {
          return Promise.resolve();
        },
      });
      const bot = interpret(mockBotMachine).onTransition((state) => {
        console.log(state.value);
        if (state.matches("finish")) {
          done();
        }
      });

      bot.start();

      bot.send({ type: "INCOMING_DIRECT_MESSAGE", message: myMessage });
    });
  });
});
