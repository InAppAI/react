import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import './ChatEmbedded.css';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface EmbeddedChatProps {
  title: string;
  initialPrompt?: string;
  suggestedQuestions: string[];
  context: string;
}

function EmbeddedChatWidget({ title, initialPrompt, suggestedQuestions, context }: EmbeddedChatProps) {
  const subscriptionId = import.meta.env.VITE_SUBSCRIPTION_ID;
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const ENDPOINT = `${apiBaseUrl}/${subscriptionId}/chat`;

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (messageText?: string) => {
    const userMessageContent = messageText || inputValue.trim();
    if (!userMessageContent || isLoading) return;

    setInputValue('');
    setIsExpanded(true);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessageContent,
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Add context to the message
      const contextualMessage = `[Context: ${context}]\n\n${userMessageContent}`;

      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: contextualMessage,
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Error: ${error instanceof Error ? error.message : 'Failed to get response'}`,
      };
      setMessages(prev => [...prev, errorMessage]);
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

  return (
    <div className={`embedded-chat-widget ${isExpanded ? '' : 'collapsed'}`}>
      <div
        className={`widget-header ${isExpanded ? 'expanded' : ''}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h4>
          💬 {title}
        </h4>
        <span className="toggle-icon">▼</span>
      </div>

      <div className={`widget-content ${isExpanded ? 'expanded' : ''}`}>
        <div className="widget-messages">
          {messages.length === 0 ? (
            <div className="widget-empty">
              <p>{initialPrompt || 'Ask me anything about this section!'}</p>
              <div className="widget-suggestions">
                {suggestedQuestions.map((question, index) => (
                  <button key={index} onClick={() => handleSend(question)}>
                    {question}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div key={message.id} className={`widget-message ${message.role}`}>
                  <div className="widget-message-icon">
                    {message.role === 'user' ? '👤' : '🤖'}
                  </div>
                  <div className="widget-message-bubble">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="widget-message assistant">
                  <div className="widget-message-icon">🤖</div>
                  <div className="widget-loading">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        <div className="widget-input">
          <div className="widget-input-wrapper">
            <input
              type="text"
              placeholder="Type a question..."
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
        </div>
      </div>
    </div>
  );
}

function ChatEmbedded() {
  return (
    <div className="embedded-layout">
      <div className="embedded-container">
        <div className="embedded-header">
          <h1>📝 InAppAI Tutorial</h1>
          <p>Interactive tutorial with embedded AI assistance in each section</p>
        </div>

        {/* Step 1 */}
        <div className="tutorial-section">
          <h2>
            <span className="step-number">1</span>
            Installation & Setup
          </h2>
          <div className="tutorial-content">
            <p>
              Getting started with InAppAI is simple. First, install the package using npm or yarn:
            </p>
            <div className="code-block">
              npm install @inappai/react
            </div>
            <p>
              Then, wrap your application with the InAppAI provider. This gives all child components
              access to the AI chat functionality:
            </p>
            <div className="code-block">
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
            <p>
              Your subscription ID can be found in your InAppAI dashboard. Make sure to keep it
              secure and never commit it to version control!
            </p>
          </div>

          <div className="try-it-section">
            <h3>💡 Try It - Ask About Installation</h3>
            <EmbeddedChatWidget
              title="Installation Help"
              initialPrompt="Need help with installation?"
              suggestedQuestions={[
                'Where do I find my subscription ID?',
                'Can I use this with TypeScript?',
                'How do I secure my API keys?',
              ]}
              context="User is learning about InAppAI installation and setup"
            />
          </div>
        </div>

        {/* Step 2 */}
        <div className="tutorial-section">
          <h2>
            <span className="step-number">2</span>
            Creating Your First Chat
          </h2>
          <div className="tutorial-content">
            <p>
              Now that you have InAppAI installed, let's create your first chat interface.
              Use the <code>useChat</code> hook to manage messages and conversations:
            </p>
            <div className="code-block">
{`import { useChat } from '@inappai/react';

function ChatComponent() {
  const { messages, sendMessage, isLoading } = useChat();

  const handleSubmit = async (text: string) => {
    await sendMessage(text);
  };

  return (
    <div>
      {messages.map((msg) => (
        <div key={msg.id}>{msg.content}</div>
      ))}
    </div>
  );
}`}
            </div>
            <p>
              The <code>useChat</code> hook provides:
            </p>
            <ul>
              <li><code>messages</code> - Array of all messages in the conversation</li>
              <li><code>sendMessage</code> - Function to send new messages</li>
              <li><code>isLoading</code> - Boolean indicating if a response is in progress</li>
              <li><code>error</code> - Any error that occurred during message sending</li>
            </ul>
          </div>

          <div className="try-it-section">
            <h3>💡 Try It - Ask About Chat Components</h3>
            <EmbeddedChatWidget
              title="Chat Component Help"
              initialPrompt="Questions about building chat interfaces?"
              suggestedQuestions={[
                'How do I customize message styling?',
                'Can I add file uploads to chat?',
                'How do I handle errors?',
              ]}
              context="User is learning about creating chat components with useChat hook"
            />
          </div>
        </div>

        {/* Step 3 */}
        <div className="tutorial-section">
          <h2>
            <span className="step-number">3</span>
            Managing Conversations
          </h2>
          <div className="tutorial-content">
            <p>
              For applications that need to manage multiple conversations, use the
              <code>useConversationStorage</code> hook. This provides full CRUD operations
              with automatic localStorage persistence:
            </p>
            <div className="code-block">
{`import { useConversationStorage } from '@inappai/react';

function ChatApp() {
  const {
    conversations,
    activeConversation,
    messages,
    createConversation,
    switchConversation,
    deleteConversation,
    addMessage,
  } = useConversationStorage('my-app');

  return (
    <div>
      <button onClick={createConversation}>New Chat</button>
      {conversations.map((conv) => (
        <div key={conv.id} onClick={() => switchConversation(conv.id)}>
          {conv.title}
        </div>
      ))}
    </div>
  );
}`}
            </div>
            <p>
              Features of conversation storage:
            </p>
            <ul>
              <li><strong>Privacy-First:</strong> All data stored locally in browser</li>
              <li><strong>Auto-Persistence:</strong> Changes saved automatically to localStorage</li>
              <li><strong>Namespace Support:</strong> Separate storage for different app sections</li>
              <li><strong>Export/Import:</strong> Backup and restore conversations</li>
              <li><strong>Metadata Tracking:</strong> Token counts, timestamps, custom tags</li>
            </ul>
          </div>

          <div className="try-it-section">
            <h3>💡 Try It - Ask About Conversation Management</h3>
            <EmbeddedChatWidget
              title="Conversation Storage Help"
              initialPrompt="Questions about managing conversations?"
              suggestedQuestions={[
                'How do I export conversations?',
                'Can I add custom metadata?',
                'How does namespace isolation work?',
              ]}
              context="User is learning about conversation management and storage"
            />
          </div>
        </div>

        {/* Step 4 */}
        <div className="tutorial-section">
          <h2>
            <span className="step-number">4</span>
            Advanced Features
          </h2>
          <div className="tutorial-content">
            <p>
              InAppAI supports several advanced features for production applications:
            </p>
            <h3>Context Injection</h3>
            <p>
              Provide contextual information to improve AI responses:
            </p>
            <div className="code-block">
{`const context = {
  currentPage: '/docs/getting-started',
  userRole: 'developer',
  preferences: { language: 'typescript' }
};

await sendMessage('How do I install?', { context });`}
            </div>
            <h3>Streaming Responses</h3>
            <p>
              Enable real-time streaming for better UX:
            </p>
            <div className="code-block">
{`const { sendMessage } = useChat({
  stream: true,
  onChunk: (chunk) => {
    // Handle each chunk as it arrives
    console.log('Received:', chunk);
  }
});`}
            </div>
            <h3>Tool Integration</h3>
            <p>
              Let the AI interact with your application through custom tools:
            </p>
            <div className="code-block">
{`const tools = [
  {
    name: 'search_docs',
    description: 'Search documentation',
    parameters: { query: 'string' }
  }
];

await sendMessage('Find info about hooks', { tools });`}
            </div>
          </div>

          <div className="try-it-section">
            <h3>💡 Try It - Ask About Advanced Features</h3>
            <EmbeddedChatWidget
              title="Advanced Features Help"
              initialPrompt="Explore advanced capabilities"
              suggestedQuestions={[
                'How do I implement streaming?',
                'What kind of tools can I create?',
                'How do I handle rate limits?',
              ]}
              context="User is learning about advanced InAppAI features like streaming and tools"
            />
          </div>
        </div>

        <div className="footer-section">
          <Link to="/">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}

export default ChatEmbedded;
