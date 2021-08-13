import { createModel } from "xstate/lib/model";
import { assign, interpret, createMachine } from "xstate";
import { appClient, botClient } from "@src/twitter/client";
import { getEnv } from "@utils/getEnv";
import { ErrorPlatformEvent } from "xstate";

async function startObserving(user: string) {
  try {
    let reply = await botClient.post(
      `account_activity/all/${getEnv("TWITTER_ENV")}/webhooks`,
      {
        url: `${getEnv("TWITTER_WEBHOOK_CALLBACK_URL")}/webhook/twitter`,
      }
    );
    console.log(reply);

      
  } catch (e) {
    console.error(e);
    throw e;
  }
}

// returns true if we have an account actvity subscription
async function checkObserving(user: string) {
  return false;
}

let userObserverModel = createModel(
  {
    user: "" as string,
    error: "" as string,
    startObserving: async (user: string) => {
      return await startObserving(user);
    },
    checkObserving: async (user: string) => {
      return await checkObserving(user);
    },
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
  },
});

const observingDirectMessagesMachine = createMachine({
  id: "observingDirectMessages",
  context: {
    user: "",
  },
  states: {
    observingUserDirectMessages: {},
  },
});

export const observerMachine = userObserverModel.createMachine({
  context: userObserverModel.initialContext,
  initial: "idle",
  states: {
    idle: {
      on: {
        OBSERVE_FOLLOWING: {
          target: "initiateObserving",
          actions: userObserverModel.assign({
            user: (_, event) => event.user,
          }),
        },
      },
    },
    checkObserving: {
      invoke: {
        src: async (context, _) => await context.checkObserving(context.user),
        onDone: {
          target: "observing",
        },
        onError: {
          target: "error",
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
