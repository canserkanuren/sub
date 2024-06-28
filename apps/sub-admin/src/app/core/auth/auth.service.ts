/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import {
  createClient,
  Session,
  SupabaseClient,
  User
} from '@supabase/supabase-js';
import { BehaviorSubject, Observable } from 'rxjs';

export interface RegisterPayload {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase: SupabaseClient;
  private currentUser: BehaviorSubject<User> = new BehaviorSubject({} as User);

  constructor() {
    // const url = process.env['SUPABASE_URL'] ?? '';
    // const key = process.env['SUPABASE_KEY'] ?? '';
    const url = import.meta.env['VITE_SUPABASE_URL'];
    const key = import.meta.env['VITE_SUPABASE_KEY'];

    this.supabase = createClient(url, key, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    });

    this.supabase.auth.onAuthStateChange((event, session) => {
      if (['SIGNED_IN', 'TOKEN_REFRESHED'].includes(event) && session) {
        this.currentUser.next(session.user);
      }
    });

    this.loadUser();
  }

  async loadUser(): Promise<void> {
    if (this.currentUser.value) {
      return;
    }

    const user = await this.user();

    user && this.currentUser.next(user);
  }

  async user(): Promise<User | null> {
    const user = await this.supabase.auth.getUser();

    return user?.data?.user;
  }

  async session(): Promise<Session | null> {
    const session = await this.supabase.auth.getSession();

    return session?.data?.session;
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUser.asObservable();
  }

  getCurrentUserId(): string | null {
    const { value } = this.currentUser;
    return value ? (value as User).id : null;
  }

  async login({ email, password }: RegisterPayload): Promise<void> {
    const { error } = await this.supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw new Error();
  }

  async register({ email, password }: RegisterPayload): Promise<void> {
    const { error } = await this.supabase.auth.signUp({
      email,
      password
    });

    if (error) throw new Error();
  }

  async logout(): Promise<void> {
    await this.supabase.auth.signOut();
  }
}
