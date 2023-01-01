import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ArkSelect, ArkStore, createStore } from '@e-square/ark';
import { map, Observable } from 'rxjs';

import { ConnectDemoWidgetComponent } from './connect-demo-widget/connect-demo-widget.component';

interface ConnectionState {
  x?: string;
}

function createInitialState(): ConnectionState {
  return {};
}

type Index = 0 | 1 | 2;

@Component({
  selector: 'ark-connect-demo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ConnectDemoWidgetComponent, ArkSelect],
  templateUrl: './connect-demo.component.html',
  styleUrls: ['./connect-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConnectDemoComponent {
  readonly stores: ArkStore<ConnectionState>[] = [
    createStore<ConnectionState>(createInitialState()),
    createStore<ConnectionState>(createInitialState()),
    createStore<ConnectionState>(createInitialState()),
  ];
  readonly inputs: FormControl<string>[] = [
    new FormControl<string>('', { nonNullable: true }),
    new FormControl<string>('', { nonNullable: true }),
    new FormControl<string>('', { nonNullable: true }),
  ];
  readonly connections: boolean[] = [false, false, false];
  // eslint-disable-next-line prettier/prettier
  readonly codeSnippets: string[] = [`
const state$: Observable<ConnectionState> = this.input.valueChanges.pipe(map(x => ({ x })));
this.store.connect(state$);`,
    // eslint-disable-next-line prettier/prettier
`
this.store.connect(this.input.valueChanges, 'x');`,
    // eslint-disable-next-line prettier/prettier
`
const state$: Observable<ConnectionState> = this.input.valueChanges.pipe(map(x => ({ x })));
this.store.connect(state$, value => ({ x: \`prefix_\${value.x}\` }));`,
  ];

  act(action: 'connect' | 'disconnect', index: Index): void {
    action === 'connect' ? this.connect(index) : this.disconnect(index);
  }

  private connect(index: Index): void {
    switch (index) {
      case 0:
        this.connectFullStore(0);
        break;
      case 1:
        this.connectWithKey(1, 'x');
        break;
      case 2:
        this.connectWithFunction(2);
        break;
    }
  }

  private disconnect(index: Index): void {
    switch (index) {
      case 0:
        this.stores[index].disconnect();
        this.connections[index] = false;
        break;
      case 1:
        this.stores[index].disconnect('x');
        this.connections[index] = false;
        break;
      case 2:
        this.stores[index].disconnect('func');
        this.connections[index] = false;
        break;
    }
  }

  private connectFullStore(index: Index): void {
    if (this.connections[index]) {
      return;
    }

    const state$: Observable<ConnectionState> = this.inputs[index].valueChanges.pipe(map(x => ({ x })));
    this.stores[index].connect(state$);
    this.connections[index] = true;
  }

  private connectWithKey(index: Index, key: keyof ConnectionState): void {
    if (this.connections[index]) {
      return;
    }

    this.stores[index].connect(this.inputs[index].valueChanges, key);
    this.connections[index] = true;
  }

  private connectWithFunction(index: Index): void {
    if (this.connections[index]) {
      return;
    }

    const state$: Observable<ConnectionState> = this.inputs[index].valueChanges.pipe(map(x => ({ x })));
    this.stores[index].connect(state$, value => ({ x: `prefix_${value.x}` }));
    this.connections[index] = true;
  }
}
