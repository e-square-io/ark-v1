import { ArkStore } from '../ark-store';

export type BeforeInitInterceptor<State> = (initialState: State) => State;
export type AfterInitInterceptor<State> = (state: State) => void;
export type BeforeUpdateInterceptor<State> = (
  currentState: State,
  newState: Partial<State>,
  store: ArkStore<State>,
) => Partial<State>;
export type AfterUpdateInterceptor<State> = (state: State, store: ArkStore<State>) => void;
export type BeforeDestroyInterceptor<State> = (state: State, store: ArkStore<State>) => void;

export interface ArkHooks<State> {
  beforeInit: BeforeInitInterceptor<State>[];
  afterInit: AfterInitInterceptor<State>[];
  beforeUpdate: BeforeUpdateInterceptor<State>[];
  afterUpdate: AfterUpdateInterceptor<State>[];
  beforeDestroy: BeforeDestroyInterceptor<State>[];
}

export interface HasHooks<State> {
  beforeInit?: BeforeInitInterceptor<State>[];
  afterInit?: AfterInitInterceptor<State>[];
  beforeUpdate?: BeforeUpdateInterceptor<State>[];
  afterUpdate?: AfterUpdateInterceptor<State>[];
  beforeDestroy?: BeforeDestroyInterceptor<State>[];
}

export type ArkStoreModifier<State = unknown> = () => Partial<HasHooks<State>>;
