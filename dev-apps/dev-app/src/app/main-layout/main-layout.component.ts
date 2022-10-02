import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'ark-main-layout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayoutComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
