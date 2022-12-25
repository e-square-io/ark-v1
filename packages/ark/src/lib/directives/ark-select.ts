/* eslint-disable @angular-eslint/directive-class-suffix */
import { Directive, Input, OnChanges, OnDestroy } from '@angular/core';
import { Observable, Subscription, takeUntil, tap } from 'rxjs';

import { ArkStore } from '../entities';
import { ArkAsyncBase } from './ark-async-base';

/**
 * Extended version of `ArkAsync` directive.
 * Behaves similarly. Accepts `ArkStore` and optionally key for the `select` operator.
 *
 * Example usage:
 * ```
 * <ng-container *arkSelect="let time; from: timeStore; by: 'timestamp'">
 *   <span>{{ time | date : 'HH:mm:ss' }}</span>
 * </ng-container>
 * ```
 */
@Directive({
  selector: '[arkSelect],[arkSelectFrom],[arkSelectBy]',
  standalone: true,
})
export class ArkSelect<T> extends ArkAsyncBase<T | T[keyof T]> implements OnChanges, OnDestroy {
  private selectSubscription?: Subscription;
  private store?: ArkStore<T>;
  private key?: string;

  @Input()
  set arkSelectFrom(store: ArkStore<T>) {
    this.store = store;
  }

  @Input()
  set arkSelectBy(key: string) {
    this.key = key;
  }

  ngOnChanges(): void {
    if (!this.store) {
      throw new Error('Store is mandatory.');
    }

    const select$: Observable<T[keyof T] | T> = this.key ? this.store.select(this.key as keyof T) : this.store.select();
    this.selectSubscription?.unsubscribe();
    this.selectSubscription = select$
      .pipe(
        tap(value => {
          this.context.update(value);
          this.view.detectChanges();
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  override ngOnDestroy(): void {
    this.selectSubscription?.unsubscribe();
    super.ngOnDestroy();
  }
}
