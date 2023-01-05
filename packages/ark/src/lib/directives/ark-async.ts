/* eslint-disable @angular-eslint/directive-class-suffix */
import { Directive, inject, Input, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';
import { Observable, Subscription, Subject, takeUntil, tap } from 'rxjs';

import { AsyncContext } from './async-context';

/**
 * Structural directive replacing `async` pipe. Accepts observable,
 * automatically subscribes to it, unsubscribes from it on destroy,
 * and provides context variable that contains emitted value.
 * Every time the value emits, the directive detects changes inside its scope.
 *
 * Example usage:
 * ```
 * <ng-container *arkAsync="let time; from: time$">
 *   <span>{{ time | date : 'HH:mm:ss' }}</span>
 * </ng-container>
 * ```
 */
@Directive({
  selector: '[arkAsync],[arkAsyncFrom]',
  standalone: true,
})
export class ArkAsync<T> implements OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly templateRef = inject(TemplateRef<AsyncContext<T>>);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly context = new AsyncContext<T>();
  private readonly view = this.viewContainerRef.createEmbeddedView<AsyncContext<T>>(this.templateRef, this.context);
  private subscription?: Subscription;

  @Input()
  set arkAsyncFrom(obs$: Observable<T | null> | undefined | null) {
    if (!obs$) {
      return;
    }

    this.subscription?.unsubscribe();

    this.subscription = obs$
      .pipe(
        tap(value => {
          this.context.update(value ? value : undefined);
          this.view.detectChanges();
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  static ngTemplateContextGuard<T>(directive: ArkAsync<T>, context: unknown): context is AsyncContext<T> {
    return true;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
