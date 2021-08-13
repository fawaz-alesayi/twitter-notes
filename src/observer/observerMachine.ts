import { createModel } from "xstate/lib/model";
import { assign, interpret, createMachine } from "xstate";
import { client } from "@src/twitter/client";
import { getEnv } from "@utils/getEnv";
import { ErrorPlatformEvent } from "xstate";

async function startObserving(user: string) {
  let reply = await client.post(
    `account_activity/all/${getEnv("TWITTER_ENV")}/webhooks.json`,
    {
      url: `${getEnv("TWITTER_WEBHOOK_CALLBACK_URL")}/webhook/twitter`,
    }
  );
  console.log(reply);
  return reply;
}

let userObserverModel = createModel(
  {
    user: "" as string,
    error: "" as string,
    startObserving: async (user: string) => { return await startObserving(user) }
  },
  {
    events: {
      OBSERVE_FOLLOWING: (user: string) => ({ user }),
      RETRY: () => ({}),
    },
  }
);

const observingFollowingMachine = createMachine({
  id: "following",
  states: {
    idle: {},
    observingUser: {},
    stopped: {},
    failed: {},
  }
})

const observingDirectMessagesMachine = createMachine({
  id: "observingDirectMessages",
  context: {
    user: "",
  },
  states: {
    observingUserDirectMessages: {

    },
  },
})

export const observerMachine = userObserverModel.createMachine({
  context: userObserverModel.initialContext,
  initial: "idle",
  states: {
    idle: {
      on: {
        OBSERVE_FOLLOWING: {
          target: "initiateObserving",
          actions: userObserverModel.assign({
            user: (_, event) => event.user
          })
        },
      },
    },
    initiateObserving: {
      invoke: {
        src: async (context, _) => await context.startObserving(context.user),
        onDone: {
          target: "observing",
        },
        onError: {
          target: "error",
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
          target: "initiateObserving",
        },
      },
    },
  },
});

export const observer = interpret(observerMachine);
