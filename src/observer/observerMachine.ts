/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createModel } from 'xstate/lib/model';
import { assign, interpret } from 'xstate';
import { createUserClient } from '@src/twitter/client';
import { getEnv } from '@utils/getEnv';
import { ErrorPlatformEvent } from 'xstate';;

export const observingList: string[] = ['806117763328708609', '244002500'];

async function startObserving(twitterHandles: string[]): Promise<void> {
  twitterHandles.forEach(async (twitterHandle) => {
    const client = await createUserClient(twitterHandle);
    await client.post(
      `account_activity/all/${getEnv('TWITTER_ENV')}/webhooks`,
      {
        url: `${getEnv('TWITTER_WEBHOOK_CALLBACK_URL')}/webhook/twitter`,
      },
    )

    // client.match(
    //   async (client: Twitter) => {
    //     await client.post(
    //       `account_activity/all/${getEnv('TWITTER_ENV')}/webhooks`,
    //       {
    //         url: `${getEnv('TWITTER_WEBHOOK_CALLBACK_URL')}/webhook/twitter`,
    //       },
    //     )
    //     return `Sent a request to account activity API successfully`;
    //   },
    //   async (err: string) => {
    //     console.info(err)
    //     return err;
    //   },
    // );
  });
}

const userObserverModel = createModel(
  {
    twitterHandles: [] as string[],
    error: '' as string,
    startObserving: async (twitterHandles: string[]) => {
      return await startObserving(twitterHandles);
    },
  },
  {
    events: {
      OBSERVE_FOLLOWING: (twitterHandles: string[]) => ({ twitterHandles }),
      RETRY: () => ({}),
    },
  },
);

/**
 * Observes the twitterHandles's following and interactions with other twitterHandles.
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
            twitterHandles: (_, event) => event.twitterHandles,
          }),
        },
      },
    },
    initiateObserving: {
      invoke: {
        src: async (context, _) =>
          await context.startObserving(context.twitterHandles),
        onDone: {
          target: 'observing',
        },
        onError: {
          target: 'observing',
          actions: assign({
            error: (context, _event: any) => {
              const event: ErrorPlatformEvent = _event;
              return `Error while observing ${context.twitterHandles}. Error Message: ${event.data}`;
            },
          }),
        },
      },
    },
    observing: {
      on: {
        OBSERVE_FOLLOWING: {
          target: 'initiateObserving',
          actions: userObserverModel.assign({
            twitterHandles: (_, event) => event.twitterHandles,
          }),
        },
      },
    },
    stopObserving: {},
  },
});

export const observer = interpret(observerMachine);
