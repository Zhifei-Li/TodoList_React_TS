import React, { useState, useMemo } from "react";
import Filter from "./components/Filter";
import TodoList from "./components/TodoList";
import TodoForm from "./components/TodoForm";
import {
  useQuery,
  useMutation,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"; 

type Todo = {
  id: number;
  text: string;
  completed: boolean;
};
const fetchTodos = async (): Promise<Todo[]> => {
  const response = await fetch(
    "https://dummyjson.com/todos?limit=10"
  );
  const data = await response.json();
  
  //get Max UserId
  const maxUserId = data.todos.reduce(
    (maxId: number, todo: { userId: number }) => Math.max(maxId, todo.userId),
    0
  );
  queryClient.setQueryData(["maxUserId"], maxUserId);
  return data.todos.map((todo: any) => ({
    id: todo.id,
    text: todo.todo,
    completed: todo.completed,
  }));
};
const queryClient = new QueryClient();
const App: React.FC = () => {
const [filter, setFilter] = useState<string>("Sort By");

const {
  data: todos,
  isLoading,
  isError,
} = useQuery({
  queryKey: ["todos"], 
  queryFn: fetchTodos, 
});

const addTodoMutation = useMutation<Todo, Error, string>({
  mutationFn: async (text: string) => {
    const maxUserId = queryClient.getQueryData<number>(["maxUserId"]) || 0;
    queryClient.setQueryData(["maxUserId"], maxUserId + 1);
    const newTodo = await fetch("https://dummyjson.com/todos/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ todo: text, completed: false, userId: maxUserId }),
    }).then((res) => res.json());
    return { id: newTodo.id, text: newTodo.todo, completed: newTodo.completed };
  },
  onSuccess: (newTodo) => {
    queryClient.setQueryData(["todos"], (oldTodos: Todo[] | undefined) => [
      ...(oldTodos || []),
      newTodo,
    ]);
  },
});
const { mutate: handleDeleteTodo } = useMutation<void, Error, number>({
  mutationFn: async (id: number): Promise<void> => {
    queryClient.setQueryData<Todo[]>(["todos"], (oldTodos) =>
      oldTodos ? oldTodos.filter((todo) => todo.id !== id) : []
    );
  },
});
// const deleteTodo = async (id: number): Promise<void> => {
//   await fetch(`https://dummyjson.com/todos/${id}`, {
//     method: "DELETE",
//   });
// };

// const { mutate: handleDeleteTodo } = useMutation<void, Error, number>({
//   mutationFn: deleteTodo,
//   onSuccess: (_, id) => {
//     // 从 queryClient 中移除已删除的 todo
//     queryClient.setQueryData<Todo[]>(["todos"], (oldTodos) =>
//       oldTodos ? oldTodos.filter((todo) => todo.id !== id) : []
//     );
//   },
// });

const updateTodo = (id: number, updatedFields: Partial<Todo>) => {
  queryClient.setQueryData<Todo[]>(["todos"], (oldTodos) => {
    if (!oldTodos) return [];

    const updatedTodos = oldTodos.map((todo) =>
      todo.id === id ? { ...todo, ...updatedFields } : todo
    );

    const updatedTodo = updatedTodos.find((todo) => todo.id === id);
    if (updatedTodo) {
      const remainingTodos = updatedTodos.filter((todo) => todo.id !== id);
      const sortedTodos = [...remainingTodos, updatedTodo];
      return sortedTodos;
    }
    return updatedTodos;
  });
};

const filteredTodos = useMemo(() => {
  if (!todos) return [];
  const filtered = todos.filter((todo) => {
    if (filter === "completed") {
      return todo.completed;
    } else if (filter === "incompleted") {
      return !todo.completed;
    }
    return true;
  });
  return filtered.sort((a, b) => (a.completed ? 1 : -1));
}, [todos, filter]);
if (isLoading) return <div>Loading...</div>;
if (isError) return <div>Error fetching todos</div>;
const handleAddTodo = (text: string) => {
  addTodoMutation.mutate(text);
};
  return (
    <div className="mt-16 w-1/2 mx-auto">
      <h1 className="text-2xl font-bold mb-4">To-do tracker</h1>
      <TodoForm onAddTodo={handleAddTodo} />
      <div className="flex justify-end mb-3">
        <Filter filter={filter} onChange={setFilter} />
      </div>
      <TodoList
        todos={filteredTodos || []}
        onDelete={handleDeleteTodo}
        onUpdate={updateTodo}
      />
    </div>
  );
};

const Root: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
};

export default Root;
