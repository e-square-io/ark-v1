import {
  createInitialState,
  testProvider,
  TestState,
  createLocalStorageSpy,
  INITIAL_A_VALUE,
  NEXT_VALUE_1,
} from '../../../testing/src';
import { StateProvider } from '../entities';
import { RxjsStateProvider } from './rxjs-state-provider';
import { StateWithStorageProvider } from './state-with-storage-provider';

const providerConstructor = StateWithStorageProvider<TestState>({
  storage: 'localStorage',
  name: 'Test',
  providerBase: RxjsStateProvider<TestState>,
});
testProvider(providerConstructor, 'RxjsStateWithStorageProvider');

describe('Storage', () => {
  let provider: StateProvider<TestState>;
  let initialState: TestState;
  let _getItemSpy: jest.SpyInstance;

  beforeEach(() => {
    const { getItemSpy } = createLocalStorageSpy();
    _getItemSpy = getItemSpy;
    initialState = createInitialState();
    provider = new providerConstructor(initialState);
  });

  describe('when setting initial state', () => {
    it('should check storage for initial value', () => {
      expect(window.localStorage.getItem).toHaveBeenCalledTimes(1);
      expect(window.localStorage.getItem).toHaveBeenCalledWith('__ark');
    });
  });

  describe('when setting new state value', () => {
    const initialStorageValue = { AnotherStore: { x: 42 } };

    beforeEach(() => {
      (window.localStorage.getItem as jest.Mock).mockReturnValue(`${JSON.stringify(initialStorageValue)}`);
    });

    it('should save it to the storage', () => {
      const expectedStoredValue = {
        ...initialStorageValue,
        Test: { a: INITIAL_A_VALUE, b: NEXT_VALUE_1 },
      };
      provider.setState({ a: INITIAL_A_VALUE, b: NEXT_VALUE_1 });
      expect(window.localStorage.setItem).toHaveBeenCalledTimes(1);
      expect(window.localStorage.setItem).toHaveBeenCalledWith('__ark', JSON.stringify(expectedStoredValue));
    });
  });
});
