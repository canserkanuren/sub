/* eslint-disable no-underscore-dangle */
import { inject, Injectable } from '@angular/core';
import { Session, User } from '@supabase/supabase-js';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { SupabaseService } from '../../supabase/supabase.service';
import { RegisterPayload } from '../models/register.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly supabaseService = inject(SupabaseService);
  private currentUser$: BehaviorSubject<User | null> =
    new BehaviorSubject<User | null>(null);
  private isAppLoaded$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  constructor() {
    this.supabaseService.client.auth.onAuthStateChange((event, session) => {
      if (['SIGNED_IN', 'TOKEN_REFRESHED'].includes(event) && session) {
        this.currentUser$.next(session.user);
      }
    });

    this.loadUser().then(() => {
      this.isAppLoaded$.next(true);
    });
  }

  async loadUser(): Promise<void> {
    const user = await this.user();

    user && this.currentUser$.next(user);
  }

  async user(): Promise<User | null> {
    const user = await this.supabaseService.client.auth.getUser();

    return user?.data?.user;
  }

  isUserLoggedIn(): Observable<boolean> {
    return this.getCurrentUser().pipe(map(user => !!user));
  }

  get isAppLoaded(): Observable<boolean> {
    return this.isAppLoaded$.asObservable();
  }

  async session(): Promise<Session | null> {
    const session = await this.supabaseService.client.auth.getSession();

    return session?.data?.session;
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUser$.asObservable();
  }

  getCurrentUserId(): string | null {
    const { value } = this.currentUser$;
    return value ? (value as User).id : null;
  }

  async login({ email, password }: RegisterPayload): Promise<void> {
    const { error } = await this.supabaseService.client.auth.signInWithPassword(
      {
        email,
        password
      }
    );

    if (error) throw new Error();
  }

  async register({ email, password }: RegisterPayload): Promise<void> {
    const { error } = await this.supabaseService.client.auth.signUp({
      email,
      password
    });

    if (error) throw new Error();
  }

  async logout(): Promise<void> {
    await this.supabaseService.client.auth.signOut();

    this.currentUser$.next(null);
  }
}
