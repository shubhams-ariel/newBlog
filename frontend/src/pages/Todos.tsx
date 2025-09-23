import React, { useState, type ChangeEvent, type FormEvent } from "react";
import { useTodo } from "../context/TodoContext";

const Todos: React.FC = () => {
  const { todos, addTodo, updateTodo, deleteTodo, loading } = useTodo();
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleAddSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text.trim()) return setError("Please enter something!");
    addTodo(text);
    setText("");
    setError(null);
  };

  const handleEditSubmit = (e: FormEvent<HTMLFormElement>, id: string) => {
    e.preventDefault();
    if (!editText.trim()) return;
    updateTodo(id, editText);
    setEditingId(null);
    setEditText("");
  };

  if (loading) return <p className="text-center mt-20 text-gray-500">Loading todos...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-100 via-purple-100 to-pink-100 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">Todos</h1>

      <form onSubmit={handleAddSubmit} className="mb-4 flex w-full max-w-md">
        <input
          value={text}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setText(e.target.value);
            if (error) setError(null);
          }}
          placeholder="Add something..."
          className="flex-grow px-4 py-2 rounded-l border"
        />
        <button type="submit" className="bg-blue-900 text-white px-4 py-2 rounded-r">
          Add
        </button>
      </form>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <ul className="w-full max-w-md">
        {todos.map((todo) => (
          <li key={todo._id} className="flex justify-between items-center bg-white p-3 mb-2 rounded shadow">
            {editingId === todo._id ? (
              <form onSubmit={(e) => handleEditSubmit(e, todo._id)} className="flex-grow flex gap-2">
                <input
                  value={editText}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setEditText(e.target.value)}
                  className="flex-grow border px-2 py-1 rounded"
                />
                <button type="submit" className="bg-green-500 text-white px-3 py-1 rounded">Save</button>
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <>
                <span>{todo.text}</span>
                <div className="flex gap-2">
                  <button onClick={() => { setEditingId(todo._id); setEditText(todo.text); }} className="bg-blue-400 text-white px-3 py-1 rounded">
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTodo(todo._id)}
                    className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Todos;
