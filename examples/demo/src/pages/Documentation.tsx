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
            <a href="#hooks" className="docs-nav-link">Hooks</a>
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
              <a href="#hooks" className="toc-link">React Hooks</a>
            </li>
            <li className="toc-item">
              <a href="#useconversationstorage" className="toc-link">useConversationStorage</a>
            </li>
            <li className="toc-item">
              <a href="#api-reference" className="toc-link">API Reference</a>
            </li>
            <li className="toc-item">
              <a href="#chat-endpoint" className="toc-link">Chat Endpoint</a>
            </li>
            <li className="toc-item">
              <a href="#knowledge-base" className="toc-link">Knowledge Base</a>
            </li>
            <li className="toc-item">
              <a href="#examples" className="toc-link">Examples</a>
            </li>
          </ul>
        </aside>

        {/* Documentation Content */}
        <main className="docs-content">
          {/* Header */}
          <header className="docs-header">
            <h1>InAppAI React SDK</h1>
            <p>
              Complete documentation for integrating AI-powered chat capabilities into your React
              applications with privacy-first, client-side conversation management.
            </p>
          </header>

          {/* Overview */}
          <section id="overview" className="docs-section">
            <h2>Overview</h2>
            <p>
              InAppAI provides a powerful, flexible SDK for adding AI chat functionality to your
              React applications. Built with privacy and developer experience in mind, it supports
              multiple deployment patterns and use cases.
            </p>

            <div className="feature-grid">
              <div className="feature-card">
                <div className="feature-icon">🔒</div>
                <h3>Privacy-First</h3>
                <p>All conversations stored locally in the browser. Zero server-side message storage.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">⚡</div>
                <h3>Fast & Lightweight</h3>
                <p>Optimized bundle size with tree-shaking support. Minimal overhead.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🎨</div>
                <h3>Fully Customizable</h3>
                <p>Bring your own UI components or use our pre-built patterns.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📦</div>
                <h3>TypeScript Native</h3>
                <p>Full TypeScript support with comprehensive type definitions.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🔄</div>
                <h3>Real-time Streaming</h3>
                <p>Support for streaming responses for better user experience.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🛠️</div>
                <h3>Tool Integration</h3>
                <p>Let AI interact with your application through custom tools.</p>
              </div>
            </div>
          </section>

          {/* Getting Started */}
          <section id="getting-started" className="docs-section">
            <h2>Getting Started</h2>

            <h3>Installation</h3>
            <p>Install the InAppAI React SDK using your preferred package manager:</p>
            <div className="docs-code-block">
              <div className="code-language">bash</div>
npm install @inappai/react
            </div>

            <h3>Basic Setup</h3>
            <p>Wrap your application with the InAppAI provider:</p>
            <div className="docs-code-block">
              <div className="code-language">tsx</div>
{`import { InAppAIProvider } from '@inappai/react';

function App() {
  return (
    <InAppAIProvider
      subscriptionId="your-subscription-id"
      apiBaseUrl="https://api.inappai.com"
    >
      <YourApp />
    </InAppAIProvider>
  );
}`}
            </div>

            <div className="info-box">
              <h4>💡 Finding Your Subscription ID</h4>
              <p>
                Your subscription ID can be found in your InAppAI dashboard. It's required for
                authenticating API requests.
              </p>
            </div>

            <div className="warning-box">
              <h4>⚠️ Security Best Practice</h4>
              <p>
                Never hardcode your subscription ID in client-side code for production. Use
                environment variables and keep sensitive credentials secure.
              </p>
            </div>
          </section>

          {/* Hooks */}
          <section id="hooks" className="docs-section">
            <h2>React Hooks</h2>

            <h3 id="useconversationstorage">useConversationStorage</h3>
            <p>
              The core hook for managing conversations with automatic localStorage persistence.
            </p>

            <h4>Import</h4>
            <div className="docs-code-block">
              <div className="code-language">tsx</div>
{`import { useConversationStorage } from '@inappai/react';`}
            </div>

            <h4>Usage</h4>
            <div className="docs-code-block">
              <div className="code-language">tsx</div>
{`function ChatComponent() {
  const {
    conversations,
    activeConversation,
    messages,
    createConversation,
    switchConversation,
    addMessage,
    updateConversation,
    deleteConversation,
    clearMessages,
    exportConversation,
    exportAll,
    importConversations,
  } = useConversationStorage('my-namespace');

  return (
    <div>
      {/* Your chat UI */}
    </div>
  );
}`}
            </div>

            <h4>Parameters</h4>
            <table className="params-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Required</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><span className="param-name">namespace</span></td>
                  <td><span className="param-type">string</span></td>
                  <td><span className="param-optional">Optional</span></td>
                  <td>Namespace for localStorage isolation. Default: 'default'</td>
                </tr>
              </tbody>
            </table>

            <h4>Return Value</h4>
            <table className="params-table">
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Type</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><span className="param-name">conversations</span></td>
                  <td><span className="param-type">StoredConversation[]</span></td>
                  <td>Array of all conversations in this namespace</td>
                </tr>
                <tr>
                  <td><span className="param-name">activeConversation</span></td>
                  <td><span className="param-type">StoredConversation | null</span></td>
                  <td>Currently active conversation</td>
                </tr>
                <tr>
                  <td><span className="param-name">messages</span></td>
                  <td><span className="param-type">Message[]</span></td>
                  <td>Messages in the active conversation</td>
                </tr>
                <tr>
                  <td><span className="param-name">createConversation</span></td>
                  <td><span className="param-type">() =&gt; string</span></td>
                  <td>Create a new conversation, returns conversation ID</td>
                </tr>
                <tr>
                  <td><span className="param-name">switchConversation</span></td>
                  <td><span className="param-type">(id: string) =&gt; void</span></td>
                  <td>Switch to a different conversation</td>
                </tr>
                <tr>
                  <td><span className="param-name">addMessage</span></td>
                  <td><span className="param-type">(msg: Partial&lt;Message&gt;) =&gt; void</span></td>
                  <td>Add a message to active conversation</td>
                </tr>
                <tr>
                  <td><span className="param-name">deleteConversation</span></td>
                  <td><span className="param-type">(id: string) =&gt; void</span></td>
                  <td>Delete a conversation</td>
                </tr>
                <tr>
                  <td><span className="param-name">exportAll</span></td>
                  <td><span className="param-type">() =&gt; string</span></td>
                  <td>Export all conversations as JSON</td>
                </tr>
              </tbody>
            </table>
          </section>

          {/* API Reference */}
          <section id="api-reference" className="docs-section">
            <h2>API Reference</h2>

            <h3 id="chat-endpoint">Chat Endpoint</h3>
            <p>Send messages and receive AI responses.</p>

            <div className="api-endpoint">
              <span className="api-method post">POST</span>
              <code>/api/:subscriptionId/chat</code>
            </div>

            <h4>Request Body</h4>
            <table className="params-table">
              <thead>
                <tr>
                  <th>Field</th>
                  <th>Type</th>
                  <th>Required</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><span className="param-name">message</span></td>
                  <td><span className="param-type">string</span></td>
                  <td><span className="param-required">Required</span></td>
                  <td>The user's message</td>
                </tr>
                <tr>
                  <td><span className="param-name">messages</span></td>
                  <td><span className="param-type">ChatMessage[]</span></td>
                  <td><span className="param-optional">Optional</span></td>
                  <td>Full conversation history for context</td>
                </tr>
                <tr>
                  <td><span className="param-name">conversationId</span></td>
                  <td><span className="param-type">string</span></td>
                  <td><span className="param-optional">Optional</span></td>
                  <td>Conversation identifier for analytics</td>
                </tr>
                <tr>
                  <td><span className="param-name">stream</span></td>
                  <td><span className="param-type">boolean</span></td>
                  <td><span className="param-optional">Optional</span></td>
                  <td>Enable streaming response (default: false)</td>
                </tr>
                <tr>
                  <td><span className="param-name">context</span></td>
                  <td><span className="param-type">object</span></td>
                  <td><span className="param-optional">Optional</span></td>
                  <td>Additional context for the AI</td>
                </tr>
              </tbody>
            </table>

            <h4>Example Request</h4>
            <div className="docs-code-block">
              <div className="code-language">tsx</div>
{`const response = await fetch(
  'https://api.inappai.com/api/your-sub-id/chat',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: 'Hello, how can you help me?',
      messages: [
        { role: 'user', content: 'Previous message' },
        { role: 'assistant', content: 'Previous response' }
      ],
      conversationId: 'conv-123',
      context: {
        currentPage: '/docs',
        userRole: 'developer'
      }
    })
  }
);

const data = await response.json();
console.log(data.message);`}
            </div>

            <h4>Response</h4>
            <table className="params-table">
              <thead>
                <tr>
                  <th>Field</th>
                  <th>Type</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><span className="param-name">message</span></td>
                  <td><span className="param-type">string</span></td>
                  <td>AI assistant's response</td>
                </tr>
                <tr>
                  <td><span className="param-name">tokens</span></td>
                  <td><span className="param-type">object</span></td>
                  <td>Token usage information</td>
                </tr>
                <tr>
                  <td><span className="param-name">tokens.prompt</span></td>
                  <td><span className="param-type">number</span></td>
                  <td>Tokens used in the prompt</td>
                </tr>
                <tr>
                  <td><span className="param-name">tokens.completion</span></td>
                  <td><span className="param-type">number</span></td>
                  <td>Tokens used in the completion</td>
                </tr>
                <tr>
                  <td><span className="param-name">tokens.total</span></td>
                  <td><span className="param-type">number</span></td>
                  <td>Total tokens used</td>
                </tr>
              </tbody>
            </table>

            <h3 id="knowledge-base">Knowledge Base Endpoints</h3>
            <p>Manage documents and perform RAG-enhanced searches.</p>

            <div className="api-endpoint">
              <span className="api-method post">POST</span>
              <code>/api/:subscriptionId/kb/documents</code>
            </div>
            <p>Add a document to the knowledge base.</p>

            <div className="api-endpoint">
              <span className="api-method get">GET</span>
              <code>/api/:subscriptionId/kb/documents</code>
            </div>
            <p>List all documents in the knowledge base.</p>

            <div className="api-endpoint">
              <span className="api-method post">POST</span>
              <code>/api/:subscriptionId/kb/search</code>
            </div>
            <p>Semantic search across your knowledge base.</p>

            <div className="api-endpoint">
              <span className="api-method delete">DELETE</span>
              <code>/api/:subscriptionId/kb/documents/:documentId</code>
            </div>
            <p>Delete a specific document.</p>
          </section>

          {/* Examples */}
          <section id="examples" className="docs-section">
            <h2>Examples</h2>

            <h3>Complete Chat Component</h3>
            <div className="docs-code-block">
              <div className="code-language">tsx</div>
{`import { useState } from 'react';
import { useConversationStorage } from '@inappai/react';

function MyChatComponent() {
  const {
    messages,
    addMessage,
    createConversation
  } = useConversationStorage('my-chat');

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message
    addMessage({
      role: 'user',
      content: input
    });

    setLoading(true);

    try {
      const response = await fetch('/api/your-sub-id/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          messages: messages.map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      const data = await response.json();

      // Add AI response
      addMessage({
        role: 'assistant',
        content: data.message
      });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
      setInput('');
    }
  };

  return (
    <div>
      <div className="messages">
        {messages.map(msg => (
          <div key={msg.id} className={msg.role}>
            {msg.content}
          </div>
        ))}
      </div>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        disabled={loading}
      />
      <button onClick={handleSend} disabled={loading}>
        Send
      </button>
    </div>
  );
}`}
            </div>

            <h3>Export/Import Conversations</h3>
            <div className="docs-code-block">
              <div className="code-language">tsx</div>
{`const { exportAll, importConversations } = useConversationStorage();

// Export
const handleExport = () => {
  const data = exportAll();
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'conversations.json';
  a.click();
};

// Import
const handleImport = (file: File) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const content = e.target?.result as string;
    importConversations(content);
  };
  reader.readAsText(file);
};`}
            </div>
          </section>
        </main>
      </div>

      {/* Footer */}
      <footer className="docs-footer">
        <p>
          Need help? Visit our <a href="https://github.com/inappai/inappai">GitHub repository</a> or{' '}
          <a href="mailto:support@inappai.com">contact support</a>
        </p>
        <p style={{ marginTop: '16px' }}>
          <Link to="/">← Back to Demo Home</Link>
        </p>
      </footer>
    </div>
  );
}

export default Documentation;
