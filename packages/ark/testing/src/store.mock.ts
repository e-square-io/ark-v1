import { ArkStore } from '@e-square/ark';
import { Observable, ReplaySubject } from 'rxjs';

export type StoreMock<State> = Partial<Record<keyof ArkStore<State>, jest.Mock | State | Observable<State>>>;
export function createStoreMock<State>(initialState: State): StoreMock<State> {
  return {
    value: initialState,
    status$: new ReplaySubject<State>(),
    update: jest.fn(),
    select: jest.fn(() => new ReplaySubject<any>()),
    updateStatus: jest.fn(),
    reset: jest.fn(),
    destroy: jest.fn(),
  };
}
