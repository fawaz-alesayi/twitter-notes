import { observerMachine } from './observerMachine';

import { interpret } from 'xstate';
describe('Given an newly created observer AND a user', () => {
  describe('When I send it an OBSERVE_FOLLOWING event', () => {
    const user = 'fawaztsa';
    it('should eventually observe the user', (done) => {
      const mockObserverMachine = observerMachine.withContext({
        startObserving: async (user: string) => {},
        user,
        error: '',
        isObserving: async () => false,
      });

      const observer = interpret(mockObserverMachine).onTransition((state) => {
        if (state.matches('observing')) {
          done();
        }
      });

      observer.start();
      observer.send({ type: 'OBSERVE_FOLLOWING', user: user });
    });
  });
});
