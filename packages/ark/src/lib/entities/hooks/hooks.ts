import {
  AfterInitInterceptor,
  AfterUpdateInterceptor,
  ArkHooks,
  BeforeDestroyInterceptor,
  BeforeInitInterceptor,
  BeforeUpdateInterceptor,
  HasHooks,
} from './ark-hooks';

export class Hooks<State> implements ArkHooks<State> {
  beforeInit: BeforeInitInterceptor<State>[];
  afterInit: AfterInitInterceptor<State>[];
  beforeUpdate: BeforeUpdateInterceptor<State>[];
  afterUpdate: AfterUpdateInterceptor<State>[];
  beforeDestroy: BeforeDestroyInterceptor<State>[];

  constructor(hooks: HasHooks<State>) {
    this.beforeInit = hooks.beforeInit || [];
    this.afterInit = hooks.afterInit || [];
    this.beforeUpdate = hooks.beforeUpdate || [];
    this.afterUpdate = hooks.afterUpdate || [];
    this.beforeDestroy = hooks.beforeDestroy || [];

    this.afterUpdate.push((state, store) => {
      for (const subscription of store.subscriptions) {
        subscription(state);
      }
    });
  }

  addBeforeDestroy(interceptor: BeforeDestroyInterceptor<State>): void {
    this.beforeDestroy.push(interceptor);
  }
}
