# TypeScript Types

> Complete type definitions for InAppAI React

InAppAI React is written in TypeScript and provides complete type definitions. This page documents all exported types and interfaces.

## Importing Types

```tsx
import type {
  InAppAIProps,
  Message,
  Tool,
  CustomStyles,
} from '@inappai/react';
```

## Core Types

### InAppAIProps

Props for the `<InAppAI />` component.

```typescript
interface InAppAIProps {
  // Required
  endpoint: string;
  agentId: string;
  messages: Message[];
  onMessagesChange: (messages: Message[]) => void;

  // Display
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  displayMode?: 'popup' | 'sidebar-left' | 'sidebar-right' |
                'panel-left' | 'panel-right' | 'embedded';
  defaultFolded?: boolean;
  showHeader?: boolean;

  // Styling
  theme?: 'light' | 'dark' | 'professional' | 'playful' |
          'minimal' | 'ocean' | 'sunset';
  customStyles?: CustomStyles;

  // Context & Data
  context?: Record<string, any> | (() => Record<string, any>);
  conversationId?: string;
  authToken?: string;

  // Tools
  tools?: Tool[];

  // Panel-specific
  panelMinWidth?: string;
  panelMaxWidth?: string;
  panelDefaultWidth?: string;
  onPanelResize?: (width: number) => void;

  // Hooks
  onMessageSent?: (message: Message) => void;
  onMessageReceived?: (message: Message) => void;
  onError?: (error: Error) => void;
}
```

**Usage:**

```tsx
const props: InAppAIProps = {
  endpoint: 'https://api.inappai.com/api',
  agentId: 'your-agent-id',
  messages: messages,
  onMessagesChange: setMessages,
};

<InAppAI {...props} />
```

### Message

Represents a single message in the conversation.

```typescript
interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}
```

**Fields:**

- `id` - Unique message identifier (e.g., `"msg-123"`, `"1234567890-user"`)
- `role` - Who sent the message:
  - `'user'` - Human user
  - `'assistant'` - AI assistant
  - `'system'` - System message (rarely used)
- `content` - Message text (supports Markdown for assistant messages)
- `timestamp` - When the message was created (optional)
- `usage` - Token usage statistics (only for assistant messages, optional)

**Usage:**

```tsx
const [messages, setMessages] = useState<Message[]>([
  {
    id: '1',
    role: 'assistant',
    content: 'Hello! How can I help you?',
    timestamp: new Date(),
  },
]);

// Adding a user message
const userMessage: Message = {
  id: Date.now().toString(),
  role: 'user',
  content: 'What is React?',
  timestamp: new Date(),
};

setMessages([...messages, userMessage]);
```

**Token Usage:**

```tsx
// Assistant message with token usage
const assistantMessage: Message = {
  id: '2',
  role: 'assistant',
  content: 'React is a JavaScript library...',
  timestamp: new Date(),
  usage: {
    promptTokens: 25,
    completionTokens: 150,
    totalTokens: 175,
  },
};
```

### Tool

Defines a function the AI can execute.

```typescript
interface Tool {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, {
      type: string;
      description: string;
      enum?: string[];
    }>;
    required: string[];
  };
  handler: (params: any) => Promise<any> | any;
}
```

**Fields:**

- `name` - Tool identifier (e.g., `"addTodo"`, `"search"`)
- `description` - Explains when to use the tool (AI reads this)
- `parameters` - JSON Schema defining tool parameters
  - `type` - Always `'object'`
  - `properties` - Parameter definitions
  - `required` - Array of required parameter names
- `handler` - Async function that executes the tool

**Usage:**

```tsx
const tools: Tool[] = [
  {
    name: 'addTodo',
    description: 'Add a new todo item to the list',
    parameters: {
      type: 'object',
      properties: {
        text: {
          type: 'string',
          description: 'The todo item text',
        },
        priority: {
          type: 'string',
          description: 'Priority level',
          enum: ['low', 'medium', 'high'],
        },
      },
      required: ['text'],
    },
    handler: async ({ text, priority }) => {
      const newTodo = {
        id: Date.now(),
        text,
        priority: priority || 'medium',
        completed: false,
      };

      setTodos([...todos, newTodo]);

      return {
        success: true,
        todo: newTodo,
      };
    },
  },
];
```

**Parameter Types:**

Supported parameter types in the JSON Schema:

- `'string'` - Text
- `'number'` - Numeric value
- `'boolean'` - true/false
- `'array'` - List of values
- `'object'` - Nested object

**With Enums:**

```tsx
{
  name: 'setTheme',
  description: 'Change the app theme',
  parameters: {
    type: 'object',
    properties: {
      theme: {
        type: 'string',
        description: 'Theme name',
        enum: ['light', 'dark', 'auto'],
      },
    },
    required: ['theme'],
  },
  handler: async ({ theme }) => {
    setTheme(theme);
    return { success: true, theme };
  },
}
```

See [Tools Guide](../guides/tools.md) for detailed examples.

### CustomStyles

Customize the appearance of the chat interface.

```typescript
interface CustomStyles {
  // Primary branding
  primaryColor?: string;
  primaryGradient?: string;

  // Button
  buttonBackgroundColor?: string;
  buttonTextColor?: string;
  buttonSize?: string;
  buttonBorderRadius?: string;
  buttonIcon?: string;

  // Window
  windowWidth?: string;
  windowHeight?: string;
  windowBorderRadius?: string;

  // Header
  headerBackground?: string;
  headerTextColor?: string;
  headerTitle?: string;
  headerSubtitle?: string;

  // Message bubbles
  userMessageBackground?: string;
  userMessageColor?: string;
  assistantMessageBackground?: string;
  assistantMessageColor?: string;

  // Typography
  fontFamily?: string;
  fontSize?: string;

  // Input area
  inputBackground?: string;
  inputBorderColor?: string;
  inputTextColor?: string;
  inputPlaceholder?: string;

  // Sidebar
  sidebarWidth?: string;
  sidebarFoldedWidth?: string;

  // Other
  borderRadius?: string;
  boxShadow?: string;
}
```

**Usage:**

```tsx
const customStyles: CustomStyles = {
  primaryColor: '#6366f1',
  buttonIcon: '💬',
  headerTitle: 'Support',
  windowWidth: '450px',
  fontFamily: 'Inter, sans-serif',
};

<InAppAI customStyles={customStyles} />
```

See [Custom Styles API](./styling.md) for detailed documentation.

## Type Utilities

### Working with Messages

**Creating messages:**

```tsx
// Helper function to create a user message
function createUserMessage(content: string): Message {
  return {
    id: `${Date.now()}-user`,
    role: 'user',
    content,
    timestamp: new Date(),
  };
}

// Helper function to create an assistant message
function createAssistantMessage(
  content: string,
  usage?: Message['usage']
): Message {
  return {
    id: `${Date.now()}-assistant`,
    role: 'assistant',
    content,
    timestamp: new Date(),
    usage,
  };
}
```

**Filtering messages:**

```tsx
const userMessages = messages.filter(m => m.role === 'user');
const assistantMessages = messages.filter(m => m.role === 'assistant');
```

**Calculating total tokens:**

```tsx
const totalTokens = messages.reduce((sum, msg) => {
  return sum + (msg.usage?.totalTokens || 0);
}, 0);
```

### Working with Tools

**Type-safe tool handlers:**

```tsx
// Define parameter types
interface SearchParams {
  query: string;
  limit?: number;
}

interface SearchResult {
  success: boolean;
  results: Array<{ title: string; url: string }>;
}

// Type-safe handler
const searchHandler = async (params: SearchParams): Promise<SearchResult> => {
  const { query, limit = 10 } = params;
  const results = await searchAPI(query, limit);
  return { success: true, results };
};

// Tool definition
const searchTool: Tool = {
  name: 'search',
  description: 'Search for information',
  parameters: {
    type: 'object',
    properties: {
      query: { type: 'string', description: 'Search query' },
      limit: { type: 'number', description: 'Max results' },
    },
    required: ['query'],
  },
  handler: searchHandler,
};
```

## Generic Types

### Context Types

For type-safe context:

```tsx
interface AppContext {
  userId: string;
  userName: string;
  page: string;
  permissions: string[];
}

const context: AppContext = {
  userId: 'user-123',
  userName: 'Alice',
  page: 'dashboard',
  permissions: ['read', 'write'],
};

<InAppAI context={context} />
```

Or with a function:

```tsx
const getContext = (): AppContext => ({
  userId: user.id,
  userName: user.name,
  page: window.location.pathname,
  permissions: user.permissions,
});

<InAppAI context={getContext} />
```

## Type Guards

Useful type guards for working with messages:

```tsx
function isUserMessage(message: Message): message is Message & { role: 'user' } {
  return message.role === 'user';
}

function isAssistantMessage(message: Message): message is Message & { role: 'assistant' } {
  return message.role === 'assistant';
}

function hasTokenUsage(message: Message): message is Message & { usage: NonNullable<Message['usage']> } {
  return message.usage !== undefined;
}

// Usage
messages.forEach(msg => {
  if (isAssistantMessage(msg) && hasTokenUsage(msg)) {
    console.log('Tokens used:', msg.usage.totalTokens);
  }
});
```

## Best Practices

### 1. Always Type Messages

```tsx
// ✅ Good - explicit typing
const [messages, setMessages] = useState<Message[]>([]);

// ❌ Bad - no typing
const [messages, setMessages] = useState([]);
```

### 2. Type Tool Parameters

```tsx
// ✅ Good - typed parameters
interface AddTodoParams {
  text: string;
  priority?: 'low' | 'medium' | 'high';
}

handler: async (params: AddTodoParams) => {
  // params.text is string
  // params.priority is 'low' | 'medium' | 'high' | undefined
}

// ❌ Bad - any params
handler: async (params: any) => {
  // No type safety
}
```

### 3. Use Type Inference

Let TypeScript infer types when possible:

```tsx
const tools: Tool[] = [
  {
    name: 'getUser',
    // ... rest of tool
    handler: async ({ userId }) => {
      // TypeScript knows this returns Promise<any>
      const user = await fetchUser(userId);
      return { success: true, user };
    },
  },
];
```

### 4. Extend Types for Custom Needs

```tsx
// Extend Message with custom fields
interface CustomMessage extends Message {
  sentiment?: 'positive' | 'negative' | 'neutral';
  category?: string;
}

const [messages, setMessages] = useState<CustomMessage[]>([]);
```

## Examples

### Complete Type-Safe Component

```tsx
import { useState } from 'react';
import type { InAppAI, Message, Tool } from '@inappai/react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

interface AddTodoParams {
  text: string;
}

function TodoApp() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);

  const tools: Tool[] = [
    {
      name: 'addTodo',
      description: 'Add a new todo',
      parameters: {
        type: 'object',
        properties: {
          text: { type: 'string', description: 'Todo text' },
        },
        required: ['text'],
      },
      handler: async ({ text }: AddTodoParams) => {
        const newTodo: Todo = {
          id: Date.now(),
          text,
          completed: false,
        };
        setTodos([...todos, newTodo]);
        return { success: true, todo: newTodo };
      },
    },
  ];

  return (
    <InAppAI
      
      agentId="your-agent-id"
      messages={messages}
      onMessagesChange={setMessages}
      tools={tools}
      context={{ todosCount: todos.length }}
    />
  );
}
```

## Next Steps

- [Component Props](./components.md) - Full props documentation
- [Custom Styles](./styling.md) - Styling API reference
- [Tools Guide](../guides/tools.md) - Working with tools
