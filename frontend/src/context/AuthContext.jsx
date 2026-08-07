import { createContext, useContext, useState } from "react";
import api from "../api/axiosInstance";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Rehydrate from localStorage on page refresh so the user stays logged in
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    const data = response.data; // { token, userId, name, email, role }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);

    return data;
  };

  const register = async (registerPayload) => {
    const response = await api.post("/auth/register", registerPayload);
    const data = response.data;

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);

    return data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook so components just call useAuth() instead of importing useContext + AuthContext everywhere
export function useAuth() {
  return useContext(AuthContext);
}
