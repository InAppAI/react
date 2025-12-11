/**
 * Todo Management Tools
 * Tools for managing the todo list
 */

import { Tool } from '@inappai/react';

export interface Todo {
  id: string | number;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface TodoToolsParams {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
}

export function createTodoTools(params: TodoToolsParams): Tool[] {
  const { todos, setTodos } = params;

  return [
    {
      name: 'addTodo',
      description: 'Add a new task to the todo list. ONLY use this when the user explicitly asks to add/create a NEW task. Do NOT use this to change priority of an existing task - use updateTodoPriority instead. Do NOT use for greetings, thanks, or general conversation.',
      parameters: {
        type: 'object',
        properties: {
          task: {
            type: 'string',
            description: 'The task to add',
          },
          priority: {
            type: 'string',
            enum: ['low', 'medium', 'high'],
            description: 'Priority level of the task (defaults to medium)',
          },
        },
        required: ['task'],
      },
      handler: async (params: { task: string; priority?: 'low' | 'medium' | 'high' }) => {
        const newTodo: Todo = {
          id: Date.now(),
          text: params.task,
          completed: false,
          priority: params.priority || 'medium',
        };
        setTodos((prev) => [...prev, newTodo]);
        return { success: true, message: `Added task: ${params.task}`, todo: newTodo };
      },
    },
    {
      name: 'completeTodo',
      description: `Mark a todo as completed. Use this when the user indicates they have finished a task.

WHEN TO USE:
- User says "I bought groceries" → complete the "Buy groceries" task
- User says "I finished the report" → complete the "Finish project report" task
- User says "I called the dentist" → complete the "Call dentist" task
- User explicitly asks to "mark X as complete" or "finish Y"

HOW TO FIND THE TASK ID:
1. Look at the context.todos array - it contains all tasks with their IDs
2. Match the user's statement to a task by finding similar keywords:
   - "bought groceries" matches "Buy groceries"
   - "finished the report" matches "Finish project report"
   - Ignore tense differences (past vs present)
   - Match key nouns/verbs (groceries→groceries, report→report)
3. ONLY use tasks where completed: false (don't complete already completed tasks)
4. If multiple incomplete tasks match, choose the highest priority one
5. If no clear match, ask the user which task they meant

IMPORTANT: The taskId MUST come from context.todos - do NOT make up an ID!`,
      parameters: {
        type: 'object',
        properties: {
          taskId: {
            type: 'number',
            description: 'The ID of the task to complete (must exist in context.todos array)',
          },
        },
        required: ['taskId'],
      },
      handler: async (params: { taskId: number }) => {
        const todo = todos.find((t) => t.id === params.taskId);
        if (!todo) {
          return { success: false, error: `Task with ID ${params.taskId} not found` };
        }
        setTodos((prev) =>
          prev.map((t) => (t.id === params.taskId ? { ...t, completed: true } : t))
        );
        return { success: true, message: `Completed task: ${todo.text}` };
      },
    },
    {
      name: 'deleteTodo',
      description: 'Delete a task from the todo list. ONLY use this when the user explicitly asks to delete/remove a specific task. You MUST provide the exact task ID number shown in the UI. Do NOT use for greetings, thanks, or general conversation.',
      parameters: {
        type: 'object',
        properties: {
          taskId: {
            type: 'number',
            description: 'The ID of the task to delete',
          },
        },
        required: ['taskId'],
      },
      handler: async (params: { taskId: number }) => {
        const todo = todos.find((t) => t.id === params.taskId);
        if (!todo) {
          return { success: false, error: `Task with ID ${params.taskId} not found` };
        }
        setTodos((prev) => prev.filter((t) => t.id !== params.taskId));
        return { success: true, message: `Deleted task: ${todo.text}` };
      },
    },
    {
      name: 'updateTodoPriority',
      description: 'Update the priority of an existing task. Use this when the user says a task is "important", "urgent", "high priority", or "can wait" RIGHT AFTER adding or mentioning a task. Look at the most recently added task ID in the context and update its priority. DO NOT add a duplicate task - only update the priority of the existing task.',
      parameters: {
        type: 'object',
        properties: {
          taskId: {
            type: 'number',
            description: 'The ID of the task to update',
          },
          priority: {
            type: 'string',
            enum: ['low', 'medium', 'high'],
            description: 'The new priority level',
          },
        },
        required: ['taskId', 'priority'],
      },
      handler: async (params: { taskId: number; priority: 'low' | 'medium' | 'high' }) => {
        const todo = todos.find((t) => t.id === params.taskId);
        if (!todo) {
          return { success: false, error: `Task with ID ${params.taskId} not found` };
        }
        setTodos((prev) =>
          prev.map((t) => (t.id === params.taskId ? { ...t, priority: params.priority } : t))
        );
        return { success: true, message: `Updated "${todo.text}" to ${params.priority} priority` };
      },
    },
  ];
}

// Alternative function signature for functional handlers
export function todoTools(
  todos: Todo[],
  addTodoHandler: (text: string, priority: 'low' | 'medium' | 'high') => any,
  completeTodoHandler: (identifier: string) => void,
  deleteTodoHandler: (id: string) => void,
  updatePriorityHandler: (id: string, priority: 'low' | 'medium' | 'high') => void
): Tool[] {
  return [
    {
      name: 'addTodo',
      description: 'Add a new task to the todo list. ONLY use this when the user explicitly asks to add/create a NEW task.',
      parameters: {
        type: 'object',
        properties: {
          task: {
            type: 'string',
            description: 'The task to add',
          },
          priority: {
            type: 'string',
            enum: ['low', 'medium', 'high'],
            description: 'Priority level of the task (defaults to medium)',
          },
        },
        required: ['task'],
      },
      handler: async (params: { task: string; priority?: 'low' | 'medium' | 'high' }) => {
        const result = addTodoHandler(params.task, params.priority || 'medium');
        return { success: true, message: `Added task: ${params.task}`, todo: result };
      },
    },
    {
      name: 'completeTodo',
      description: 'Mark a todo as completed when the user indicates they finished a task. You can use the task ID or keywords from the task text. Example: "I wrote the documentation" should complete the "Write documentation" task. Check context.todos for available tasks.',
      parameters: {
        type: 'object',
        properties: {
          identifier: {
            type: 'string',
            description: 'Task ID or keyword from the task text to identify which task to complete',
          },
        },
        required: ['identifier'],
      },
      handler: async (params: { identifier: string }) => {
        completeTodoHandler(params.identifier);
        return { success: true, message: `Completed task matching: ${params.identifier}` };
      },
    },
    {
      name: 'deleteTodo',
      description: 'Delete a task from the todo list. Provide the task ID.',
      parameters: {
        type: 'object',
        properties: {
          taskId: {
            type: 'string',
            description: 'The ID of the task to delete',
          },
        },
        required: ['taskId'],
      },
      handler: async (params: { taskId: string }) => {
        deleteTodoHandler(params.taskId);
        return { success: true, message: `Deleted task` };
      },
    },
    {
      name: 'updateTodoPriority',
      description: 'Update the priority of an existing task. Use this when the user indicates a task is important/urgent (high priority), or can wait/is low priority. If the user just added a task and immediately says "it\'s important" or "it\'s urgent", update the most recently added task to high priority. Check context.todos to find the task ID.',
      parameters: {
        type: 'object',
        properties: {
          taskId: {
            type: 'string',
            description: 'The ID of the task to update',
          },
          priority: {
            type: 'string',
            enum: ['low', 'medium', 'high'],
            description: 'The new priority level: high for important/urgent tasks, medium for normal tasks, low for tasks that can wait',
          },
        },
        required: ['taskId', 'priority'],
      },
      handler: async (params: { taskId: string; priority: 'low' | 'medium' | 'high' }) => {
        updatePriorityHandler(params.taskId, params.priority);
        return { success: true, message: `Updated priority to ${params.priority}` };
      },
    },
  ];
}

