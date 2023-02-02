import { Injectable } from '@angular/core';
import { ArkStore, HasStatus, Store, withStatus } from '@e-square/ark';

import { BooksState, createInitialBooksState } from '../entities';

@Injectable()
export class BooksStore extends Store<BooksState, ArkStore<BooksState> & HasStatus>(withStatus) {
  constructor() {
    super(createInitialBooksState());
  }
}
