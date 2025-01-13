import React, { useState } from "react";

interface TodoInputProps {
  onAdd: (todo: string) => void;
}

const TodoInput: React.FC<TodoInputProps> = ({ onAdd }) => {
  const [input, setInput] = useState("");

  const handleAdd = () => {
    if (input.trim()) {
      onAdd(input.trim());
      setInput("");
    }
  };

  return (
    <div className="flex items-center gap-2 p-4">
      <input
        type="text"
        placeholder="Create your todo..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="flex-grow border rounded-md px-4 py-2"
      />
      <button
        onClick={handleAdd}
        className="p-2 bg-purple-500 text-white rounded-md"
        // className={`p-2 text-white rounded-md ${
        //   input ? "bg-input-purple" : "bg-purple-500"
        // }`}
        disabled={!input}
      >
        ➤
      </button>
    </div>
  );
};

export default TodoInput;
