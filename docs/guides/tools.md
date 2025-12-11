# Tools & Function Calling

> Enable the AI to execute functions in your application

**Tools** (also called function calling) enable the AI to perform actions in your application. This transforms the AI from a passive chatbot into an active assistant that can create todos, update data, trigger workflows, and more.

## Overview

Tools work through a simple flow:

1. **Define Tool Schema** - Specify name, description, and parameters
2. **Provide Handler** - Implement the actual function logic
3. **AI Decides to Call** - When appropriate, AI calls your tool with parameters
4. **Handler Executes** - Your function runs and returns a result
5. **AI Uses Result** - AI incorporates the result into its response

## Tool Interface

```typescript
interface Tool {
  name: string;                    // Unique identifier for the tool
  description: string;             // Explains when and how to use the tool
  parameters: {                    // JSON Schema for parameters
    type: 'object';
    properties: Record<string, {
      type: string;
      description: string;
      enum?: string[];             // For constrained values
    }>;
    required: string[];            // Required parameter names
  };
  handler: (params: any) => Promise<any>;  // Async function that executes the tool
}
```

## Quick Example

```tsx
import { InAppAI, Tool, Message } from '@inappai/react';
import { useState } from 'react';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [count, setCount] = useState(0);

  const tools: Tool[] = [
    {
      name: 'incrementCounter',
      description: 'Increment the counter when the user asks to increase it',
      parameters: {
        type: 'object',
        properties: {
          amount: {
            type: 'number',
            description: 'Amount to increment by (default: 1)',
          },
        },
        required: [],
      },
      handler: async (params) => {
        const amount = params.amount || 1;
        setCount(prev => prev + amount);
        return { success: true, newCount: count + amount };
      },
    },
  ];

  return (
    <div>
      <p>Counter: {count}</p>
      <InAppAI
        
        agentId="your-agent-id"
        messages={messages}
        onMessagesChange={setMessages}
        tools={tools}
        context={{ currentCount: count }}
      />
    </div>
  );
}
```

**User**: "Increase the counter by 5"
**AI**: *[Calls incrementCounter({ amount: 5 })]* "I've incremented the counter by 5. It's now at 5."

## Complete Example: Todo App

Here's a real-world example that lets the AI manage a todo list:

```typescript
import { Tool } from '@inappai/react';

function TodoApp() {
  const [todos, setTodos] = useState([
    { id: '1', text: 'Buy groceries', completed: false, priority: 'high' },
    { id: '2', text: 'Call dentist', completed: false, priority: 'medium' },
  ]);

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
      handler: async (params: { text: string; priority?: string }) => {
        const newTodo = {
          id: Date.now().toString(),
          text: params.text,
          completed: false,
          priority: params.priority || 'medium',
        };
        setTodos([...todos, newTodo]);
        return { success: true, todo: newTodo };
      },
    },
    {
      name: 'completeTodo',
      description: 'Mark a todo as completed when the user indicates they finished a task. Use the task ID or keywords from the task text to identify which task to complete.',
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
          setTodos(todos.map(t => t.id === todo.id ? { ...t, completed: true } : t));
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
          taskId: { type: 'string', description: 'The ID of the task' },
          priority: {
            type: 'string',
            enum: ['low', 'medium', 'high'],
            description: 'The new priority level',
          },
        },
        required: ['taskId', 'priority'],
      },
      handler: async (params: { taskId: string; priority: string }) => {
        setTodos(todos.map(t =>
          t.id === params.taskId ? { ...t, priority: params.priority } : t
        ));
        return { success: true, message: `Updated priority to ${params.priority}` };
      },
    },
  ];

  return (
    <InAppAI
      
      agentId="your-agent-id"
      tools={todoTools}
      context={() => ({
        todos: todos.map(t => ({
          id: t.id,
          text: t.text,
          completed: t.completed,
          priority: t.priority
        })),
        stats: {
          total: todos.length,
          active: todos.filter(t => !t.completed).length,
          completed: todos.filter(t => t.completed).length,
        }
      })}
    />
  );
}
```

**Example Conversation:**

```
User: "Add a task to prepare presentation"
AI: [Calls addTodo({ text: "Prepare presentation", priority: "medium" })]
    "I've added 'Prepare presentation' to your todo list."

User: "Actually, make it high priority"
AI: [Calls updateTodoPriority({ taskId: "1234", priority: "high" })]
    "Updated the task priority to high."

User: "I finished buying groceries"
AI: [Calls completeTodo({ identifier: "groceries" })]
    "Great! I've marked 'Buy groceries' as completed."
```

## Tool Description Best Practices

The `description` field is critical - it tells the AI when and how to use the tool.

### ✅ Good Descriptions

```typescript
{
  name: 'addTodo',
  description: 'Create a new todo item when the user wants to add a task to their list.',
  // Clear trigger condition: "when the user wants to add"
}

{
  name: 'searchProducts',
  description: 'Search the product catalog when the user asks about available products, pricing, or inventory. Returns matching products with name, price, and stock status.',
  // Explains when to use + what it returns
}

{
  name: 'createTicket',
  description: 'Create a new support ticket when the user reports an issue or requests help. Use this when the conversation suggests a problem that needs tracking.',
  // Multiple trigger scenarios
}
```

### ❌ Bad Descriptions

```typescript
{
  name: 'addTodo',
  description: 'Adds a todo',
  // Too vague - when should it be used?
}

{
  name: 'search',
  description: 'Performs a search operation in the database',
  // Too technical, not user-focused
}

{
  name: 'updateUser',
  description: 'Only use this when the user explicitly says "update my profile"',
  // Too rigid, misses natural variations
}
```

### Tips for Great Descriptions

1. **Explain the trigger** - "when the user asks to...", "when the user reports..."
2. **Be specific but flexible** - Cover main use cases without being overly restrictive
3. **Mention what it returns** - Helps AI use the result effectively
4. **Reference context** - "Use the product IDs from context.cart..."
5. **Handle ambiguity** - "Accept task ID or keywords to identify the task"

## Parameters Best Practices

### Use Enums for Limited Options

```typescript
{
  priority: {
    type: 'string',
    enum: ['low', 'medium', 'high'],
    description: 'Task priority level',
  }
}
```

### Make Parameters Optional When Appropriate

```typescript
{
  parameters: {
    type: 'object',
    properties: {
      query: { type: 'string', description: 'Search query' },
      limit: { type: 'number', description: 'Max results (default: 10)' },
    },
    required: ['query'],  // Only query is required
  }
}
```

### Use Clear Descriptions

```typescript
{
  identifier: {
    type: 'string',
    description: 'Task ID (e.g., "123") or keyword from task text (e.g., "groceries")',
    // Shows examples of valid inputs
  }
}
```

## Combining Tools and Context

Tools work best when combined with context:

```tsx
<InAppAI
  tools={tools}
  context={() => ({
    // Provide current state so AI knows what's available
    todos: todos.map(t => ({ id: t.id, text: t.text, completed: t.completed })),
    stats: {
      total: todos.length,
      completed: todos.filter(t => t.completed).length,
    }
  })}
/>
```

The AI can see the current state and make better decisions about which tools to call.

## Error Handling

Return clear error messages from handlers:

```typescript
{
  handler: async (params) => {
    const todo = todos.find(t => t.id === params.id);

    if (!todo) {
      return {
        success: false,
        error: 'Todo not found. Please check the ID.'
      };
    }

    // Success case
    deleteTodo(todo.id);
    return {
      success: true,
      message: `Deleted todo: ${todo.text}`
    };
  }
}
```

The AI will communicate these errors naturally to the user.

## Organizing Tools

For complex apps, organize tools into separate modules:

```typescript
// tools/todoTools.ts
export const createTodoTools = (
  todos: Todo[],
  addTodo: (text: string, priority: string) => void,
  completeTodo: (id: string) => void
): Tool[] => [
  {
    name: 'addTodo',
    // ... tool definition
  },
  {
    name: 'completeTodo',
    // ... tool definition
  },
];

// Component
import { createTodoTools } from './tools/todoTools';

function App() {
  const [todos, setTodos] = useState([]);
  const tools = createTodoTools(todos, addTodo, completeTodo);

  return <InAppAI tools={tools} />;
}
```

## Security Considerations

### Validate Inputs

Always validate tool inputs, even though the AI provides them:

```typescript
{
  handler: async (params) => {
    // Validate field is allowed
    const allowedFields = ['name', 'bio'];
    if (!allowedFields.includes(params.field)) {
      return { error: 'Invalid field' };
    }

    // Sanitize value
    const sanitized = sanitizeInput(params.value);

    // Perform update
    await updateProfile(params.field, sanitized);
    return { success: true };
  }
}
```

### Restrict Permissions

Only provide tools for actions the current user is allowed to perform:

```typescript
const tools: Tool[] = [
  // Everyone can add todos
  addTodoTool,

  // Only admins can delete all todos
  ...(user.isAdmin ? [deleteAllTodosTool] : []),
];
```

### Don't Expose Sensitive Data

Be careful what you return from tool handlers:

```typescript
// ❌ Don't expose sensitive data
return { user: { id, email, password, ssn } };

// ✅ Only return what's needed
return { user: { id, displayName } };
```

## Testing Tools

Test tool handlers independently:

```typescript
import { createTodoTools } from './tools/todoTools';

describe('Todo Tools', () => {
  it('should add a todo', async () => {
    const todos: Todo[] = [];
    const addTodo = jest.fn();

    const tools = createTodoTools(todos, addTodo, jest.fn());
    const addTodoTool = tools.find(t => t.name === 'addTodo')!;

    const result = await addTodoTool.handler({
      text: 'Test task',
      priority: 'high'
    });

    expect(result.success).toBe(true);
    expect(addTodo).toHaveBeenCalledWith('Test task', 'high');
  });
});
```

## Common Patterns

### CRUD Operations

```typescript
const tools: Tool[] = [
  createItemTool,
  readItemTool,
  updateItemTool,
  deleteItemTool,
];
```

### Search and Filter

```typescript
{
  name: 'searchProducts',
  description: 'Search products by name, category, or description',
  parameters: {
    type: 'object',
    properties: {
      query: { type: 'string', description: 'Search query' },
      category: { type: 'string', description: 'Filter by category (optional)' },
      minPrice: { type: 'number', description: 'Minimum price (optional)' },
      maxPrice: { type: 'number', description: 'Maximum price (optional)' },
    },
    required: ['query'],
  },
  handler: async (params) => {
    const results = await searchProducts(params);
    return { products: results };
  },
}
```

### Workflows

```typescript
{
  name: 'submitOrder',
  description: 'Submit the current cart as an order',
  parameters: {
    type: 'object',
    properties: {
      shippingAddress: { type: 'string' },
      paymentMethod: { type: 'string', enum: ['card', 'paypal'] },
    },
    required: ['shippingAddress', 'paymentMethod'],
  },
  handler: async (params) => {
    const order = await createOrder(cart, params);
    clearCart();
    return { orderId: order.id, total: order.total };
  },
}
```

## Troubleshooting

### AI not calling tools

1. **Check description clarity** - Is it clear when to use the tool?
2. **Provide context** - Does the AI have enough information to know when to call?
3. **Simplify parameters** - Are parameters too complex?
4. **Test manually** - Call the handler directly to verify it works

### Wrong parameters passed

1. **Improve parameter descriptions** - Be more specific
2. **Use enums** - Constrain values to valid options
3. **Validate in handler** - Check and return clear errors

### Tools not working with state

Use functional state updates to avoid stale closures:

```typescript
// ❌ Bad - uses stale todos
handler: async (params) => {
  setTodos([...todos, newTodo]);  // todos might be stale
}

// ✅ Good - always uses current state
handler: async (params) => {
  setTodos(prev => [...prev, newTodo]);
}
```

## Code Examples

Complete working example with tools:

- **[Todo with Tools](../../examples/snippets/todo-with-tools.tsx)** - Full todo app with AI tools for create, update, delete, and complete operations

## Next Steps

- **[Context Passing](./context.md)** - Provide app state to AI
- **[Examples](../examples/)** - See real-world tool implementations
- **[API Reference](../api/types.md)** - Complete Tool type definition
