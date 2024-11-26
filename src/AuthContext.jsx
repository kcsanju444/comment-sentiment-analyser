import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);

  const logout = () => {
    setUser(null);
    setAdmin(null);
    // Perform any additional logout logic (e.g., API call, clearing cookies)
  };

  return (
    <AuthContext.Provider value={{ user, setUser, admin, setAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
