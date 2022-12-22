import { Observable, ReplaySubject } from 'rxjs';

import { ArkStore } from '../src';

export type StoreMock<State> = Partial<Record<keyof ArkStore<State>, jest.Mock | State | Observable<State>>>;
export function createStoreMock<State>(initialState: State): StoreMock<State> {
  return {
    value: initialState,
    status$: new ReplaySubject<State>(),
    update: jest.fn(),
    select: jest.fn(),
    updateStatus: jest.fn(),
    reset: jest.fn(),
    destroy: jest.fn(),
  };
}
