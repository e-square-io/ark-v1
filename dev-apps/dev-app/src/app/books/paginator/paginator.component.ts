import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { PaginationData } from '../entities';

@Component({
  selector: 'ark-paginator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginatorComponent {
  @Input()
  set paginationData(value: PaginationData) {
    this.totalPages = Math.ceil(value.totalItems / value.maxResults);
    this.currentPage = value.startIndex / value.maxResults + 1;
  }

  @Output() readonly page = new EventEmitter<number>();

  currentPage = 0;
  totalPages = 0;
}
