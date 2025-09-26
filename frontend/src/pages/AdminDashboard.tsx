import React, { useEffect } from "react";
import { useAdmin } from "../context/AdminContext";

const AdminDashboard: React.FC = () => {
  const { todos, loading, fetchTodos, deleteTodo } = useAdmin();

  useEffect(() => {
    fetchTodos();
  }, []);

  if (loading) return <p className="p-6 text-center">Loading...</p>;

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="mb-6 text-gray-700">Manage all user's todos:</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {todos.length > 0 ? (
            todos.map((todo) => (
              <div key={todo._id} className="bg-white p-4 rounded-xl shadow relative">
                <button
                  onClick={() => deleteTodo(todo._id)}
                  aria-label="Delete todo"
                  className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-sm hover:bg-red-700"
                >
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
            <p className="text-gray-500 col-span-full text-center">No todos found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
