import { Constructor } from './constructor';
import { DefaultError } from './default-error';
import { StateProvider } from './state-provider';
import { Status } from './status';

export interface StatusState {
  status: Status;
  error?: DefaultError;
}

export function createDefaultStatus(): StatusState {
  return { status: 'idle' };
}

export interface StatusOptions<State> {
  providerBase: Constructor<StateProvider<State>>;
}
