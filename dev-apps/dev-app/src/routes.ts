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
    ],
  },
];
