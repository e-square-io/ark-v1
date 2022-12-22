import { waitForAsync } from '@angular/core/testing';
import { skip } from 'rxjs';

import { StateProvider, StatusState } from '../entities';
import { RxjsStateProvider } from './rxjs-state-provider';
import { StatusProvider } from './status-provider';

const providerConstructor = StatusProvider({
  providerBase: RxjsStateProvider<StatusState>,
});

const EXPECTED_INITIAL_STATE: StatusState = { status: 'idle' };
const DUMMY_ERROR = { code: 1, message: 'Error' };
const SETTING_ERROR_STATUS_EXCEPTION = 'Setting status to error requires updating the `error` property as well.';

describe('Status provider', () => {
  let provider: StateProvider<StatusState>;

  beforeEach(() => {
    provider = new providerConstructor();
  });

  it('should be created', () => {
    expect(provider).toBeTruthy();
  });

  it('should set initial state', () => {
    expect(provider.state).toEqual(EXPECTED_INITIAL_STATE);
  });

  describe('set status', () => {
    it('should update the status value', () => {
      const expectedValue: StatusState = { status: 'busy' };
      provider.setState({ status: 'busy' });
      expect(provider.state).toEqual(expectedValue);
    });

    describe('when error status set and no error provided', () => {
      it('should throw exception', () => {
        expect(() => provider.setState({ status: 'error' })).toThrowError(SETTING_ERROR_STATUS_EXCEPTION);
      });
    });

    describe('when error status removed', () => {
      beforeEach(() => {
        provider.setState({ status: 'error', error: DUMMY_ERROR });
      });

      it('should update error to undefined', () => {
        expect(provider.state).toEqual({ status: 'error', error: DUMMY_ERROR });
        provider.setState({ status: 'idle' });
        expect(provider.state).toEqual({ status: 'idle', error: undefined });
      });
    });
  });

  describe('select status', () => {
    it('should return observable that emits values when state being updated', waitForAsync(() => {
      const expectedValue: StatusState = { status: 'busy' };
      provider
        .selectState(state => state)
        .pipe(skip(1))
        .subscribe(state => {
          expect(state).toEqual(expectedValue);
        });

      provider.setState({ status: 'busy' });
    }));
  });

  describe('get value', () => {
    let expectedValue: StatusState;

    beforeEach(() => {
      expectedValue = { status: 'busy' };
      provider.setState({ status: 'busy' });
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
      provider.setState({ status: 'busy' });
      provider.reset();
      expect(provider.state).toEqual(EXPECTED_INITIAL_STATE);
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
