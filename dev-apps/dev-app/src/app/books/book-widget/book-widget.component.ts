import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Book } from '../entities';

@Component({
  selector: 'ark-book-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book-widget.component.html',
  styleUrls: ['./book-widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookWidgetComponent {
  @Input() book?: Book;
}
