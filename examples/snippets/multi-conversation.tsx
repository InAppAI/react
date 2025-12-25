/**
 * Multi-Conversation Chat Example
 *
 * ChatGPT-style interface with multiple conversations.
 * Users can create, switch, and manage multiple chat sessions.
 *
 * @see https://github.com/InAppAI/react/docs/examples/multi-conversation.md
 */

import { useState } from 'react';
import { InAppAI, Message } from '@inappai/react';
import '@inappai/react/styles.css';

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
}

function MultiConversationApp() {
  // Manage multiple conversations
  const [conversations, setConversations] = useState<Conversation[]>([
    { id: '1', title: 'General Chat', messages: [] },
    { id: '2', title: 'Support Question', messages: [] },
  ]);

  const [activeConversationId, setActiveConversationId] = useState('1');

  // Get active conversation
  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const messages = activeConversation?.messages || [];

  // Update messages for active conversation
  const setMessages = (newMessages: Message[]) => {
    setConversations(prev => prev.map(conv =>
      conv.id === activeConversationId
        ? { ...conv, messages: newMessages }
        : conv
    ));
  };

  // Create new conversation
  const createConversation = () => {
    const newConv: Conversation = {
      id: Date.now().toString(),
      title: `Chat ${conversations.length + 1}`,
      messages: [],
    };
    setConversations(prev => [...prev, newConv]);
    setActiveConversationId(newConv.id);
  };

  // Delete conversation
  const deleteConversation = (id: string) => {
    if (conversations.length === 1) return; // Keep at least one

    setConversations(prev => prev.filter(c => c.id !== id));

    // Switch to another conversation if deleting active one
    if (id === activeConversationId) {
      const remaining = conversations.filter(c => c.id !== id);
      setActiveConversationId(remaining[0]?.id || '');
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Conversation List Sidebar */}
      <aside style={{
        width: '280px',
        borderRight: '1px solid #ddd',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #ddd' }}>
          <button
            onClick={createConversation}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            + New Chat
          </button>
        </div>

        {/* Conversation List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
          {conversations.map(conv => (
            <div
              key={conv.id}
              style={{
                padding: '12px',
                marginBottom: '8px',
                backgroundColor: conv.id === activeConversationId ? '#f0f0f0' : 'transparent',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
              onClick={() => setActiveConversationId(conv.id)}
            >
              <span>{conv.title}</span>
              {conversations.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteConversation(conv.id);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '18px',
                  }}
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      </aside>

      {/* Chat Area */}
      <main style={{ flex: 1 }}>
        <InAppAI
          agentId="your-agent-id"
          conversationId={activeConversationId}  // Important: track which conversation
          messages={messages}
          onMessagesChange={setMessages}

          displayMode="embedded"
          showHeader={false}
          theme="light"

          context={{
            conversationTitle: activeConversation?.title,
            conversationCount: conversations.length,
          }}
        />
      </main>
    </div>
  );
}

export default MultiConversationApp;
