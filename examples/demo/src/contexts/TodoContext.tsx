import { createContext, useContext, useState, ReactNode } from 'react';
import { todoTools, type Todo } from '../tools/todoTools';
import type { Tool } from '@inappai/react';

interface TodoWithDate extends Todo {
  createdAt: Date;
}

interface TodoContextType {
  todos: TodoWithDate[];
  addTodo: (text: string, priority?: 'low' | 'medium' | 'high') => TodoWithDate;
  completeTodo: (identifier: string | number) => void;
  deleteTodo: (id: string | number) => void;
  updatePriority: (id: string | number, priority: 'low' | 'medium' | 'high') => void;
  tools: Tool[];
  context: () => Record<string, any>;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export function TodoProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useState<TodoWithDate[]>([
    { id: '1', text: 'Build the AI-powered todo app', completed: true, priority: 'high', createdAt: new Date() },
    { id: '2', text: 'Test AI copilot features', completed: false, priority: 'medium', createdAt: new Date() },
    { id: '3', text: 'Write documentation', completed: false, priority: 'low', createdAt: new Date() },
  ]);

  const addTodo = (text: string, priority: 'low' | 'medium' | 'high' = 'medium') => {
    const newTodo: TodoWithDate = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      priority,
      createdAt: new Date(),
    };
    setTodos(prev => [...prev, newTodo]);
    return newTodo;
  };

  const completeTodo = (identifier: string | number) => {
    setTodos((prev) =>
      prev.map((todo) => {
        if (
          todo.id === identifier ||
          (typeof identifier === 'string' && todo.text.toLowerCase().includes(identifier.toLowerCase()))
        ) {
          return { ...todo, completed: true };
        }
        return todo;
      })
    );
  };

  const deleteTodo = (id: string | number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const updatePriority = (id: string | number, priority: 'low' | 'medium' | 'high') => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, priority } : todo))
    );
  };

  // Create tools with current handlers
  const tools = todoTools(todos, addTodo, completeTodo, deleteTodo, updatePriority);

  // Create context getter function (always returns fresh data)
  const getContext = () => {
    const stats = {
      total: todos.length,
      active: todos.filter((t) => !t.completed).length,
      completed: todos.filter((t) => t.completed).length,
    };

    return {
      todos: todos.map((t) => ({
        id: t.id,
        text: t.text,
        completed: t.completed,
        priority: t.priority,
      })),
      stats,
    };
  };

  return (
    <TodoContext.Provider value={{ todos, addTodo, completeTodo, deleteTodo, updatePriority, tools, context: getContext }}>
      {children}
    </TodoContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTodos() {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodos must be used within a TodoProvider');
  }
  return context;
}
