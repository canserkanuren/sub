import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./home/home.component').then((c) => c.HomeComponent),
  },
  {
    path: 'subscription',
    loadComponent: () =>
      import('./subscription/subscription.component').then(
        (c) => c.SubscriptionComponent
      ),
  },
];
