import React, { useState, type ChangeEvent, type FormEvent } from "react";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import { useTodo } from "../context/TodoContext";
import type { Todo } from "../interfaces/Todo";

const columns: { id: Todo["status"]; title: string }[] = [
  { id: "todo", title: "Todo" },
  { id: "in-progress", title: "In Progress" },
  { id: "done", title: "Done" },
];

const Todos: React.FC = () => {
  const { todos, addTodo, updateTodo, deleteTodo, loading } = useTodo();
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const handleAddSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text.trim()) return setError("Please enter something!");
    addTodo(text);
    setText("");
    setError(null);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { draggableId, source, destination } = result;
    if (source.droppableId !== destination.droppableId) {
      updateTodo(draggableId, { status: destination.droppableId as Todo["status"] });
    }
  };

  if (loading)
    return <p className="text-center mt-20 text-gray-500">Loading todos...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-r p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Todos</h1>

      <form
        onSubmit={handleAddSubmit}
        className="mb-6 flex w-full max-w-md mx-auto"
      >
        <input
          value={text}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setText(e.target.value);
            if (error) setError(null);
          }}
          placeholder="Add a new task..."
          className="flex-grow px-4 py-2 rounded-l border"
        />
        <button
          type="submit"
          className="bg-blue-900 text-white px-4 py-2 rounded-r"
        >
          Add
        </button>
      </form>

      {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
          {columns.map((col) => (
            <Droppable droppableId={col.id} key={col.id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-gray-100 rounded-lg p-4 min-h-[400px] flex flex-col"
                >
                  <h2 className="text-xl font-bold mb-4 text-center">{col.title}</h2>
                  {todos
                    .filter((todo) => todo.status === col.id)
                    .map((todo, index) => (
                      <Draggable
                        key={todo._id.toString()}
                        draggableId={todo._id.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-white p-3 mb-3 rounded shadow flex justify-between items-center"
                          >
                            {editingId === todo._id ? (
                              <form
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  if (!editText.trim()) return;
                                  updateTodo(todo._id, { text: editText });
                                  setEditingId(null);
                                  setEditText("");
                                }}
                                className="flex justify-between items-center w-full"
                              >
                                <input
                                  value={editText}
                                  onChange={(e) => setEditText(e.target.value)}
                                  className="flex-grow border px-2 py-1 rounded mr-2"
                                />
                                <button type="submit" className="bg-green-500 text-white px-2 py-1 rounded">
                                  Save
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingId(null)}
                                  className="bg-gray-400 text-white px-2 py-1 rounded ml-1"
                                >
                                  Cancel
                                </button>
                              </form>
                            ) : (
                              <>
                                <span>{todo.text}</span>
                                <div className="flex gap-1">
                                  <button
                                    onClick={() => {
                                      setEditingId(todo._id);
                                      setEditText(todo.text);
                                    }}
                                    className="bg-blue-400 text-white px-2 py-1 rounded text-sm"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => deleteTodo(todo._id)}
                                    className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default Todos;