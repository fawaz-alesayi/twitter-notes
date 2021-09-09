import { botMachine, DirectMessage } from "./botMachine";

import { interpret } from "xstate";
describe("Given a bot in the 'listeningForDirectMessages' state", () => {
  describe("When I send it an 'INCOMING_DIRECT_MESSAGE' event", () => {
    let myMessage: DirectMessage = { text: "hello", fromUserId: "fawaztsa", toUserId: "fawaztsa" };
    it("should eventually reach the 'finish' state", (done) => {
      const mockBotMachine = botMachine.withContext({
        incomingDirectMessage: {
          text: "",
          fromUserId: "",
          toUserId: "",
        },
        outgoingDirectMessage: {
          text: "",
          fromUserId: "",
          toUserId: "",
        },
        generateReply: (message: DirectMessage) => {
          return message;
        },
        sendDirectMessage: (message: DirectMessage) => {
          return Promise.resolve();
        },
      });
      const bot = interpret(mockBotMachine).onTransition((state) => {
        if (state.matches("finish")) {
          done();
        }
      });

      bot.start();

      bot.send({ type: "INCOMING_DIRECT_MESSAGE", message: myMessage });
    });
  });
});
