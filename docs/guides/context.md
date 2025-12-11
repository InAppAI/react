# Context Passing

> Send application state to make AI responses more relevant

**Context** allows you to pass information about your application's current state to the AI, enabling more relevant and personalized responses. This is one of the most powerful features of InAppAI React.

## Overview

The AI can see the context you provide and use it to:

- Answer questions about the current page or user state
- Provide personalized recommendations
- Understand user intent better
- Reference specific data from your app

## Basic Usage

Pass context as an object via the `context` prop:

```tsx
import { InAppAI, Message } from '@inappai/react';
import { useState } from 'react';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);

  return (
    <InAppAI
      
      agentId="your-agent-id"
      messages={messages}
      onMessagesChange={setMessages}
      context={{
        page: 'dashboard',
        userName: 'Alice',
        userRole: 'admin',
      }}
    />
  );
}
```

When a user asks "What can I do here?", the AI can see it's the dashboard page and the user is an admin, providing a relevant answer.

## Static vs Dynamic Context

### Static Context (Object)

Use a plain object when context doesn't change often:

```tsx
<InAppAI
  context={{
    appName: 'MyApp',
    version: '2.1.0',
    environment: 'production',
  }}
/>
```

### Dynamic Context (Function)

Use a function to capture state at the moment the user sends a message:

```tsx
<InAppAI
  context={() => ({
    currentPage: window.location.pathname,
    scrollPosition: window.scrollY,
    selectedText: window.getSelection()?.toString() || '',
    timestamp: new Date().toISOString(),
  })}
/>
```

**Important**: The function is called every time the user sends a message, ensuring the AI gets fresh data.

## Real-World Examples

### E-Commerce Store

```tsx
function ProductPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [cart, setCart] = useState([
    { id: 1, name: 'Blue T-Shirt', price: 29.99, quantity: 2 },
    { id: 2, name: 'Jeans', price: 59.99, quantity: 1 },
  ]);

  return (
    <InAppAI
      
      agentId="your-agent-id"
      messages={messages}
      onMessagesChange={setMessages}
      context={{
        page: 'product',
        productId: 'shirt-001',
        productName: 'Blue T-Shirt',
        price: 29.99,
        inStock: true,
        cart: {
          items: cart.length,
          total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        },
        user: {
          isLoggedIn: true,
          hasAccount: true,
        },
      }}
    />
  );
}
```

Now the AI can answer:
- "What's in my cart?" → Sees 3 items totaling $119.97
- "Is this item in stock?" → Sees inStock: true
- "Can I check out?" → Sees user is logged in

### Documentation Site

```tsx
function DocsPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const currentSection = 'getting-started';
  const userProgress = {
    completedSections: ['introduction', 'installation'],
    currentSection: 'quick-start',
  };

  return (
    <InAppAI
      
      agentId="your-agent-id"
      messages={messages}
      onMessagesChange={setMessages}
      displayMode="sidebar-right"

      // Dynamic context captures current page state
      context={() => ({
        pageType: 'documentation',
        section: currentSection,
        pageTitle: document.title,
        url: window.location.pathname,
        selectedText: window.getSelection()?.toString() || '',
        progress: userProgress,
      })}
    />
  );
}
```

The AI can now:
- Reference the specific documentation section
- See what the user has completed
- Refer to selected text for clarification

### SaaS Dashboard

```tsx
function Dashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const user = {
    id: 'user-123',
    name: 'Alice Chen',
    email: 'alice@company.com',
    role: 'admin',
    plan: 'professional',
  };

  const stats = {
    projects: 12,
    activeUsers: 45,
    storageUsed: '34.2 GB',
    storageLimit: '100 GB',
  };

  return (
    <InAppAI
      
      agentId="your-agent-id"
      messages={messages}
      onMessagesChange={setMessages}
      context={{
        page: 'dashboard',
        user: user,
        stats: stats,
        notifications: {
          unread: 3,
          urgent: 1,
        },
      }}
    />
  );
}
```

The AI understands the user's account and can provide personalized help.

### Code Editor

```tsx
function CodeEditor() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedCode, setSelectedCode] = useState('');
  const [currentFile, setCurrentFile] = useState('app.tsx');

  return (
    <InAppAI
      
      agentId="your-agent-id"
      messages={messages}
      onMessagesChange={setMessages}
      displayMode="panel-right"

      // Capture editor state when user asks a question
      context={() => ({
        file: currentFile,
        language: currentFile.split('.').pop(),
        selectedCode: selectedCode,
        lineCount: selectedCode.split('\n').length,
        hasSelection: selectedCode.length > 0,
      })}
    />
  );
}
```

The AI can reference the selected code and current file.

## Context Best Practices

### 1. Include Only Relevant Data

❌ **Don't**: Send everything

```tsx
context={{
  entireUserObject: user,  // May include sensitive data
  allProducts: products,   // Too much data
  wholeDatabase: db,       // Definitely not!
}}
```

✅ **Do**: Send focused, relevant information

```tsx
context={{
  userName: user.name,
  userRole: user.role,
  currentProduct: products.find(p => p.id === currentId),
  cartTotal: cart.total,
}}
```

### 2. Avoid Sensitive Data

Never include:
- Passwords or API keys
- Credit card numbers
- Social security numbers
- Private tokens
- Full user records with PII

```tsx
context={{
  userName: user.name,        // ✅ OK
  userEmail: user.email,      // ⚠️ Careful - depends on use case
  userPassword: user.password // ❌ NEVER
}}
```

### 3. Use Functions for Dynamic Data

If data changes frequently, use a function:

```tsx
// ✅ Fresh data every message
context={() => ({
  scrollPosition: window.scrollY,
  timeOnPage: Date.now() - pageLoadTime,
})}

// ❌ Stale data - captured once
context={{
  scrollPosition: window.scrollY,  // Only set on mount
}}
```

### 4. Structure Your Context

Organize context hierarchically:

```tsx
context={{
  page: {
    type: 'product',
    id: 'prod-123',
    url: window.location.pathname,
  },
  user: {
    id: userId,
    role: userRole,
    preferences: userPreferences,
  },
  application: {
    version: '2.1.0',
    feature: featureName,
  },
}}
```

### 5. Keep It Lightweight

Context is sent with every message. Keep it under 2-3KB:

```tsx
// ✅ Lightweight - just IDs and summaries
context={{
  cartItemCount: cart.length,
  cartTotal: cart.total,
}}

// ❌ Heavy - full objects
context={{
  cartItems: cart.map(item => ({...item, fullDetails: true})),
}}
```

## Combining Context with Tools

Context and tools work great together:

```tsx
function TodoApp() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [todos, setTodos] = useState([
    { id: 1, text: 'Buy groceries', completed: false },
    { id: 2, text: 'Finish report', completed: true },
  ]);

  const tools = [
    {
      name: 'addTodo',
      description: 'Add a new todo item',
      parameters: {
        type: 'object',
        properties: {
          text: { type: 'string', description: 'The todo text' },
        },
        required: ['text'],
      },
      handler: async ({ text }: { text: string }) => {
        const newTodo = { id: Date.now(), text, completed: false };
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

      // Context shows current state
      context={{
        totalTodos: todos.length,
        completedTodos: todos.filter(t => t.completed).length,
        pendingTodos: todos.filter(t => !t.completed),
      }}
    />
  );
}
```

The AI can see pending todos and suggest adding new ones using the tool.

## Advanced Patterns

### Context with Authentication

```tsx
context={{
  user: authUser ? {
    id: authUser.id,
    name: authUser.name,
    authenticated: true,
  } : {
    authenticated: false,
  },
}}
```

### Multi-Language Context

```tsx
context={{
  locale: i18n.language,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
}}
```

### Feature Flags

```tsx
context={{
  features: {
    newDashboard: featureFlags.newDashboard,
    betaFeatures: user.betaAccess,
  },
}}
```

## Examples

See these complete implementations:

- [E-Commerce Context](../../examples/snippets/popup-chat.tsx) - Shopping cart context
- [Documentation Context](../../examples/snippets/sidebar-docs.tsx) - Dynamic page context
- [Todo with Context](../../examples/snippets/todo-with-tools.tsx) - Context + tools

## Next Steps

- [Tools & Function Calling](./tools.md) - Execute actions based on context
- [Authentication](./authentication.md) - Pass user identity securely
- [Examples](../examples/) - See context in action
