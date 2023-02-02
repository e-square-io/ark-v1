import { ArkObserver, SubscriptionDescriptor } from '../../entities';
import { StatusState } from './status-state';

export interface HasStatus {
  updateStatus(status: Partial<StatusState>): void;
  subscribeToStatus(projectFn: ArkObserver<StatusState>): SubscriptionDescriptor;
  unsubscribeFromStatus(descriptor: SubscriptionDescriptor): void;
  getStatus(): StatusState;
  resetStatus(): void;
}

export function createInitialStatusState(): StatusState {
  return { status: 'idle' };
}
