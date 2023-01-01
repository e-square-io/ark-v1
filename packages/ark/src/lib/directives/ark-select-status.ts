/* eslint-disable @angular-eslint/directive-class-suffix */
import { Directive, inject, Input, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subject, Subscription, takeUntil } from 'rxjs';

import { ArkStore } from '../entities';
import { StatusContext } from './status-context';

@Directive({
  selector: '[arkSelectStatus],[arkSelectStatusFrom]',
  standalone: true,
})
export class ArkSelectStatus implements OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly templateRef = inject(TemplateRef<StatusContext>);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly context = new StatusContext();
  private readonly view = this.viewContainerRef.createEmbeddedView<StatusContext>(this.templateRef, this.context);
  private storeSubscription?: Subscription;

  @Input()
  set arkSelectStatusFrom(store: ArkStore<unknown>) {
    this.storeSubscription?.unsubscribe();
    this.storeSubscription = store.status$?.pipe(takeUntil(this.destroy$)).subscribe(status => {
      this.context.update(status);
      this.view.detectChanges();
    });
  }

  static ngTemplateContextGuard(dir: ArkSelectStatus, ctx: unknown): ctx is StatusContext {
    return true;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
