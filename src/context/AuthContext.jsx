import { createContext, useState, useEffect, useCallback } from 'react';
import {
  loginUser,
  signupUser,
  logoutUser,
  getCurrentUser,
  clearAccessToken,
} from '../services/auth';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    let cancelled = false;
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (!cancelled && currentUser) {
          setUser(currentUser);
          setIsAuthenticated(true);
        }
      } catch {

      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    checkAuth();
    return () => { cancelled = true; };
  }, []);

  const login = useCallback(async (credentials) => {
    const data = await loginUser(credentials);
    setUser(data.user);
    setIsAuthenticated(true);
    return data;
  }, []);

  const signup = useCallback(async (userData) => {
    const data = await signupUser(userData);
    setUser(data.user);
    setIsAuthenticated(true);
    return data;
  }, []);

  const logout = useCallback(async () => {
    await logoutUser();
    setUser(null);
    setIsAuthenticated(false);
    clearAccessToken();
  }, []);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
