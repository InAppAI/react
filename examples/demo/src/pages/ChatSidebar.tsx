import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useConversationStorage } from '../hooks/useConversationStorage';
import ReactMarkdown from 'react-markdown';
import './ChatSidebar.css';

function ChatSidebar() {
  const subscriptionId = import.meta.env.VITE_SUBSCRIPTION_ID;
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const ENDPOINT = `${apiBaseUrl}/${subscriptionId}/chat`;

  const {
    messages,
    addMessage,
    createConversation,
    clearMessages,
  } = useConversationStorage('sidebar-chat');

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentSection, setCurrentSection] = useState('Introduction');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);

  // Auto-scroll sidebar messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Create conversation on mount
  useEffect(() => {
    createConversation();
  }, []);

  // Track scroll position to determine current section
  useEffect(() => {
    const handleScroll = () => {
      if (!mainContentRef.current) return;

      const sections = mainContentRef.current.querySelectorAll('[data-section]');
      let current = 'Introduction';

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 150) {
          current = section.getAttribute('data-section') || 'Introduction';
        }
      });

      setCurrentSection(current);
    };

    const content = mainContentRef.current;
    if (content) {
      content.addEventListener('scroll', handleScroll);
      return () => content.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const handleSend = async (messageText?: string) => {
    const userMessageContent = messageText || inputValue.trim();
    if (!userMessageContent || isLoading) return;

    setInputValue('');

    // Add context about current section
    const contextualMessage = `[User is currently viewing: "${currentSection}" section]\n\n${userMessageContent}`;

    // Add user message
    addMessage({
      role: 'user',
      content: userMessageContent,
    });

    setIsLoading(true);

    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: contextualMessage,
          messages: messages.map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Add assistant message
      addMessage({
        role: 'assistant',
        content: data.message,
        usage: data.tokens ? {
          promptTokens: data.tokens.prompt,
          completionTokens: data.tokens.completion,
          totalTokens: data.tokens.total,
        } : undefined,
      });
    } catch (error) {
      console.error('Error:', error);
      addMessage({
        role: 'assistant',
        content: `Error: ${error instanceof Error ? error.message : 'Failed to get response'}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNewConversation = () => {
    if (confirm('Start a new conversation? Current messages will be cleared.')) {
      clearMessages();
    }
  };

  return (
    <div className="sidebar-layout">
      {/* Main Content Area */}
      <div
        ref={mainContentRef}
        className={`main-content ${sidebarCollapsed ? 'with-narrow-sidebar' : 'with-sidebar'}`}
      >
        <div className="content-header">
          <h1>InAppAI React SDK Documentation</h1>
          <p>
            Welcome to the InAppAI React SDK documentation. This page demonstrates the
            sidebar chat pattern - an always-visible AI assistant that stays accessible
            while you browse documentation.
          </p>
        </div>

        <div className="content-section" data-section="Introduction">
          <h2>Introduction</h2>
          <p>
            InAppAI provides a powerful React SDK for integrating AI chat capabilities
            into your applications. The sidebar pattern shown here is ideal for:
          </p>
          <ul>
            <li>Documentation sites with AI-powered help</li>
            <li>Admin panels with context-aware assistance</li>
            <li>Learning platforms with on-demand tutoring</li>
            <li>Knowledge bases with intelligent search</li>
          </ul>
          <h3>Key Features</h3>
          <ul>
            <li><strong>Context-Aware:</strong> The assistant knows what section you're viewing</li>
            <li><strong>Always Available:</strong> No need to navigate away from content</li>
            <li><strong>Privacy-First:</strong> All conversations stored locally</li>
            <li><strong>Collapsible:</strong> Maximize content space when needed</li>
          </ul>
        </div>

        <div className="content-section" data-section="Getting Started">
          <h2>Getting Started</h2>
          <p>
            Install the InAppAI React SDK using npm or yarn:
          </p>
          <div className="code-example">
            npm install @inappai/react
          </div>
          <h3>Basic Setup</h3>
          <p>
            Import and configure the InAppAI provider in your root component:
          </p>
          <div className="code-example">
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
        </div>

        <div className="content-section" data-section="Chat Components">
          <h2>Chat Components</h2>
          <p>
            The SDK provides several ready-to-use chat components for different use cases.
          </p>
          <h3>Sidebar Pattern</h3>
          <p>
            This page demonstrates the sidebar pattern - perfect for documentation and
            knowledge bases:
          </p>
          <div className="code-example">
{`import { ChatSidebar } from '@inappai/react';

function Docs() {
  return (
    <div>
      <MainContent />
      <ChatSidebar
        position="right"
        width={400}
        collapsible={true}
        contextAware={true}
      />
    </div>
  );
}`}
          </div>
          <h3>Embedded Pattern</h3>
          <p>
            For inline help within specific sections:
          </p>
          <div className="code-example">
{`import { ChatEmbed } from '@inappai/react';

function Tutorial() {
  return (
    <section>
      <h2>Step 1: Installation</h2>
      <ChatEmbed
        initialPrompt="Help me with installation"
        compact={true}
      />
    </section>
  );
}`}
          </div>
        </div>

        <div className="content-section" data-section="API Reference">
          <h2>API Reference</h2>
          <h3>useChat Hook</h3>
          <p>
            The core hook for building custom chat interfaces:
          </p>
          <div className="code-example">
{`const {
  messages,
  sendMessage,
  isLoading,
  error
} = useChat({
  subscriptionId: 'your-id',
  apiBaseUrl: 'https://api.inappai.com'
});`}
          </div>
          <h3>useConversationStorage Hook</h3>
          <p>
            Manage client-side conversation persistence:
          </p>
          <div className="code-example">
{`const {
  conversations,
  activeConversation,
  createConversation,
  switchConversation,
  deleteConversation
} = useConversationStorage('my-namespace');`}
          </div>
        </div>

        <div className="content-section" data-section="Advanced Usage">
          <h2>Advanced Usage</h2>
          <h3>Custom Context</h3>
          <p>
            You can inject custom context into your chat messages:
          </p>
          <div className="code-example">
{`const contextData = {
  currentPage: '/docs/getting-started',
  userRole: 'developer',
  language: 'en'
};

await sendMessage('How do I install?', {
  context: contextData
});`}
          </div>
          <h3>Streaming Responses</h3>
          <p>
            Enable streaming for real-time response rendering:
          </p>
          <div className="code-example">
{`const { sendMessage } = useChat({
  stream: true,
  onChunk: (chunk) => {
    console.log('Received chunk:', chunk);
  }
});`}
          </div>
        </div>

        <div className="nav-footer">
          <Link to="/">← Back to Home</Link>
        </div>
      </div>

      {/* Chat Sidebar */}
      <div className={`chat-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <button
          className="sidebar-toggle"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          title={sidebarCollapsed ? 'Expand Chat' : 'Collapse Chat'}
        >
          {sidebarCollapsed ? '◄' : '►'}
        </button>

        <div className="sidebar-header">
          <h2>💬 AI Assistant</h2>
          <p>Ask me anything about InAppAI</p>
        </div>

        <div className="context-indicator">
          <strong>Current Section:</strong>
          {currentSection}
        </div>

        <div className="sidebar-messages">
          {messages.length === 0 ? (
            <div className="welcome-state">
              <h3>👋 Hello!</h3>
              <p>I'm here to help you with InAppAI documentation.</p>
              <div className="quick-prompts">
                <button onClick={() => handleSend('How do I get started?')}>
                  How do I get started?
                </button>
                <button onClick={() => handleSend('Explain the sidebar pattern')}>
                  Explain the sidebar pattern
                </button>
                <button onClick={() => handleSend('Show me code examples')}>
                  Show me code examples
                </button>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className={`sidebar-message ${message.role}`}>
                <div className="message-icon">
                  {message.role === 'user' ? '👤' : '🤖'}
                </div>
                <div className="message-bubble">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              </div>
            ))
          )}

          {isLoading && (
            <div className="sidebar-message assistant">
              <div className="message-icon">🤖</div>
              <div className="loading-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="sidebar-input">
          <div className="input-wrapper">
            <input
              type="text"
              placeholder="Ask a question..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
            <button
              onClick={() => handleSend()}
              disabled={!inputValue.trim() || isLoading}
            >
              {isLoading ? '...' : '↵'}
            </button>
          </div>
          <div className="conversation-controls">
            <button onClick={handleNewConversation}>
              🔄 New Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatSidebar;
