"use client";

import { createContext, useContext, useEffect, useMemo, useState, useRef, useCallback } from "react";
import type { ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabaseClient";

type SessionContextValue = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  refreshSession: () => Promise<void>;
};

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

// Minimum time between session refreshes (30 seconds - much more conservative)
const MIN_REFRESH_INTERVAL = 30000;

// Session cache key for localStorage
const SESSION_CACHE_KEY = 'pactable_session_cache';
const SESSION_CACHE_TTL = 60 * 60 * 1000; // 1 hour (increased from 5 minutes)

// Helper to check if a JWT is expired
function isJwtExpired(token: string): boolean {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    // Add 60 second buffer
    return decoded.exp * 1000 < Date.now() + 60000;
  } catch {
    return true; // Assume expired if we can't parse
  }
}

// Helper to get cached session from localStorage
function getCachedSession(): { session: Session | null; timestamp: number } | null {
  if (typeof window === 'undefined') return null;
  try {
    const cached = localStorage.getItem(SESSION_CACHE_KEY);
    if (!cached) return null;
    const parsed = JSON.parse(cached);
    
    // Check if cache record is still valid
    if (Date.now() - parsed.timestamp > SESSION_CACHE_TTL) {
      localStorage.removeItem(SESSION_CACHE_KEY);
      return null;
    }
    
    // Check if the actual JWT is still valid
    if (parsed.session?.access_token && isJwtExpired(parsed.session.access_token)) {
      // JWT expired, but we might be able to refresh it
      // Return null to trigger a fresh getSession() which will auto-refresh
      localStorage.removeItem(SESSION_CACHE_KEY);
      return null;
    }
    
    return parsed;
  } catch {
    return null;
  }
}

// Helper to cache session in localStorage
function setCachedSession(session: Session | null) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SESSION_CACHE_KEY, JSON.stringify({
      session,
      timestamp: Date.now()
    }));
  } catch {
    // Ignore localStorage errors
  }
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const supabase = useMemo(() => createClient(), []);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const lastRefreshRef = useRef<number>(0);
  const refreshPromiseRef = useRef<Promise<void> | null>(null);
  const initializedRef = useRef(false);

  const refreshSession = useCallback(async () => {
    const now = Date.now();
    
    // Debounce: don't refresh if we just did
    if (now - lastRefreshRef.current < MIN_REFRESH_INTERVAL) {
      return;
    }

    // Dedupe: return existing promise if refresh is in progress
    if (refreshPromiseRef.current) {
      return refreshPromiseRef.current;
    }

    refreshPromiseRef.current = (async () => {
      try {
        lastRefreshRef.current = now;
        // Use getSession() - it uses cached JWT tokens, doesn't hit the API
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
        // Cache the session
        setCachedSession(session);
      } catch (error) {
        console.error('Session refresh error:', error);
        // On error, try to use cached session
        const cached = getCachedSession();
        if (cached?.session) {
          setSession(cached.session);
          setUser(cached.session.user ?? null);
        }
      } finally {
        setLoading(false);
        refreshPromiseRef.current = null;
      }
    })();

    return refreshPromiseRef.current;
  }, [supabase]);

  useEffect(() => {
    // Only initialize once
    if (initializedRef.current) return;
    initializedRef.current = true;

    const initialize = async () => {
      // Try to use cached session first for instant UI (optimistic)
      const cached = getCachedSession();
      if (cached?.session) {
        setSession(cached.session);
        setUser(cached.session.user ?? null);
        lastRefreshRef.current = cached.timestamp;
        setLoading(false); // Show UI immediately with cached session
      }

      // Verify session with Supabase (this should use local storage, not API)
      try {
        const { data: { session: freshSession } } = await supabase.auth.getSession();
        
        if (freshSession) {
          // Got a valid session - use it
          setSession(freshSession);
          setUser(freshSession.user ?? null);
          setCachedSession(freshSession);
          lastRefreshRef.current = Date.now();
        } else if (cached?.session) {
          // No fresh session but we have cached - KEEP using cached
          // Don't clear the session - the cache is still valid
          console.log('No fresh session, keeping cached session');
        } else {
          // No fresh session and no cache = not logged in
          setSession(null);
          setUser(null);
        }
      } catch (error) {
        console.error('Session init error:', error);
        // On error, keep using cached session if available
        // Don't clear anything on error
      } finally {
        setLoading(false);
      }
    };

    initialize();

    // Listen for auth state changes (login, logout, token refresh)
    // But be careful not to clear valid sessions on spurious null events
    let authChangeTimeout: NodeJS.Timeout | null = null;
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      // Clear any pending update
      if (authChangeTimeout) {
        clearTimeout(authChangeTimeout);
      }
      
      // Debounce auth state changes (100ms)
      authChangeTimeout = setTimeout(() => {
        // Only clear session on explicit SIGNED_OUT event
        // For other events, only update if we have a valid session
        if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
          setCachedSession(null);
          localStorage.removeItem(SESSION_CACHE_KEY);
        } else if (newSession) {
          // We have a valid session - update
          setSession(newSession);
          setUser(newSession.user ?? null);
          setCachedSession(newSession);
        }
        // If newSession is null but event is not SIGNED_OUT, 
        // keep the current session (might be a spurious event)
        
        setLoading(false);
        lastRefreshRef.current = Date.now();
      }, 100);
    });

    return () => {
      if (authChangeTimeout) {
        clearTimeout(authChangeTimeout);
      }
      subscription.unsubscribe();
    };
  }, [supabase, refreshSession]);

  const value = useMemo(
    () => ({ session, user, loading, refreshSession }),
    [session, user, loading, refreshSession]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSessionContext() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSessionContext must be used within a SessionProvider");
  }
  return context;
}
