import { RouteMeta } from '@analogjs/router';
import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { filter, of, switchMap } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';

export const routeMeta: RouteMeta = {
  title: 'Subscription admin',
  canActivate: [
    () => {
      const router = inject(Router);

      return inject(AuthService)
        .getCurrentUser()
        .pipe(
          filter(user => user !== null),
          switchMap(isAuthenticated =>
            of(!isAuthenticated ? router.createUrlTree(['/login']) : true)
          )
        );
    }
  ],
  providers: []
};

@Component({
  selector: 'sub-admin-subscription-details',
  standalone: true,
  imports: [],
  template: ``
})
export default class SubscriptionDetailsComponent {
  subscriptionId = input.required<string>();
}
