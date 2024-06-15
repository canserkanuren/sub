import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideNgxStripe } from 'ngx-stripe';
import { environment } from '../environments/environment';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes, withComponentInputBinding()),
    // provideExperimentalZonelessChangeDetection(),
    provideNgxStripe(environment.STRIPE_PUBLISHABLE_KEY)
  ]
};
