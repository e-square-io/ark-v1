import { ArkObserver, ArkStore, StoreConstructor, SubscriptionDescriptor, StoreOptions, ReducerFn } from '../entities';
import { Hooks } from '../entities/hooks';
import { getHooksFromOptions } from './utils/get-hooks-from-options';

export function mixinStore<State>(): StoreConstructor<State, ArkStore<State>> {
  return class implements ArkStore<State> {
    private state: State;
    private _observers: ArkObserver<State>[] = [];
    private readonly _hooks: Hooks<State>;

    get subscriptions(): ArkObserver<State>[] {
      return [...this._observers];
    }

    get hooks(): Hooks<State> {
      return this._hooks;
    }

    get value(): State {
      return this.getValue();
    }
    set value(_v: Partial<State>) {
      this.update(_v);
    }

    constructor(private readonly initialState: State, options?: StoreOptions<State>) {
      this._hooks = new Hooks<State>(getHooksFromOptions(options));

      if (options?.destroyer) {
        const destroyer = options.destroyer();
        destroyer(() => this.destroy());
      }

      let state =
        typeof initialState !== 'object'
          ? initialState
          : Array.isArray(initialState)
          ? (initialState.slice(0) as State)
          : { ...initialState };
      if (this._hooks.beforeInit.length) {
        for (const interceptor of this._hooks.beforeInit) {
          state = interceptor(state);
        }
      }

      this.state = typeof state !== 'object' ? state : Array.isArray(state) ? (state.slice(0) as State) : { ...state };

      if (this._hooks.afterInit.length) {
        for (const interceptor of this._hooks.afterInit) {
          interceptor(this.state);
        }
      }
    }

    update(updateObj: Partial<State>): void;
    update(reducerFn: ReducerFn<State>): void;
    update(arg: Partial<State> | ReducerFn<State>): void {
      let state: State;
      if (typeof arg === 'function') {
        state = { ...this.state, ...arg(this.state) };
      } else if (typeof arg === 'object' && Array.isArray(arg)) {
        if (this._hooks.beforeUpdate.length) {
          for (const interceptor of this._hooks.beforeUpdate) {
            interceptor(this.state, arg, this);
          }
        }

        state = arg.slice(0) as State;
      } else if (typeof arg === 'object') {
        if (this._hooks.beforeUpdate.length) {
          for (const interceptor of this._hooks.beforeUpdate) {
            interceptor(this.state, arg, this);
          }
        }

        state = { ...this.state, ...arg };
      } else if (typeof arg === 'boolean' || typeof arg === 'number' || typeof arg === 'string') {
        state = arg;
      } else {
        return;
      }

      this.setState(state);
    }

    subscribe(observer: ArkObserver<State>): SubscriptionDescriptor {
      const descriptor = this._observers.length;
      this._observers.push(observer);
      observer(this.state);

      return descriptor;
    }

    unsubscribe(descriptor: SubscriptionDescriptor): void {
      if (descriptor > this._observers.length - 1) {
        return;
      }

      this._observers.splice(descriptor, 1);
    }

    getValue(): State {
      return typeof this.state !== 'object'
        ? this.state
        : Array.isArray(this.state)
        ? (this.state.slice(0) as State)
        : { ...this.state };
    }

    reset(): void {
      this.setState(this.initialState);
    }

    destroy(): void {
      if (this._hooks.beforeDestroy.length) {
        for (const interceptor of this._hooks.beforeDestroy) {
          interceptor(this.state, this);
        }
      }

      this._observers = [];
    }

    private setState(state: State): void {
      this.state =
        typeof this.state !== 'object' && typeof state !== 'object'
          ? state
          : Array.isArray(this.state) && Array.isArray(state)
          ? (state.slice(0) as State)
          : { ...state };

      if (this._hooks.afterUpdate.length) {
        for (const interceptor of this._hooks.afterUpdate) {
          interceptor(this.state, this);
        }
      }
    }
  };
}
