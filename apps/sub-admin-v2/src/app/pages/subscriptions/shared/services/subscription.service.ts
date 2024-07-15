/* eslint-disable no-underscore-dangle */
import { inject, Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { SupabaseService } from '../../../../core/supabase/supabase.service';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private readonly supabaseService = inject(SupabaseService);

  getSubscriptions(start: number, end: number, size: number): Observable<any> {
    const rangeStart = start * size;
    return from(
      this.supabaseService.client
        .from('subscriptions')
        .select()
        .range(rangeStart, size)
        .order('created_at', { ascending: false })
    );
  }

  getSubscriptionById(id: number): Observable<any> {
    return from(
      this.supabaseService.client
        .from('subscriptions')
        .select()
        .eq('id', id)
        .single()
    );
  }

  getFileFromBucket(fileName: string): Observable<any> {
    return from(
      this.supabaseService.client.storage
        .from('identityCards')
        .createSignedUrl(fileName, 6000)
    );
  }
}
