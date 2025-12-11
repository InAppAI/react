import { Link } from 'react-router-dom';
import './Documentation.css';

function Documentation() {
  return (
    <div className="docs-layout">
      {/* Navigation */}
      <nav className="docs-nav">
        <div className="docs-nav-container">
          <div className="docs-logo">📚 InAppAI Docs</div>
          <div className="docs-nav-links">
            <a href="#overview" className="docs-nav-link">Overview</a>
            <a href="#getting-started" className="docs-nav-link">Getting Started</a>
            <a href="#tools" className="docs-nav-link">Tools</a>
            <a href="#api" className="docs-nav-link">API</a>
            <Link to="/" className="docs-nav-link">← Home</Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="docs-container">
        {/* Table of Contents */}
        <aside className="docs-toc">
          <div className="toc-title">On This Page</div>
          <ul className="toc-list">
            <li className="toc-item">
              <a href="#overview" className="toc-link">Overview</a>
            </li>
            <li className="toc-item">
              <a href="#getting-started" className="toc-link">Getting Started</a>
            </li>
            <li className="toc-item">
              <a href="#display-modes" className="toc-link">Display Modes</a>
            </li>
            <li className="toc-item">
              <a href="#themes" className="toc-link">Themes</a>
            </li>
            <li className="toc-item">
              <a href="#context" className="toc-link">Context Passing</a>
            </li>
            <li className="toc-item">
              <a href="#tools" className="toc-link">Tools & Function Calling</a>
            </li>
            <li className="toc-item">
              <a href="#persistence" className="toc-link">Conversation Persistence</a>
            </li>
            <li className="toc-item">
              <a href="#hooks" className="toc-link">Message Hooks</a>
            </li>
            <li className="toc-item">
              <a href="#api-reference" className="toc-link">API Reference</a>
            </li>
          </ul>
        </aside>

        {/* Documentation Content */}
        <main className="docs-content">
          {/* Header */}
          <header className="docs-header">
            <h1>InAppAI React Component</h1>
            <p>
              Complete documentation for integrating AI-powered chat capabilities into your React
              applications with multiple display modes, tools, and customization options.
            </p>
          </header>

          {/* Overview */}
          <section id="overview" className="docs-section">
            <h2>Overview</h2>
            <p>
              InAppAI is a powerful React component that adds AI chat functionality to your application.
              It supports multiple display modes (popup, sidebar, panel), themes, custom tools for AI-app
              interaction, and conversation persistence.
            </p>

            <div className="feature-grid">
              <div className="feature-card">
                <div className="feature-icon">🎨</div>
                <h3>Multiple Display Modes</h3>
                <p>Popup, sidebar (left/right), or panel (left/right) to fit your app layout.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🛠️</div>
                <h3>Tools & Function Calling</h3>
                <p>Let AI execute functions in your app through natural language.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">💾</div>
                <h3>Controlled State</h3>
                <p>Full control over message state - persist to your backend, localStorage, or any storage.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🎭</div>
                <h3>7 Built-in Themes</h3>
                <p>Light, dark, professional, playful, minimal, ocean, and sunset themes.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📋</div>
                <h3>Context Passing</h3>
                <p>Provide real-time app context to make AI responses more relevant.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📦</div>
                <h3>TypeScript Support</h3>
                <p>Full TypeScript support with comprehensive type definitions.</p>
              </div>
            </div>
          </section>

          {/* Getting Started */}
          <section id="getting-started" className="docs-section">
            <h2>Getting Started</h2>

            <h3>Installation</h3>
            <p>Install the InAppAI React package using npm:</p>
            <div className="docs-code-block">
              <div className="code-language">bash</div>
npm install @inappai/react
            </div>

            <h3>Basic Usage</h3>
            <p>Import and use the InAppAI component in your React app. InAppAI uses controlled mode - you manage the message state:</p>
            <div className="docs-code-block">
              <div className="code-language">tsx</div>
{`import { useState } from 'react';
import { InAppAI, Message } from '@inappai/react';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);

  return (
    <div>
      <YourContent />
      <InAppAI
        endpoint="https://api.inappai.com"
        agentId="your-agent-id"
        displayMode="popup"
        theme="light"
        messages={messages}
        onMessagesChange={setMessages}
      />
    </div>
  );
}`}
            </div>

            <div className="info-box">
              <h4>💡 Agent ID Required</h4>
              <p>
                You need an Agent ID from InAppAI to use the component. Get yours at the
                InAppAI dashboard. Pass it as the <code>agentId</code> prop.
              </p>
            </div>
          </section>

          {/* Display Modes */}
          <section id="display-modes" className="docs-section">
            <h2>Display Modes</h2>
            <p>InAppAI supports 6 different display modes to fit your application layout:</p>

            <h3>Popup Mode</h3>
            <p>A floating chat button that opens a popup window. Perfect for websites and general applications.</p>
            <div className="docs-code-block">
              <div className="code-language">tsx</div>
{`<InAppAI
  endpoint="https://api.inappai.com/api"
  agentId="your-agent-id"
  displayMode="popup"
  position="bottom-right"
  messages={messages}
  onMessagesChange={setMessages}
/>`}
            </div>

            <h3>Sidebar Mode</h3>
            <p>A fixed sidebar that slides out from the left or right side. Great for documentation sites.</p>
            <div className="docs-code-block">
              <div className="code-language">tsx</div>
{`<InAppAI
  endpoint="https://api.inappai.com/api"
  agentId="your-agent-id"
  displayMode="sidebar-right"
  defaultFolded={true}
  messages={messages}
  onMessagesChange={setMessages}
/>`}
            </div>

            <h3>Panel Mode</h3>
            <p>A resizable panel that appears side-by-side with your content. Perfect for IDE-like interfaces.</p>
            <div className="docs-code-block">
              <div className="code-language">tsx</div>
{`<InAppAI
  endpoint="https://api.inappai.com/api"
  agentId="your-agent-id"
  displayMode="panel-right"
  panelMinWidth="20%"
  panelMaxWidth="50%"
  panelDefaultWidth="30%"
  messages={messages}
  onMessagesChange={setMessages}
/>`}
            </div>

            <div className="warning-box">
              <h4>⚠️ Panel Mode Layout</h4>
              <p>
                Panel mode requires a flex layout wrapper to display side-by-side. See the
                Router.tsx example in this demo for the correct implementation.
              </p>
            </div>

            <h3>Embedded Mode</h3>
            <p>Renders only the chat interface without any wrapper. Perfect for custom layouts and multi-conversation apps.</p>
            <div className="docs-code-block">
              <div className="code-language">tsx</div>
{`<div className="chat-container" style={{ height: '500px' }}>
  <InAppAI
    endpoint="https://api.inappai.com/api"
    agentId="your-agent-id"
    displayMode="embedded"
    showHeader={false}
    messages={messages}
    onMessagesChange={setMessages}
  />
</div>`}
            </div>

            <div className="info-box">
              <h4>💡 Embedded Mode</h4>
              <p>
                Embedded mode fills its parent container (100% width and height). Use the
                <code>showHeader</code> prop to hide the header for cleaner custom UIs.
              </p>
            </div>
          </section>

          {/* Themes */}
          <section id="themes" className="docs-section">
            <h2>Themes</h2>
            <p>Choose from 7 built-in themes or create your own with custom styles:</p>

            <ul>
              <li><strong>light</strong> - Clean white theme</li>
              <li><strong>dark</strong> - Dark mode with high contrast</li>
              <li><strong>professional</strong> - Corporate blue theme</li>
              <li><strong>playful</strong> - Vibrant purple gradient</li>
              <li><strong>minimal</strong> - Minimalist gray theme</li>
              <li><strong>ocean</strong> - Calm teal/blue theme</li>
              <li><strong>sunset</strong> - Warm orange/pink gradient</li>
            </ul>

            <div className="docs-code-block">
              <div className="code-language">tsx</div>
{`<InAppAI
  endpoint="https://api.inappai.com/api/your-id"
  theme="ocean"
/>`}
            </div>
          </section>

          {/* Context Passing */}
          <section id="context" className="docs-section">
            <h2>Context Passing</h2>
            <p>
              Provide application context to the AI to make responses more relevant and accurate.
              Context can be a static object or a function that returns fresh data.
            </p>

            <h3>Static Context</h3>
            <p>Use for data that doesn't change during the session:</p>
            <div className="docs-code-block">
              <div className="code-language">tsx</div>
{`<InAppAI
  endpoint="https://api.inappai.com/api/your-id"
  context={{
    user: { name: 'John', plan: 'premium' },
    page: 'dashboard'
  }}
/>`}
            </div>

            <h3>Dynamic Context (Recommended)</h3>
            <p>Use a function for data that changes frequently (like todo lists, form data, etc.):</p>
            <div className="docs-code-block">
              <div className="code-language">tsx</div>
{`const [todos, setTodos] = useState([...]);

<InAppAI
  endpoint="https://api.inappai.com/api/your-id"
  context={() => ({
    todos: todos,
    stats: {
      total: todos.length,
      completed: todos.filter(t => t.completed).length
    }
  })}
/>`}
            </div>

            <div className="info-box">
              <h4>💡 Why Use a Function?</h4>
              <p>
                Functions are called fresh on each message, ensuring the AI always sees the latest
                app state. Static objects are captured at render time and may become stale.
              </p>
            </div>
          </section>

          {/* Tools & Function Calling */}
          <section id="tools" className="docs-section">
            <h2>Tools & Function Calling</h2>
            <p>
              Tools enable the AI to execute functions in your application. This transforms the AI
              from a passive chatbot into an active assistant that can manipulate your app.
            </p>

            <h3>Tool Structure</h3>
            <p>Each tool has a name, description, parameter schema, and handler function:</p>
            <div className="docs-code-block">
              <div className="code-language">tsx</div>
{`const tools = [
  {
    name: 'addTodo',
    description: 'Create a new todo when user wants to add a task',
    parameters: {
      type: 'object',
      properties: {
        text: {
          type: 'string',
          description: 'The task description'
        },
        priority: {
          type: 'string',
          enum: ['low', 'medium', 'high'],
          description: 'Task priority level'
        }
      },
      required: ['text']
    },
    handler: async (params) => {
      const newTodo = {
        id: Date.now().toString(),
        text: params.text,
        priority: params.priority || 'medium',
        completed: false
      };
      setTodos([...todos, newTodo]);
      return { success: true, todo: newTodo };
    }
  }
];

<InAppAI
  endpoint="https://api.inappai.com/api/your-id"
  tools={tools}
  context={() => ({ todos })}
/>`}
            </div>

            <h3>Example Conversation</h3>
            <div className="docs-code-block">
              <div className="code-language">text</div>
{`User: "Add a task to buy groceries"
AI: [Calls addTodo({ text: "Buy groceries", priority: "medium" })]
    "I've added 'Buy groceries' to your todo list."

User: "Make it high priority"
AI: [Calls updatePriority({ taskId: "123", priority: "high" })]
    "Updated the task to high priority."`}
            </div>

            <div className="warning-box">
              <h4>⚠️ Tool Description Best Practices</h4>
              <ul>
                <li>Be clear about when to use the tool</li>
                <li>Include examples in the description</li>
                <li>Balance specificity with flexibility</li>
                <li>Reference context data when relevant</li>
              </ul>
            </div>
          </section>

          {/* Conversation Persistence */}
          <section id="persistence" className="docs-section">
            <h2>Conversation Persistence</h2>
            <p>
              InAppAI uses <strong>controlled mode</strong> - you manage the message state and decide how to persist it.
              This gives you full control over storage: backend database, localStorage, or any custom solution.
            </p>

            <h3>Recommended: Backend Storage</h3>
            <p>For production apps, persist messages to your own backend associated with the authenticated user:</p>
            <div className="docs-code-block">
              <div className="code-language">tsx</div>
{`const [messages, setMessages] = useState<Message[]>([]);

// Load from your backend on mount
useEffect(() => {
  api.getConversation(userId).then(setMessages);
}, [userId]);

// Save to your backend when messages change
const handleMessagesChange = async (newMessages: Message[]) => {
  setMessages(newMessages);
  await api.saveConversation(userId, newMessages);
};

<InAppAI
  endpoint="https://api.inappai.com/api"
  agentId="your-agent-id"
  conversationId={\`user-\${userId}\`}
  messages={messages}
  onMessagesChange={handleMessagesChange}
/>`}
            </div>

            <h3>Demo: localStorage (Development Only)</h3>
            <p>For prototyping without a backend, you can use localStorage. <strong>Not recommended for production.</strong></p>
            <div className="docs-code-block">
              <div className="code-language">tsx</div>
{`const [messages, setMessages] = useState<Message[]>(() => {
  const saved = localStorage.getItem('my-chat');
  return saved ? JSON.parse(saved) : [];
});

useEffect(() => {
  localStorage.setItem('my-chat', JSON.stringify(messages));
}, [messages]);

<InAppAI
  messages={messages}
  onMessagesChange={setMessages}
  // ... other props
/>`}
            </div>

            <h3>Session-Only (Simplest)</h3>
            <p>For the simplest integration, just use React state. Messages reset on page refresh:</p>
            <div className="docs-code-block">
              <div className="code-language">tsx</div>
{`const [messages, setMessages] = useState<Message[]>([]);

<InAppAI
  messages={messages}
  onMessagesChange={setMessages}
  // ... other props
/>`}
            </div>

            <div className="info-box">
              <h4>💡 Why Controlled Mode?</h4>
              <p>
                Controlled mode gives you full ownership of message data. You decide where to store it,
                how to encrypt it, and how to associate it with users. The component just renders the
                messages you provide and reports changes via <code>onMessagesChange</code>.
              </p>
            </div>
          </section>

          {/* Message Hooks */}
          <section id="hooks" className="docs-section">
            <h2>Message Hooks</h2>
            <p>React to message events for analytics, error tracking, or custom UI updates:</p>

            <div className="docs-code-block">
              <div className="code-language">tsx</div>
{`<InAppAI
  endpoint="https://api.inappai.com/api/your-id"
  onMessageSent={(message) => {
    console.log('User sent:', message);
    trackEvent('ai_message_sent');
  }}
  onMessageReceived={(message) => {
    console.log('AI responded:', message);
    trackEvent('ai_message_received');
  }}
  onError={(error) => {
    console.error('Chat error:', error);
    showErrorNotification(error.message);
  }}
/>`}
            </div>

            <h3>Use Cases</h3>
            <ul>
              <li><strong>Analytics:</strong> Track user engagement with the AI assistant</li>
              <li><strong>Error Handling:</strong> Show user-friendly error messages</li>
              <li><strong>Logging:</strong> Record conversations for debugging or compliance</li>
              <li><strong>UI Updates:</strong> Trigger animations or state changes on messages</li>
            </ul>
          </section>

          {/* API Reference */}
          <section id="api-reference" className="docs-section">
            <h2>API Reference</h2>

            <h3>InAppAI Props</h3>
            <table className="params-table">
              <thead>
                <tr>
                  <th>Prop</th>
                  <th>Type</th>
                  <th>Required</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><span className="param-name">endpoint</span></td>
                  <td><span className="param-type">string</span></td>
                  <td><span className="param-required">Required</span></td>
                  <td>Your backend API endpoint</td>
                </tr>
                <tr>
                  <td><span className="param-name">agentId</span></td>
                  <td><span className="param-type">string</span></td>
                  <td><span className="param-required">Required</span></td>
                  <td>Your InAppAI Agent ID</td>
                </tr>
                <tr>
                  <td><span className="param-name">messages</span></td>
                  <td><span className="param-type">Message[]</span></td>
                  <td><span className="param-required">Required</span></td>
                  <td>Messages array - you manage the state</td>
                </tr>
                <tr>
                  <td><span className="param-name">onMessagesChange</span></td>
                  <td><span className="param-type">function</span></td>
                  <td><span className="param-required">Required</span></td>
                  <td>Callback when messages change</td>
                </tr>
                <tr>
                  <td><span className="param-name">displayMode</span></td>
                  <td><span className="param-type">string</span></td>
                  <td><span className="param-optional">Optional</span></td>
                  <td>'popup' | 'sidebar-left' | 'sidebar-right' | 'panel-left' | 'panel-right' | 'embedded'</td>
                </tr>
                <tr>
                  <td><span className="param-name">theme</span></td>
                  <td><span className="param-type">string</span></td>
                  <td><span className="param-optional">Optional</span></td>
                  <td>'light' | 'dark' | 'professional' | 'playful' | 'minimal' | 'ocean' | 'sunset'</td>
                </tr>
                <tr>
                  <td><span className="param-name">position</span></td>
                  <td><span className="param-type">string</span></td>
                  <td><span className="param-optional">Optional</span></td>
                  <td>Position of popup button (popup mode only)</td>
                </tr>
                <tr>
                  <td><span className="param-name">conversationId</span></td>
                  <td><span className="param-type">string</span></td>
                  <td><span className="param-optional">Optional</span></td>
                  <td>Conversation ID passed to backend for context</td>
                </tr>
                <tr>
                  <td><span className="param-name">context</span></td>
                  <td><span className="param-type">object | function</span></td>
                  <td><span className="param-optional">Optional</span></td>
                  <td>Application context to send with messages</td>
                </tr>
                <tr>
                  <td><span className="param-name">tools</span></td>
                  <td><span className="param-type">Tool[]</span></td>
                  <td><span className="param-optional">Optional</span></td>
                  <td>Array of custom tools the AI can call</td>
                </tr>
                <tr>
                  <td><span className="param-name">showHeader</span></td>
                  <td><span className="param-type">boolean</span></td>
                  <td><span className="param-optional">Optional</span></td>
                  <td>Show/hide the chat header (useful for embedded mode)</td>
                </tr>
                <tr>
                  <td><span className="param-name">onMessageSent</span></td>
                  <td><span className="param-type">function</span></td>
                  <td><span className="param-optional">Optional</span></td>
                  <td>Callback when user sends a message</td>
                </tr>
                <tr>
                  <td><span className="param-name">onMessageReceived</span></td>
                  <td><span className="param-type">function</span></td>
                  <td><span className="param-optional">Optional</span></td>
                  <td>Callback when AI responds</td>
                </tr>
                <tr>
                  <td><span className="param-name">onError</span></td>
                  <td><span className="param-type">function</span></td>
                  <td><span className="param-optional">Optional</span></td>
                  <td>Callback when an error occurs</td>
                </tr>
                <tr>
                  <td><span className="param-name">customStyles</span></td>
                  <td><span className="param-type">object</span></td>
                  <td><span className="param-optional">Optional</span></td>
                  <td>Custom styling options</td>
                </tr>
                <tr>
                  <td><span className="param-name">defaultFolded</span></td>
                  <td><span className="param-type">boolean</span></td>
                  <td><span className="param-optional">Optional</span></td>
                  <td>Start sidebar/panel in folded state</td>
                </tr>
                <tr>
                  <td><span className="param-name">panelMinWidth</span></td>
                  <td><span className="param-type">string</span></td>
                  <td><span className="param-optional">Optional</span></td>
                  <td>Minimum panel width (panel mode only)</td>
                </tr>
                <tr>
                  <td><span className="param-name">panelMaxWidth</span></td>
                  <td><span className="param-type">string</span></td>
                  <td><span className="param-optional">Optional</span></td>
                  <td>Maximum panel width (panel mode only)</td>
                </tr>
                <tr>
                  <td><span className="param-name">panelDefaultWidth</span></td>
                  <td><span className="param-type">string</span></td>
                  <td><span className="param-optional">Optional</span></td>
                  <td>Default panel width (panel mode only)</td>
                </tr>
                <tr>
                  <td><span className="param-name">onPanelResize</span></td>
                  <td><span className="param-type">function</span></td>
                  <td><span className="param-optional">Optional</span></td>
                  <td>Callback when panel is resized</td>
                </tr>
              </tbody>
            </table>

            <h3>Tool Interface</h3>
            <div className="docs-code-block">
              <div className="code-language">tsx</div>
{`interface Tool {
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
  handler: (params: any) => Promise<any>;
}`}
            </div>
          </section>

          {/* Examples */}
          <section className="docs-section">
            <h2>Examples</h2>
            <p>
              Check out the <Link to="/todo-demo">Todo Demo</Link> to see Tools and Context in action,
              or try the <Link to="/chat-multi-conversation">Fullscreen Chat</Link> to experience
              multi-conversation management with persistence.
            </p>

            <div className="info-box">
              <h4>📚 More Resources</h4>
              <p>
                For more examples and detailed guides, visit the
                <a href="https://github.com/InAppAI/react" target="_blank" rel="noopener noreferrer"> GitHub repository</a>.
              </p>
            </div>
          </section>
        </main>
      </div>

      {/* Footer */}
      <footer className="docs-footer">
        <p>
          Built with ❤️ by the InAppAI team •{' '}
          <a href="https://github.com/InAppAI/react" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          {' • '}
          <Link to="/">Back to Demo</Link>
        </p>
      </footer>
    </div>
  );
}

export default Documentation;
