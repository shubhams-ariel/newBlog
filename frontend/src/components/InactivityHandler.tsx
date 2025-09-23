import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

const InactivityHandler: React.FC<Props> = ({ children }) => {
  const navigate = useNavigate();
  const [warning, setWarning] = useState(false);
  const logoutTimer = useRef<NodeJS.Timeout | null>(null);
  let inactivityTimer: NodeJS.Timeout;

  const logout = () => {
    setWarning(false);
    localStorage.clear();
    navigate("/login");
  };

  const resetTimer = () => {
    clearTimeout(inactivityTimer);
    if (logoutTimer.current) clearTimeout(logoutTimer.current);

    setWarning(false);

 
    inactivityTimer = setTimeout(() => {
      setWarning(true);

      
      logoutTimer.current = setTimeout(() => {
        logout();
      }, 30 * 1000);
      
    }, 7 * 60 * 1000); 
  };

  useEffect(() => {
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    resetTimer();

    return () => {
      clearTimeout(inactivityTimer);
      if (logoutTimer.current) clearTimeout(logoutTimer.current);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
    };
  }, []);

  return (
    <>
      {warning && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <p className="text-lg font-semibold mb-4">
              You were inactive for 2 minutes.
            </p>
            <p className="mb-4 text-gray-600">
              Click below to stay logged in, or you will be signed out in 30
              seconds.
            </p>
            <button
              onClick={resetTimer}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              I'm here
            </button>
          </div>
        </div>
      )}
      {children}
    </>
  );
};

export default InactivityHandler;
