/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createModel } from 'xstate/lib/model';
import { assign, interpret } from 'xstate';
import { createUserClient } from '@src/twitter/client';
import { getEnv } from '@utils/getEnv';
import { ErrorPlatformEvent } from 'xstate';
import HttpStatusCode from '@src/utils/HttpStatusCodes';

export const observingList: string[] = ['806117763328708609'];

async function startObserving(user: string) {
  const client = createUserClient(user)
  await client.post(
    `account_activity/all/${getEnv('TWITTER_ENV')}/webhooks`,
    {
      url: `${getEnv('TWITTER_WEBHOOK_CALLBACK_URL')}/webhook/twitter`,
    },
  );
}

/**
 * checks if the user followings are being observed
 * @param user a twitter handle to the user
 */
async function isObserving(user: string) {
  const client = createUserClient(user);
  const reply = await client.get<Response>(
    `account_activity/all/${getEnv('TWITTER_ENV')}/subscriptions`,
  );
  if (reply.status === HttpStatusCode.NO_CONTENT) return true;
  return false;
}

const userObserverModel = createModel(
  {
    user: '' as string,
    error: '' as string,
    startObserving: async (user: string) => {
      return await startObserving(user);
    },
    isObserving: async (user: string) => {
      return await isObserving(user);
    },
  },
  {
    events: {
      OBSERVE_FOLLOWING: (user: string) => ({ user }),
      RETRY: () => ({}),
    },
  },
);


/**
 * Observes the user's following and interactions with other users.
 * Has the same lifetime as the NodeJS process.
 */
export const observerMachine = userObserverModel.createMachine({
  context: userObserverModel.initialContext,
  initial: 'idle',
  states: {
    idle: {
      on: {
        OBSERVE_FOLLOWING: {
          target: 'initiateObserving',
          actions: userObserverModel.assign({
            user: (_, event) => event.user,
          }),
        },
      },
    },
    checkObserving: {
      invoke: {
        src: async (context, _) => await context.isObserving(context.user),
        onDone: {
          target: 'observing',
        },
        onError: {
          target: 'error',
        },
      },
    },
    initiateObserving: {
      invoke: {
        src: async (context, _) => await context.startObserving(context.user),
        onDone: {
          target: 'observing',
        },
        onError: {
          target: 'error',
          actions: assign({
            error: (context, _event: any) => {
              const event: ErrorPlatformEvent = _event;
              return `Error while observing ${context.user}. Error Message: ${event.data}`;
            },
          }),
        },
      },
    },
    observing: {},
    stopObserving: {},
    error: {
      on: {
        RETRY: {
          target: 'checkObserving',
        },
      },
    },
  },
});

export const observer = interpret(observerMachine);
