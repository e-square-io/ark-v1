/* eslint-disable @typescript-eslint/no-explicit-any */
import { Constructor } from './constructor';
import { Hooks } from './hooks';
import { ReducerFn } from './reducer';

export type UnknownState = Record<string, unknown>;
export type SelectKey<State> = keyof State;
export type SubscriptionDescriptor = number;
export type ArkObserver<State> = (state: State) => void;
export type ArkStoreExtension<T, L> = (store: T) => T & Constructor<L>;
export type ArkStoreExtender<T, L> = () => ArkStoreExtension<T, L>;
export type ArkStoreDestroyer = () => (cb: () => any) => void;

/**
 * Ark gives you an abstraction to extend to create your store.
 */
export interface ArkStore<State> {
  readonly subscriptions: ArkObserver<State>[];
  readonly hooks: Hooks<State>;

  /**
   * Current value of the store.
   */
  value: State;

  /**
   * Current value of the store.
   */
  getValue(): State;

  /**
   * Update the store's value.
   *
   * @example
   *
   * store.update({ x: 42 });
   */
  update(updateObj: Partial<State>): void;
  /**
   * Update the store's value.
   *
   * @example
   *
   * store.update(state => ({ x: state.x + 1 }));
   */
  update(reducerFn: ReducerFn<State>): void;
  update(arg: Partial<State> | ReducerFn<State>): void;

  subscribe(projectFn: ArkObserver<State>): SubscriptionDescriptor;

  unsubscribe(descriptor: SubscriptionDescriptor): void;

  /**
   * Reset the store to its initial value.
   */
  reset(): void;

  /**
   * Do all cleanup that needs to occur when the instance is destroyed.
   */
  destroy(): void;
}
