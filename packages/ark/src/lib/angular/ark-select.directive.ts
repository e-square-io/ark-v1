/* eslint-disable @angular-eslint/directive-class-suffix */
import { Directive, inject, Input, OnChanges, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';

import { ArkStore, SubscriptionDescriptor, UnknownState } from '../entities';
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
export class ArkSelect<T, S extends ArkStore<T>> implements OnChanges, OnDestroy {
  private readonly templateRef = inject(TemplateRef<AsyncContext<T | T[keyof T]>>);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly context = new AsyncContext<T | T[keyof T]>();
  private readonly view = this.viewContainerRef.createEmbeddedView<AsyncContext<T | T[keyof T]>>(
    this.templateRef,
    this.context,
  );
  private store?: S;
  private key?: string;
  private storeSubscription?: SubscriptionDescriptor;

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
  ): ctx is AsyncContext<T | T[keyof T]> {
    return true;
  }

  ngOnChanges(): void {
    if (!this.store) {
      throw new Error('Store is mandatory.');
    }

    this.storeSubscription && this.store.unsubscribe(this.storeSubscription);
    this.storeSubscription = this.store.subscribe(state => {
      const value = this.key ? state[this.key as keyof T] : state;

      this.context.update(value);
      this.view.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.storeSubscription && this.store?.unsubscribe(this.storeSubscription);
  }
}
