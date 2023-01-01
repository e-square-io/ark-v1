/* eslint-disable @angular-eslint/directive-class-suffix */
import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[arkSelect],[arkSelectFrom],[arkSelectBy]',
  standalone: true,
})
export class ArkSelectMock {
  @Input() arkSelectFrom?: any;
  @Input() arkSelectBy?: any;
}
