import React, { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
//import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface IFormInput {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Signup: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, watch, formState: { errors } } = useForm<IFormInput>();
  const password = watch("password");

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const success = await signup({ username: data.username, email: data.email, password: data.password });
    if (success) navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Signup</h2>

        <div className="mb-4">
          <input {...register("username", { required: "Username is required" })} type="text" placeholder="Username" className="w-full px-4 py-2 border rounded-lg" />
          {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
        </div>

        <div className="mb-4">
          <input {...register("email", { required: "Email is required", pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email format" } })} type="email" placeholder="Email" className="w-full px-4 py-2 border rounded-lg" />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>

        <div className="mb-4 relative">
          <input {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })} type={showPassword ? "text" : "password"} placeholder="Password" className="w-full px-4 py-2 border rounded-lg pr-10" />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 flex items-center text-gray-500">{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button>
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>

        <div className="mb-6 relative">
          <input {...register("confirmPassword", { required: "Confirm Password is required", validate: (value) => value === password || "Passwords do not match" })} type={showPassword ? "text" : "password"} placeholder="Confirm Password" className="w-full px-4 py-2 border rounded-lg pr-10" />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 flex items-center text-gray-500">{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button>
          {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
        </div>

        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">Signup</button>

        <p className="mt-4 text-center">Already have an account? <a href="/login" className="text-blue-400 underline">login</a>.</p>
      </form>
    </div>
  );
};

export default Signup;
