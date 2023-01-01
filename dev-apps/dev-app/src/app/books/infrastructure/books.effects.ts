import { Injectable } from '@angular/core';
import { createEffect } from '@e-square/ark';
import { switchMap, map, of } from 'rxjs';

import { BooksResponse, BooksState, createInitialBooksState, mapBooksResItemToBook, MAX_RESULTS } from '../entities';
import { BooksService } from './books.service';
import { BooksStore } from './books.store';

@Injectable()
export class BooksEffects {
  /**
   * Get books according to the search term and current page number.
   */
  readonly getBooks = createEffect<{ q: string | null; currentPage: number }, BooksState>(
    q$ =>
      q$.pipe(
        switchMap(({ q, currentPage }) => {
          // If the search term is null, we want to clear the results.
          if (!q) {
            return of(createInitialBooksState());
          }

          // Otherwise, calculate the start index.
          const startIndex = (currentPage - 1) * MAX_RESULTS;

          // And call the API.
          return this.booksService.readBooks(q, startIndex, MAX_RESULTS).pipe(
            // We are getting the API response and map it into our `BookState` object.
            map<BooksResponse, BooksState>(res => ({
              items: res.items.map(i => mapBooksResItemToBook(i)),
              paginationData: { startIndex, maxResults: MAX_RESULTS, totalItems: res.totalItems },
            })),
          );
        }),
      ),
    this.booksStore,
  );

  constructor(private readonly booksService: BooksService, private readonly booksStore: BooksStore) {}
}
