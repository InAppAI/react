# Authentication

> Identify users and secure your AI assistant

**Authentication** allows you to identify users, personalize responses, and secure access to your AI assistant. InAppAI supports JWT (JSON Web Token) authentication for production use cases.

## Overview

Authentication in InAppAI React enables:

- **User Identification** - Know who's chatting with the AI
- **Personalized Responses** - AI can reference user-specific data
- **Access Control** - Restrict AI features to authenticated users
- **Usage Tracking** - Monitor usage per user
- **Conversation Persistence** - Save conversations per user

## Authentication Flow

```
1. User logs in to your app → Your auth system issues JWT
2. Pass JWT to InAppAI component → Component sends it with each request
3. Backend verifies JWT → Extracts user identity
4. Backend uses user context → Personalizes AI responses
```

## Quick Example

```tsx
import { InAppAI, Message } from '@inappai/react';
import { useState } from 'react';
import { useAuth } from './auth'; // Your auth system

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const { user, token } = useAuth(); // Get JWT from your auth

  if (!user) {
    return <div>Please log in</div>;
  }

  return (
    <InAppAI
      
      agentId="your-agent-id"
      messages={messages}
      onMessagesChange={setMessages}

      // Pass authentication token
      authToken={token}

      // Pass user context
      context={{
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        userRole: user.role,
      }}
    />
  );
}
```

## Using JWT Authentication

### 1. Generate JWT in Your Backend

When a user logs in, your backend should generate a JWT:

```typescript
// Backend: Generate JWT (Node.js example)
import jwt from 'jsonwebtoken';

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  // Verify credentials
  const user = await authenticateUser(email, password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Generate JWT
  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({ token, user });
});
```

### 2. Store JWT in Frontend

Store the JWT securely in your frontend:

```tsx
// Using React Context for auth state
import { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const { token, user } = await response.json();

    setToken(token);
    setUser(user);

    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
```

### 3. Pass JWT to InAppAI

```tsx
import { InAppAI, Message } from '@inappai/react';
import { useState } from 'react';
import { useAuth } from './auth';

function ChatApp() {
  const [messages, setMessages] = useState<Message[]>([]);
  const { user, token } = useAuth();

  return (
    <InAppAI
      
      agentId="your-agent-id"
      messages={messages}
      onMessagesChange={setMessages}
      authToken={token} // JWT sent with each request
      context={{
        userId: user.id,
        userName: user.name,
      }}
    />
  );
}
```

### 4. Verify JWT in Backend

Your InAppAI backend should verify the JWT:

```typescript
// Backend: Verify JWT middleware
import jwt from 'jsonwebtoken';

app.use('/api/chat', (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user to request
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
});
```

## User-Specific Features

Once authenticated, you can implement user-specific features:

### User-Specific Conversations

```tsx
function UserChat() {
  const { user, token } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);

  // Load user's conversation from backend
  useEffect(() => {
    async function loadConversation() {
      const response = await fetch(`/api/users/${user.id}/conversation`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { messages } = await response.json();
      setMessages(messages);
    }
    loadConversation();
  }, [user.id, token]);

  // Save to user-specific conversation
  const handleMessagesChange = async (newMessages: Message[]) => {
    setMessages(newMessages);

    await fetch(`/api/users/${user.id}/conversation`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ messages: newMessages }),
    });
  };

  return (
    <InAppAI
      
      agentId="your-agent-id"
      authToken={token}
      conversationId={`user_${user.id}`}
      messages={messages}
      onMessagesChange={handleMessagesChange}
    />
  );
}
```

### Role-Based Features

```tsx
function RoleBasedChat() {
  const { user, token } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);

  // Different tools for different roles
  const tools = user.role === 'admin' ? adminTools : userTools;

  return (
    <InAppAI
      
      agentId="your-agent-id"
      authToken={token}
      messages={messages}
      onMessagesChange={setMessages}
      tools={tools} // Role-specific tools
      context={{
        userId: user.id,
        userRole: user.role,
        permissions: user.permissions,
      }}
    />
  );
}
```

### Usage Limits per User

```tsx
function LimitedChat() {
  const { user, token } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [usage, setUsage] = useState({ count: 0, limit: 100 });

  // Check usage before allowing chat
  useEffect(() => {
    async function checkUsage() {
      const response = await fetch(`/api/users/${user.id}/usage`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setUsage(data);
    }
    checkUsage();
  }, [user.id, token]);

  if (usage.count >= usage.limit) {
    return <div>You've reached your monthly limit. Upgrade to continue.</div>;
  }

  return (
    <InAppAI
      
      agentId="your-agent-id"
      authToken={token}
      messages={messages}
      onMessagesChange={setMessages}
      onMessageReceived={(message) => {
        // Track token usage
        if (message.usage) {
          setUsage(prev => ({
            ...prev,
            count: prev.count + message.usage.totalTokens,
          }));
        }
      }}
    />
  );
}
```

## Security Best Practices

### 1. Never Expose Secrets in Frontend

```tsx
// ❌ NEVER do this
<InAppAI
  apiKey="sk_live_abc123"  // Exposed in browser!
/>

// ✅ Always use backend
<InAppAI
    // Backend handles API key
  authToken={token}  // User-specific JWT only
/>
```

### 2. Set Token Expiration

```typescript
// Backend: Short-lived tokens
const token = jwt.sign(payload, secret, {
  expiresIn: '1h', // Expire after 1 hour
});
```

### 3. Refresh Tokens

Implement token refresh for long sessions:

```tsx
const { token, refreshToken } = useAuth();

// Refresh before expiry
useEffect(() => {
  const interval = setInterval(async () => {
    const newToken = await refreshToken();
    setToken(newToken);
  }, 50 * 60 * 1000); // Refresh every 50 minutes

  return () => clearInterval(interval);
}, []);
```

### 4. Validate on Backend

Always validate user identity on the backend:

```typescript
// Backend: Don't trust client context
app.post('/api/chat', authenticate, async (req, res) => {
  const userId = req.user.id; // From verified JWT

  // ❌ Don't use client-provided userId
  // const userId = req.body.context.userId;

  const conversation = await getConversation(userId);
  // ...
});
```

### 5. Use HTTPS

Always use HTTPS in production to protect tokens:

```tsx
<InAppAI
    // ✅ HTTPS
  // endpoint="http://api.inappai.com/api"  // ❌ Insecure
/>
```

## Anonymous vs Authenticated

Support both anonymous and authenticated users:

```tsx
function FlexibleChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const { user, token } = useAuth();

  // Generate session ID for anonymous users
  const [sessionId] = useState(() => `anon_${Date.now()}_${Math.random()}`);

  return (
    <InAppAI
      
      agentId="your-agent-id"
      messages={messages}
      onMessagesChange={setMessages}

      // Use token if authenticated, otherwise null
      authToken={token || undefined}

      // Different context for auth vs anonymous
      context={user ? {
        userId: user.id,
        userName: user.name,
        authenticated: true,
      } : {
        sessionId: sessionId,
        authenticated: false,
      }}
    />
  );
}
```

## Examples

### Enterprise SaaS

```tsx
function EnterpriseDashboard() {
  const { user, token } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);

  return (
    <InAppAI
      endpoint="https://api.yourcompany.com/ai"
      agentId="enterprise-assistant"
      authToken={token}
      messages={messages}
      onMessagesChange={setMessages}
      context={{
        userId: user.id,
        organizationId: user.organizationId,
        role: user.role,
        permissions: user.permissions,
        subscription: user.subscription,
      }}
    />
  );
}
```

### Multi-Tenant App

```tsx
function TenantChat() {
  const { user, token, tenant } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);

  return (
    <InAppAI
      endpoint={`https://${tenant.subdomain}.yourapp.com/api`}
      agentId={tenant.agentId}
      authToken={token}
      messages={messages}
      onMessagesChange={setMessages}
      context={{
        userId: user.id,
        tenantId: tenant.id,
        tenantName: tenant.name,
      }}
    />
  );
}
```

## Testing Authentication

For development, you can use mock authentication:

```tsx
// Development only
const mockAuth = {
  user: { id: 'dev-user', name: 'Developer', role: 'admin' },
  token: 'dev-token-123',
};

function DevApp() {
  const [messages, setMessages] = useState<Message[]>([]);

  return (
    <InAppAI
      endpoint="http://localhost:3000/api"
      agentId="dev-agent"
      authToken={mockAuth.token}
      messages={messages}
      onMessagesChange={setMessages}
    />
  );
}
```

## Next Steps

- [Context Passing](./context.md) - Send user-specific context
- [Conversation Persistence](./persistence.md) - Save per-user conversations
- [Security Best Practices](../advanced/security.md) - Comprehensive security guide
- [Backend Integration](../advanced/backend-integration.md) - Set up authentication backend
