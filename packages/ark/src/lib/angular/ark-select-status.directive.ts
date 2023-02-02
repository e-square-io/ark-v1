/* eslint-disable @angular-eslint/directive-class-suffix */
import { Directive, inject, Input, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';

import { SubscriptionDescriptor } from '../entities';
import { HasStatus, StatusContext } from '../status';

@Directive({
  selector: '[arkSelectStatus],[arkSelectStatusFrom]',
  standalone: true,
})
export class ArkSelectStatus implements OnDestroy {
  private readonly templateRef = inject(TemplateRef<StatusContext>);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly context = new StatusContext();
  private readonly view = this.viewContainerRef.createEmbeddedView<StatusContext>(this.templateRef, this.context);
  private storeSubscription?: SubscriptionDescriptor;
  private store?: HasStatus;

  @Input()
  set arkSelectStatusFrom(store: HasStatus) {
    this.store = store;
    this.storeSubscription && this.store.unsubscribeFromStatus(this.storeSubscription);
    this.storeSubscription = this.store.subscribeToStatus(status => {
      this.context.update(status);
      this.view.detectChanges();
    });
  }

  static ngTemplateContextGuard(dir: ArkSelectStatus, ctx: unknown): ctx is StatusContext {
    return true;
  }

  ngOnDestroy(): void {
    this.storeSubscription && this.store?.unsubscribeFromStatus(this.storeSubscription);
  }
}
