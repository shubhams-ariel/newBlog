import React from "react";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import { useTodo } from "../context/TodoContext";
import type { Todo } from "../interfaces/Todo";

const columns: { id: Todo["status"]; title: string }[] = [
  { id: "todo", title: "Todo" },
  { id: "in-progress", title: "In Progress" },
  { id: "done", title: "Done" },
];

const KanbanBoard: React.FC = () => {
  const { todos, updateTodo, deleteTodo, loading } = useTodo();

  if (loading) return <p className="text-center mt-20 text-gray-500">Loading todos...</p>;

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { draggableId, source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      updateTodo(draggableId, { status: destination.droppableId as Todo["status"] });
    }
  };

  return (
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
                          <span>{todo.text}</span>
                          <button
                            onClick={() => deleteTodo(todo._id)}
                            className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                          >
                            Delete
                          </button>
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
  );
};

export default KanbanBoard;
