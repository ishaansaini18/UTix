import { createContext, useEffect, useMemo, useState } from "react";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("utixUser"));
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("utixUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("utixUser");
    }
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      signIn: (account, role = "student") =>
        setUser({ ...account, role }),
      logout: () => setUser(null),
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
