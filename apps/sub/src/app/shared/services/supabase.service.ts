import { Injectable } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { DateTime } from 'luxon';
import { environment } from '../../../environments/environment';
import { Subscription } from '../models/subscription.model';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.SUPABASE_URL,
      environment.SUPABASE_KEY
    );
  }

  async addSub(subscription: Subscription): Promise<void> {
    const now = DateTime.now().toFormat('yyyyMMdd_HHmmss');
    const uniqueId = `${subscription.lastName.toUpperCase()}_${subscription.firstName}_${now}`;

    const { error: identityCardRectoError, data: identityCardRectoData } =
      await this.supabase.storage
        .from('identityCards')
        .upload(
          `${uniqueId}/identity_card_recto`,
          subscription.identityCardRecto
        );

    if (identityCardRectoError) {
      throw new Error('failed to send attachment');
    }

    const { error: identityCardVersoError, data: identityCardVersoData } =
      await this.supabase.storage
        .from('identityCards')
        .upload(
          `${uniqueId}/identity_card_verso`,
          subscription.identityCardVerso
        );

    if (identityCardVersoError) {
      throw new Error('failed to send attachment');
    }

    const { error } = await this.supabase.from('subscriptions').insert({
      unique_id: uniqueId,
      last_name: subscription.lastName,
      first_name: subscription.firstName,
      mail: subscription.mail,
      address: subscription.address,
      zipcode: subscription.zipcode,
      city: subscription.city,
      identity_card_recto_url: identityCardRectoData.path,
      identity_card_verso_url: identityCardVersoData.path
    });

    if (error) {
      throw new Error('failed to add subs');
    }
  }
}
