/* eslint-disable @angular-eslint/directive-class-suffix */
import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[arkSelectStatus],[arkSelectStatusFrom]',
  standalone: true,
})
export class ArkSelectStatusMock {
  @Input() arkSelectStatusFrom?: any;
}
