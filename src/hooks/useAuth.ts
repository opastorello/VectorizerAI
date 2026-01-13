import { useState, useEffect, useCallback } from 'react';

interface UseAuthReturn {
  isAuthRequired: boolean | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AUTH_STORAGE_KEY = 'vectorizer_auth';

const API_BASE = '/api';

export function useAuth(): UseAuthReturn {
  const [isAuthRequired, setIsAuthRequired] = useState<boolean | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAuthConfig() {
      try {
        const response = await fetch(`${API_BASE}/auth/config`);
        const data = await response.json();
        const authRequired = data.authRequired;
        setIsAuthRequired(authRequired);

        if (!authRequired) {
          setIsAuthenticated(true);
        } else {
          const stored = sessionStorage.getItem(AUTH_STORAGE_KEY);
          if (stored === 'true') {
            setIsAuthenticated(true);
          }
        }
      } catch {
        setIsAuthRequired(false);
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    }

    checkAuthConfig();
  }, []);

  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        sessionStorage.setItem(AUTH_STORAGE_KEY, 'true');
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    setIsAuthenticated(false);
  }, []);

  return {
    isAuthRequired,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
}
