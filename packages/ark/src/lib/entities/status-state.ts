import { DefaultError } from './default-error';
import { Status } from './status';

export interface StatusState<S = Status, E = DefaultError> {
  status: S;
  error?: E;
}
