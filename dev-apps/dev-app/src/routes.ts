import { Routes } from '@angular/router';

import { AuthGuard } from './app/auth/auth.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./app/login/login.component').then(c => c.LoginComponent) },
  {
    path: '',
    loadComponent: () => import('./app/main-layout/main-layout.component').then(c => c.MainLayoutComponent),
    canActivate: [AuthGuard],
    children: [
      {
        path: 'async-demo',
        loadComponent: () => import('./app/async-demo/async-demo.component').then(c => c.AsyncDemoComponent),
      },
      {
        path: 'connect-demo',
        loadComponent: () => import('./app/connect-demo/connect-demo.component').then(c => c.ConnectDemoComponent),
      },
      {
        path: 'effect-demo',
        loadComponent: () => import('./app/effect-demo/effect-demo.component').then(c => c.EffectDemoComponent),
      },
      {
        path: 'books-demo',
        loadComponent: () => import('./app/books/books.component').then(c => c.BooksComponent),
      },
    ],
  },
];
