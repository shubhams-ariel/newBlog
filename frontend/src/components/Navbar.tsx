import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getDecryptedCookie, removeCookie } from "../utils/cookieUtils";

interface NavLink {
  name: string;
  path: string;
  roles?: string[];
}

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const roleFromCookie = getDecryptedCookie("role");
    if (roleFromCookie) {
      setUserRole(roleFromCookie);
    } else {
      setUserRole(null);
    }
  }, []);

  const handleLogout = () => {
    removeCookie("role");
    localStorage.clear();
    setUserRole(null);
    navigate("/login");
  };

  const profilePic = localStorage.getItem("profilePic");

  const links: NavLink[] = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Todos", path: "/todos" },
    { name: "RenderList", path: "/RenderList" },
    { name: "Blogs", path: "/blogs" },
    { name: "All List", path: "/admin", roles: ["admin"] },
  ];

  return (
    <nav className="bg-gray-900 p-4 text-white flex justify-between items-center sticky rounded-md top-0 z-50 sm:px-6 lg:px-8 mb-4">
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

  
      <button
        className="sm:hidden block text-white focus:outline-none"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {menuOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

  
      <div className="space-x-4 font-semibold flex sm:flex hidden">
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

    
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-gray-900 flex flex-col items-center sm:hidden z-50">
          {links.map((link) => {
            if (link.roles && !link.roles.includes(userRole as string)) return null;
            return (
              <Link
                key={link.path}
                to={link.path}
                className="hover:bg-red-600 px-4 py-2 rounded transition w-full text-center"
                onClick={() => setMenuOpen(false)}
              >
                {link.name}
              </Link>
            );
          })}
          <button
            onClick={() => {
              setMenuOpen(false);
              handleLogout();
            }}
            className="bg-red-500 px-4 py-2 rounded hover:bg-blue-600 transition-colors w-full mt-2"
          >
            Sign Out
          </button>
        </div>
      )}

     
      <button
        onClick={handleLogout}
        className="bg-red-500 px-3 py-1 rounded hover:bg-blue-600 transition-colors sm:block hidden"
      >
        Sign Out
      </button>
    </nav>
  );
};

export default Navbar;
