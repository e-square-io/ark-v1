import { ChangeDetectorRef, inject, ViewRef } from '@angular/core';

const ERROR_MESSAGE = 'To use Angular features the store must be created in an injection context such as a constructor';

export function injetcViewRef(): ViewRef {
  try {
    const viewRef = inject(ChangeDetectorRef, { optional: true }) as ViewRef | null;

    if (!viewRef) {
      throw new Error(ERROR_MESSAGE);
    }

    return viewRef;
  } catch {
    throw new Error(ERROR_MESSAGE);
  }
}
