import type { User } from '@/lib/shared/types';
import { create } from 'zustand';
import { supabase } from '../supabase/client';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
  checkUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    console.log('[DEBUG] Login started');
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('[DEBUG] Login error:', error);
      throw error;
    }

    console.log('[DEBUG] Login success:', data.user);

    if (data.user) {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle();

      if (userError) {
        console.error('[DEBUG] Fetch user error:', userError);
        throw userError;
      }

      if (!userData) {
        console.log('[DEBUG] User not found in users table, creating...');
        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .insert([
            { id: data.user.id, email: data.user.email, username: email.split('@')[0], is_admin: false }
          ])
          .select()
          .single();

        if (insertError) {
          console.error('[DEBUG] Insert user error:', insertError);
          set({
            user: { id: data.user.id, email: data.user.email || '', username: email.split('@')[0], is_admin: false, created_at: new Date().toISOString() },
            isAuthenticated: true,
            isLoading: false,
          });
          return;
        }

        console.log('[DEBUG] New user created:', newUser);
        set({
          user: newUser,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        console.log('[DEBUG] User found:', userData);
        set({
          user: userData,
          isAuthenticated: true,
          isLoading: false,
        });
      }
    }
  },

  register: async (email: string, password: string, username: string) => {
    console.log('[DEBUG] Register started');

    const { data: usernameExists } = await supabase
      .rpc('check_username_available', { check_username: username });

    if (usernameExists === false) {
      throw new Error('Bu kullanıcı adı zaten alınmış. Lütfen başka bir kullanıcı adı seçin.');
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error('[DEBUG] Register error:', error);
      throw error;
    }

    console.log('[DEBUG] Register success:', data.user);

    if (data.user) {
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert([
          { id: data.user.id, email: data.user.email, username: username, is_admin: false }
        ])
        .select()
        .single();

      if (insertError) {
        console.error('[DEBUG] Insert user error:', insertError);
        set({
          user: { id: data.user.id, email: data.user.email || '', username: username, is_admin: false, created_at: new Date().toISOString() },
          isAuthenticated: true,
          isLoading: false,
        });
        return;
      }

      console.log('[DEBUG] New user created:', newUser);
      set({
        user: newUser,
        isAuthenticated: true,
        isLoading: false,
      });
    }
  },

  logout: async () => {
    console.log('[DEBUG] Logout started');
    await supabase.auth.signOut();
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  checkUser: async () => {
    console.log('[DEBUG] checkUser started');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      console.log('[DEBUG] Session:', session);

      if (session?.user) {
        console.log('[DEBUG] User logged in, fetching user data...');
        const { data: userData, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        if (error) {
          console.error('[DEBUG] Fetch user error:', error);
          set({ user: null, isAuthenticated: false, isLoading: false });
          return;
        }

        if (!userData) {
          console.log('[DEBUG] User not found in users table, creating...');
          const { data: newUser, error: insertError } = await supabase
            .from('users')
            .insert([
              { id: session.user.id, email: session.user.email, username: session.user.email?.split('@')[0], is_admin: false }
            ])
            .select()
            .single();

          if (insertError) {
            console.error('[DEBUG] Insert user error:', insertError);
            set({
              user: { id: session.user.id, email: session.user.email || '', username: session.user.email?.split('@')[0], is_admin: false, created_at: new Date().toISOString() },
              isAuthenticated: true,
              isLoading: false,
            });
            return;
          }

          console.log('[DEBUG] New user created:', newUser);
          set({
            user: newUser,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          console.log('[DEBUG] User found:', userData);
          set({
            user: userData,
            isAuthenticated: true,
            isLoading: false,
          });
        }
      } else {
        console.log('[DEBUG] No session, user not logged in');
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch (error) {
      console.error('[DEBUG] checkUser error:', error);
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));