import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './guards/index';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  // Public routes
  {
    path: 'home',
    loadComponent: () =>
      import('./components/public/home/home.component').then(
        (m) => m.HomeComponent
      ),
  },
  {
    path: 'about-it',
    loadComponent: () =>
      import('./components/public/about-it/about-it-component').then(
        (m) => m.AboutItComponent
      ),
  },
  {
    path: 'contact-me',
    loadComponent: () =>
      import('./components/public/contact-me/contact-me').then(
        (m) => m.ContactMeComponent
      ),
  },
  {
    path: 'login',
    canMatch: [guestGuard],
    loadComponent: () =>
      import('./components/public/auth/login-component/login-component').then(
        (m) => m.LoginComponent
      ),
  },

  // Private routes
  {
    path: 'admin-projects',
    canMatch: [authGuard],
    loadComponent: () =>
      import('./components/private/admin-projects/admin-projects').then(
        (m) => m.AdminProjects
      ),
  },
  // Fallback route
  {
    path: '**',
    redirectTo: 'home',
  },
];
