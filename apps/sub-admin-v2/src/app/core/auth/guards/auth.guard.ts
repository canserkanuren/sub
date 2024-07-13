import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { combineLatest, filter, of, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const loginGuard = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return combineLatest([
    authService.isUserLoggedIn(),
    authService.isAppLoaded
  ]).pipe(
    filter(([, isAppLoaded]) => isAppLoaded),
    switchMap(([isUserLoggedIn]) =>
      of(!isUserLoggedIn ? true : router.createUrlTree(['/']))
    )
  );
};

export const protectedRoutesGuard = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return combineLatest([
    authService.isUserLoggedIn(),
    authService.isAppLoaded
  ]).pipe(
    filter(([, isAppLoaded]) => isAppLoaded),
    switchMap(([isUserLoggedIn]) =>
      of(!isUserLoggedIn ? router.createUrlTree(['/login']) : true)
    )
  );
};
