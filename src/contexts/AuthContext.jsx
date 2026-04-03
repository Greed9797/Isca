import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';

// Create a Context for Authentication
const AuthContext = createContext({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Get initial session securely
    const initializeAuth = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Erro de segurança ao verificar sessão:', error.message);
      }
      
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    initializeAuth();

    // 2. Set up listener for auth state changes (Login, Logout, Token Refresh)
    // Ensures tokens are handled securely behind the scenes by Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Cleanup subscription
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Secure Sign In Function
  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  // Secure Sign Out Function
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const value = {
    session,
    user,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
