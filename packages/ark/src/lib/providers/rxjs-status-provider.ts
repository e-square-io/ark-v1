import { distinctUntilChanged, map, Observable, ReplaySubject } from 'rxjs';

import { StateProvider, SelectStateFunction, StatusState, Status, DefaultError } from '../entities';

/**
 * RxJs provider that implements status state functionality.
 */
export class RxjsStatusProvider<S = Status, Err = DefaultError> implements StateProvider<StatusState<S, Err>> {
  protected _state: StatusState<S, Err>;
  protected readonly stateSubject$ = new ReplaySubject<StatusState<S, Err>>(1);

  get state(): StatusState<S, Err> {
    return this._state;
  }

  constructor(protected readonly initialState?: StatusState<S, Err>) {
    this._state = initialState ? initialState : ({ status: 'idle' } as StatusState<S, Err>);
    this.stateSubject$.next(this._state);
  }

  setState(state: StatusState<S, Err>): void {
    if (state.status === 'error' && !state.error) {
      throw new Error('Setting status to error requires updating the `error` property as well.');
    }

    if (state.status !== 'error') {
      state.error = undefined;
    }

    this._state = state;
    this.stateSubject$.next(this._state);
  }

  selectState<Result>(selectFn: SelectStateFunction<StatusState<S, Err>, Result>): Observable<Result> {
    return this.stateSubject$.asObservable().pipe(
      map<StatusState<S, Err>, Result>(state => selectFn(state)),
      distinctUntilChanged(),
    );
  }

  getValue(): StatusState<S, Err> {
    return { ...this._state };
  }

  reset(): void {
    this.setState(this.initialState ? this.initialState : ({ status: 'idle' } as StatusState<S, Err>));
  }

  destroy(): void {
    this.stateSubject$.complete();
  }
}
