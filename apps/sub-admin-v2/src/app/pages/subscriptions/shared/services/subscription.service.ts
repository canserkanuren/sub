/* eslint-disable no-underscore-dangle */
import { inject, Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { SupabaseService } from '../../../../core/supabase/supabase.service';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private readonly supabaseService = inject(SupabaseService);

  getSubscriptions(start: number, end: number): Observable<any> {
    return from(
      this.supabaseService.client
        .from('subscriptions')
        .select()
        .range(start, end)
    );
  }
}
