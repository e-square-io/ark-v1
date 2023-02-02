import { ArkError, Status, StatusState } from './entities';

export class StatusContext {
  private _statusState?: StatusState;

  get $implicit(): StatusState | undefined {
    return this._statusState;
  }

  get status(): Status | undefined {
    return this._statusState?.status;
  }

  get busy(): boolean {
    return this._statusState?.status === 'busy';
  }

  get error(): ArkError | undefined {
    return this._statusState?.error;
  }

  get errorMessage(): string | undefined {
    return this._statusState?.error?.message;
  }

  update(statusState: StatusState): void {
    this._statusState = statusState;
  }
}
