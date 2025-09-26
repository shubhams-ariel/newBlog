import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Dashboard: React.FC = () => {
  const { user, role } = useAuth();

  const username = user?.username || "User";
  const isAdmin = role?.toLowerCase() === "admin";

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
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

        <div className="mt-8 flex flex-col gap-3">
          <Link
            to="/todos"
            className="bg-red-400 p-3 rounded-lg text-white font-semibold inline-block"
          >
            Explore Todos
          </Link>

          {isAdmin && (
            <Link
              to="/admin"
              className="bg-green-600 p-3 rounded-lg text-white font-semibold inline-block"
            >
              Admin Panel
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
