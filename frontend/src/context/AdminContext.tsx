import React, { createContext, useContext,  useEffect, useState,  type ReactNode } from "react";
import adminAPI from "../services/adminApi";
import blogAPI from "../services/blogApi";
import type { Todo } from "../interfaces/Todo";
import { toast } from "react-toastify";

interface Blog {
  _id: string;
  title: string;
  author?: { username: string; email?: string };
}

interface AdminContextType {
  todos: Todo[];
  blogs: Blog[];
  loading: boolean;
  fetchTodos: () => Promise<void>;
  fetchBlogs: () => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  deleteBlog: (id: string) => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);

  
  const fetchTodos = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.get<Todo[]>("/todos");
      setTodos(res.data);
    } catch (err) {
      console.error("Error fetching todos:", err);
      toast.error("Failed to load todos");
    } finally {
      setLoading(false);
    }
  };

  const deleteTodo = async (id: string) => {
    if (!window.confirm("Delete this todo?")) return;
    try {
      await adminAPI.delete(`/todos/${id}`);
      setTodos((prev) => prev.filter((t) => t._id !== id));
      toast.success("Todo deleted");
    } catch (err) {
      console.error("Error deleting todo:", err);
      toast.error("Failed to delete todo");
    }
  };

  
  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await blogAPI.getAll();
      setBlogs(res.data);
    } catch (err) {
      console.error("Error fetching blogs:", err);
      toast.error("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  const deleteBlog = async (id: string) => {
    if (!window.confirm("Delete this blog?")) return;
    try {
      await blogAPI.delete(id);
      setBlogs((prev) => prev.filter((b) => b._id !== id));
      toast.success("Blog deleted");
    } catch (err) {
      console.error("Error deleting blog:", err);
      toast.error("Failed to delete blog");
    }
  };

  return (
    <AdminContext.Provider
      value={{ todos, blogs, loading, fetchTodos, fetchBlogs, deleteTodo, deleteBlog }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = (): AdminContextType => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
};
