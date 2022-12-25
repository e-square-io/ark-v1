import { Directive, inject, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subject } from 'rxjs';

import { AsyncContext } from './async-context';

@Directive()
export class ArkAsyncBase<T> implements OnDestroy {
  protected readonly destroy$ = new Subject<void>();
  protected readonly templateRef = inject(TemplateRef<T>);
  protected readonly viewContainerRef = inject(ViewContainerRef);
  protected readonly context = new AsyncContext<T>();
  protected readonly view = this.viewContainerRef.createEmbeddedView<AsyncContext<T>>(this.templateRef, this.context);

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
