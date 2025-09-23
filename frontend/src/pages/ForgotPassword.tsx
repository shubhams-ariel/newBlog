import React, { useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await API.post("/forgot-password", { email });
      toast.success(res.data.msg);
      console.log("Preview URL (Ethereal):", res.data.previewURL); 
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.msg || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1><a href="/login">-</a></h1>
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Forgot Password</h2>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg mb-4"
        />
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
          Send Reset Link
        </button>
        <p className="text-center text-sm text-gray-500 mt-4">
  Remember your password?{" "}
  <a href="/login" className="text-blue-500 hover:underline">
    Login
  </a>
</p>
      </form>
    </div>
  );
};

export default ForgotPassword;
