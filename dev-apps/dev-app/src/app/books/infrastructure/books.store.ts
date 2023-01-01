import { Injectable } from '@angular/core';
import { Store } from '@e-square/ark';

import { BooksState, createInitialBooksState } from '../entities';

@Injectable()
export class BooksStore extends Store<BooksState>({ withStatus: true }) {
  constructor() {
    super(createInitialBooksState());
  }
}
