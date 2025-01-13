import React, { useState } from "react";

type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

interface TodoListProps {
  todos: Todo[];
  onDelete: (id: number) => void;
  onUpdate: (id: number, updatedFields: Partial<Todo>) => void;
}

const TodoList: React.FC<TodoListProps> = ({ todos, onDelete, onUpdate }) => {
  const [visibleTodosCount, setVisibleTodosCount] = useState(3);
  const handleLoadMore = () => {
    // setVisibleTodosCount((prevCount) => prevCount + 10);
    setVisibleTodosCount(todos.length);
  };

  const visibleTodos = todos.slice(0, visibleTodosCount);

  return (
    <div>
      <ul>
        {visibleTodos.map((todo) => (
          <li key={todo.id} className="flex items-center justify-between">
            <div className="mb-5 flex items-center">
              <input
                type="checkbox"
                className="custom-checkbox"
                checked={todo.completed}
                onChange={() =>
                  onUpdate(todo.id, { completed: !todo.completed })
                }
              />
              <span className="ml-5">{todo.text}</span>
            </div>
            <button
              onClick={() => onDelete(todo.id)}
              className="bg-delete-btn rounded-lg w-8 h-8 flex justify-center items-center"
            >
              <img
                alt="Delete"
                src="/images/delete-btn.png"
                className="w-[60%] h-[60%] object-contain"
              />
            </button>
          </li>
        ))}
      </ul>

      {/* Load More btn */}
      {todos.length > visibleTodosCount && (
        <div className="flex justify-center">
          <button
            onClick={handleLoadMore}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded text-purple"
          >
            Load more
          </button>
        </div>
      )}
    </div>
  );
};

export default TodoList;
