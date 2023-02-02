import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  ArkAsync,
  ArkSelect,
  ArkSelectStatus,
  ArkStore,
  createEffect,
  createStore,
  HasStatus,
  withStatus,
} from '@e-square/ark';
import { delay, Observable, of, Subject, switchMap, map, throwError } from 'rxjs';

interface RequestData {
  x: string | number;
  y: string | number;
}

interface ResponseData {
  a: string | number;
  b: string | number;
}

interface DataForm {
  a: FormControl<string | number>;
  b: FormControl<string | number>;
}

interface EffectDemoComponentState {
  result?: ResponseData;
  xxx?: number;
}

function requestData(a: string | number, b: string | number, responseTime = 1000): Observable<ResponseData> {
  return !a ? throwError(() => new Error('There is no "a" provided')) : of({ a, b }).pipe(delay(responseTime));
}

@Component({
  selector: 'ark-effect-demo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ArkSelect, ArkSelectStatus, ArkAsync],
  templateUrl: './effect-demo.component.html',
  styleUrls: ['./effect-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EffectDemoComponent {
  readonly submit$ = new Subject<RequestData>();
  readonly store = createStore<EffectDemoComponentState, ArkStore<EffectDemoComponentState> & HasStatus>(
    {},
    undefined,
    withStatus,
  );
  readonly getData = createEffect<RequestData, EffectDemoComponentState>(
    req$ =>
      req$.pipe(
        switchMap(req => requestData(req.x, req.y, 1000)),
        map(result => ({ result })),
      ),
    this.store,
  );

  readonly form = new FormGroup<DataForm>({
    a: new FormControl<string | number>('', { nonNullable: true }),
    b: new FormControl<string | number>('', { nonNullable: true }),
  });

  constructor() {
    // Supply actions observable that will trigger effect
    this.getData(this.submit$);
  }

  submit(): void {
    const a = this.form.controls.a.value;
    const b = this.form.controls.b.value;
    this.submit$.next({ x: a, y: b });

    // Call effect explicitly
    // this.getData({ x: a, y: b });
  }
}
