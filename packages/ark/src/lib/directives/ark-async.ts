/* eslint-disable @angular-eslint/directive-class-suffix */
import { Directive, Input } from '@angular/core';
import { Observable, Subscription, takeUntil, tap } from 'rxjs';

import { ArkAsyncBase } from './ark-async-base';

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
export class ArkAsync<T = unknown> extends ArkAsyncBase<T | undefined | null> {
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
          this.context.update(value);
          this.view.detectChanges();
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }
}
