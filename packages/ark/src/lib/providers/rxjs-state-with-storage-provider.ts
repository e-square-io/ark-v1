import { distinctUntilChanged, map, Observable, ReplaySubject } from 'rxjs';

import {
  StateProviderConstructor,
  StateProvider,
  SelectStateFunction,
  StorageOptions,
  StorageMechanism,
} from '../entities';

function tryGetStorage(storage: StorageMechanism): Storage | undefined {
  try {
    return typeof window[storage] !== 'undefined' ? window[storage] : undefined;
  } catch {
    return undefined;
  }
}

const DEFAULT_STORAGE_ROOT_KEY = '__ark';

/**
 * RxJs state provider that keeps its state in browser storage.
 * @param options Browser storage configuration.
 */
export function RxjsStateWithStorageProvider<State>(options: StorageOptions): StateProviderConstructor<State> {
  return class implements StateProvider<State> {
    private _state: State;
    private readonly stateSubject$ = new ReplaySubject<State>(1);
    private storage = tryGetStorage(options.storage);

    get state(): State {
      return this._state;
    }

    constructor(private readonly initialState?: State) {
      const storageValue = this.readStorage()?.[options.name];

      this._state = storageValue ? { ...this.state, ...storageValue } : initialState ? initialState : ({} as State);
      this.stateSubject$.next(this._state);
    }

    setState(state: State): void {
      this._state = state;
      this.stateSubject$.next(this._state);
      this.updateStorage();
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

    protected updateStorage(): void {
      if (!options.storage || !this.storage) {
        return;
      }

      let storageValue = this.readStorage();
      storageValue = storageValue ? storageValue : {};

      storageValue[options.name] = { ...this.state };
      this.storage.setItem(this.getRootKey(), JSON.stringify(storageValue));
    }

    protected readStorage(): Record<string, Partial<State>> | null {
      if (!options.storage || !this.storage) {
        return null;
      }

      const value = this.storage.getItem(this.getRootKey());

      if (value) {
        try {
          return JSON.parse(value);
        } catch {
          return null;
        }
      }

      return null;
    }

    protected getRootKey(): string {
      return options.storageRootKey || DEFAULT_STORAGE_ROOT_KEY;
    }
  };
}
