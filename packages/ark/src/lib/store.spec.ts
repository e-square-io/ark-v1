import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  createInitialState,
  INITIAL_A_VALUE,
  NEXT_VALUE_1,
  StateProviderMock,
  STATE_MOCK,
  TestState,
} from '../../testing/src';
import { StateProvider } from './entities';
import { Store } from './store';

@Injectable()
class TestStore extends Store<TestState>({ provider: StateProviderMock<TestState>, withStatus: StateProviderMock }) {
  constructor() {
    super(createInitialState());
  }
}

describe('Store', () => {
  let store: TestStore;
  let provider: StateProvider<TestState>;
  let statusProvider: StateProvider<TestState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TestStore],
    });

    store = TestBed.inject(TestStore);
    provider = (store as any).provider as StateProvider<TestState>;
    statusProvider = (store as any).statusProvider as StateProvider<TestState>;
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  it('should set initial state', () => {
    const initialState = createInitialState();
    expect(provider.state).toEqual(initialState);
  });

  describe('update', () => {
    let providerSetStateSpy: jest.SpyInstance;
    let statusProviderSetStateSpy: jest.SpyInstance;

    beforeEach(() => {
      providerSetStateSpy = jest.spyOn(provider, 'setState');
      providerSetStateSpy.mockReset();
      statusProviderSetStateSpy = jest.spyOn(statusProvider, 'setState');
      statusProviderSetStateSpy.mockReset();
    });

    describe('when updating by partial object', () => {
      it('should call providers "setState" method with the full state object', () => {
        store.update({ b: NEXT_VALUE_1 });
        expect(provider.setState).toHaveBeenCalledTimes(1);
        expect(provider.setState).toHaveBeenCalledWith({ a: INITIAL_A_VALUE, b: NEXT_VALUE_1 });
      });
    });

    describe('when updating by projection function', () => {
      it('should call providers "setState" method with the full state object', () => {
        store.update(state => ({ b: `${state.a}.${NEXT_VALUE_1}` }));
        expect(provider.setState).toHaveBeenCalledTimes(1);
        expect(provider.setState).toHaveBeenCalledWith({ a: INITIAL_A_VALUE, b: `${INITIAL_A_VALUE}.${NEXT_VALUE_1}` });
      });
    });
  });

  describe('select', () => {
    let providerSelectStateSpy: jest.SpyInstance;

    beforeEach(() => {
      providerSelectStateSpy = jest.spyOn(provider, 'selectState');
      providerSelectStateSpy.mockReset();
      providerSelectStateSpy.mockImplementation(arg => arg(STATE_MOCK));
    });

    describe('when selecting the whole state', () => {
      it('should call providers "selectState" method with projection function that returns the whole state', () => {
        const result = store.select();
        expect(provider.selectState).toHaveBeenCalledTimes(1);
        expect(provider.selectState).toHaveBeenCalledWith(expect.any(Function));
        expect(result).toEqual(STATE_MOCK);
      });
    });

    describe('when selecting the specific key', () => {
      it('should call providers "selectState" method with projection function that returns the state of the key', () => {
        const result = store.select('b');
        expect(provider.selectState).toHaveBeenCalledTimes(1);
        expect(provider.selectState).toHaveBeenCalledWith(expect.any(Function));
        expect(result).toEqual(STATE_MOCK.b);
      });
    });

    describe('when selecting by the projection function', () => {
      it('should call providers "selectState" method with the provided projection function', () => {
        const expectedResult = { c: `${STATE_MOCK.a}.${STATE_MOCK.b}` };
        const result = store.select(state => ({ c: `${state.a}.${state.b}` }));
        expect(provider.selectState).toHaveBeenCalledTimes(1);
        expect(provider.selectState).toHaveBeenCalledWith(expect.any(Function));
        expect(result).toEqual(expectedResult);
      });
    });
  });

  describe('update status', () => {
    it('should call method "setState" of status provider', () => {
      store.updateStatus({ status: 'busy' });
      expect(statusProvider.setState).toHaveBeenCalledTimes(1);
      expect(statusProvider.setState).toHaveBeenCalledWith({ status: 'busy' });
    });
  });

  describe('reset', () => {
    it('should call "reset" method of provider', () => {
      store.reset();
      expect(provider.reset).toHaveBeenCalledTimes(1);
    });

    it('should call "reset" method of status rovider', () => {
      store.reset();
      expect(statusProvider.reset).toHaveBeenCalledTimes(1);
    });
  });

  describe('destroy', () => {
    it('should call "destroy" method of provider', () => {
      store.destroy();
      expect(provider.destroy).toHaveBeenCalledTimes(1);
    });

    it('should call "destroy" method of status rovider', () => {
      store.destroy();
      expect(statusProvider.destroy).toHaveBeenCalledTimes(1);
    });
  });
});
