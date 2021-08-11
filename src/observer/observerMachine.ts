import { createModel } from "xstate/lib/model";
import { assign } from "xstate/lib/actionTypes";
import { interpret } from "xstate";
import { DirectMessage } from "../bot/botMachine";
import { client } from "../twitter/client";
import { getEnv } from "../utils/getEnv";

let userObserverModel = createModel(
  {
    user: "" as string,
  },
  {
    events: {
      START: () => ({}),
      OBSERVE_FOLLOWING: (user: string) => ({ user }),
    },
  }
);

const observer = userObserverModel.createMachine({
  context: userObserverModel.initialContext,
  initial: "idle",
  states: {
    idle: {
      on: {
        START: {
          target: "observingFollowing",
        },
      },
    },
    observingFollowing: {
      invoke: {
        src: async (context, _) => await startObserving(context.user),
      },
    },
  },
});

export { observer };

async function startObserving(user: string) {
  try {
    let reply = client.post(
      `account_activity/all/${getEnv("TWITTER_ENV")}/webhooks.json`,
      {
        url: `${getEnv("TWITTER_ENV")}/webhooks/twitter`,
      }
    );
  } catch (e) {}
}
