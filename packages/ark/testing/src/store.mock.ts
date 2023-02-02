import { ArkObserver, ArkStore } from '@e-square/ark';

export type StoreMock<State> = Partial<Record<keyof ArkStore<State>, jest.Mock | State | ArkObserver<State>[]>>;
export function createStoreMock<State>(initialState: State): StoreMock<State> {
  return {
    value: initialState,
    subscriptions: [] as ArkObserver<State>[],
    getValue: jest.fn(),
    update: jest.fn(),
    subscribe: jest.fn(),
    unsubscribe: jest.fn(),
    reset: jest.fn(),
    destroy: jest.fn(),
  };
}
