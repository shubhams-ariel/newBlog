import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { getDecryptedCookie } from "../utils/cookieUtils";

const Dashboard: React.FC = () => {
  const username = localStorage.getItem("username") || "User";
  const [userRole, setUserRole] = useState("user");

  useEffect(() => {
    
    const roleFromCookie = getDecryptedCookie("role");
    if (roleFromCookie) {
      setUserRole(roleFromCookie);
    } else {
      
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          const decoded: { role: string } = jwtDecode(token);
          setUserRole(decoded.role);
        } catch (error) {
          console.error("Failed to decode token:", error);
        }
      }
    }
  }, []);

  const isAdmin = userRole.toLowerCase() === "admin";

  return (
    <div className="min-h-screen shadow-lg flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-2xl p-10 max-w-md w-full text-center border-2 transform transition duration-300 hover:scale-105 hover:shadow-xl">
        <h1 className="text-4xl font-extrabold text-gray-800">
          Welcome, <span className="text-blue-600">{username}</span>!
        </h1>

        <p
          className={`mt-6 text-lg font-medium ${
            isAdmin ? "text-red-600" : "text-blue-600"
          }`}
        >
          You are logged in as an {isAdmin ? "Admin" : "User"}.
        </p>

        <div className="mt-8">
          <Link
            to="/todos"
            className="bg-red-400 p-3 rounded-lg text-white font-semibold inline-block"
          >
            Explore Todos
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
