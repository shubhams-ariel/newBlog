import React, { createContext, useContext, useState,  type ReactNode } from "react";
import API from "../services/api";
import { toast } from "react-toastify";
import { setEncryptedCookie } from "../utils/cookieUtils";
import type { LoginResponse, SignupResponse } from "../interfaces/User";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  user: LoginResponse["user"] | null;
  role: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (data: { username: string; email: string; password: string }) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<LoginResponse["user"] | null>(() => {
    const storedUser = localStorage.getItem("username");
    return storedUser
      ? {
          id: localStorage.getItem("userId") || "",
          username: storedUser,
          profilePic: localStorage.getItem("profilePic") || "",
        }
      : null;
  });

  const [role, setRole] = useState<string | null>(() => localStorage.getItem("role"));
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    try {
      const res = await API.post<LoginResponse>("/login", { email, password }, { withCredentials: true });
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("username", res.data.user.username);
      localStorage.setItem("profilePic", res.data.user.profilePic || "");
      localStorage.setItem("userId", res.data.user.id);

      setEncryptedCookie("role", res.data.role);

      setUser(res.data.user);
      setRole(res.data.role);

      toast.success("Login successful!", { position: "top-right", autoClose: 3000 });
      navigate("/dashboard");
      return true;
    } catch (err: any) {
      toast.error(err.response?.data?.msg || "Network error, please try again", { position: "top-right", autoClose: 3000 });
      return false;
    }
  };

  /** Signup */
  const signup = async (data: { username: string; email: string; password: string }) => {
    try {
      const res = await API.post<SignupResponse>("/signup", data, { withCredentials: true });

      localStorage.setItem("role", res.data.role);
      localStorage.setItem("username", res.data.user.username);
      localStorage.setItem("profilePic", res.data.user.profilePic || "");
      localStorage.setItem("userId", res.data.user.id);

      setEncryptedCookie("role", res.data.role);

      setUser(res.data.user);
      setRole(res.data.role);

      toast.success("Signup successful!", { position: "top-right", autoClose: 3000 });
      return true;
    } catch (err: any) {
      toast.error(err.response?.data?.msg || "Network error, please try again", { position: "top-right", autoClose: 3000 });
      return false;
    }
  };

  /** Logout */
  const logout = () => {
    localStorage.clear();
    setUser(null);
    setRole(null);
    toast.info("Logged out successfully", { position: "top-right", autoClose: 2000 });
  };

  return (
    <AuthContext.Provider value={{ user, role, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/** Hook to use auth context */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
