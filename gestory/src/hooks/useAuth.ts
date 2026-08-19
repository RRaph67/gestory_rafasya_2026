"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/services/supabaseClient";

export interface AuthUser {
  id: string;
  email?: string | null;
  full_name?: string | null;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    if (!supabase) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const session = data.session;
        if (session && mounted) {
          const u = session.user;
          setUser({ id: u.id, email: u.email, full_name: u.user_metadata?.full_name });
          try {
            localStorage.setItem("authToken", session.access_token);
          } catch {}
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && session.access_token) {
        const u = session.user;
        setUser({ id: u.id, email: u.email, full_name: u.user_metadata?.full_name });
        try {
          localStorage.setItem("authToken", session.access_token);
        } catch {}
      } else {
        setUser(null);
        try {
          localStorage.removeItem("authToken");
        } catch {}
      }
      if (mounted) setLoading(false);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const sb = supabase;
    if (!sb) throw new Error("Supabase client is not initialized");
    const res = await sb.auth.signInWithPassword({ email, password });
    if (res.error) throw res.error;
    return res;
  };

  const signUp = async (fullName: string, email: string, password: string) => {
    const sb = supabase;
    if (!sb) throw new Error("Supabase client is not initialized");
    const res = await sb.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });
    if (res.error) throw res.error;
    return res;
  };

  const signOut = async () => {
    const sb = supabase;
    if (!sb) throw new Error("Supabase client is not initialized");
    await sb.auth.signOut();
    try {
      localStorage.removeItem("authToken");
    } catch {}
    setUser(null);
  };

  return { user, loading, signIn, signUp, signOut };
}
