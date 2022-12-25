import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DoCheck, OnDestroy } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ArkAsync, ArkSelect } from '@e-square/ark';
import { filter, map, Subject, takeUntil, timer } from 'rxjs';

import { TimeStore } from './time.store';

type AsyncDemoComponentMode = 'async-pipe' | 'async-directive' | 'select-directive';

@Component({
  selector: 'ark-async-demo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DatePipe, ArkAsync, ArkSelect],
  providers: [TimeStore],
  templateUrl: './async-demo.component.html',
  styleUrls: ['./async-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsyncDemoComponent implements DoCheck, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  checkCount = 0;
  mode: AsyncDemoComponentMode = 'async-pipe';
  readonly modeControl = new FormControl<AsyncDemoComponentMode>(this.mode);
  readonly time$ = timer(0, 1000).pipe(
    map(() => Date.now()),
    takeUntil(this.destroy$),
  );

  constructor(readonly timeStore: TimeStore) {
    this.modeControl.valueChanges
      .pipe(filter(Boolean), takeUntil(this.destroy$))
      .subscribe(value => (this.mode = value));
    this.time$.pipe(takeUntil(this.destroy$)).subscribe(timestamp => this.timeStore.update({ timestamp }));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  ngDoCheck(): void {
    this.checkCount++;
  }
}
