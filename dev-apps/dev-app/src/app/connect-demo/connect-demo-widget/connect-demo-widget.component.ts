import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'ark-connect-demo-widget',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './connect-demo-widget.component.html',
  styleUrls: ['./connect-demo-widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConnectDemoWidgetComponent {
  @Input() codeSnippet?: string;
  @Input() inputControl?: FormControl<string>;
  @Input() isConnected = false;
  @Output() readonly action = new EventEmitter<'connect' | 'disconnect'>();
}
