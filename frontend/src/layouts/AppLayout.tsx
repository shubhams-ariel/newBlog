import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Signup from "../pages/Signup";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Todos from "../pages/Todos";
import AdminDashboard from "../pages/AdminDashboard";
import RenderList from "../pages/RenderList";
import ProfileUpload from "../components/ProfileUpload";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import BlogList from "../pages/BlogList";
import BlogDetail from "../pages/BlogDetails";
import BlogForm from "../pages/BlogForm";
import AdminBlogList from "../pages/AdminBlogList";

import ProtectedRoute from "../routes/ProtectedRoute";
import AdminRoute from "../routes/AdminRoute";

import PublicLayout from "./PublicLayout";
import PrivateLayout from "./PrivateLayout";
import { AuthProvider } from "../context/AuthContext";
import { BlogProvider } from "../context/BlogContext";
import { TodoProvider } from "../context/TodoContext";
import { AdminProvider } from "../context/AdminContext"; // ✅ new import

const AppLayout: React.FC = () => {
  return (
    <AuthProvider>
      <ToastContainer position="top-right" autoClose={2000} />

      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <PublicLayout>
              <Signup />
            </PublicLayout>
          }
        />
        <Route
          path="/login"
          element={
            <PublicLayout>
              <Login />
            </PublicLayout>
          }
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Protected Routes */}
        <Route
          path="/profile-upload"
          element={
            <ProtectedRoute>
              <PrivateLayout>
                <ProfileUpload />
              </PrivateLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <PrivateLayout>
                <Dashboard />
              </PrivateLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/todos"
          element={
            <ProtectedRoute>
              <TodoProvider>
                <PrivateLayout>
                  <Todos />
                </PrivateLayout>
              </TodoProvider>
            </ProtectedRoute>
          }
        />

        <Route
          path="/renderlist"
          element={
            <ProtectedRoute>
              <PrivateLayout>
                <RenderList />
              </PrivateLayout>
            </ProtectedRoute>
          }
        />

        {/* Blog Routes */}
        <Route
          path="/blogs"
          element={
            <ProtectedRoute>
              <BlogProvider>
                <PrivateLayout>
                  <BlogList />
                </PrivateLayout>
              </BlogProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/blogs/new"
          element={
            <ProtectedRoute>
              <BlogProvider>
                <PrivateLayout>
                  <BlogForm />
                </PrivateLayout>
              </BlogProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/blogs/:id"
          element={
            <ProtectedRoute>
              <BlogProvider>
                <PrivateLayout>
                  <BlogDetail />
                </PrivateLayout>
              </BlogProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/blogs/:id/edit"
          element={
            <ProtectedRoute>
              <BlogProvider>
                <PrivateLayout>
                  <BlogForm />
                </PrivateLayout>
              </BlogProvider>
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route 
          path="/admin"
          element={
            <AdminRoute>
              <AdminProvider>
                <PrivateLayout>
                  <AdminDashboard />
                </PrivateLayout>
              </AdminProvider>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/blogs"
          element={
            <AdminRoute>
              <AdminProvider>
                <PrivateLayout>
                  <AdminBlogList />
                </PrivateLayout>
              </AdminProvider>
            </AdminRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
};

export default AppLayout;
