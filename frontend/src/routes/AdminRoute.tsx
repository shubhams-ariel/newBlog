import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface Props {
  children: JSX.Element;
}

const AdminRoute: React.FC<Props> = ({ children }) => {
  const { role, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div>Loading...</div>;
  if (role !== "admin") return <Navigate to="/login" replace state={{ from: location }} />;

  return children;
};

export default AdminRoute;
