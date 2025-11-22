# InAppAI React

> Beautiful, customizable AI chat component for React applications

[![npm version](https://img.shields.io/npm/v/@inappai/react.svg)](https://www.npmjs.com/package/@inappai/react)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**InAppAI React** is an open-source React component that lets you embed a beautiful AI chat assistant into your web application in minutes. Built for modern React applications with full TypeScript support.

## Features

✨ **Beautiful UI** - Polished, professional chat interface out of the box
🎯 **Multiple Display Modes** - Popup, Sidebar, or integrated Panel layouts
🎨 **Fully Customizable** - Theme system + custom styles for complete brand control
📱 **Responsive** - Works perfectly on desktop, tablet, and mobile
🌓 **Multiple Themes** - Light, Dark, Professional, Playful, Minimal, Ocean, Sunset
⚡ **Zero Config** - Works immediately with sensible defaults
🔧 **TypeScript** - Full type safety and autocomplete
📦 **Tiny Bundle** - Minimal dependencies, optimized for performance
🔒 **Secure** - Designed to work with your secure backend
🔄 **Resizable Panels** - Drag-to-resize with constraints (panel mode)
📍 **Collapsible Sidebars** - Fold/unfold to save screen space

## Quick Start

### Installation

```bash
npm install @inappai/react
# or
yarn add @inappai/react
# or
pnpm add @inappai/react
```

### Basic Usage

```tsx
import { InAppAI } from '@inappai/react';
import '@inappai/react/styles.css';

function App() {
  return (
    <div>
      <h1>My App</h1>
      <InAppAI
        endpoint="https://api.inappai.com/api/{subscriptionId}"
        position="bottom-right"
        theme="light"
      />
    </div>
  );
}
```

That's it! You now have a fully functional AI chat assistant in your app.

## Backend Setup

The InAppAI component requires a backend server to securely handle AI API calls. This keeps your API keys safe and gives you full control over usage, costs, and rate limiting.

**Get Started:**

- Sign up at [inappai.com](https://inappai.com) to get your subscription ID
- Use the hosted SaaS backend endpoint
- Start building immediately with no infrastructure setup required

## Customization

### Themes

InAppAI comes with built-in light and dark themes:

```tsx
<InAppAI
  endpoint="https://api.inappai.com/api/{subscriptionId}"
  theme="dark"  // or "light"
/>
```

### Custom Styles

Fully customize the appearance to match your brand:

```tsx
<InAppAI
  endpoint="https://api.inappai.com/api/{subscriptionId}"
  customStyles={{
    // Branding
    primaryColor: '#6366f1',

    // Button
    buttonBackgroundColor: '#6366f1',
    buttonTextColor: '#ffffff',
    buttonSize: '60px',
    buttonIcon: '💬',

    // Window
    windowWidth: '400px',
    windowHeight: '600px',

    // Header
    headerBackground: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    headerTitle: 'Support Chat',

    // Typography
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto',
    fontSize: '14px',
  }}
/>
```

### Positioning

Place the chat widget anywhere on your page:

```tsx
<InAppAI
  endpoint="https://api.inappai.com/api/{subscriptionId}"
  position="bottom-right"  // bottom-left, top-right, top-left
/>
```

### Display Modes

InAppAI supports multiple display modes to fit different use cases:

#### Popup Mode (Default)

A floating chat window that can be positioned in any corner:

```tsx
<InAppAI
  endpoint="https://api.inappai.com/api/{subscriptionId}"
  displayMode="popup"  // default
  position="bottom-right"
/>
```

#### Sidebar Mode

Full-height sidebar on left or right side of the screen. Perfect for persistent chat interfaces:

```tsx
<InAppAI
  endpoint="https://api.inappai.com/api/{subscriptionId}"
  displayMode="sidebar-right"  // or 'sidebar-left'
  defaultFolded={false}  // Start expanded or folded
/>
```

**Sidebar Features:**
- Full viewport height
- Collapsible/foldable interface
- Overlay mode (doesn't push content)
- Perfect for documentation sites or dashboards

#### Panel Mode

Integrated resizable panels that push page content. Ideal for split-screen layouts:

```tsx
<InAppAI
  endpoint="https://api.inappai.com/api/{subscriptionId}"
  displayMode="panel-right"  // or 'panel-left'
  panelMinWidth="20%"
  panelMaxWidth="50%"
  panelDefaultWidth="30%"
  onPanelResize={(width) => console.log('Panel width:', width)}
/>
```

**Panel Features:**
- Resizable with drag handle
- Pushes page content (not overlay)
- Min/max width constraints
- Resize callbacks for layout adjustments
- Perfect for IDE-like interfaces

### Context Passing

Send application context to make responses more relevant:

```tsx
<InAppAI
  endpoint="https://api.inappai.com/api/{subscriptionId}"
  context={{
    page: window.location.pathname,
    user: {
      plan: 'premium',
      feature: 'analytics'
    }
  }}
/>
```

**Context Best Practices:**

- **Use Functions for Dynamic Context:** When context changes frequently (e.g., todo lists, form data), pass a function that returns fresh context on each message:

```tsx
const getContext = () => ({
  todos: currentTodos,
  stats: {
    total: currentTodos.length,
    completed: currentTodos.filter(t => t.completed).length
  }
});

<InAppAI
  endpoint="https://api.inappai.com/api/{subscriptionId}"
  context={getContext}
/>
```

- **Use Static Objects for Unchanging Context:** For user info, app settings, or page metadata that doesn't change during a session, static objects are more efficient.

### Tools & Function Calling

**Tools** enable the AI to execute functions in your application, allowing it to perform actions like creating todos, updating data, or triggering workflows. This transforms the AI from a passive chatbot into an active assistant that can manipulate your app.

#### How Tools Work

1. **Define Tool Schema:** Specify the function name, description, and parameters
2. **Provide Handler:** Implement the actual function logic
3. **AI Calls Tool:** When appropriate, the AI will call your tool with parameters
4. **Return Result:** Your handler executes and returns a result to the AI

#### Tool Interface

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

#### Complete Example: Todo App with AI Tools

Here's a real-world example from our demo that lets the AI manage a todo list:

```typescript
import { Tool } from '@inappai/react';

// Your app state
const [todos, setTodos] = useState([
  { id: '1', text: 'Buy groceries', completed: false, priority: 'high' },
  { id: '2', text: 'Call dentist', completed: false, priority: 'medium' },
]);

// Define tools
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
        t => t.id === params.identifier || t.text.toLowerCase().includes(params.identifier.toLowerCase())
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
    description: 'Update the priority of an existing task. Use this when the user indicates a task is important/urgent (high priority), or can wait (low priority).',
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
          description: 'The new priority level',
        },
      },
      required: ['taskId', 'priority'],
    },
    handler: async (params: { taskId: string; priority: 'low' | 'medium' | 'high' }) => {
      setTodos(todos.map(t => t.id === params.taskId ? { ...t, priority: params.priority } : t));
      return { success: true, message: `Updated priority to ${params.priority}` };
    },
  },
];

// Use tools with context
<InAppAI
  endpoint="https://api.inappai.com/api/{subscriptionId}"
  tools={todoTools}
  context={() => ({
    todos: todos.map(t => ({ id: t.id, text: t.text, completed: t.completed, priority: t.priority })),
    stats: {
      total: todos.length,
      active: todos.filter(t => !t.completed).length,
      completed: todos.filter(t => t.completed).length,
    }
  })}
/>
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

#### Tool Description Best Practices

- **Be Clear About When to Use:** Explain the trigger conditions (e.g., "when the user wants to add a task")
- **Include Examples:** Show concrete use cases in the description
- **Balance Specificity and Flexibility:** Provide enough detail for accuracy but allow for natural language variations
- **Reference Context:** Mention checking `context.todos` or similar to help AI understand available data
- **Handle Ambiguity:** For tools like `completeTodo`, accept both IDs and keywords to handle various user inputs

#### Advanced: Organizing Tools

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
  // ... more tools
];

// Component
import { createTodoTools } from './tools/todoTools';

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const tools = createTodoTools(todos, addTodo, completeTodo);

  return <InAppAI tools={tools} />;
}
```

### Conversation Persistence

Use `conversationId` to save and restore conversations automatically using localStorage:

```tsx
<InAppAI
  endpoint="https://api.inappai.com/api/{subscriptionId}"
  conversationId="support-chat"
/>
```

**How it works:**
- Messages are automatically saved to localStorage with the key `inappai_conversation_{conversationId}`
- When the component mounts, previous messages are restored
- Perfect for maintaining conversation history across page refreshes or navigation

**Use Cases:**

- **Single Persistent Assistant:** Use the same ID across your entire app to maintain one continuous conversation
  ```tsx
  // All pages use the same conversation
  <InAppAI conversationId="app-assistant" />
  ```

- **Page-Specific Conversations:** Use different IDs per page/feature for isolated conversations
  ```tsx
  // Support page
  <InAppAI conversationId="support-chat" />

  // Settings page
  <InAppAI conversationId="settings-help" />
  ```

- **User-Specific Conversations:** Include user ID for per-user persistence
  ```tsx
  <InAppAI conversationId={`user-${userId}-assistant`} />
  ```

**Managing Storage:**

```typescript
// Clear a specific conversation
localStorage.removeItem('inappai_conversation_support-chat');

// Clear all InAppAI conversations
Object.keys(localStorage)
  .filter(key => key.startsWith('inappai_conversation_'))
  .forEach(key => localStorage.removeItem(key));
```

### Message Hooks

React to message events in your application:

```tsx
<InAppAI
  endpoint="https://api.inappai.com/api/{subscriptionId}"
  onMessageSent={(message) => {
    console.log('User sent:', message);
    // Track analytics, show notifications, etc.
  }}
  onMessageReceived={(message) => {
    console.log('AI responded:', message);
    // Update UI, log metrics, etc.
  }}
  onError={(error) => {
    console.error('Chat error:', error);
    // Show error notification to user
  }}
/>
```

**Real-World Example: Analytics & Error Tracking**

```tsx
import { InAppAI } from '@inappai/react';
import { trackEvent, captureError } from './analytics';

function App() {
  return (
    <InAppAI
      endpoint="https://api.inappai.com/api/{subscriptionId}"
      conversationId="app-assistant"
      onMessageSent={(message) => {
        trackEvent('ai_message_sent', {
          messageLength: message.length,
          timestamp: new Date().toISOString(),
        });
      }}
      onMessageReceived={(message) => {
        trackEvent('ai_message_received', {
          messageLength: message.length,
          timestamp: new Date().toISOString(),
        });
      }}
      onError={(error) => {
        captureError('InAppAI Error', {
          error: error.message,
          stack: error.stack,
        });
        // Show user-friendly error notification
        toast.error('Unable to send message. Please try again.');
      }}
    />
  );
}
```

## API Reference

### InAppAIProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `endpoint` | `string` | **required** | Your backend API endpoint |
| `position` | `'bottom-right' \| 'bottom-left' \| 'top-right' \| 'top-left'` | `'bottom-right'` | Position of the chat widget (popup mode only) |
| `displayMode` | `'popup' \| 'sidebar-left' \| 'sidebar-right' \| 'panel-left' \| 'panel-right'` | `'popup'` | Display mode for the chat interface |
| `defaultFolded` | `boolean` | `false` | Start sidebar/panel in folded state |
| `theme` | `'light' \| 'dark' \| 'professional' \| 'playful' \| 'minimal' \| 'ocean' \| 'sunset'` | `'light'` | Color theme |
| `context` | `Record<string, any> \| () => Record<string, any>` | `undefined` | Application context to send with messages (can be function for fresh context) |
| `conversationId` | `string` | `undefined` | Unique ID for conversation persistence in localStorage. Messages are saved and restored when using the same ID |
| `customStyles` | `CustomStyles` | `{}` | Custom styling options |
| `tools` | `Tool[]` | `[]` | Custom tools/functions the AI can call |
| `onMessageSent` | `(message: string) => void` | `undefined` | Callback fired when user sends a message |
| `onMessageReceived` | `(message: string) => void` | `undefined` | Callback fired when AI responds |
| `onError` | `(error: Error) => void` | `undefined` | Callback fired when an error occurs |
| `panelMinWidth` | `string` | `'20%'` | Minimum panel width (panel mode only) |
| `panelMaxWidth` | `string` | `'33.33%'` | Maximum panel width (panel mode only) |
| `panelDefaultWidth` | `string` | `'25%'` | Default panel width (panel mode only) |
| `onPanelResize` | `(width: number) => void` | `undefined` | Callback when panel is resized |

### CustomStyles

See [CustomStyles Documentation](./docs/CUSTOM_STYLES.md) for the full list of customization options.

## Examples

### E-Commerce Support (Popup)

```tsx
<InAppAI
  endpoint="https://api.inappai.com/api/{subscriptionId}"
  displayMode="popup"
  position="bottom-right"
  customStyles={{
    headerTitle: 'Shopping Assistant',
    buttonIcon: '🛍️',
    primaryColor: '#10b981',
  }}
  context={{
    cart: cart.items,
    page: 'product-details',
    productId: currentProduct.id,
  }}
/>
```

### Documentation Site (Sidebar)

```tsx
<InAppAI
  endpoint="https://api.inappai.com/api/{subscriptionId}"
  displayMode="sidebar-right"
  defaultFolded={true}
  customStyles={{
    headerTitle: 'Documentation Assistant',
    buttonIcon: '📚',
    sidebarWidth: '400px',
  }}
  context={() => ({
    // Fresh context on each message
    currentPage: window.location.pathname,
    scrollPosition: window.scrollY,
    selectedText: window.getSelection()?.toString(),
  })}
/>
```

### Code Editor (Panel)

```tsx
<InAppAI
  endpoint="https://api.inappai.com/api/{subscriptionId}"
  displayMode="panel-right"
  panelMinWidth="25%"
  panelMaxWidth="50%"
  panelDefaultWidth="30%"
  theme="dark"
  customStyles={{
    headerTitle: 'AI Copilot',
    buttonIcon: '🤖',
  }}
  context={{
    openFiles: editor.getOpenFiles(),
    currentFile: editor.getCurrentFile(),
    language: editor.getLanguage(),
  }}
  onPanelResize={(width) => {
    editor.layout(); // Adjust editor layout
  }}
/>
```

### SaaS Dashboard (Sidebar)

```tsx
<InAppAI
  endpoint="https://api.inappai.com/api/{subscriptionId}"
  displayMode="sidebar-left"
  theme="professional"
  customStyles={{
    headerTitle: 'AI Assistant',
    headerSubtitle: 'Always here to help',
  }}
  context={{
    user: user.email,
    plan: user.subscriptionTier,
    feature: currentFeature,
  }}
/>
```

### Customer Support with Ticket Tools

```tsx
import { InAppAI, Tool } from '@inappai/react';

function SupportDashboard() {
  const [tickets, setTickets] = useState([]);

  const supportTools: Tool[] = [
    {
      name: 'createTicket',
      description: 'Create a new support ticket when the user reports an issue or requests help.',
      parameters: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            description: 'Brief summary of the issue',
          },
          description: {
            type: 'string',
            description: 'Detailed description of the problem',
          },
          priority: {
            type: 'string',
            enum: ['low', 'medium', 'high', 'urgent'],
            description: 'Ticket priority based on severity',
          },
        },
        required: ['title', 'description'],
      },
      handler: async (params) => {
        const ticket = await api.createTicket(params);
        setTickets([...tickets, ticket]);
        return { success: true, ticketId: ticket.id };
      },
    },
    {
      name: 'searchKnowledgeBase',
      description: 'Search the knowledge base for articles related to the user\'s question.',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Search keywords or phrases',
          },
        },
        required: ['query'],
      },
      handler: async (params) => {
        const articles = await api.searchKB(params.query);
        return { articles };
      },
    },
  ];

  return (
    <InAppAI
      endpoint="https://api.inappai.com/api/{subscriptionId}"
      displayMode="popup"
      conversationId={`support-${userId}`}
      tools={supportTools}
      context={() => ({
        openTickets: tickets.filter(t => t.status !== 'closed'),
        userPlan: user.plan,
      })}
      onMessageSent={(msg) => trackEvent('support_message_sent', { message: msg })}
    />
  );
}
```

### Project Management with Task Tools

```tsx
import { InAppAI, Tool } from '@inappai/react';

function ProjectBoard() {
  const [tasks, setTasks] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  const projectTools: Tool[] = [
    {
      name: 'createTask',
      description: 'Create a new task in the current project when the user describes work to be done.',
      parameters: {
        type: 'object',
        properties: {
          title: { type: 'string', description: 'Task title' },
          assignee: { type: 'string', description: 'Team member to assign (optional)' },
          dueDate: { type: 'string', description: 'Due date in YYYY-MM-DD format (optional)' },
          labels: { type: 'array', items: { type: 'string' }, description: 'Task labels/tags' },
        },
        required: ['title'],
      },
      handler: async (params) => {
        const task = await createTask(selectedProject.id, params);
        setTasks([...tasks, task]);
        return { success: true, task };
      },
    },
    {
      name: 'updateTaskStatus',
      description: 'Update task status when user indicates a task is in progress, blocked, or completed.',
      parameters: {
        type: 'object',
        properties: {
          taskId: { type: 'string', description: 'Task identifier' },
          status: {
            type: 'string',
            enum: ['todo', 'in-progress', 'blocked', 'review', 'done'],
            description: 'New task status',
          },
        },
        required: ['taskId', 'status'],
      },
      handler: async (params) => {
        await updateTaskStatus(params.taskId, params.status);
        setTasks(tasks.map(t => t.id === params.taskId ? { ...t, status: params.status } : t));
        return { success: true };
      },
    },
    {
      name: 'getTaskDetails',
      description: 'Retrieve full details about a specific task.',
      parameters: {
        type: 'object',
        properties: {
          taskId: { type: 'string', description: 'Task identifier' },
        },
        required: ['taskId'],
      },
      handler: async (params) => {
        const task = await fetchTaskDetails(params.taskId);
        return { task };
      },
    },
  ];

  return (
    <InAppAI
      endpoint="https://api.inappai.com/api/{subscriptionId}"
      displayMode="panel-right"
      conversationId={`project-${selectedProject?.id}`}
      tools={projectTools}
      context={() => ({
        project: selectedProject,
        tasks: tasks.map(t => ({
          id: t.id,
          title: t.title,
          status: t.status,
          assignee: t.assignee,
        })),
        teamMembers: selectedProject?.members || [],
      })}
      customStyles={{
        headerTitle: `${selectedProject?.name} Assistant`,
        buttonIcon: '📋',
      }}
    />
  );
}
```

## Demo

🚀 **[Try the Live Demo](https://inappai.github.io/react/)** - Interactive 3-step tutorial!

The demo showcases:

1. **Home Page** - Choose display modes (popup, sidebar, panel) and themes with live preview
2. **Todo App Demo** - AI assistant with Tools & Context that can manage your todo list through natural language
3. **Documentation** - Complete API reference and usage examples
4. **Fullscreen Chat** - Multi-conversation ChatGPT-like interface with localStorage persistence

### Run Locally

Try the demo locally in the `examples/demo` directory:

#### Quick Start

```bash
# Clone the repo
git clone https://github.com/InAppAI/react.git
cd react

# Install dependencies
npm install

# Configure your subscription ID
cd examples/demo
cp .env.example .env
# Edit .env and add your VITE_SUBSCRIPTION_ID and VITE_API_BASE_URL

# Build the package and start the demo
cd ../..
npm run build:package
npm run dev:demo
```

Visit `http://localhost:5173` to see it in action.

**📖 For detailed setup instructions, see [examples/demo/SETUP.md](./examples/demo/SETUP.md)**

**Demo Routes:**
- `/` - Home page with mode/theme selector
- `/todo-demo` - Todo app with AI tools demonstration
- `/docs` - Documentation page
- `/chat-multi-conversation` - Fullscreen multi-conversation chat

## Development

### Setup

```bash
# Install dependencies
npm install

# Build the package
npm run build:package

# Run the demo
npm run dev:demo
```

### Project Structure

```
inapp-ai-react/
├── packages/
│   └── inapp-ai-react/          # Main React component package
│       ├── src/
│       │   ├── components/
│       │   │   ├── InAppAI.tsx  # Core chat component
│       │   │   └── InAppAI.css  # Component styles
│       │   ├── types.ts         # TypeScript interfaces
│       │   └── index.ts         # Package exports
│       └── package.json
├── examples/
│   └── demo/                    # Interactive demo application
│       ├── src/
│       │   ├── components/      # Demo UI components
│       │   │   └── InAppAI-Enhanced.tsx  # Enhanced wrapper with conversationId
│       │   ├── contexts/        # React contexts
│       │   │   ├── PreferenceContext.tsx  # Theme/mode persistence
│       │   │   └── TodoContext.tsx        # Global todo state
│       │   ├── pages/           # Demo pages
│       │   │   ├── Home.tsx               # 3-step tutorial
│       │   │   ├── TodoDemo.tsx           # Tools & Context demo
│       │   │   ├── Documentation.tsx      # API docs
│       │   │   └── ChatMultiConversation.tsx  # Fullscreen chat
│       │   ├── tools/           # AI tool definitions
│       │   │   └── todoTools.ts # Example tools for todo operations
│       │   └── Router.tsx       # App routing with route-based context
│       └── package.json
├── docs/                        # Documentation files
│   ├── CUSTOM_STYLES.md        # Styling guide
│   └── ...
└── README.md                    # This file
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

## Publishing

For maintainers: See [PUBLISHING.md](./PUBLISHING.md) for the complete guide on building and publishing to NPM.

## License

MIT © [InAppAI](https://github.com/InAppAI)

## Support

- 📧 Email: support@inappai.com
- 💬 Discord: [Join our community](https://discord.gg/inappai)
- 🐛 Issues: [GitHub Issues](https://github.com/InAppAI/react/issues)

## Troubleshooting

### Conversation not persisting across page navigation

**Problem:** Messages are lost when navigating between pages in a single-page app (React Router, Next.js, etc.)

**Solution:** Ensure the `InAppAI` component is **above** your routes in the component tree, not inside route components:

```tsx
// ❌ Wrong - Component remounts on route change
function App() {
  return (
    <Routes>
      <Route path="/page1" element={<><Page1 /><InAppAI /></>} />
      <Route path="/page2" element={<><Page2 /><InAppAI /></>} />
    </Routes>
  );
}

// ✅ Correct - Component persists across navigation
function App() {
  return (
    <>
      <Routes>
        <Route path="/page1" element={<Page1 />} />
        <Route path="/page2" element={<Page2 />} />
      </Routes>
      <InAppAI conversationId="app-assistant" />
    </>
  );
}
```

Also use `conversationId` to enable localStorage persistence across page refreshes.

### Panel mode displays below content instead of side-by-side

**Problem:** Panel appears below the page content instead of next to it.

**Solution:** Use a flex layout wrapper when in panel mode:

```tsx
const isPanel = displayMode.startsWith('panel');

if (isPanel) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: displayMode === 'panel-right' ? 'row-reverse' : 'row',
      height: '100vh',
    }}>
      <InAppAI displayMode={displayMode} />
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {/* Your main content */}
      </div>
    </div>
  );
}
```

See [examples/demo/src/Router.tsx](./examples/demo/src/Router.tsx) for a complete example.

### Tools not executing / AI not using tools

**Problem:** AI doesn't call your tools even when it should.

**Solutions:**

1. **Provide Context:** Ensure the AI has relevant context to know when to use tools:
   ```tsx
   <InAppAI
     tools={todoTools}
     context={() => ({ todos: currentTodos })}  // AI can see available todos
   />
   ```

2. **Write Clear Descriptions:** Tool descriptions should explain when and how to use the tool:
   ```typescript
   {
     name: 'addTodo',
     description: 'Create a new todo item when the user wants to add a task to their list.',
     // ... rest of tool definition
   }
   ```

3. **Balance Specificity:** Avoid overly rigid descriptions that limit the AI's flexibility. Use natural language triggers.

### Backend endpoint errors (401, 404, 500)

**Problem:** Chat fails with authentication or server errors.

**Solutions:**

1. **Check Subscription ID:** Ensure your endpoint includes the subscription ID:
   ```tsx
   endpoint={`https://api.inappai.com/api/${subscriptionId}`}
   ```

2. **Verify Subscription:** Confirm your subscription is active in your InAppAI dashboard.

3. **Check CORS:** If self-hosting, ensure your backend allows requests from your frontend domain.

4. **Use Error Hook:** Implement error handling to debug issues:
   ```tsx
   <InAppAI
     onError={(error) => {
       console.error('InAppAI Error:', error);
       // Check error.message for details
     }}
   />
   ```

### Context not updating / AI sees stale data

**Problem:** AI assistant uses outdated context even after app state changes.

**Solution:** Use a **function** for dynamic context instead of a static object:

```tsx
// ❌ Wrong - Context is captured once at render time
<InAppAI context={{ todos: todos }} />

// ✅ Correct - Function is called fresh on each message
<InAppAI context={() => ({ todos: todos })} />
```

## Roadmap

- [x] Core chat component
- [x] Multiple display modes (popup, sidebar, panel)
- [x] Theme system (7 built-in themes)
- [x] Custom styling API
- [x] Tools & Function Calling
- [x] Context passing (static & dynamic)
- [x] Conversation persistence (localStorage)
- [x] Message hooks (onMessageSent, onMessageReceived, onError)
- [x] Panel resizing with callbacks
- [ ] Streaming responses
- [ ] File uploads
- [ ] Voice input
- [ ] Code syntax highlighting in messages
- [ ] Multi-language support
- [ ] Plugin system

## Related Projects

- **[InAppAI Backend](https://github.com/InAppAI/app)** - Multi-tenant SaaS backend for self-hosting

---

**Built with ❤️ by the InAppAI team**
