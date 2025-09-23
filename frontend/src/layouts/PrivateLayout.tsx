import React from "react";
import Navbar from "../components/Navbar";

const PrivateLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      <Navbar />
      <main className="p-6">{children}</main>
    </div>
  );
};

export default PrivateLayout;
