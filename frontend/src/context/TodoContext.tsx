import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import todoAPI from "../services/todoApi";
import adminAPI from "../services/adminApi"; // For admin fetch
import type { Todo } from "../interfaces/Todo";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface TodoContextType {
  todos: Todo[];
  addTodo: (text: string) => void;
  updateTodo: (id: string, text: string) => void;
  deleteTodo: (id: string) => void;
  loading: boolean;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

interface Props {
  children: ReactNode;
  isAdmin?: boolean;
}

export const TodoProvider: React.FC<Props> = ({ children, isAdmin = false }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTodos = async () => {
      setLoading(true);
      try {
        const res = isAdmin
          ? await adminAPI.get("/todos") 
          : await todoAPI.get<Todo[]>("/");     
        setTodos(res.data);
      } catch (err: any) {
        if (err.response?.status === 401) {
          localStorage.clear();
          navigate("/login");
        } else {
          toast.error("Error fetching todos");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchTodos();
  }, [navigate, isAdmin]);

  const addTodo = async (text: string) => {
    try {
      const res = await todoAPI.post<Todo>("/", { text });
      setTodos((prev) => [...prev, res.data]);
      toast.success("Todo added successfully!");
    } catch {
      toast.error("Failed to add todo");
    }
  };

  const updateTodo = async (id: string, text: string) => {
    try {
      const res = await todoAPI.put<Todo>(`/${id}`, { text });
      setTodos((prev) => prev.map((todo) => (todo._id === id ? res.data : todo)));
      toast.success("Todo updated successfully!");
    } catch {
      toast.error("Failed to update todo");
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await todoAPI.delete(`/${id}`);
      setTodos((prev) => prev.filter((todo) => todo._id !== id));
      toast.success("Todo deleted successfully!");
    } catch {
      toast.error("Failed to delete todo");
    }
  };

  return (
    <TodoContext.Provider value={{ todos, addTodo, updateTodo, deleteTodo, loading }}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = (): TodoContextType => {
  const context = useContext(TodoContext);
  if (!context) throw new Error("useTodo must be used within TodoProvider");
  return context;
};
