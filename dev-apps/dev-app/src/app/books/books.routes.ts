import { Routes } from '@angular/router';

export const BOOKS_ROUTES: Routes = [
  {
    path: 'books-reactive',
    loadComponent: () => import('./books-reactive/books-reactive.component').then(m => m.BooksReactiveComponent),
  },
  {
    path: 'books-declarative',
    loadComponent: () =>
      import('./books-declarative/books-declarative.component').then(m => m.BooksDeclarativeComponent),
  },
];
