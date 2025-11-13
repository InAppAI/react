import { useState, useRef, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useConversationStorage, StoredConversation } from '../hooks/useConversationStorage';
import ReactMarkdown from 'react-markdown';
import './ChatMultiConversation.css';

type FilterMode = 'all' | 'today' | 'week' | 'month';

const COLORS = ['#667eea', '#f093fb', '#fa709a', '#4facfe', '#43e97b', '#fa8c96'];
const AVAILABLE_TAGS = ['work', 'personal', 'research', 'support', 'ideas', 'urgent'];

function ChatMultiConversation() {
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
    updateConversation,
    deleteConversation,
    exportAll,
    importConversations,
  } = useConversationStorage('multi-conversation');

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (conversations.length === 0) {
      createConversation();
    }
  }, []);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading || !activeConversation) return;

    const userMessageContent = inputValue.trim();
    setInputValue('');

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
          message: userMessageContent,
          conversationId: activeConversation.id,
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

  const handleAddTag = (conversationId: string, tag: string) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) return;

    const currentTags = conversation.metadata?.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];

    updateConversation(conversationId, {
      metadata: {
        ...conversation.metadata,
        tags: newTags,
      },
    });
  };

  const handleSetColor = (conversationId: string, color: string) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) return;

    updateConversation(conversationId, {
      metadata: {
        ...conversation.metadata,
        color,
      },
    });
  };

  const handleExport = () => {
    const data = exportAll();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inappai-conversations-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        importConversations(content);
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const filteredConversations = useMemo(() => {
    let filtered = conversations;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(c =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.messages.some(m => m.content.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(c =>
        selectedTags.some(tag => c.metadata?.tags?.includes(tag))
      );
    }

    // Time filter
    if (filterMode !== 'all') {
      const now = new Date();
      const cutoff = new Date();

      switch (filterMode) {
        case 'today':
          cutoff.setHours(0, 0, 0, 0);
          break;
        case 'week':
          cutoff.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoff.setMonth(now.getMonth() - 1);
          break;
      }

      filtered = filtered.filter(c => new Date(c.updatedAt) >= cutoff);
    }

    return filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [conversations, searchQuery, selectedTags, filterMode]);

  const groupedConversations = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const groups = {
      today: [] as StoredConversation[],
      yesterday: [] as StoredConversation[],
      week: [] as StoredConversation[],
      older: [] as StoredConversation[],
    };

    filteredConversations.forEach(conv => {
      const date = new Date(conv.updatedAt);
      if (date >= today) {
        groups.today.push(conv);
      } else if (date >= yesterday) {
        groups.yesterday.push(conv);
      } else if (date >= weekAgo) {
        groups.week.push(conv);
      } else {
        groups.older.push(conv);
      }
    });

    return groups;
  }, [filteredConversations]);

  const stats = useMemo(() => ({
    total: conversations.length,
    totalMessages: conversations.reduce((sum, c) => sum + (c.metadata?.messageCount || 0), 0),
    totalTokens: conversations.reduce((sum, c) => sum + (c.metadata?.totalTokens || 0), 0),
  }), [conversations]);

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

  const getPreview = (conv: StoredConversation) => {
    const lastMessage = conv.messages[conv.messages.length - 1];
    if (!lastMessage) return 'No messages yet';
    return lastMessage.content.substring(0, 60) + (lastMessage.content.length > 60 ? '...' : '');
  };

  const renderConversationGroup = (title: string, convs: StoredConversation[]) => {
    if (convs.length === 0) return null;

    return (
      <div className="conversation-group">
        <div className="group-header">
          {title}
          <span className="group-count">{convs.length}</span>
        </div>
        {convs.map(conv => (
          <div
            key={conv.id}
            className={`advanced-conversation-item ${activeConversation?.id === conv.id ? 'active' : ''}`}
            onClick={() => switchConversation(conv.id)}
          >
            <div className="conversation-title-row">
              <div
                className="conversation-color-dot"
                style={{ background: conv.metadata?.color || '#667eea' }}
              />
              <div className="conversation-title">{conv.title}</div>
              <div className="conversation-actions">
                <button
                  className="action-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('Delete this conversation?')) {
                      deleteConversation(conv.id);
                    }
                  }}
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>
            <div className="conversation-preview">{getPreview(conv)}</div>
            <div className="conversation-meta-row">
              <span>{conv.metadata?.messageCount || 0} msgs</span>
              <span>•</span>
              <span>{formatTimestamp(conv.updatedAt)}</span>
              {conv.metadata?.tags && conv.metadata.tags.length > 0 && (
                <>
                  <span>•</span>
                  <div className="conversation-tags">
                    {conv.metadata.tags.map(tag => (
                      <span key={tag} className="conversation-tag">{tag}</span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="multi-conversation-layout">
      {/* Advanced Sidebar */}
      <div className={`advanced-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="advanced-header">
          <h2>🗂️ Conversations</h2>
          <p>Organize, search, and manage your chats</p>
        </div>

        <div className="sidebar-controls">
          <button className="new-conversation-btn" onClick={createConversation}>
            + New Conversation
          </button>
        </div>

        <div className="search-and-filter">
          <input
            type="text"
            className="search-input"
            placeholder="🔍 Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="filter-tabs">
            <button
              className={`filter-tab ${filterMode === 'all' ? 'active' : ''}`}
              onClick={() => setFilterMode('all')}
            >
              All
            </button>
            <button
              className={`filter-tab ${filterMode === 'today' ? 'active' : ''}`}
              onClick={() => setFilterMode('today')}
            >
              Today
            </button>
            <button
              className={`filter-tab ${filterMode === 'week' ? 'active' : ''}`}
              onClick={() => setFilterMode('week')}
            >
              Week
            </button>
            <button
              className={`filter-tab ${filterMode === 'month' ? 'active' : ''}`}
              onClick={() => setFilterMode('month')}
            >
              Month
            </button>
          </div>

          <div className="tag-filter">
            {AVAILABLE_TAGS.map(tag => (
              <span
                key={tag}
                className={`tag-chip ${selectedTags.includes(tag) ? 'selected' : ''}`}
                onClick={() => toggleTag(tag)}
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        <div className="conversations-scroll">
          {renderConversationGroup('Today', groupedConversations.today)}
          {renderConversationGroup('Yesterday', groupedConversations.yesterday)}
          {renderConversationGroup('This Week', groupedConversations.week)}
          {renderConversationGroup('Older', groupedConversations.older)}

          {filteredConversations.length === 0 && (
            <div className="empty-state">
              <p>No conversations found</p>
            </div>
          )}
        </div>

        <div className="sidebar-stats">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Conversations</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{stats.totalMessages}</div>
              <div className="stat-label">Messages</div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="multi-chat-area">
        {activeConversation ? (
          <>
            <div className="multi-chat-header">
              <button
                className="toggle-sidebar-btn"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              >
                {sidebarCollapsed ? '→' : '←'}
              </button>
              <div className="header-content">
                <h1>
                  <div
                    className="conversation-color-dot"
                    style={{ background: activeConversation.metadata?.color || '#667eea' }}
                  />
                  {activeConversation.title}
                </h1>
                <div className="conversation-info">
                  <span>{activeConversation.metadata?.messageCount || 0} messages</span>
                  {activeConversation.metadata?.totalTokens && (
                    <>
                      <span>•</span>
                      <span>{activeConversation.metadata.totalTokens} tokens</span>
                    </>
                  )}
                  <span>•</span>
                  <span>Updated {formatTimestamp(activeConversation.updatedAt)}</span>
                </div>
              </div>
              <div className="header-actions">
                <div style={{ position: 'relative' }}>
                  <button className="header-action-btn">
                    🎨 Color
                  </button>
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    display: 'none',
                    background: 'white',
                    padding: '8px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    marginTop: '4px',
                    gap: '4px',
                  }}>
                    {COLORS.map(color => (
                      <div
                        key={color}
                        onClick={() => handleSetColor(activeConversation.id, color)}
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: color,
                          cursor: 'pointer',
                        }}
                      />
                    ))}
                  </div>
                </div>
                <div style={{ position: 'relative' }}>
                  <button className="header-action-btn">
                    🏷️ Tags
                  </button>
                </div>
                <button className="header-action-btn" onClick={handleExport}>
                  📥 Export
                </button>
                <button className="header-action-btn" onClick={handleImport}>
                  📤 Import
                </button>
              </div>
            </div>

            <div className="multi-messages-container">
              {messages.length === 0 ? (
                <div className="empty-state">
                  <h2>Start the conversation</h2>
                  <p>Type a message below to begin</p>
                </div>
              ) : (
                messages.map(message => (
                  <div key={message.id} className={`multi-message ${message.role}`}>
                    <div className="multi-message-avatar">
                      {message.role === 'user' ? '👤' : '🤖'}
                    </div>
                    <div className="multi-message-content">
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                  </div>
                ))
              )}

              {isLoading && (
                <div className="multi-message assistant">
                  <div className="multi-message-avatar">🤖</div>
                  <div className="multi-message-content">
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <span>.</span><span>.</span><span>.</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="multi-input-area">
              <div className="multi-input-wrapper">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                />
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isLoading}
                >
                  {isLoading ? '...' : '↵'}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="empty-state">
            <h2>No conversation selected</h2>
            <p>Select a conversation from the sidebar or create a new one</p>
            <button onClick={createConversation}>Create Conversation</button>
          </div>
        )}

        <Link to="/" className="back-link">← Back to Home</Link>
      </div>
    </div>
  );
}

export default ChatMultiConversation;
