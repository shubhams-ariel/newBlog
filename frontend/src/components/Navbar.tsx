import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { getDecryptedCookie, removeCookie } from "../utils/cookieUtils";

interface NavLink {
  name: string;
  path: string;
  roles?: string[];
}

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
   
    const roleFromCookie = getDecryptedCookie("role");
    if (roleFromCookie) {
      setUserRole(roleFromCookie);
    } else {
    
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          const decoded: any = jwtDecode(token);
          setUserRole(decoded.role);
        } catch (error) {
          console.error("Invalid token:", error);
          handleLogout();
        }
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("profilePic");
    removeCookie("role"); 
    setUserRole(null);
    navigate("/login");
  };

  const profilePic = localStorage.getItem("profilePic");

  const links: NavLink[] = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Todos", path: "/todos" },
    { name: "RenderList", path: "/RenderList" },
    { name: "Blogs", path: "/blogs" },
    { name: "All List", path: "/admin" },
  ];

  return (
    <nav className="bg-gray-900 p-4 text-white flex justify-between items-center sticky rounded-md top-0 z-50">
      <div className="flex items-center gap-2">
        <img
          src={
            profilePic
              ? `http://localhost:5000/uploads/${profilePic}`
              : "https://via.placeholder.com/40"
          }
          alt="Profile"
          className="h-10 w-10 rounded-full object-cover cursor-pointer"
          onClick={() => navigate("/profile-upload")}
        />
        <h1 className="p-1 text-red-500 font-bold">
          <Link to="/dashboard">Ariel Software Solutions</Link>
        </h1>
      </div>

      <div className="space-x-4 font-semibold flex">
        {links.map((link) => {
          if (link.roles && !link.roles.includes(userRole as string)) return null;
          return (
            <Link
              key={link.path}
              to={link.path}
              className="hover:bg-red-600 px-2 py-1 rounded transition"
            >
              {link.name}
            </Link>
          );
        })}
      </div>

      <button
        onClick={handleLogout}
        className="bg-red-500 px-3 py-1 rounded hover:bg-blue-600 transition-colors"
      >
        Sign Out
      </button>
    </nav>
  );
};

export default Navbar;
