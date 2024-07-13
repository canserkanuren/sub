/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private _supabase: SupabaseClient;

  constructor() {
    const url = environment.SUPABASE_URL;
    const key = environment.SUPABASE_KEY;

    this._supabase = createClient(url, key, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    });
  }

  get client(): SupabaseClient {
    return this._supabase;
  }
}
