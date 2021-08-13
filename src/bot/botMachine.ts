import { createModel } from "xstate/lib/model";
import { interpret, createMachine, assign } from "xstate";
import { client, clientV2 } from "../twitter/client";

export interface DirectMessage {
  text: string;
  user: string;
}

let botModel = createModel(
  {
    outgoingDirectMessage: {} as DirectMessage,
    incomingDirectMessage: {} as DirectMessage,
    parseDirectMessage: parseDirectMessage,
    sendDirectMessage: sendDirectMessage,
  },
  {
    events: {
      INCOMING_DIRECT_MESSAGE: (message: DirectMessage) => ({ message }),
      OUTGOING_DIRECT_MESSAGE: (message: DirectMessage) => ({ message }),
      RETRY_DIRECT_MESSAGE: () => ({}),
      FOLLOW: (user: any) => ({}),
    },
  }
);

let messageModel = createModel({
  message: {} as DirectMessage,
  sendDirectMessage: async (directMessage: DirectMessage) => { return await sendDirectMessage(directMessage) }
});

const messageMachine = messageModel.createMachine({
  id: "message",
  initial: "sendingDirectMessage",
  states: {
    sendingDirectMessage: {
      invoke: {
        src: async (context, _: any) =>
          context.sendDirectMessage(context.message),
        onDone: {
          // log sucessful message
          target: "done",
        },
        onError: {
          target: "error",
          // log failure here.
        },
      },
    },
    done: {
      type: "final",
    },
    error: {
      type: "final",
    },
  },
});

export const botMachine = botModel.createMachine({
  initial: "listeningForDirectMessages",
  context: botModel.initialContext,
  states: {
    listeningForDirectMessages: {
      on: {
        INCOMING_DIRECT_MESSAGE: {
          actions: botModel.assign({
            incomingDirectMessage: (_, event) => event.message,
          }),
          target: "generatingReply",
        },
      },
    },
    generatingReply: {
      entry: (_context) =>
        botModel.assign({
          outgoingDirectMessage: (context, _) =>
            context.parseDirectMessage(context.incomingDirectMessage),
        }),
      always: {
        target: "replying",
      },
    },
    replying: {
      invoke: {
        id: 'message',
        src: messageMachine,
        data: {
          message: (context: any, _event: any) => context.outgoingDirectMessage,
          sendDirectMessage: (context: any, _event: any) => context.sendDirectMessage,
        },
        onDone: {
          target: "finish",
        },
        onError: {
          target: "error",
        },
      },
    },
    error: {
      on: {
        RETRY_DIRECT_MESSAGE: {
          target: "replying",
        },
      },
    },
    finish: {
      type: "final",
    },
  },
});

function parseDirectMessage(message: DirectMessage) {
  console.log(message);
  return message;
}

async function sendDirectMessage(message: DirectMessage) {
  await clientV2.post("direct_messages/new", {
    text: message.text,
    user_id: message.user,
  });
}

export const bot = interpret(botMachine);