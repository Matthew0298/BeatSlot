import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api, clearToken, getToken, MeResponse, setToken } from '@/lib/api';

interface AuthContextValue {
  profile: MeResponse | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (body: Record<string, string>) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<MeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    const data = await api.me();
    setProfile(data);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        if (token) {
          await refreshProfile();
        }
      } catch {
        await clearToken();
        setProfile(null);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [refreshProfile]);

  const signIn = useCallback(async (email: string, password: string) => {
    const result = await api.login(email, password);
    await setToken(result.access_token);
    await refreshProfile();
  }, [refreshProfile]);

  const signUp = useCallback(async (body: Record<string, string>) => {
    const result = await api.register(body);
    await setToken(result.access_token);
    await refreshProfile();
  }, [refreshProfile]);

  const signOut = useCallback(async () => {
    await clearToken();
    setProfile(null);
  }, []);

  const value = useMemo(
    () => ({
      profile,
      isLoading,
      isAuthenticated: !!profile,
      signIn,
      signUp,
      signOut,
      refreshProfile,
    }),
    [profile, isLoading, signIn, signUp, signOut, refreshProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
