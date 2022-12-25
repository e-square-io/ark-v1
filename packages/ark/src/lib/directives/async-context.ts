export class AsyncContext<T> {
  $implicit?: T;

  update(value: T): void {
    this.$implicit = value;
  }
}
