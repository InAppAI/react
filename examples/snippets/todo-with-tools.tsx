/**
 * Todo App with AI Tools Example
 *
 * Complete example showing how to use tools (function calling)
 * to let the AI interact with your application.
 *
 * The AI can add, complete, and update todos through natural language.
 *
 * @see https://github.com/InAppAI/react/docs/guides/tools.md
 */

import { useState } from 'react';
import { InAppAI, Message, Tool } from '@inappai/react';
import '@inappai/react/styles.css';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

function TodoWithToolsApp() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [todos, setTodos] = useState<Todo[]>([
    { id: '1', text: 'Buy groceries', completed: false, priority: 'high' },
    { id: '2', text: 'Call dentist', completed: false, priority: 'medium' },
  ]);

  // Define tools that the AI can call
  const todoTools: Tool[] = [
    {
      name: 'addTodo',
      description: 'Create a new todo item when the user wants to add a task to their list.',
      parameters: {
        type: 'object',
        properties: {
          text: {
            type: 'string',
            description: 'The task description',
          },
          priority: {
            type: 'string',
            enum: ['low', 'medium', 'high'],
            description: 'Task priority level',
          },
        },
        required: ['text'],
      },
      handler: async (params: { text: string; priority?: 'low' | 'medium' | 'high' }) => {
        const newTodo: Todo = {
          id: Date.now().toString(),
          text: params.text,
          completed: false,
          priority: params.priority || 'medium',
        };

        setTodos(prev => [...prev, newTodo]);
        return { success: true, todo: newTodo };
      },
    },
    {
      name: 'completeTodo',
      description: 'Mark a todo as completed. Use the task ID or keywords from the task text to identify which task to complete.',
      parameters: {
        type: 'object',
        properties: {
          identifier: {
            type: 'string',
            description: 'Task ID or keyword from the task text',
          },
        },
        required: ['identifier'],
      },
      handler: async (params: { identifier: string }) => {
        const todo = todos.find(
          t => t.id === params.identifier ||
               t.text.toLowerCase().includes(params.identifier.toLowerCase())
        );

        if (todo) {
          setTodos(prev => prev.map(t =>
            t.id === todo.id ? { ...t, completed: true } : t
          ));
          return { success: true, message: `Completed: ${todo.text}` };
        }

        return { success: false, message: 'Todo not found' };
      },
    },
    {
      name: 'updateTodoPriority',
      description: 'Update the priority of an existing task.',
      parameters: {
        type: 'object',
        properties: {
          taskId: {
            type: 'string',
            description: 'The ID of the task',
          },
          priority: {
            type: 'string',
            enum: ['low', 'medium', 'high'],
            description: 'The new priority level',
          },
        },
        required: ['taskId', 'priority'],
      },
      handler: async (params: { taskId: string; priority: 'low' | 'medium' | 'high' }) => {
        setTodos(prev => prev.map(t =>
          t.id === params.taskId ? { ...t, priority: params.priority } : t
        ));
        return { success: true, message: `Updated priority to ${params.priority}` };
      },
    },
  ];

  return (
    <div className="app">
      <header>
        <h1>AI-Powered Todo List</h1>
      </header>

      {/* Todo List Display */}
      <main style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
        <h2>My Tasks</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {todos.map(todo => (
            <li
              key={todo.id}
              style={{
                padding: '12px',
                marginBottom: '8px',
                backgroundColor: '#f5f5f5',
                borderRadius: '6px',
                textDecoration: todo.completed ? 'line-through' : 'none',
                opacity: todo.completed ? 0.6 : 1,
              }}
            >
              <span style={{
                color: todo.priority === 'high' ? 'red' : todo.priority === 'medium' ? 'orange' : 'green',
                fontWeight: 'bold',
                marginRight: '8px',
              }}>
                [{todo.priority}]
              </span>
              {todo.text}
            </li>
          ))}
        </ul>

        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#e3f2fd',
          borderRadius: '6px',
        }}>
          <p><strong>Try saying:</strong></p>
          <ul>
            <li>"Add a task to prepare presentation"</li>
            <li>"Mark buy groceries as complete"</li>
            <li>"Make the dentist task high priority"</li>
          </ul>
        </div>
      </main>

      {/* AI Assistant with Tools */}
      <InAppAI
        agentId="your-agent-id"
        messages={messages}
        onMessagesChange={setMessages}

        // Pass tools - AI can call these functions
        tools={todoTools}

        // Pass context - AI can see current state
        context={() => ({
          todos: todos.map(t => ({
            id: t.id,
            text: t.text,
            completed: t.completed,
            priority: t.priority,
          })),
          stats: {
            total: todos.length,
            active: todos.filter(t => !t.completed).length,
            completed: todos.filter(t => t.completed).length,
          },
        })}

        customStyles={{
          headerTitle: 'Todo Assistant',
          buttonIcon: '✓',
        }}
      />
    </div>
  );
}

export default TodoWithToolsApp;
