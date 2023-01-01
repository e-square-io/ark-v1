import { BooksEffects } from '../src/app/books/infrastructure';

type BooksEffectsMock = Partial<Record<keyof BooksEffects, jest.Mock>>;
export function createBooksEffectsMock(): BooksEffectsMock {
  return {
    getBooks: jest.fn(),
  };
}
