import { StateProvider } from '../src';

export class StateProviderMock<State> implements StateProvider<State> {
  state: State;
  constructor(readonly initialState: State) {
    this.state = initialState;
  }
  setState = jest.fn();
  selectState = jest.fn();
  getValue = jest.fn();
  reset = jest.fn();
  destroy = jest.fn();
}

export function createStateProviderMock<State>(is: State): StateProviderMock<State> {
  return {
    initialState: is,
    state: is,
    setState: jest.fn(),
    selectState: jest.fn(),
    getValue: jest.fn(),
    reset: jest.fn(),
    destroy: jest.fn(),
  };
}
