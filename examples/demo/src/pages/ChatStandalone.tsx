import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useConversationStorage } from '../hooks/useConversationStorage';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './ChatStandalone.css';

function ChatStandalone() {
  const subscriptionId = import.meta.env.VITE_SUBSCRIPTION_ID;
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const ENDPOINT = `${apiBaseUrl}/${subscriptionId}/chat`;

  const {
    conversations,
    activeConversation,
    messages,
    createConversation,
    switchConversation,
    addMessage,
    deleteConversation,
  } = useConversationStorage('standalone-chat');

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Create first conversation if none exists
  useEffect(() => {
    if (conversations.length === 0) {
      createConversation();
    }
  }, []);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessageContent = inputValue.trim();
    setInputValue('');

    // Add user message
    addMessage({
      role: 'user',
      content: userMessageContent,
    });

    setIsLoading(true);

    try {
      // Call API with full message history
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessageContent,
          conversationId: activeConversation?.id,
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

  const filteredConversations = conversations.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="standalone-chat-container">
      {/* Sidebar */}
      <div className={`conversation-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <button
            className="collapse-btn"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            title={sidebarCollapsed ? 'Expand' : 'Collapse'}
          >
            {sidebarCollapsed ? '→' : '←'}
          </button>
          {!sidebarCollapsed && (
            <>
              <h2>💬 Chats</h2>
              <button className="new-chat-btn" onClick={createConversation}>
                + New
              </button>
            </>
          )}
        </div>

        {!sidebarCollapsed && (
          <>
            <div className="search-box">
              <input
                type="text"
                placeholder="🔍 Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="conversations-list">
              {filteredConversations.length === 0 ? (
                <div className="empty-state">
                  <p>No conversations yet</p>
                  <button onClick={createConversation}>Start chatting</button>
                </div>
              ) : (
                filteredConversations.map((conv) => (
                  <div
                    key={conv.id}
                    className={`conversation-item ${activeConversation?.id === conv.id ? 'active' : ''}`}
                    onClick={() => switchConversation(conv.id)}
                  >
                    <div className="conversation-title">{conv.title}</div>
                    <div className="conversation-meta">
                      {conv.metadata?.messageCount || 0} msgs • {formatTimestamp(conv.updatedAt)}
                    </div>
                    <button
                      className="delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Delete this conversation?')) {
                          deleteConversation(conv.id);
                        }
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="sidebar-footer">
              <Link to="/" className="back-link">← Home</Link>
            </div>
          </>
        )}
      </div>

      {/* Chat Area */}
      <div className="chat-area">
        <div className="chat-header">
          <h1>🤖 InAppAI Assistant</h1>
          {activeConversation && (
            <div className="chat-info">
              <span>{activeConversation.metadata?.messageCount || 0} messages</span>
              {activeConversation.metadata?.totalTokens && (
                <span>• {activeConversation.metadata.totalTokens} tokens</span>
              )}
            </div>
          )}
        </div>

        <div className="messages-container">
          {messages.length === 0 ? (
            <div className="welcome-message">
              <h2>Welcome to InAppAI!</h2>
              <p>Start a conversation by typing a message below.</p>
              <div className="suggestions">
                <button onClick={() => setInputValue('What can you help me with?')}>
                  What can you help me with?
                </button>
                <button onClick={() => setInputValue('Explain client-side storage')}>
                  Explain client-side storage
                </button>
                <button onClick={() => setInputValue('How does this demo work?')}>
                  How does this demo work?
                </button>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className={`message ${message.role}`}>
                <div className="message-avatar">
                  {message.role === 'user' ? '👤' : '🤖'}
                </div>
                <div className="message-content">
                  <ReactMarkdown
                    components={{
                      code({ node, inline, className, children, ...props }: any) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                          <SyntaxHighlighter
                            style={vscDarkPlus}
                            language={match[1]}
                            PreTag="div"
                            {...props}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                  {message.usage && (
                    <div className="message-meta">
                      {message.usage.totalTokens} tokens
                    </div>
                  )}
                </div>
              </div>
            ))
          )}

          {isLoading && (
            <div className="message assistant">
              <div className="message-avatar">🤖</div>
              <div className="message-content">
                <div className="loading-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="input-area">
          <input
            type="text"
            placeholder="Type a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading || !activeConversation}
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading || !activeConversation}
          >
            {isLoading ? '...' : '↵'}
          </button>
        </div>

        {!activeConversation && conversations.length > 0 && (
          <div className="no-conversation-selected">
            Select a conversation from the sidebar or create a new one
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatStandalone;
