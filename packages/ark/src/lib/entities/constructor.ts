/* eslint-disable @typescript-eslint/no-explicit-any */
import { StoreOptions } from './store-options';

export type Constructor<T> = new (...args: any[]) => T;
export type StoreConstructor<State, T> = new (initialState: State, options?: StoreOptions<State>) => T;
