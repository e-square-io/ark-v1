import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { useArkState, withAngularChangeDetection } from '@e-square/ark';
import { debounceTime, Subject, takeUntil } from 'rxjs';

import { BookWidgetComponent } from '../book-widget/book-widget.component';
import { Book, mapBooksResItemToBook, MAX_RESULTS, PaginationData } from '../entities';
import { BooksService } from '../infrastructure';
import { PaginatorComponent } from '../paginator/paginator.component';

@Component({
  selector: 'ark-books-declarative',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BookWidgetComponent, PaginatorComponent],
  providers: [BooksService],
  templateUrl: './books-declarative.component.html',
  styleUrls: ['./books-declarative.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooksDeclarativeComponent implements OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private q: string | null = null;
  private readonly setBooks: (books: Book[]) => void;
  private readonly setPaginationData: (paginationData: PaginationData) => void;

  readonly searchControl = new FormControl<string | null>(null);

  paginationData: () => PaginationData;
  books: () => Book[];

  constructor(private readonly booksService: BooksService) {
    const [books, setBooks] = useArkState<Book[]>([], {
      modifiers: [withAngularChangeDetection()],
    });
    this.books = books;
    this.setBooks = setBooks;

    const [paginationData, setPaginationData] = useArkState<PaginationData>({
      startIndex: 0,
      totalItems: 0,
      maxResults: MAX_RESULTS,
    });
    this.paginationData = paginationData;
    this.setPaginationData = setPaginationData;

    this.searchControl.valueChanges.pipe(debounceTime(700), takeUntil(this.destroy$)).subscribe(q => {
      this.q = q;
      this.readData();
    });
  }

  updatePage(currentPage: number): void {
    const startIndex = (currentPage - 1) * MAX_RESULTS;

    this.setPaginationData({ ...this.paginationData(), startIndex });
    this.readData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  private readData(): void {
    if (!this.q) {
      this.setPaginationData({ ...this.paginationData(), startIndex: 0, totalItems: 0 });
      this.setBooks([]);

      return;
    }

    this.searchControl.disable({ emitEvent: false });
    const { startIndex, maxResults } = this.paginationData();
    this.booksService.readBooks(this.q, startIndex, maxResults).subscribe(({ items, totalItems }) => {
      this.setBooks(items.map(i => mapBooksResItemToBook(i)));
      this.setPaginationData({ startIndex, maxResults, totalItems });
      this.searchControl.enable({ emitEvent: false });
    });
  }
}
