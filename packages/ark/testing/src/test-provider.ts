import { waitForAsync } from '@angular/core/testing';
import { StateProvider, StateProviderConstructor } from '@e-square/ark';
import { skip } from 'rxjs';

import { createInitialState, INITIAL_A_VALUE, NEXT_VALUE_1, TestState } from './test-state';

export function testProvider(providerConstructor: StateProviderConstructor<TestState>, providerName?: string): void {
  describe(providerName || providerConstructor.name, () => {
    let provider: StateProvider<TestState>;
    let initialState: TestState;

    beforeEach(() => {
      initialState = createInitialState();
      provider = new providerConstructor(initialState);
    });

    it('should be created', () => {
      expect(provider).toBeTruthy();
    });

    it('should set initial state', () => {
      expect(provider.state).toBe(initialState);
    });

    describe('set state', () => {
      it('should update the state value', () => {
        const expectedValue: TestState = { a: INITIAL_A_VALUE, b: NEXT_VALUE_1 };
        provider.setState({ a: INITIAL_A_VALUE, b: NEXT_VALUE_1 });
        expect(provider.state).toEqual(expectedValue);
      });
    });

    describe('select state', () => {
      it('should return observable that emits values when state being updated', waitForAsync(() => {
        const expectedValue: TestState = { a: INITIAL_A_VALUE, b: NEXT_VALUE_1 };
        provider
          .selectState(state => state)
          .pipe(skip(1))
          .subscribe(state => {
            expect(state).toEqual(expectedValue);
          });

        provider.setState({ a: INITIAL_A_VALUE, b: NEXT_VALUE_1 });
      }));
    });

    describe('get value', () => {
      let expectedValue: TestState;

      beforeEach(() => {
        expectedValue = { a: INITIAL_A_VALUE, b: NEXT_VALUE_1 };
        provider.setState({ a: INITIAL_A_VALUE, b: NEXT_VALUE_1 });
      });

      it('should return current state value', () => {
        expect(provider.getValue()).toEqual(expectedValue);
      });

      it('should return copy of state value', () => {
        expect(provider.getValue()).not.toBe(expectedValue);
      });
    });

    describe('reset', () => {
      it('should reset value to initial state', () => {
        provider.setState({ a: INITIAL_A_VALUE, b: NEXT_VALUE_1 });
        provider.reset();
        expect(provider.state).toBe(initialState);
      });
    });

    describe('destroy', () => {
      it('should complete state stream', waitForAsync(() => {
        provider
          .selectState(state => state)
          .subscribe({
            complete: () => expect(true).toBeTruthy(),
          });
        provider.destroy();
      }));
    });
  });
}
