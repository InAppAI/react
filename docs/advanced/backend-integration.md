# Backend Integration

> Setting up your backend to work with InAppAI React

This guide shows you how to integrate InAppAI React with your backend. You can use the hosted InAppAI backend or build your own.

## Quick Start: Hosted Backend

The fastest way to get started is using the hosted InAppAI backend.

### 1. Get Your Agent ID

Sign up at [inappai.com](https://inappai.com) and create an agent. You'll receive:

- **Agent ID**: `agent-abc123`
- **API Endpoint**: `https://api.inappai.com/api`

### 2. Configure Frontend

```tsx
import { InAppAI } from '@inappai/react';

<InAppAI
  
  agentId="agent-abc123"  // Your agent ID
  messages={messages}
  onMessagesChange={setMessages}
/>
```

That's it! The hosted backend handles:
- AI API calls (OpenAI, Claude, etc.)
- Conversation management
- Rate limiting
- Error handling

## Custom Backend Integration

For full control, integrate with your own backend.

### Backend Requirements

Your backend must provide these endpoints:

```
GET  /{agentId}/health          - Health check
POST /{agentId}/chat            - Process chat messages
```

### Endpoint Specifications

#### Health Check Endpoint

```typescript
// GET /{agentId}/health

// Response
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Example (Express.js):**

```typescript
app.get('/:agentId/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});
```

#### Chat Endpoint

```typescript
// POST /{agentId}/chat

// Request body
{
  "message": "Hello, AI!",
  "conversationId": "conv-123",           // Optional
  "context": {                             // Optional
    "userId": "user-456",
    "page": "dashboard"
  },
  "tools": [                               // Optional
    {
      "type": "function",
      "function": {
        "name": "addTodo",
        "description": "Add a todo item",
        "parameters": {
          "type": "object",
          "properties": {
            "text": { "type": "string" }
          },
          "required": ["text"]
        }
      }
    }
  ]
}

// Response
{
  "message": "Hello! How can I help you?",
  "usage": {                               // Optional
    "promptTokens": 10,
    "completionTokens": 8,
    "totalTokens": 18
  }
}

// Or with tool calls
{
  "toolCalls": [
    {
      "id": "call_abc123",
      "type": "function",
      "function": {
        "name": "addTodo",
        "arguments": "{\"text\":\"Buy milk\"}"
      }
    }
  ]
}
```

### Full Backend Example (Node.js/Express)

```typescript
import express from 'express';
import cors from 'cors';
import { OpenAI } from 'openai';

const app = express();
app.use(express.json());
app.use(cors({
  origin: ['https://yourapp.com'],
  credentials: true,
}));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Store conversations in memory (use database in production)
const conversations = new Map<string, any[]>();

// Health check
app.get('/:agentId/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// Chat endpoint
app.post('/:agentId/chat', async (req, res) => {
  try {
    const { message, conversationId, context, tools } = req.body;
    const { agentId } = req.params;

    // Get or create conversation history
    const conversationKey = `${agentId}:${conversationId || 'default'}`;
    const history = conversations.get(conversationKey) || [];

    // Add user message to history
    history.push({
      role: 'user',
      content: message,
    });

    // Build system message with context
    const systemMessage = {
      role: 'system',
      content: `You are a helpful AI assistant. ${
        context ? `Context: ${JSON.stringify(context)}` : ''
      }`,
    };

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [systemMessage, ...history],
      tools: tools || undefined,
    });

    const assistantMessage = completion.choices[0].message;

    // Check for tool calls
    if (assistantMessage.tool_calls) {
      // Return tool calls for client-side execution
      res.json({
        toolCalls: assistantMessage.tool_calls,
      });
    } else {
      // Add assistant response to history
      history.push({
        role: 'assistant',
        content: assistantMessage.content,
      });

      // Update conversation history
      conversations.set(conversationKey, history);

      // Return response
      res.json({
        message: assistantMessage.content,
        usage: {
          promptTokens: completion.usage?.prompt_tokens || 0,
          completionTokens: completion.usage?.completion_tokens || 0,
          totalTokens: completion.usage?.total_tokens || 0,
        },
      });
    }
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      error: error.message || 'Internal server error',
    });
  }
});

app.listen(3001, () => {
  console.log('Backend running on http://localhost:3001');
});
```

### Environment Variables

Create a `.env` file:

```bash
# AI Provider
OPENAI_API_KEY=sk-...

# Server
PORT=3001
NODE_ENV=production

# Security
JWT_SECRET=your-secret-key
ALLOWED_ORIGINS=https://yourapp.com,https://www.yourapp.com
```

## Adding Authentication

Protect your endpoints with JWT authentication:

```typescript
import jwt from 'jsonwebtoken';

// Authentication middleware
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // Attach user to request
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Protected chat endpoint
app.post('/:agentId/chat', authenticate, async (req, res) => {
  const userId = req.user.id;  // From verified JWT

  // Use userId for conversation management
  const conversationKey = `${userId}:${req.params.agentId}`;
  // ... rest of chat logic
});
```

Frontend with auth:

```tsx
const { token } = useAuth();

<InAppAI
  endpoint="https://api.yourapp.com"
  agentId="your-agent-id"
  authToken={token}  // Sent as Authorization header
  messages={messages}
  onMessagesChange={setMessages}
/>
```

## Database Integration

Use a database for production conversation storage:

### PostgreSQL Example

```typescript
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create conversations table
await pool.query(`
  CREATE TABLE IF NOT EXISTS conversations (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    agent_id VARCHAR(255) NOT NULL,
    conversation_id VARCHAR(255) NOT NULL,
    messages JSONB NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, agent_id, conversation_id)
  )
`);

// Save conversation
async function saveConversation(userId, agentId, conversationId, messages) {
  await pool.query(
    `INSERT INTO conversations (user_id, agent_id, conversation_id, messages)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (user_id, agent_id, conversation_id)
     DO UPDATE SET messages = $4, updated_at = NOW()`,
    [userId, agentId, conversationId, JSON.stringify(messages)]
  );
}

// Load conversation
async function loadConversation(userId, agentId, conversationId) {
  const result = await pool.query(
    `SELECT messages FROM conversations
     WHERE user_id = $1 AND agent_id = $2 AND conversation_id = $3`,
    [userId, agentId, conversationId]
  );

  return result.rows[0]?.messages || [];
}

// Use in chat endpoint
app.post('/:agentId/chat', authenticate, async (req, res) => {
  const userId = req.user.id;
  const { agentId } = req.params;
  const { message, conversationId = 'default' } = req.body;

  // Load history
  const history = await loadConversation(userId, agentId, conversationId);

  // Add new message
  history.push({ role: 'user', content: message });

  // Get AI response
  // ...

  // Save updated history
  await saveConversation(userId, agentId, conversationId, history);

  res.json({ message: aiResponse });
});
```

### MongoDB Example

```typescript
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URL);
const db = client.db('chatapp');
const conversations = db.collection('conversations');

// Create index
await conversations.createIndex(
  { userId: 1, agentId: 1, conversationId: 1 },
  { unique: true }
);

// Save conversation
async function saveConversation(userId, agentId, conversationId, messages) {
  await conversations.updateOne(
    { userId, agentId, conversationId },
    {
      $set: {
        messages,
        updatedAt: new Date(),
      },
    },
    { upsert: true }
  );
}

// Load conversation
async function loadConversation(userId, agentId, conversationId) {
  const doc = await conversations.findOne({
    userId,
    agentId,
    conversationId,
  });

  return doc?.messages || [];
}
```

## Rate Limiting

Protect your backend from abuse:

```typescript
import rateLimit from 'express-rate-limit';

// Limit to 20 requests per minute per user
const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: 'Too many requests, please try again later',
  keyGenerator: (req) => req.user?.id || req.ip,
});

app.post('/:agentId/chat', authenticate, chatLimiter, chatHandler);
```

## Caching

Cache responses to reduce AI API costs:

```typescript
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 3600 });  // 1 hour

app.post('/:agentId/chat', async (req, res) => {
  const { message, context } = req.body;
  const cacheKey = `${message}:${JSON.stringify(context)}`;

  // Check cache
  const cached = cache.get(cacheKey);
  if (cached) {
    return res.json(cached);
  }

  // Get AI response
  const response = await getAIResponse(message, context);

  // Cache response
  cache.set(cacheKey, response);

  res.json(response);
});
```

## Error Handling

Handle errors gracefully:

```typescript
app.post('/:agentId/chat', async (req, res) => {
  try {
    const response = await openai.chat.completions.create({ ... });
    res.json({ message: response.choices[0].message.content });
  } catch (error) {
    console.error('OpenAI error:', error);

    // Rate limit error
    if (error.status === 429) {
      return res.status(429).json({
        error: 'Rate limit exceeded. Please try again later.',
      });
    }

    // Invalid request
    if (error.status === 400) {
      return res.status(400).json({
        error: 'Invalid request. Please check your input.',
      });
    }

    // Generic error
    res.status(500).json({
      error: 'An error occurred. Please try again.',
    });
  }
});
```

## Deployment

### Docker

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3001

CMD ["node", "server.js"]
```

Build and run:

```bash
docker build -t inappai-backend .
docker run -p 3001:3001 --env-file .env inappai-backend
```

### Cloud Platforms

#### Vercel

```bash
npm install -g vercel
vercel deploy
```

Add environment variables in Vercel dashboard.

#### Railway

```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

#### Heroku

```bash
heroku create
git push heroku main
heroku config:set OPENAI_API_KEY=sk-...
```

## Testing Your Backend

```bash
# Health check
curl http://localhost:3001/your-agent-id/health

# Chat request
curl -X POST http://localhost:3001/your-agent-id/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello!",
    "conversationId": "test-123"
  }'
```

## Monitoring

Track backend performance:

```typescript
import morgan from 'morgan';

// Request logging
app.use(morgan('combined'));

// Custom metrics
app.post('/:agentId/chat', async (req, res) => {
  const startTime = Date.now();

  try {
    const response = await getAIResponse(req.body);
    const duration = Date.now() - startTime;

    console.log('Chat request:', {
      duration,
      tokens: response.usage?.totalTokens,
      userId: req.user?.id,
    });

    res.json(response);
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error('Chat error:', { duration, error: error.message });
    res.status(500).json({ error: error.message });
  }
});
```

## Next Steps

- [Custom Backend](./custom-backend.md) - Build a full-featured backend
- [Security](./security.md) - Secure your backend
- [Architecture](./architecture.md) - Understand the architecture
