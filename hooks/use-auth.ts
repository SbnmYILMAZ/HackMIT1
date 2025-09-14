"use client";

import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { supabase } from "@/lib/supabase/client";
import type { AuthUser } from "@/lib/types/database";
import type { Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Función simple para obtener usuario actual
async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    console.log("getCurrentUser - fetching user...");
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    console.log("getCurrentUser - user data:", user, "error:", userError);

    if (userError || !user) {
      console.log("getCurrentUser - no user or error, returning null");
      return null;
    }

    console.log("getCurrentUser - fetching profile for user:", user.id);
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    console.log(
      "getCurrentUser - profile data:",
      profile,
      "error:",
      profileError
    );

    type ProfileData = {
      id: string;
      email: string | null;
      username: string;
      full_name: string | null;
      avatar_url: string | null;
      role: "user" | "admin";
    } | null;

    if (!profile) {
      console.log("getCurrentUser - no profile found, returning null");
      return null;
    }

    const typedProfile = profile as ProfileData;

    const authUser = {
      id: user.id,
      email: typedProfile?.email || undefined,
      username: typedProfile?.username || "",
      full_name: typedProfile?.full_name || undefined,
      avatar_url: typedProfile?.avatar_url || undefined,
      role: typedProfile?.role || "user",
    };

    console.log("getCurrentUser - returning auth user:", authUser);
    return authUser;
  } catch (error) {
    console.error("Error en getCurrentUser:", error);
    return null;
  }
}

// Función simple para cerrar sesión
async function signOutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(`Error al cerrar sesión: ${error.message}`);
  }
}
//hhsahas
export function AuthProvider({
  children,
}: {
  children: ReactNode;
}): React.ReactElement {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshUser = async () => {
    if (isRefreshing) {
      console.log("Already refreshing user, skipping...");
      return;
    }

    try {
      setIsRefreshing(true);
      console.log("Refreshing user...");
      const currentUser = await getCurrentUser();
      console.log("Current user:", currentUser);
      setUser(currentUser);
    } catch (error) {
      console.error("Error refreshing user:", error);
      setUser(null);
    } finally {
      setIsRefreshing(false);
    }
  };

  const signOut = async () => {
    try {
      await signOutUser();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  useEffect(() => {
    // Obtener sesión inicial
    const getInitialSession = async () => {
      try {
        const {
          data: { session: initialSession },
        } = await supabase.auth.getSession();
        setSession(initialSession);

        if (initialSession) {
          await refreshUser();
        }
      } catch (error) {
        console.error("Error getting initial session:", error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Escuchar cambios de autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", event, !!session);
      setSession(session);

      if (event === "SIGNED_OUT") {
        setUser(null);
        setLoading(false);
      } else if (event === "INITIAL_SESSION") {
        setLoading(false);
      }
      // Don't handle SIGNED_IN events to prevent loops
    });

    return () => subscription.unsubscribe();
  }, []);

  return React.createElement(
    AuthContext.Provider,
    { value: { user, session, loading, signOut, refreshUser } },
    children
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
