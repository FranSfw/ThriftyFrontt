import { Injectable } from '@angular/core';
import {
  createClient,
  SupabaseClient,
  AuthChangeEvent,
  Session,
} from '@supabase/supabase-js';
import { environment } from '../../enviroments/enviroments'; // ✅ Import environment variables

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    const SUPABASE_URL = environment.SUPABASE_URL;
    const SUPABASE_ANON_KEY = environment.SUPABASE_ANON_KEY;

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      console.error('❌ Missing Supabase environment variables');
    }

    this.supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // ✅ Handle OAuth redirects (Important for Google sign-in)
    this.supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        console.log('✅ Session restored:', data.session);
      }
    });
  }

  // ✅ Login user with email & password
  async login(email: string, password: string) {
    return await this.supabase.auth.signInWithPassword({ email, password });
  }

  // ✅ Sign up a new user (email + password)
  async signUp(email: string, password: string) {
    return await this.supabase.auth.signUp({
      email,
      password,
    });
  }

  async insertUserMetadata(
    authId: string,
    firstName: string,
    lastName: string,
    username: string,
    email: string
  ) {
    const fullName = `${firstName} ${lastName}`;
    return await this.supabase
      .from('user')
      .insert([{ authId, name: fullName, username, email }]);
  }
  // ✅ Logout user
  async logout() {
    return await this.supabase.auth.signOut();
  }

  // ✅ Google Sign-in (Fixed)
  async signInWithGoogle() {
    return await this.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/home`, // ✅ Redirect after login
        skipBrowserRedirect: true, // ✅ Ensures session continuity
      },
    });
  }

  // ✅ Get the current session
  getSession() {
    return this.supabase.auth.getSession();
  }

  // ✅ Listen to auth state changes
  onAuthStateChange(
    callback: (event: AuthChangeEvent, session: Session | null) => void
  ) {
    return this.supabase.auth.onAuthStateChange(callback);
  }

  // supabase.service.ts
  async updateEmail(newEmail: string) {
    return await this.supabase.auth.updateUser({ email: newEmail });
  }

  async updatePassword(newPassword: string) {
    return await this.supabase.auth.updateUser({ password: newPassword });
  }
}
