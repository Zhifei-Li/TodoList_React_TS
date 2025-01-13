import React, { useState } from "react";

interface TodoFormProps {
  onAddTodo: (text: string) => void; 
}

const TodoForm: React.FC<TodoFormProps> = ({ onAddTodo }) => {
  const [text, setText] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); 
    if (text.trim() === "") return; 
    onAddTodo(text); 
    setText(""); 
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-custom-gray w-full p-2 rounded-lg flex"
    >
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Create your todo..."
        type="text"
        className="bg-custom-gray w-full p-2 focus:outline-none"
      />
      <button
        type="submit"
        className={`bg-add-btn rounded-lg w-10 h-10 flex justify-center items-center ${
          text ? "bg-input-purple" : "bg-gray-500"
        }`}
        disabled={!text}
      >
        <img
          alt="Add"
          src="/images/add-btn.png"
          className="w-[60%] h-[60%] object-contain"
        />
      </button>
    </form>
  );
};

export default TodoForm;
