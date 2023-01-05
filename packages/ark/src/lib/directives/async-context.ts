export class AsyncContext<T> {
  private _value?: T;

  get $implicit(): T | undefined {
    return this._value;
  }

  update(value: T | undefined): void {
    this._value = value;
  }
}
