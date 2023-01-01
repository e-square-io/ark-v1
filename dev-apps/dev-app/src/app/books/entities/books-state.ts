import { Book } from './book';
import { PaginationData } from './pagination-data';

export const MAX_RESULTS = 5;

export interface BooksState {
  items: Book[];
  paginationData: PaginationData;
}

export function createInitialBooksState(): BooksState {
  return {
    items: [],
    paginationData: {
      startIndex: 0,
      maxResults: MAX_RESULTS,
      totalItems: 0,
    },
  };
}
