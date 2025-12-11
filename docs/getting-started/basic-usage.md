# Basic Usage

> Common patterns and configuration for InAppAI React

This guide covers the most common usage patterns and configurations you'll need when integrating InAppAI into your React application.

## Controlled Mode

InAppAI React uses **controlled mode** exclusively - you manage the message state in your application:

```tsx
import { useState } from 'react';
import { InAppAI, Message } from '@inappai/react';

function App() {
  // You manage the messages state
  const [messages, setMessages] = useState<Message[]>([]);

  return (
    <InAppAI
      
      agentId="your-agent-id"
      messages={messages}
      onMessagesChange={setMessages}
    />
  );
}
```

**Why controlled mode?**
- Full control over message persistence
- Implement custom storage (localStorage, database, etc.)
- Easy to debug and test
- No hidden state

## Required Props

Every InAppAI component needs these props:

```tsx
<InAppAI
    // Backend API URL
  agentId="your-agent-id"                  // Your Agent ID
  messages={messages}                       // Message array state
  onMessagesChange={setMessages}           // Update handler
/>
```

## Optional Common Props

### Position

Control where the chat button appears (popup mode only):

```tsx
<InAppAI
  position="bottom-right"  // bottom-left, top-right, top-left
  // ... required props
/>
```

### Theme

Choose from 7 built-in themes:

```tsx
<InAppAI
  theme="light"  // dark, professional, playful, minimal, ocean, sunset
  // ... required props
/>
```

### Conversation ID

Identify the conversation context:

```tsx
<InAppAI
  conversationId="user-123"  // Unique ID for this conversation
  // ... required props
/>
```

This is useful for:
- Multi-user apps (one conversation per user)
- Multi-conversation apps (like ChatGPT)
- Backend conversation tracking

## Common Patterns

### 1. Popup Chat (Default)

Floating chat button that opens a popup window:

```tsx
function App() {
  const [messages, setMessages] = useState<Message[]>([]);

  return (
    <div>
      <YourAppContent />
      <InAppAI
        
        agentId="your-agent-id"
        messages={messages}
        onMessagesChange={setMessages}
        position="bottom-right"
        theme="light"
      />
    </div>
  );
}
```

### 2. Sidebar Layout

Fixed sidebar that slides in from the side:

```tsx
<InAppAI
  displayMode="sidebar-right"  // or sidebar-left
  defaultFolded={false}         // Start expanded
  // ... required props
/>
```

### 3. Panel Layout

Resizable panel that pushes content:

```tsx
<InAppAI
  displayMode="panel-right"     // or panel-left
  panelMinWidth="20%"
  panelMaxWidth="50%"
  panelDefaultWidth="30%"
  // ... required props
/>
```

### 4. Embedded Chat

Embed chat directly in your layout:

```tsx
<div style={{ height: '600px', width: '400px' }}>
  <InAppAI
    displayMode="embedded"
    showHeader={true}
    // ... required props
  />
</div>
```

### 5. Custom Styling

Match your brand:

```tsx
<InAppAI
  customStyles={{
    primaryColor: '#6366f1',
    buttonIcon: '💬',
    headerTitle: 'Support Chat',
    windowWidth: '400px',
    windowHeight: '600px',
  }}
  // ... required props
/>
```

### 6. With Context

Send app state to the AI:

```tsx
<InAppAI
  context={{
    page: window.location.pathname,
    userPlan: 'premium',
    cartItems: 3,
  }}
  // ... required props
/>
```

### 7. With Message Hooks

React to message events:

```tsx
<InAppAI
  onMessageSent={(message) => {
    console.log('User sent:', message);
    // Track analytics, etc.
  }}
  onMessageReceived={(message) => {
    console.log('AI replied:', message);
  }}
  onError={(error) => {
    console.error('Error:', error);
    // Show notification to user
  }}
  // ... required props
/>
```

## Message State Management

### Basic State

Simple useState for single-page apps:

```tsx
const [messages, setMessages] = useState<Message[]>([]);

<InAppAI
  messages={messages}
  onMessagesChange={setMessages}
/>
```

### With localStorage Persistence

Save messages to browser storage:

```tsx
const conversationId = 'chat-123';
const storageKey = `conversation_${conversationId}`;

const [messages, setMessages] = useState<Message[]>(() => {
  const saved = localStorage.getItem(storageKey);
  return saved ? JSON.parse(saved) : [];
});

useEffect(() => {
  localStorage.setItem(storageKey, JSON.stringify(messages));
}, [messages, storageKey]);

<InAppAI
  conversationId={conversationId}
  messages={messages}
  onMessagesChange={setMessages}
/>
```

### With Backend Persistence

Save to your database:

```tsx
const [messages, setMessages] = useState<Message[]>([]);
const [conversationId, setConversationId] = useState<string>('');

// Load messages on mount
useEffect(() => {
  async function loadConversation() {
    const { id, messages } = await api.getOrCreateConversation(userId);
    setConversationId(id);
    setMessages(messages);
  }
  loadConversation();
}, [userId]);

// Save messages when they change
const handleMessagesChange = async (newMessages: Message[]) => {
  setMessages(newMessages);
  await api.saveMessages(userId, conversationId, newMessages);
};

<InAppAI
  conversationId={conversationId}
  messages={messages}
  onMessagesChange={handleMessagesChange}
/>
```

## Conversation ID Patterns

### Per-User Conversation

Most common pattern for single conversation per user:

```tsx
const conversationId = `user-${userId}`;
```

### Per-Feature Conversation

Separate conversations for different features:

```tsx
const conversationId = `user-${userId}-${feature}`;
// e.g., "user-123-support", "user-123-onboarding"
```

### Multi-Conversation Support

User can switch between multiple conversations:

```tsx
const [activeConversationId, setActiveConversationId] = useState('conv-1');

<InAppAI
  conversationId={activeConversationId}
  messages={conversations[activeConversationId]}
  onMessagesChange={(msgs) => {
    setConversations(prev => ({
      ...prev,
      [activeConversationId]: msgs
    }));
  }}
/>
```

## Component Placement

### With React Router

Place InAppAI **above** your routes so it persists across navigation:

```tsx
function App() {
  const [messages, setMessages] = useState<Message[]>([]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>

      {/* Component persists across route changes */}
      <InAppAI
        conversationId="app-assistant"
        messages={messages}
        onMessagesChange={setMessages}
      />
    </>
  );
}
```

### With Panel Mode

Use flex layout for side-by-side content:

```tsx
const isPanel = displayMode.startsWith('panel');

if (isPanel) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: displayMode === 'panel-right' ? 'row-reverse' : 'row',
      height: '100vh'
    }}>
      <InAppAI displayMode={displayMode} {...props} />
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <YourMainContent />
      </div>
    </div>
  );
}
```

## Environment Configuration

Use environment variables for different environments:

```tsx
// .env.development
VITE_AGENT_ID=dev-agent-id-123
VITE_API_BASE_URL=https://api.inappai.com/api

// .env.production
VITE_AGENT_ID=prod-agent-id-456
VITE_API_BASE_URL=https://api.inappai.com/api
```

```tsx
<InAppAI
  endpoint={import.meta.env.VITE_API_BASE_URL}
  agentId={import.meta.env.VITE_AGENT_ID}
  // ... other props
/>
```

## Best Practices

### ✅ Do's

- **Manage message state** at the appropriate level (component, context, or global state)
- **Use conversationId** for multi-user or multi-conversation apps
- **Persist messages** to backend for production apps
- **Place component above routes** to maintain state during navigation
- **Use environment variables** for Agent IDs
- **Handle errors** with the `onError` callback

### ❌ Don'ts

- Don't put InAppAI inside route components (it will remount and lose state)
- Don't hardcode sensitive data in the code
- Don't use localStorage for production persistence (use your backend)
- Don't forget to import the CSS file
- Don't share the same conversationId across different users

## TypeScript Types

InAppAI exports useful TypeScript types:

```tsx
import {
  InAppAI,
  Message,           // Message structure
  Tool,              // Tool definition
  CustomStyles,      // Styling options
  InAppAIProps,      // Component props
} from '@inappai/react';
```

## Next Steps

Now that you understand basic usage, explore advanced features:

- **[Display Modes](../guides/display-modes.md)** - Different layout options
- **[Themes & Customization](../guides/themes.md)** - Styling and theming
- **[Context Passing](../guides/context.md)** - Send app state to AI
- **[Tools](../guides/tools.md)** - Let AI perform actions
- **[Persistence](../guides/persistence.md)** - Save conversations properly
- **[Message Hooks](../guides/message-hooks.md)** - React to events

## Examples

See real-world examples:

- **[E-Commerce](../examples/e-commerce.md)** - Shopping assistant
- **[Documentation Site](../examples/documentation.md)** - Help widget
- **[SaaS Dashboard](../examples/saas-dashboard.md)** - App assistant
- **[All Examples](../examples/)** - Browse all examples
