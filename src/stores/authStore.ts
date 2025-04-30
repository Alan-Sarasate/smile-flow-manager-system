
import { create } from 'zustand';
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from '@supabase/supabase-js';
import { toast } from "sonner";

interface Profile {
  id: string;
  name: string | null;
  role: string;
}

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  initialized: boolean;
  isAdmin: boolean;
  
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  profile: null,
  isLoading: true,
  initialized: false,
  isAdmin: false,
  
  initialize: async () => {
    try {
      // Set up auth state listener FIRST
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          set({ session, user: session?.user ?? null });
          
          // Use setTimeout to prevent Supabase deadlock
          if (session?.user) {
            setTimeout(() => {
              get().fetchProfile();
            }, 0);
          }
        }
      );
      
      // THEN check for existing session
      const { data: { session } } = await supabase.auth.getSession();
      set({ 
        session, 
        user: session?.user ?? null, 
        isLoading: false,
        initialized: true,
      });
      
      if (session?.user) {
        await get().fetchProfile();
      }
      
      return () => subscription.unsubscribe();
    } catch (error) {
      console.error("Auth initialization error:", error);
      set({ isLoading: false, initialized: true });
    }
  },
  
  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      toast.success("Login realizado com sucesso!");
      set({ isLoading: false });
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Falha ao fazer login");
      set({ isLoading: false });
    }
  },
  
  loginWithGoogle: async () => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) throw error;
      
      set({ isLoading: false });
    } catch (error: any) {
      console.error("Google login error:", error);
      toast.error(error.message || "Falha ao fazer login com Google");
      set({ isLoading: false });
    }
  },
  
  register: async (email, password, name) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
          }
        }
      });
      
      if (error) throw error;
      
      toast.success("Registro realizado com sucesso!");
      set({ isLoading: false });
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || "Falha ao registrar");
      set({ isLoading: false });
    }
  },
  
  logout: async () => {
    try {
      await supabase.auth.signOut();
      set({ user: null, session: null, profile: null, isAdmin: false });
      toast.success("Logout realizado com sucesso");
    } catch (error: any) {
      console.error("Logout error:", error);
      toast.error(error.message || "Falha ao fazer logout");
    }
  },
  
  fetchProfile: async () => {
    const { user } = get();
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (error) throw error;
      
      const isAdmin = data?.role === 'admin';
      
      set({ 
        profile: data as Profile,
        isAdmin
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  }
}));
