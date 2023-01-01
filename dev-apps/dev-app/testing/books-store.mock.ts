import { StoreMock, createStoreMock } from '@e-square/ark/testing';
import { Observable } from 'rxjs';

import { BooksState, createInitialBooksState } from '../src/app/books/entities';
import { BooksStore } from '../src/app/books/infrastructure';

type BooksStoreMock = StoreMock<BooksState> &
  Partial<Record<keyof BooksStore, jest.Mock | Observable<any> | BooksState>>;
export function createBooksStoreMock(): BooksStoreMock {
  return {
    ...createStoreMock(createInitialBooksState()),
  };
}
