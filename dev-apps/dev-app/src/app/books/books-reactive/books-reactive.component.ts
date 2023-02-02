import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ArkSelect, ArkSelectStatus, createStore, connect, select } from '@e-square/ark';
import { debounceTime } from 'rxjs';

import { BookWidgetComponent } from '../book-widget/book-widget.component';
import { BooksEffects, BooksService, BooksStore } from '../infrastructure';
import { PaginatorComponent } from '../paginator/paginator.component';

interface BooksComponentState {
  q: string | null;
  currentPage: number;
}

function createInitialBooksComponentState(): BooksComponentState {
  return {
    q: null,
    currentPage: 1,
  };
}

@Component({
  selector: 'ark-books',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ArkSelect, ArkSelectStatus, BookWidgetComponent, PaginatorComponent],
  providers: [BooksEffects, BooksService, BooksStore],
  templateUrl: './books-reactive.component.html',
  styleUrls: ['./books-reactive.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooksReactiveComponent {
  /**
   * We need th component store to keep the data
   * about the search term and the current page.
   */
  readonly componentStore = createStore<BooksComponentState>(createInitialBooksComponentState());
  readonly searchControl = new FormControl<string | null>(null);

  constructor(readonly booksEffects: BooksEffects, readonly booksStore: BooksStore) {
    // Observable of the search term
    const q$ = this.searchControl.valueChanges.pipe(debounceTime(700));
    connect(this.componentStore, q$, 'q');

    /**
     * Call effect every time we update either the search term
     * or current page number.
     */
    booksEffects.getBooks(select(this.componentStore));

    // Console errors
    booksStore.subscribeToStatus(status => status.error && console.log(status.error));
  }

  updatePage(currentPage: number): void {
    this.componentStore.update({ currentPage });
  }
}
