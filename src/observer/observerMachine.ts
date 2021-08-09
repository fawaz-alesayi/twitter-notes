import { createModel } from "xstate/lib/model";
import { assign } from "xstate/lib/actionTypes";
import { interpret } from "xstate";

let userObserverModel = createModel(
  {
    user: String,
  },
  {
    events: {
      observe: (user: any) => ({ user }),
    },
  }
);

let observer = userObserverModel.createMachine({
  context: userObserverModel.initialContext,
  initial: "idle",
  states: {
    idle: {
      on: {
        observe: {
          target: 'observing',
          actions: userObserverModel.assign({
            user: (_, event) => event.user
          })
        }
      },
    },
    observing: {},
  },
});