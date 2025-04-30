
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

type Profile = {
  id: string;
  name: string | null;
  role: string;
};

type AuthState = {
  user: User | null;
  profile: Profile | null;
  isAdmin: boolean;
  initialized: boolean;
  loading: boolean;
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>; // Fixed return type
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  isAdmin: false,
  initialized: false,
  loading: false,
  
  initialize: async () => {
    const { data } = await supabase.auth.getSession();
    
    if (data.session?.user) {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.session.user.id)
        .single();
        
      set({ 
        user: data.session.user,
        profile: profileData,
        isAdmin: profileData?.role === 'admin',
        initialized: true
      });
    } else {
      set({ user: null, profile: null, initialized: true });
    }
  },
  
  login: async (email, password) => {
    set({ loading: true });
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (data.user) {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
        
      set({
        user: data.user,
        profile: profileData,
        isAdmin: profileData?.role === 'admin',
        loading: false
      });
    } else {
      set({ loading: false });
    }
    
    return { error: error ? error.message : null };
  },
  
  loginWithGoogle: async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
  },
  
  register: async (email, password, name) => {
    set({ loading: true });
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
        },
      },
    });
    
    set({ loading: false });
    
    return { error: error ? error.message : null };
  },
  
  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, profile: null });
  },
  
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile, isAdmin: profile?.role === 'admin' }),
}));
