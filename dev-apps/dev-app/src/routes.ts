import { Routes } from '@angular/router';

import { AuthGuard } from './app/auth/auth.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./app/login/login.component').then(m => m.LoginComponent) },
  {
    path: '',
    loadComponent: () => import('./app/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    canActivate: [AuthGuard],
    children: [
      {
        path: 'async-demo',
        loadComponent: () => import('./app/async-demo/async-demo.component').then(m => m.AsyncDemoComponent),
      },
      {
        path: 'connect-demo',
        loadComponent: () => import('./app/connect-demo/connect-demo.component').then(m => m.ConnectDemoComponent),
      },
      {
        path: 'effect-demo',
        loadComponent: () => import('./app/effect-demo/effect-demo.component').then(m => m.EffectDemoComponent),
      },
      {
        path: 'books',
        loadChildren: () => import('./app/books/books.routes').then(m => m.BOOKS_ROUTES),
      },
    ],
  },
];
