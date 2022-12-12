import { distinctUntilChanged, map, Observable, ReplaySubject } from 'rxjs';

import { StateProvider, SelectStateFunction } from '../entities';

/**
 * Classic RxJs state provider based on behavior subject.
 */
export class RxjsStateProvider<State> implements StateProvider<State> {
  protected _state: State;
  protected readonly stateSubject$ = new ReplaySubject<State>(1);

  get state(): State {
    return this._state;
  }

  constructor(protected readonly initialState?: State) {
    this._state = initialState ? initialState : ({} as State);
    this.stateSubject$.next(this._state);
  }

  setState(state: State): void {
    this._state = state;
    this.stateSubject$.next(this._state);
  }

  selectState<Result>(selectFn: SelectStateFunction<State, Result>): Observable<Result> {
    return this.stateSubject$.asObservable().pipe(
      map<State, Result>(state => selectFn(state)),
      distinctUntilChanged(),
    );
  }

  getValue(): State {
    return { ...this._state };
  }

  reset(): void {
    this.setState(this.initialState ? this.initialState : ({} as State));
  }

  destroy(): void {
    this.stateSubject$.complete();
  }
}
