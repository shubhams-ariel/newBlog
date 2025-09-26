import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import API from "../services/api";
import { toast } from "react-toastify";
import { setEncryptedCookie } from "../utils/cookieUtils";
import type { LoginResponse, SignupResponse } from "../interfaces/User";
import { useNavigate } from "react-router-dom";
import { startTokenRefresh, stopTokenRefresh } from "../utils/tokenManager";

interface AuthContextType {
  user: LoginResponse["user"] | null;
  role: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (data: { username: string; email: string; password: string }) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<LoginResponse["user"] | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const fetchUser = async () => {
      try {
        const res = await API.get("/me", { withCredentials: true });
        if (res.data.user) {
          setUser(res.data.user);
          setRole(res.data.user.role);
          localStorage.setItem("username", res.data.user.username);
          localStorage.setItem("userId", res.data.user.id);

         
          interval = setInterval(() => {
           
          }, (15 * 60 - 10) * 1000); 
        }
      } catch {
        setUser(null);
        setRole(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await API.post<LoginResponse>(
        "/login",
        { email, password },
        { withCredentials: true }
      );

      localStorage.setItem("username", res.data.user.username);
      localStorage.setItem("profilePic", res.data.user.profilePic || "");
      localStorage.setItem("userId", res.data.user.id);

      setEncryptedCookie("role", res.data.role);

      setUser(res.data.user);
      setRole(res.data.role);
       startTokenRefresh();
      toast.success("Login successful!", { position: "top-right", autoClose: 3000 });
      navigate("/dashboard");
      return true;
    } catch (err: any) {
      toast.error(
        err.response?.data?.msg || "Network error, please try again",
        { position: "top-right", autoClose: 3000 }
      );
      return false;
    }
  };

  const signup = async (data: { username: string; email: string; password: string }) => {
    try {
      const res = await API.post<SignupResponse>("/signup", data, {
        withCredentials: true,
      });

      //localStorage.setItem("role", res.data.role);
      localStorage.setItem("username", res.data.user.username);
      localStorage.setItem("profilePic", res.data.user.profilePic || "");
      localStorage.setItem("userId", res.data.user.id);

      setEncryptedCookie("role", res.data.role);

      setUser(res.data.user);
      setRole(res.data.role);
      startTokenRefresh();
      toast.success("Signup successful!", { position: "top-right", autoClose: 3000 });
      return true;
    } catch (err: any) {
      toast.error(
        err.response?.data?.msg || "Network error, please try again",
        { position: "top-right", autoClose: 3000 }
      );
      return false;
    }
  };

  const logout = () => {
    stopTokenRefresh();
    localStorage.clear();
    setUser(null);
    setRole(null);
    toast.info("Logged out successfully", { position: "top-right", autoClose: 2000 });
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
