import { createContext, useEffect, useState, useCallback } from "react";
import * as authService from "../services/authService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.onAuthChange((u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const register = useCallback(async (payload) => {
    const u = await authService.register(payload);
    setUser(u);
    return u;
  }, []);

  const login = useCallback(async (payload) => {
    const u = await authService.login(payload);
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const resetPassword = useCallback((email) => authService.resetPassword(email), []);

  const updateProfile = useCallback(
    async (patch) => {
      if (!user) return;
      const updated = await authService.updateUserProfile(user.id, patch);
      setUser((prev) => ({ ...prev, ...updated }));
      return updated;
    },
    [user]
  );

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === "admin",
    register,
    login,
    logout,
    resetPassword,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
