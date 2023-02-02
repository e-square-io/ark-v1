import { ArkObserver, ArkStore, Constructor, SubscriptionDescriptor } from '../entities';
import { createStore } from '../store';
import { HasStatus, createInitialStatusState } from './entities/has-status';
import { StatusState } from './entities/status-state';

export function mixinStatus<T extends Constructor<ArkStore<unknown>>>(store: T): T & Constructor<HasStatus> {
  return class extends store implements HasStatus {
    private readonly statusStore = createStore<StatusState>(createInitialStatusState());

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(...args: any[]) {
      super(...args);
      this.hooks.addBeforeDestroy(() => this.statusStore.destroy());
    }

    updateStatus(statusState: Partial<StatusState>): void {
      if (statusState.status === 'error' && !statusState.error) {
        throw new Error('Setting status to error requires updating the `error` property as well.');
      }

      if (statusState.status !== 'error') {
        statusState.error = undefined;
      }

      this.statusStore.update(statusState);
    }

    subscribeToStatus(observer: ArkObserver<StatusState>): SubscriptionDescriptor {
      return this.statusStore.subscribe(observer);
    }

    unsubscribeFromStatus(descriptor: SubscriptionDescriptor): void {
      this.statusStore.unsubscribe(descriptor);
    }

    getStatus(): StatusState {
      return this.statusStore.getValue();
    }

    resetStatus(): void {
      this.statusStore.reset();
    }
  };
}
