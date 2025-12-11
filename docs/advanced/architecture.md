# Architecture

> How InAppAI React works internally

This document explains the internal architecture of InAppAI React, helping you understand how the component works and make informed decisions when building with it.

## Overview

InAppAI React is built on three core principles:

1. **Controlled Mode** - Parent component manages all state
2. **Backend Separation** - API keys and AI logic stay on the server
3. **Client-Side Tools** - Tool handlers execute in the browser

## Component Architecture

```
┌─────────────────────────────────────────────────┐
│           Your React Application                │
│                                                  │
│  ┌────────────────────────────────────────┐    │
│  │         <InAppAI />                    │    │
│  │                                         │    │
│  │  ┌──────────────┐  ┌──────────────┐   │    │
│  │  │   UI Layer   │  │ State Layer  │   │    │
│  │  │              │  │              │   │    │
│  │  │ • Button     │  │ • messages   │   │    │
│  │  │ • Window     │  │ • isOpen     │   │    │
│  │  │ • Messages   │  │ • isLoading  │   │    │
│  │  │ • Input      │  │ • error      │   │    │
│  │  └──────────────┘  └──────────────┘   │    │
│  │                                         │    │
│  │  ┌──────────────────────────────────┐ │    │
│  │  │      Tool Registry               │ │    │
│  │  │  • Executes handlers locally     │ │    │
│  │  │  • Returns results to backend    │ │    │
│  │  └──────────────────────────────────┘ │    │
│  └────────────────────────────────────────┘    │
│                      ↓ HTTP                     │
└──────────────────────┼──────────────────────────┘
                       ↓
         ┌─────────────────────────┐
         │   InAppAI Backend       │
         │                         │
         │  • Validates requests   │
         │  • Calls AI API         │
         │  • Manages context      │
         │  • Handles tool calls   │
         └─────────────────────────┘
                       ↓
              ┌────────────────┐
              │   AI Provider  │
              │  (OpenAI, etc) │
              └────────────────┘
```

## Data Flow

### Message Send Flow

```
1. User types message and presses Enter
   ↓
2. Component creates Message object
   ↓
3. Calls onMessagesChange([...messages, userMessage])
   ↓
4. Parent updates state (re-renders with new message)
   ↓
5. Component sends HTTP POST to backend
   ↓
6. Backend forwards to AI API
   ↓
7. AI responds (with optional tool calls)
   ↓
8. If tool calls:
   a. Component executes tool handlers locally
   b. Sends results back to backend
   c. Backend gets natural language response
   ↓
9. Component calls onMessagesChange([...messages, assistantMessage])
   ↓
10. Parent updates state (re-renders with AI response)
```

### Controlled Mode

InAppAI React uses **controlled mode** exclusively:

```tsx
// The component NEVER manages messages internally
// Parent must provide both messages and onChange

function App() {
  const [messages, setMessages] = useState<Message[]>([]); // ← Parent owns state

  return (
    <InAppAI
      messages={messages}              // ← Props IN
      onMessagesChange={setMessages}   // ← Callback OUT
    />
  );
}
```

**Why controlled mode?**

- ✅ You control persistence (localStorage, backend, etc.)
- ✅ You can transform messages before storing
- ✅ Enables multi-conversation apps
- ✅ Full control over state management
- ✅ Works with any state library (Redux, Zustand, etc.)

## Tool Execution Model

Tools use a **local-first execution** model:

```
1. User: "Add a todo: Buy milk"
   ↓
2. Backend receives message + tool definitions
   ↓
3. AI decides to call 'addTodo' tool
   ↓
4. Backend returns: { toolCalls: [{ name: 'addTodo', params: { text: 'Buy milk' } }] }
   ↓
5. Component finds local handler for 'addTodo'
   ↓
6. Executes: handler({ text: 'Buy milk' })
   ↓
7. Handler updates React state: setTodos([...todos, newTodo])
   ↓
8. Handler returns: { success: true, todo: { id: 1, text: 'Buy milk' } }
   ↓
9. Component sends result back to backend
   ↓
10. Backend asks AI to create natural language response
   ↓
11. AI responds: "I've added 'Buy milk' to your todo list"
```

**Why local execution?**

- ✅ Direct access to React state
- ✅ No need to expose state mutation APIs
- ✅ Tools can trigger side effects (navigate, open modals, etc.)
- ✅ Type-safe with TypeScript
- ❌ Tools can't run server-side operations (solved with backend tools)

## Context Handling

Context is evaluated **at message send time**:

```tsx
// Static context - captured once
<InAppAI
  context={{ userId: '123' }}  // ← Object evaluated once on mount
/>

// Dynamic context - fresh on every message
<InAppAI
  context={() => ({
    scrollPosition: window.scrollY,  // ← Function called each send
    selectedText: window.getSelection()?.toString(),
  })}
/>
```

**Context flow:**

```
User sends message
  ↓
context is function? → YES → Call context() → Get fresh data
  ↓                      NO
Send current object      ↓
  ↓                      ↓
  └──────────────────────┘
            ↓
    Sent to backend with message
```

## State Management

The component manages several internal states:

### UI State (Internal)

```tsx
const [isOpen, setIsOpen] = useState(false);        // Window open/closed
const [isFolded, setIsFolded] = useState(false);    // Sidebar folded
const [inputValue, setInputValue] = useState('');   // Input text
const [isLoading, setIsLoading] = useState(false);  // AI thinking
const [error, setError] = useState<string | null>(null);
```

### Message State (External)

```tsx
// Provided by parent via props
messages: Message[]
onMessagesChange: (messages: Message[]) => void
```

This separation ensures:
- UI state is temporary (doesn't need persistence)
- Message state is durable (parent controls storage)

## Rendering Strategy

InAppAI React uses different render strategies per display mode:

### Popup Mode

```tsx
return (
  <>
    <button onClick={toggleOpen}>🤖</button>  {/* Fixed position */}
    {isOpen && (
      <div className="window">  {/* Absolute positioned */}
        {/* Chat UI */}
      </div>
    )}
  </>
);
```

### Sidebar Mode

```tsx
return (
  <div className="sidebar">  {/* Fixed position, full height */}
    {isFolded ? (
      <div className="folded-content">AI</div>
    ) : (
      <div className="expanded-content">{/* Chat UI */}</div>
    )}
  </div>
);
```

### Panel Mode

```tsx
return (
  <div className="panel" style={{ width: panelWidth }}>
    <div className="resize-handle" onMouseDown={startResize} />
    {/* Chat UI */}
  </div>
);
```

### Embedded Mode

```tsx
// Returns chat UI directly (no wrapper)
return (
  <div className="chat-window">
    {/* Chat UI */}
  </div>
);
```

## Performance Optimizations

### 1. Message Rendering

Messages use stable keys to prevent re-renders:

```tsx
messages.map((msg) => (
  <div key={msg.id}>  {/* Stable ID prevents full re-render */}
    {msg.content}
  </div>
))
```

### 2. Auto-scroll Optimization

Uses `useRef` to avoid re-renders:

```tsx
const messagesEndRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
}, [messages]);  // Only when messages change
```

### 3. Input Focus Management

Refocuses input after AI responds:

```tsx
useEffect(() => {
  if (!isLoading) {
    inputRef.current?.focus();
  }
}, [isLoading]);
```

### 4. Connection Checking

Health checks run at 30-second intervals:

```tsx
useEffect(() => {
  const checkConnection = async () => {
    const response = await fetch(`${endpoint}/health`);
    setIsConnected(response.ok);
  };

  checkConnection();
  const interval = setInterval(checkConnection, 30000);
  return () => clearInterval(interval);
}, [endpoint]);
```

## Styling System

Three-layer styling approach:

### Layer 1: Base Styles (CSS)

```css
/* InAppAI.css - component structure */
.inapp-ai-window {
  display: flex;
  flex-direction: column;
}
```

### Layer 2: Theme Styles (CSS)

```css
/* themes.css - theme variables */
.inapp-ai-theme-dark {
  --inapp-ai-bg: #1f2937;
  --inapp-ai-text: #f9fafb;
}
```

### Layer 3: Custom Styles (Inline)

```tsx
// Applied as inline styles via customStyles prop
<div style={{
  background: customStyles.headerBackground,
  color: customStyles.headerTextColor,
}} />
```

Priority: **Inline > Theme > Base**

## React Hooks Used

### useState

- Message state (external)
- UI state (internal)
- Loading state
- Error state

### useEffect

- Auto-scroll on new messages
- Backend health checks
- Panel resize handlers
- Input focus management

### useRef

- Message scroll anchor
- Panel resize element
- Input element reference
- External messages reference (avoid stale closures)

### No Custom Hooks

The component doesn't export custom hooks. All functionality is encapsulated in the `<InAppAI />` component.

## Error Handling

Errors are handled at multiple levels:

### 1. Network Errors

```tsx
try {
  const response = await fetch(`${endpoint}/chat`, { ... });
  if (!response.ok) throw new Error('Failed to get response');
} catch (err) {
  setError(err.message);
  onError?.(err);  // Call optional error hook
}
```

### 2. Tool Execution Errors

```tsx
try {
  const result = await tool.handler(params);
  return result;
} catch (error) {
  return { success: false, error: error.message };
}
```

### 3. UI Error Display

```tsx
{error && (
  <div className="error-banner">
    {error}
    <button onClick={() => setError(null)}>Dismiss</button>
  </div>
)}
```

## Security Considerations

### Client-Side Only

- ✅ No API keys in client code
- ✅ Backend validates all requests
- ✅ Tool handlers run in browser (can't access secrets)

### CORS

Backend must enable CORS for frontend origin:

```typescript
// Backend
app.use(cors({
  origin: ['https://your-app.com'],
  credentials: true,
}));
```

### Authentication

JWT tokens are sent via headers:

```tsx
fetch(`${endpoint}/chat`, {
  headers: {
    'Authorization': `Bearer ${authToken}`,
  },
});
```

## Bundle Size

InAppAI React is optimized for small bundle size:

- **Main package**: ~50KB (minified)
- **Dependencies**:
  - `react-markdown`: ~25KB
  - `react-syntax-highlighter`: ~20KB
- **Total**: ~95KB minified (~30KB gzipped)

Tree-shaking eliminates unused code.

## Browser Compatibility

Supports all modern browsers:

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Uses standard Web APIs:
- `fetch` for networking
- `localStorage` for persistence (user-implemented)
- CSS Grid/Flexbox for layout

## TypeScript Support

Fully typed with TypeScript:

- All props have type definitions
- Message, Tool, CustomStyles interfaces exported
- Generic types for custom contexts
- Type inference for tool handlers

```tsx
import type { InAppAIProps, Message, Tool } from '@inappai/react';
```

## Testing Considerations

When testing apps that use InAppAI:

### 1. Mock the Component

```tsx
jest.mock('@inappai/react', () => ({
  InAppAI: ({ onMessagesChange }: any) => (
    <div data-testid="inappai-mock">
      <button onClick={() => onMessagesChange([])}>Send</button>
    </div>
  ),
}));
```

### 2. Test Message State

```tsx
test('messages update correctly', () => {
  const { result } = renderHook(() => useState<Message[]>([]));
  const [messages, setMessages] = result.current;

  // Test your message handling logic
  act(() => {
    setMessages([{ id: '1', role: 'user', content: 'Hello' }]);
  });

  expect(result.current[0]).toHaveLength(1);
});
```

### 3. Mock Backend

```tsx
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ message: 'AI response' }),
  })
);
```

## Design Patterns

### Composition

The component is designed as a single, self-contained unit:

```tsx
// Not composable (intentional)
<InAppAI>
  <InAppAI.Header />      {/* ❌ Doesn't exist */}
  <InAppAI.Messages />    {/* ❌ Doesn't exist */}
</InAppAI>

// Configured via props (actual API)
<InAppAI
  showHeader={true}       {/* ✅ Props control features */}
  customStyles={{ ... }}  {/* ✅ Props control styling */}
/>
```

This simplifies the API and prevents invalid configurations.

### Render Props

Not used. Customization is via props only.

### Hooks Pattern

No custom hooks exported. All functionality through component.

## Next Steps

- [Performance Guide](./performance.md) - Optimization techniques
- [Security Guide](./security.md) - Security best practices
- [Backend Integration](./backend-integration.md) - Set up your backend
