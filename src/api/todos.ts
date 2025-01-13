import axios from 'axios';

const API_URL = 'https://dummyjson.com/todos';

export const fetchTodos = async (limit = 10) => {
  const response = await axios.get(`${API_URL}?limit=${limit}`);
  return response.data.todos;
};

export const addTodo = async (todo: string) => {
  const response = await axios.post(API_URL, { todo, completed: false });
  return response.data;
};

export const deleteTodo = async (id: number) => {
  await axios.delete(`${API_URL}/${id}`);
  return id;
};

export const toggleTodo = async (id: number, completed: boolean) => {
  const response = await axios.put(`${API_URL}/${id}`, { completed });
  return response.data;
};
