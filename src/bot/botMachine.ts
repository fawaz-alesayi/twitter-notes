import { createModel } from "xstate/lib/model";
import { assign } from "xstate/lib/actionTypes";
import { interpret } from "xstate";

export interface DirectMessage {
    text: string;
    user: string;
}

let botModel = createModel(
  {
    name: "bot",
    outgoingDirectMessage: {} as DirectMessage,
  },
  {
    events: {
      START: (config: any) => ({}),
      INCOMING_DIRECT_MESSAGE: (message: DirectMessage) => ({ message }),
      OUTGOING_DIRECT_MESSAGE: (message: any) => ({ message }),
      FOLLOW: (user: any) => ({}),
    },
  }
);

export const botMachine = botModel.createMachine({
  initial: "idle",
  context: botModel.initialContext,
  states: {
    idle: {
      on: {
        START: {
          target: "listeningForDirectMessages",
        },
      },
    },
    listeningForDirectMessages: {
      on: {
        INCOMING_DIRECT_MESSAGE: {
          target: "sendingDirectMessage",
          actions: botModel.assign({
            outgoingDirectMessage: (_, event) => event.message,
          }),
        },
      },
    },
    sendingDirectMessage: {
        invoke: {
            src: async (context, _) => await sendMessage(context.outgoingDirectMessage),
            onDone: {
                // log sucessful message
            },
            onError: {
                // log failure here.
            },
        },
    },
  },
});


async function sendMessage(message: DirectMessage) {
    Promise.resolve();
}