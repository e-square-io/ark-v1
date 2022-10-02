import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'ark-books',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooksComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
