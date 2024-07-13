import { Route } from '@angular/router';
import {
  loginGuard,
  protectedRoutesGuard
} from './core/auth/guards/auth.guard';

export const routes: Route[] = [
  { path: '', redirectTo: 'subscriptions', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then(m => m.LoginPageComponent),
    canActivate: [loginGuard]
  },
  {
    path: 'subscriptions',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/subscriptions/subscriptions.component').then(
            m => m.SubscriptionsComponent
          )
      },
      {
        path: ':subscriptionId',
        loadComponent: () =>
          import(
            './pages/subscriptions/pages/subscription-details/subscription-details.component'
          ).then(m => m.SubscriptionDetailsComponent)
      }
    ],
    canActivateChild: [protectedRoutesGuard]
  }
];
