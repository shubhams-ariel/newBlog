import React, { useEffect, useState } from "react";
import adminAPI from "../services/adminApi";
import type { Todo } from "../interfaces/Todo";

const AdminDashboard: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTodos = async () => {
    try {
      const res = await adminAPI.get<Todo[]>("/todos");
      setTodos(res.data);
    } catch (err) {
      console.error("Error fetching todos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this todo?")) return;

    try {
      await adminAPI.delete(`/todos/${id}`);
      setTodos((prev) => prev.filter((todo) => todo._id !== id));
      alert("Todo deleted successfully!");
    } catch (err) {
      console.error("Error deleting todo:", err);
    }
  };

  if (loading) return <p className="p-6 text-center">Loading...</p>;

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="mb-6 text-gray-700">Manage all user's todos:</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {todos.length > 0 ? (
            todos.map((todo) => (
              <div
                key={todo._id}
                className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition relative"
              >
              <button onClick={() => handleDelete(todo._id)}
               aria-label="Delete todo" className="absolute top-2 p-1 right-2 bg-red-600 text-white px-2 py-1 rounded text-sm hover:bg-red-700">
                ✕
              </button>

                <p className="text-gray-800">
                  <strong>User:</strong> {todo.user.username}
                </p>
                {todo.user.email && (
                  <p className="text-gray-600 text-sm">
                    <strong>Email:</strong> {todo.user.email}
                  </p>
                )}
                <p className="mt-2">
                  <strong>Todo:</strong> {todo.text}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-full text-center">
              No todos found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
