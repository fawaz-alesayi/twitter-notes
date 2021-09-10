/* eslint-disable @typescript-eslint/no-unused-vars */
import { createModel } from 'xstate/lib/model';
import { interpret } from 'xstate';
import { botClient } from '../twitter/client';

export interface DirectMessage {
  text: string;
  fromUserId: string;
  toUserId: string;
}

const botModel = createModel(
  {
    outgoingDirectMessage: {} as DirectMessage,
    incomingDirectMessage: {} as DirectMessage,
    generateReply: generateReply,
    sendDirectMessage: sendTwitterDirectMessage,
  },
  {
    events: {
      INCOMING_DIRECT_MESSAGE: (message: DirectMessage) => ({ message }),
      OUTGOING_DIRECT_MESSAGE: (message: DirectMessage) => ({ message }),
      RETRY_DIRECT_MESSAGE: () => ({}),
      FOLLOW: (user: string) => ({}),
    },
  },
);

const messageModel = createModel({
  message: {} as DirectMessage,
  sendDirectMessage: async (directMessage: DirectMessage) => {
    return await sendTwitterDirectMessage(directMessage);
  },
});

/**
 * This state machine handles sending a message to a user and logging all events that come through it.
 */
const messageMachine = messageModel.createMachine({
  id: 'message',
  initial: 'sendingDirectMessage',
  context: messageModel.initialContext,
  states: {
    sendingDirectMessage: {
      invoke: {
        src: async (context) =>
          context.sendDirectMessage(context.message),
        onDone: {
          // log sucessful message
          target: 'done',
        },
        onError: {
          // log failure here.
          target: 'error',
        },
      },
    },
    done: {
      type: 'final',
    },
    error: {
      type: 'final',
    },
  },
});

/**
 * The bot manages one Twitter account
 * it parses incoming DM's and executes side-effects accordingly.
 * it can send a message, save Direct Messages to a database, and subscribe users to services.
 *
 * This state machine only lives for the duration of the HTTP request and response cycle.
 * In other words, a new botMachine is created for each incoming HTTP request.
 */
export const botMachine = botModel.createMachine({
  initial: 'listeningForEvents',
  context: botModel.initialContext,
  states: {
    listeningForEvents: {
      on: {
        INCOMING_DIRECT_MESSAGE: {
          actions: botModel.assign({
            incomingDirectMessage: (_, event) => event.message,
          }),
          target: 'generatingReply',
        },
        OUTGOING_DIRECT_MESSAGE: {
          actions: botModel.assign({
            outgoingDirectMessage: (_, event) => event.message,
          }),
          target: 'sendingDirectMessage',
        },
      },
    },
    parseDirectMessage: {},
    generatingReply: {
      entry: (_context) =>
        botModel.assign({
          outgoingDirectMessage: (context, _) =>
            context.generateReply(context.incomingDirectMessage),
        }),
      always: {
        target: 'sendingDirectMessage',
      },
    },
    sendingDirectMessage: {
      invoke: {
        id: 'message',
        src: messageMachine,
        data: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          message: (context: any, _event: any) => context.outgoingDirectMessage,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          sendDirectMessage: (context: any, _event: any) =>
            context.sendDirectMessage,
        },
        onDone: {
          target: 'finish',
        },
        onError: {
          target: 'error',
        },
      },
    },
    error: {
      type: 'final',
    },
    finish: {
      type: 'final',
    },
  },
});

function generateReply(message: DirectMessage) {
  console.log(message);
  return message;
}

async function sendTwitterDirectMessage(message: DirectMessage) {
  await botClient.post<Record<string, unknown>>('direct_messages/events/new', {
    event: {
      type: 'message_create',
      message_create: {
        target: {
          recipient_id: message.toUserId,
        },
        message_data: {
          text: message.text,
        },
      },
    },
  });
}

export const bot = interpret(botMachine);
