# Conversation Persistence

> Save and restore conversations across sessions

**Persistence** enables you to save conversations so users can continue where they left off. InAppAI React uses **controlled mode**, giving you complete control over how and where messages are stored.

## Overview

InAppAI React requires you to manage message state (controlled mode). This design gives you flexibility to implement persistence however you need:

- **localStorage** - Simple browser storage (development/demos)
- **Backend API** - Production-grade persistence (recommended)
- **Hybrid** - localStorage + backend sync (best UX)

## Quick Example

```tsx
import { useState, useEffect } from 'react';
import { InAppAI, Message } from '@inappai/react';

function App() {
  const conversationId = 'my-chat';
  const storageKey = `conversation_${conversationId}`;

  // Load from localStorage
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage when messages change
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(messages));
  }, [messages]);

  return (
    <InAppAI
      
      agentId="your-agent-id"
      conversationId={conversationId}
      messages={messages}
      onMessagesChange={setMessages}
    />
  );
}
```

Now conversations persist across page refreshes!

## Persistence Patterns

### Pattern 1: localStorage (Development)

**Best for**: Development, demos, prototypes

**Pros**: Simple, no backend needed
**Cons**: Browser-specific, not synced across devices

```tsx
import { useState, useEffect } from 'react';
import { InAppAI, Message } from '@inappai/react';

function LocalStoragePersistence() {
  const conversationId = 'my-chat';
  const storageKey = `conversation_${conversationId}`;

  // Initialize from localStorage
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  });

  // Auto-save on changes
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(messages));
  }, [messages, storageKey]);

  return (
    <InAppAI
      
      agentId="your-agent-id"
      conversationId={conversationId}
      messages={messages}
      onMessagesChange={setMessages}
    />
  );
}
```

### Pattern 2: Backend API (Production)

**Best for**: Production apps, multi-device access

**Pros**: Synced across devices, secure, scalable
**Cons**: Requires backend implementation

```tsx
import { useState, useEffect } from 'react';
import { InAppAI, Message } from '@inappai/react';

// Your API client
const api = {
  async getConversation(userId: string, conversationId: string) {
    const response = await fetch(
      `/api/users/${userId}/conversations/${conversationId}`
    );
    if (response.status === 404) {
      return { id: conversationId, messages: [] };
    }
    return await response.json();
  },

  async saveMessages(
    userId: string,
    conversationId: string,
    messages: Message[]
  ) {
    await fetch(`/api/users/${userId}/conversations/${conversationId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    });
  },
};

function BackendPersistence() {
  const userId = 'user-123'; // From your auth system
  const conversationId = 'support-chat';

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  // Load from backend on mount
  useEffect(() => {
    async function load() {
      try {
        const { messages } = await api.getConversation(userId, conversationId);
        setMessages(messages);
      } catch (error) {
        console.error('Failed to load conversation:', error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [userId, conversationId]);

  // Save to backend when messages change
  const handleMessagesChange = async (newMessages: Message[]) => {
    setMessages(newMessages);

    try {
      await api.saveMessages(userId, conversationId, newMessages);
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  if (loading) return <div>Loading conversation...</div>;

  return (
    <InAppAI
      
      agentId="your-agent-id"
      conversationId={conversationId}
      messages={messages}
      onMessagesChange={handleMessagesChange}
    />
  );
}
```

### Pattern 3: Hybrid (Best UX)

**Best for**: Production apps needing instant UX

**Pros**: Instant load + cross-device sync
**Cons**: More complex implementation

```tsx
import { useState, useEffect } from 'react';
import { InAppAI, Message } from '@inappai/react';

function HybridPersistence() {
  const userId = 'user-123';
  const conversationId = 'my-chat';
  const storageKey = `conversation_${userId}_${conversationId}`;

  // Load from localStorage immediately (instant)
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  });

  // Sync with backend on mount
  useEffect(() => {
    async function sync() {
      try {
        const { messages: serverMessages } = await api.getConversation(
          userId,
          conversationId
        );

        // Use server messages if newer
        if (serverMessages.length > messages.length) {
          setMessages(serverMessages);
          localStorage.setItem(storageKey, JSON.stringify(serverMessages));
        }
      } catch (error) {
        console.error('Sync failed:', error);
      }
    }
    sync();
  }, [userId, conversationId]);

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
    <InAppAI
      
      agentId="your-agent-id"
      conversationId={conversationId}
      messages={messages}
      onMessagesChange={handleMessagesChange}
    />
  );
}
```

## Conversation IDs

The `conversationId` prop helps the backend associate messages with a specific conversation:

```tsx
<InAppAI
  conversationId={conversationId}  // Sent to backend with each message
  messages={messages}
  onMessagesChange={setMessages}
/>
```

### Conversation ID Patterns

#### Single Conversation per User

```tsx
const conversationId = `user_${userId}`;
```

#### Multiple Conversations

```tsx
const conversationId = `user_${userId}_chat_${chatId}`;
```

#### Support Tickets

```tsx
const conversationId = `ticket_${ticketId}`;
```

#### Anonymous Sessions

```tsx
const [conversationId] = useState(() => `session_${Date.now()}_${Math.random()}`);
```

## Multi-Conversation Management

For apps like ChatGPT with multiple conversation threads:

```tsx
import { useState } from 'react';
import { InAppAI, Message } from '@inappai/react';

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: Date;
}

function MultiConversationApp() {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 'conv-1',
      title: 'Getting Started',
      messages: [],
      updatedAt: new Date(),
    },
  ]);
  const [activeId, setActiveId] = useState('conv-1');

  const activeConversation = conversations.find(c => c.id === activeId)!;

  const handleMessagesChange = (messages: Message[]) => {
    setConversations(prev =>
      prev.map(conv =>
        conv.id === activeId
          ? { ...conv, messages, updatedAt: new Date() }
          : conv
      )
    );

    // Save to backend
    saveConversation(activeId, messages);
  };

  const createNewConversation = () => {
    const newConv: Conversation = {
      id: `conv-${Date.now()}`,
      title: 'New Chat',
      messages: [],
      updatedAt: new Date(),
    };
    setConversations([...conversations, newConv]);
    setActiveId(newConv.id);
  };

  return (
    <div className="app">
      {/* Conversation List */}
      <aside className="conversation-list">
        <button onClick={createNewConversation}>+ New Chat</button>
        {conversations.map(conv => (
          <div
            key={conv.id}
            className={activeId === conv.id ? 'active' : ''}
            onClick={() => setActiveId(conv.id)}
          >
            {conv.title} ({conv.messages.length})
          </div>
        ))}
      </aside>

      {/* Active Chat */}
      <main>
        <InAppAI
          
          agentId="your-agent-id"
          conversationId={activeId}
          messages={activeConversation.messages}
          onMessagesChange={handleMessagesChange}
          displayMode="embedded"
        />
      </main>
    </div>
  );
}
```

See the complete [Multi-Conversation Example](../../examples/snippets/multi-conversation.tsx).

## Best Practices

### 1. Handle Loading States

Show loading UI while fetching messages:

```tsx
if (loading) {
  return <div>Loading conversation...</div>;
}
```

### 2. Handle Errors Gracefully

```tsx
const handleMessagesChange = async (newMessages: Message[]) => {
  setMessages(newMessages);

  try {
    await api.saveMessages(userId, conversationId, newMessages);
  } catch (error) {
    console.error('Save failed:', error);
    // Show error notification to user
    showNotification('Failed to save message. Retrying...');
    // Implement retry logic
  }
};
```

### 3. Debounce Backend Saves

For frequent updates, debounce backend saves:

```tsx
import { useCallback } from 'react';
import debounce from 'lodash/debounce';

const debouncedSave = useCallback(
  debounce((messages: Message[]) => {
    api.saveMessages(userId, conversationId, messages);
  }, 1000),
  [userId, conversationId]
);

const handleMessagesChange = (newMessages: Message[]) => {
  setMessages(newMessages);
  localStorage.setItem(storageKey, JSON.stringify(newMessages));
  debouncedSave(newMessages);
};
```

### 4. Clean Up Old Conversations

Remove old conversations periodically:

```tsx
// Delete conversations older than 30 days
const cleanupOldConversations = () => {
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('conversation_')) {
      const data = JSON.parse(localStorage.getItem(key)!);
      const lastMessage = data[data.length - 1];
      if (lastMessage?.timestamp < thirtyDaysAgo) {
        localStorage.removeItem(key);
      }
    }
  });
};
```

### 5. Validate Data on Load

Always validate loaded data:

```tsx
const [messages, setMessages] = useState<Message[]>(() => {
  try {
    const saved = localStorage.getItem(storageKey);
    if (!saved) return [];

    const parsed = JSON.parse(saved);

    // Validate structure
    if (!Array.isArray(parsed)) return [];

    // Validate each message
    return parsed.filter(msg =>
      msg.id && msg.role && msg.content
    );
  } catch (error) {
    console.error('Failed to load messages:', error);
    return [];
  }
});
```

## Backend Implementation

Here's a simple Express.js backend example:

```typescript
// Backend API (Node.js/Express)
import express from 'express';

const app = express();
app.use(express.json());

// In-memory store (use database in production)
const conversations = new Map<string, Message[]>();

// Get conversation
app.get('/api/users/:userId/conversations/:conversationId', (req, res) => {
  const { userId, conversationId } = req.params;
  const key = `${userId}:${conversationId}`;

  const messages = conversations.get(key) || [];
  res.json({ id: conversationId, messages });
});

// Save conversation
app.put('/api/users/:userId/conversations/:conversationId', (req, res) => {
  const { userId, conversationId } = req.params;
  const { messages } = req.body;
  const key = `${userId}:${conversationId}`;

  conversations.set(key, messages);
  res.json({ success: true });
});
```

For production, use a database like PostgreSQL, MongoDB, or Firebase.

## Examples

Complete persistence implementations:

- [localStorage Persistence](../../examples/snippets/with-persistence.tsx) - All three patterns
- [Multi-Conversation](../../examples/snippets/multi-conversation.tsx) - ChatGPT-style interface

## Next Steps

- [Authentication](./authentication.md) - Secure user-specific persistence
- [Backend Integration](../advanced/backend-integration.md) - Set up your backend
- [Multi-Conversation Example](../examples/multi-conversation.md) - Multiple chat threads
