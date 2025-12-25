# Demo Architecture

> Code structure and design patterns used in the InAppAI React demo

This document explains the architecture of the demo application, helping you understand how the pieces fit together and apply similar patterns in your own projects.

## Overview

The demo is a multi-page React application built with Vite that showcases different integration patterns for InAppAI React.

```
examples/demo/
├── src/
│   ├── main.tsx              # App entry point
│   ├── Router.tsx            # Routing and shared AI assistant
│   ├── index.css             # Global styles
│   ├── pages/                # Page components
│   │   ├── Home.tsx          # Main tutorial page
│   │   ├── TodoDemo.tsx      # Tools & context demo
│   │   ├── ChatMultiConversation.tsx  # Fullscreen multi-chat
│   │   └── Documentation.tsx # API documentation
│   ├── contexts/             # React contexts
│   │   ├── PreferenceContext.tsx   # Theme/mode persistence
│   │   └── TodoContext.tsx         # Global todo state
│   ├── hooks/                # Custom hooks
│   │   ├── useConversationStorage.ts  # Multi-conversation persistence
│   │   └── useChatHandlers.ts         # Chat event handlers
│   └── tools/                # AI tool definitions
│       ├── todoTools.ts      # Todo management tools
│       └── index.ts          # Tool exports
├── public/                   # Static assets
├── .env.example              # Environment template
├── package.json
└── vite.config.ts
```

## Key Patterns

### 1. Shared AI Assistant Pattern

The demo uses a "shared AI assistant" pattern where a single `<InAppAI />` component persists across route changes.

```tsx
// Router.tsx
function AppContent() {
  const location = useLocation();
  const { preferences } = usePreferences();
  const todoContext = useTodos();

  // Session-only message state
  const [messages, setMessages] = useState<Message[]>([]);

  // Determine tools and context based on current route
  const isOnTodoPage = location.pathname === '/todo-demo';
  const aiTools = isOnTodoPage ? todoContext.tools : [];
  const aiContextGetter = () => ({
    page: location.pathname,
    ...(isOnTodoPage ? todoContext.context() : {}),
  });

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/todo-demo" element={<TodoDemo />} />
        {/* ... */}
      </Routes>

      {/* Shared AI persists across routes */}
      <InAppAI
        endpoint={import.meta.env.VITE_API_BASE_URL}
        agentId={import.meta.env.VITE_AGENT_ID}
        displayMode={preferences.displayMode}
        theme={preferences.theme}
        messages={messages}
        onMessagesChange={setMessages}
        context={aiContextGetter}
        tools={aiTools}
      />
    </>
  );
}
```

**Benefits:**
- Conversation persists as user navigates
- Tools and context change based on current page
- Single source of truth for messages

### 2. Route-Based Tools

Tools are dynamically provided based on the current route:

```tsx
// In Router.tsx
const isOnTodoPage = location.pathname === '/todo-demo';
const aiTools = isOnTodoPage ? todoContext.tools : [];
```

This pattern allows page-specific AI capabilities without loading unused tools.

### 3. Context Provider Hierarchy

The app uses a layered context structure:

```tsx
// Router.tsx
<BrowserRouter>
  <PreferenceProvider>      {/* Theme, display mode */}
    <TodoProvider>          {/* Todo state and tools */}
      <AppContent />
    </TodoProvider>
  </PreferenceProvider>
</BrowserRouter>
```

## Context Implementations

### PreferenceContext

Manages user preferences with localStorage persistence:

```tsx
// contexts/PreferenceContext.tsx
export function PreferenceProvider({ children }) {
  const [preferences, setPreferences] = useState<Preferences>(() => {
    // Load from localStorage on mount
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_PREFERENCES;
  });

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  }, [preferences]);

  return (
    <PreferenceContext.Provider value={{ preferences, setTheme, setDisplayMode }}>
      {children}
    </PreferenceContext.Provider>
  );
}
```

**Stored preferences:**
- `theme`: Current theme ('light', 'dark', 'professional', etc.)
- `displayMode`: Layout mode ('popup', 'sidebar-right', 'panel-left', etc.)

### TodoContext

Manages todo state and provides tools + context:

```tsx
// contexts/TodoContext.tsx
export function TodoProvider({ children }) {
  const [todos, setTodos] = useState<Todo[]>([/* initial todos */]);

  // CRUD operations
  const addTodo = (text, priority) => { /* ... */ };
  const completeTodo = (id) => { /* ... */ };
  const deleteTodo = (id) => { /* ... */ };
  const updatePriority = (id, priority) => { /* ... */ };

  // Create tools with current handlers
  const tools = todoTools(todos, addTodo, completeTodo, deleteTodo, updatePriority);

  // Context getter for AI (always returns fresh data)
  const getContext = () => ({
    todos: todos.map(t => ({ id: t.id, text: t.text, completed: t.completed })),
    stats: { total: todos.length, active: todos.filter(t => !t.completed).length },
  });

  return (
    <TodoContext.Provider value={{ todos, addTodo, completeTodo, tools, context: getContext }}>
      {children}
    </TodoContext.Provider>
  );
}
```

## Tool Implementation

### Tool Definition Pattern

Tools are defined with handlers that close over React state:

```tsx
// tools/todoTools.ts
export function todoTools(
  todos: Todo[],
  addTodoHandler: (text: string, priority: string) => void,
  completeTodoHandler: (id: string) => void,
  // ...
): Tool[] {
  return [
    {
      name: 'addTodo',
      description: 'Add a new task to the todo list',
      parameters: {
        type: 'object',
        properties: {
          task: { type: 'string', description: 'The task to add' },
          priority: { type: 'string', enum: ['low', 'medium', 'high'] },
        },
        required: ['task'],
      },
      handler: async ({ task, priority }) => {
        addTodoHandler(task, priority || 'medium');
        return { success: true, message: `Added task: ${task}` };
      },
    },
    // ... more tools
  ];
}
```

**Key principles:**
- Handlers receive state updaters, not raw state
- Return structured results for AI to report back
- Include detailed descriptions for AI understanding

## Conversation Storage

### useConversationStorage Hook

For multi-conversation support with localStorage persistence:

```tsx
// hooks/useConversationStorage.ts
export function useConversationStorage(namespace: string = 'default') {
  const [allConversations, setAllConversations] = useState<StoredConversation[]>([]);
  const [activeIds, setActiveIds] = useState<Record<string, string>>({});

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      setAllConversations(data.conversations || []);
      setActiveIds(data.activeIds || {});
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      conversations: allConversations,
      activeIds,
    }));
  }, [allConversations, activeIds]);

  return {
    conversations: allConversations,
    activeConversation: allConversations.find(c => c.id === activeIds[namespace]),
    messages: activeConversation?.messages || [],
    createConversation,
    switchConversation,
    setMessages,  // For InAppAI's onMessagesChange
    // ...
  };
}
```

**Usage in ChatMultiConversation:**

```tsx
function ChatMultiConversation() {
  const {
    conversations,
    activeConversation,
    messages,
    createConversation,
    switchConversation,
    setMessages,
  } = useConversationStorage('multi-chat');

  return (
    <InAppAI
      conversationId={activeConversation?.id}
      messages={messages}
      onMessagesChange={setMessages}
      displayMode="embedded"
    />
  );
}
```

## Display Mode Handling

### Panel Mode Layout

Panel modes require special layout handling to position the AI panel alongside content:

```tsx
// Router.tsx
const isPanel = preferences.displayMode.startsWith('panel');

if (isPanel) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: preferences.displayMode === 'panel-right' ? 'row-reverse' : 'row',
      height: '100vh',
    }}>
      <InAppAI
        displayMode={preferences.displayMode}
        panelMinWidth="20%"
        panelMaxWidth="33.33%"
        panelDefaultWidth="25%"
      />
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <Routes>{/* ... */}</Routes>
      </div>
    </div>
  );
}
```

### Excluding Routes

Some routes have their own chat UI and shouldn't show the shared assistant:

```tsx
const ROUTES_WITHOUT_AI = ['/chat-multi-conversation'];
const showSharedAI = !ROUTES_WITHOUT_AI.includes(location.pathname);
```

## Environment Configuration

```env
# .env
VITE_AGENT_ID=your-agent-id-here
VITE_API_BASE_URL=https://api.inappai.com/api
```

Access in code:

```tsx
<InAppAI
  endpoint={import.meta.env.VITE_API_BASE_URL}
  agentId={import.meta.env.VITE_AGENT_ID}
/>
```

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Router.tsx                               │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    PreferenceProvider                       │ │
│  │  ┌───────────────────────────────────────────────────────┐  │ │
│  │  │                    TodoProvider                       │  │ │
│  │  │                                                       │  │ │
│  │  │  ┌─────────────┐      ┌────────────────────────────┐  │  │ │
│  │  │  │   Routes    │      │        InAppAI             │  │  │ │
│  │  │  │             │      │                            │  │  │ │
│  │  │  │  /          │◄─────│  messages (from useState)  │  │  │ │
│  │  │  │  /todo-demo │◄─────│  tools (from TodoContext)  │  │  │ │
│  │  │  │  /docs      │◄─────│  context (route-based)     │  │  │ │
│  │  │  └─────────────┘      │  theme (from Preferences)  │  │  │ │
│  │  │                       └────────────────────────────┘  │  │ │
│  │  └───────────────────────────────────────────────────────┘  │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Best Practices Demonstrated

1. **Controlled Components** - Messages managed by parent, passed as props
2. **Context for Global State** - Preferences and todos in React context
3. **Route-Based Features** - Tools/context change based on current page
4. **Persistence Patterns** - localStorage for preferences and conversations
5. **Display Mode Flexibility** - Layout adapts to selected display mode
6. **Type Safety** - Full TypeScript throughout

## Applying These Patterns

### For Simple Apps

Use session-only state like the main demo:

```tsx
const [messages, setMessages] = useState<Message[]>([]);
<InAppAI messages={messages} onMessagesChange={setMessages} />
```

### For Multi-Page Apps

Use the shared assistant pattern with route-based tools.

### For ChatGPT-Like Apps

Use `useConversationStorage` for multi-conversation support.

### For Production

Replace localStorage with your backend:

```tsx
// Instead of localStorage
const [messages, setMessages] = useState<Message[]>([]);

// Load from backend
useEffect(() => {
  api.getConversation(userId, conversationId).then(setMessages);
}, [conversationId]);

// Save to backend
const handleMessagesChange = async (newMessages) => {
  setMessages(newMessages);
  await api.saveConversation(userId, conversationId, newMessages);
};
```

## Related Documentation

- [Demo Overview](./README.md) - What the demo includes
- [Setup Guide](./setup.md) - Running the demo locally
- [Tools Guide](https://www.inappai.com/docs/react/tools/) - Complete tools documentation
- [Context Passing](https://www.inappai.com/docs/react/context/) - Context patterns
