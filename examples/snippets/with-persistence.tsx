/**
 * Conversation Persistence Example
 *
 * Demonstrates both localStorage (development) and backend (production)
 * persistence patterns for saving conversations.
 *
 * @see https://github.com/InAppAI/react/docs/guides/persistence.md
 */

import { useState, useEffect } from 'react';
import { InAppAI, Message } from '@inappai/react';
import '@inappai/react/styles.css';

// ========================================
// Option 1: localStorage (Development/Demo)
// ========================================

function LocalStoragePersistence() {
  const conversationId = 'my-chat';
  const storageKey = `conversation_${conversationId}`;

  // Load messages from localStorage on mount
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  });

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(messages));
  }, [messages, storageKey]);

  return (
    <div>
      <h1>Chat with localStorage Persistence</h1>
      <p>Messages will survive page refresh (browser-specific)</p>

      <InAppAI
        agentId="your-agent-id"
        conversationId={conversationId}
        messages={messages}
        onMessagesChange={setMessages}
      />
    </div>
  );
}

// ========================================
// Option 2: Backend Persistence (Production)
// ========================================

// Mock API for demonstration
const api = {
  async getOrCreateConversation(userId: string) {
    // In production: fetch from your backend
    const response = await fetch(`/api/users/${userId}/conversation`);
    return await response.json();
    // Returns: { id: string, messages: Message[] }
  },

  async saveMessages(userId: string, conversationId: string, messages: Message[]) {
    // In production: save to your backend
    await fetch(`/api/users/${userId}/conversations/${conversationId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    });
  },
};

function BackendPersistence() {
  const userId = 'user-123'; // From your auth system
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Load conversation from backend on mount
  useEffect(() => {
    async function loadConversation() {
      try {
        const { id, messages } = await api.getOrCreateConversation(userId);
        setConversationId(id);
        setMessages(messages);
      } catch (error) {
        console.error('Failed to load conversation:', error);
      } finally {
        setLoading(false);
      }
    }

    loadConversation();
  }, [userId]);

  // Save messages to backend when they change
  const handleMessagesChange = async (newMessages: Message[]) => {
    setMessages(newMessages);

    try {
      await api.saveMessages(userId, conversationId, newMessages);
    } catch (error) {
      console.error('Failed to save messages:', error);
      // Optionally: show error to user, retry logic, etc.
    }
  };

  if (loading) {
    return <div>Loading conversation...</div>;
  }

  return (
    <div>
      <h1>Chat with Backend Persistence</h1>
      <p>Messages synced to your backend (works across devices)</p>

      <InAppAI
        agentId="your-agent-id"
        conversationId={conversationId}
        messages={messages}
        onMessagesChange={handleMessagesChange}
      />
    </div>
  );
}

// ========================================
// Option 3: Hybrid (localStorage + Backend Sync)
// ========================================

function HybridPersistence() {
  const userId = 'user-123';
  const conversationId = 'my-chat';
  const storageKey = `conversation_${userId}_${conversationId}`;

  // Load from localStorage first (instant)
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  });

  // Sync with backend on mount
  useEffect(() => {
    async function syncWithBackend() {
      try {
        const { messages: serverMessages } = await api.getOrCreateConversation(userId);
        // Use server messages if they're more recent
        if (serverMessages.length > messages.length) {
          setMessages(serverMessages);
          localStorage.setItem(storageKey, JSON.stringify(serverMessages));
        }
      } catch (error) {
        console.error('Sync failed:', error);
      }
    }

    syncWithBackend();
  }, [userId]);

  // Save to both localStorage and backend
  const handleMessagesChange = async (newMessages: Message[]) => {
    setMessages(newMessages);

    // Immediate: save to localStorage
    localStorage.setItem(storageKey, JSON.stringify(newMessages));

    // Background: sync to backend
    try {
      await api.saveMessages(userId, conversationId, newMessages);
    } catch (error) {
      console.error('Backend sync failed:', error);
      // Messages still saved locally
    }
  };

  return (
    <div>
      <h1>Chat with Hybrid Persistence</h1>
      <p>Instant localStorage + backend sync</p>

      <InAppAI
        agentId="your-agent-id"
        conversationId={conversationId}
        messages={messages}
        onMessagesChange={handleMessagesChange}
      />
    </div>
  );
}

// Export the pattern you want to use
export default BackendPersistence; // Recommended for production
// export default LocalStoragePersistence; // For development/demos
// export default HybridPersistence; // For best UX
