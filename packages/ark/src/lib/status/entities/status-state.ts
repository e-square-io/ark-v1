import { ArkError } from './ark-error';
import { Status } from './status';

export interface StatusState {
  status: Status;
  error?: ArkError;
}

export function createDefaultStatus(): StatusState {
  return { status: 'idle' };
}
