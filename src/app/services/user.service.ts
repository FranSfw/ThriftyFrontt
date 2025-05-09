import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private user = new BehaviorSubject<any>(null);
  user$ = this.user.asObservable();
  private readonly apiUrl =
    'https://thrifty-production.up.railway.app/users';

  /**
   * Constructs a new instance of the UserService.
   *
   * @param supabase The SupabaseService to use for authentication.
   */
  constructor(private supabase: SupabaseService) {
    this.restoreSession();
  }

  private async restoreSession() {
    try {
      // ✅ First, check if a session is stored in localStorage
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        this.user.next(JSON.parse(storedUser));
      }

      // ✅ Then, check if Supabase has an active session
      const { data } = await this.supabase.getSession();
      if (data.session) {
        this.user.next(data.session.user);
        localStorage.setItem('user', JSON.stringify(data.session.user)); // ✅ Save session
      }

      // ✅ Listen for auth state changes
      this.supabase.onAuthStateChange((_, session) => {
        this.user.next(session?.user ?? null);
        if (session?.user) {
          localStorage.setItem('user', JSON.stringify(session.user)); // ✅ Store user session
        } else {
          localStorage.removeItem('user'); // ❌ Remove session if logged out
        }
      });
    } catch (error) {
      console.error('Error restoring session:', error);
    }
  }

  // user.service.ts
  async changeEmail(email: string) {
    return await this.supabase.updateEmail(email);
  }

  async changePassword(password: string) {
    return await this.supabase.updatePassword(password);
  }

  getFullUserProfile(): Promise<any> {
    const authUser = this.user.value;
    if (!authUser) return Promise.resolve(null);

    return fetch(`${this.apiUrl}/auth/${authUser.id}`).then((res) =>
      res.json()
    );
  }

  async login(email: string, password: string) {
    const { data, error } = await this.supabase.login(email, password);
    if (!error) {
      this.user.next(data.user);
      localStorage.setItem('user', JSON.stringify(data.user)); // ✅ Store session
    }
    return { data, error };
  }

  async logout() {
    await this.supabase.logout();
    this.user.next(null);
    localStorage.removeItem('user'); // ✅ Clear session
  }

  getCurrentUser() {
    return this.user.value;
  }

  async signUp(
    firstName: string,
    lastName: string,
    username: string,
    email: string,
    password: string
  ) {
    // ✅ Step 1: Register the user with Supabase Auth
    const { data, error } = await this.supabase.signUp(email, password);

    if (error || !data.user) {
      console.error('Error signing up:', error?.message);
      return { data: null, error };
    }

    // ✅ Step 2: Insert additional user details into your "users" table
    const { error: insertError } = await this.supabase.insertUserMetadata(
      data.user.id,
      firstName,
      lastName,
      username,
      email
    );

    if (insertError) {
      console.error('Error saving user metadata:', insertError.message);
      return { data: null, error: insertError };
    }

    this.user.next(data.user);
    localStorage.setItem('user', JSON.stringify(data.user));

    return { data: data.user, error: null };
  }

  async updateUserInfo(
    id: number,
    updates: { name?: string; username?: string }
  ) {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`, {
        method: 'PUT', // or PATCH, depending on your backend setup
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update user info');
      }

      const data = await response.json();
      return { data, error: null };
    } catch (error: any) {
      console.error('Update failed:', error.message);
      return { data: null, error };
    }
  }

  // ✅ Google Sign-in (Corrected)
  async signInWithGoogle() {
    const { data, error } = await this.supabase.signInWithGoogle();

    if (error) {
      console.error('Google login failed:', error.message);
      return { data: null, error };
    }

    // ✅ Redirect the user to the Google login page
    if (data?.url) {
      window.location.href = data.url; // Redirects to the OAuth page
    }

    return { data, error };
  }
}
