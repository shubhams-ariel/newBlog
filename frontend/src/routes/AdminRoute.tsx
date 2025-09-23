import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; 

interface Props {
  children: JSX.Element;
}

const AdminRoute: React.FC<Props> = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem("accessToken");
  console.log("AdminRoutetoken:",token);

  if (!token) return <Navigate to="/login" replace state={{ from: location }} />;

  try {
    const decoded=  localStorage.getItem("role"); 
    return decoded === "admin" ? children : <Navigate to="/login" replace state={{ from: location }} />;
  } catch {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
};

export default AdminRoute;
