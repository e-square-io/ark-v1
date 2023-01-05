/* eslint-disable @angular-eslint/directive-class-suffix */
import { Directive, inject, Input, OnChanges, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';
import { Observable, Subscription, Subject, takeUntil, tap } from 'rxjs';

import { ArkStore, UnknownState } from '../entities';
import { AsyncContext } from './async-context';

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
export class ArkSelect<T extends UnknownState, S extends ArkStore<T>> implements OnChanges, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly templateRef = inject(TemplateRef<AsyncContext<T>>);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly context = new AsyncContext<T>();
  private readonly view = this.viewContainerRef.createEmbeddedView<AsyncContext<T>>(this.templateRef, this.context);
  private selectSubscription?: Subscription;
  private store?: S;
  private key?: keyof UnknownState;

  @Input()
  set arkSelectFrom(store: S) {
    this.store = store;
  }

  @Input()
  set arkSelectBy(key: string) {
    this.key = key;
  }

  static ngTemplateContextGuard<T extends UnknownState, S extends ArkStore<T>>(
    dir: ArkSelect<T, S>,
    ctx: unknown,
  ): ctx is AsyncContext<T> {
    return true;
  }

  ngOnChanges(): void {
    if (!this.store) {
      throw new Error('Store is mandatory.');
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const select$: Observable<any> = this.key
      ? this.store.select(state => state[this.key as keyof UnknownState])
      : this.store.select();
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

  ngOnDestroy(): void {
    this.selectSubscription?.unsubscribe();
    this.destroy$.next();
  }
}
