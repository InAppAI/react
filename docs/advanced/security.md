# Security

> Security best practices and architecture

This guide covers security considerations when building with InAppAI React, helping you create secure AI-powered applications.

## Security Model

InAppAI React uses a **backend-first security model**:

```
┌──────────────────────────────┐
│      Browser (Public)        │
│                              │
│  • No API keys               │
│  • No secrets                │
│  • JWT auth only             │
│  • Tool handlers run here    │
└──────────────┬───────────────┘
               │ HTTPS
               ↓
┌──────────────────────────────┐
│    Backend (Protected)       │
│                              │
│  • API keys stored           │
│  • Validates all requests    │
│  • Rate limiting             │
│  • User authentication       │
└──────────────┬───────────────┘
               │ API Key
               ↓
┌──────────────────────────────┐
│      AI Provider API         │
└──────────────────────────────┘
```

## Never Expose API Keys

### ❌ Wrong: API Keys in Client

```tsx
// NEVER DO THIS - API key exposed in browser!
<InAppAI
  apiKey="sk_live_abc123..."  // ❌ Leaked to users!
/>
```

Anyone can:
- View source code
- Steal your API key
- Run up your bill
- Access your AI account

### ✅ Correct: Backend Proxy

```tsx
// Frontend - No API keys
<InAppAI
  endpoint="https://api.yourapp.com"  // ✅ Your backend
  agentId="your-agent-id"
/>
```

```typescript
// Backend - API key stored securely
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,  // ✅ Server-side only
});

app.post('/api/chat', async (req, res) => {
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: req.body.messages,
  });

  res.json(response);
});
```

## Authentication

### JWT-Based Authentication

Use JWT tokens to identify users:

```tsx
// Frontend
import { useAuth } from './auth';

function App() {
  const { user, token } = useAuth();  // Your auth system

  if (!user) {
    return <LoginPage />;
  }

  return (
    <InAppAI
      endpoint="https://api.yourapp.com"
      agentId="your-agent-id"
      authToken={token}  // JWT sent to backend
      context={{
        userId: user.id,
        userName: user.name,
      }}
    />
  );
}
```

```typescript
// Backend - Verify JWT
import jwt from 'jsonwebtoken';

app.use('/api/chat', (req, res, next) => {
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
});
```

### Token Best Practices

1. **Use Short Expiration**

```typescript
// Generate token with 1-hour expiration
const token = jwt.sign(
  { userId: user.id },
  process.env.JWT_SECRET,
  { expiresIn: '1h' }
);
```

2. **Implement Refresh Tokens**

```tsx
// Frontend - Auto-refresh before expiry
useEffect(() => {
  const refreshInterval = setInterval(async () => {
    const newToken = await refreshAccessToken();
    setToken(newToken);
  }, 50 * 60 * 1000);  // Refresh every 50 min (before 1-hour expiry)

  return () => clearInterval(refreshInterval);
}, []);
```

3. **Rotate Secrets**

```bash
# Regularly rotate JWT secrets
JWT_SECRET=new-secret-value
```

## Context Security

### Sanitize User Context

Never trust user-provided context:

```tsx
// ❌ Dangerous - unsanitized user input
context={{
  userName: userInput,  // Could contain malicious code
  query: searchQuery,   // Could be XSS vector
}}

// ✅ Safe - sanitized input
import DOMPurify from 'dompurify';

context={{
  userName: DOMPurify.sanitize(userInput),
  query: DOMPurify.sanitize(searchQuery),
}}
```

### Avoid Sensitive Data

Don't send sensitive data in context:

```tsx
// ❌ Bad - sensitive data exposed
context={{
  user: {
    id: user.id,
    email: user.email,
    password: user.password,      // ❌ Never send
    creditCard: user.creditCard,  // ❌ Never send
    ssn: user.ssn,                // ❌ Never send
  },
}}

// ✅ Good - minimal, non-sensitive data
context={{
  userId: user.id,
  userName: user.name,
  userRole: user.role,
}}
```

### Backend Validation

Always validate context on the backend:

```typescript
app.post('/api/chat', authenticate, (req, res) => {
  const { context } = req.body;

  // ❌ Don't trust client context for permissions
  // if (context.userId === 'admin') { ... }

  // ✅ Use verified user from JWT
  const userId = req.user.id;  // From verified JWT
  const isAdmin = await checkAdminStatus(userId);

  if (isAdmin) {
    // Grant admin features
  }
});
```

## Tool Security

### Validate Tool Parameters

```tsx
const tools: Tool[] = [
  {
    name: 'deleteAccount',
    description: 'Delete user account',
    parameters: {
      type: 'object',
      properties: {
        userId: { type: 'string' },
      },
      required: ['userId'],
    },
    handler: async ({ userId }) => {
      // ❌ Dangerous - no validation
      // await deleteUser(userId);

      // ✅ Safe - verify ownership
      const currentUser = await getCurrentUser();
      if (userId !== currentUser.id) {
        return { success: false, error: 'Unauthorized' };
      }

      await deleteUser(userId);
      return { success: true };
    },
  },
];
```

### Rate Limit Tools

Prevent abuse by rate-limiting tool calls:

```tsx
const toolCallCounts = new Map();

const tools: Tool[] = [
  {
    name: 'sendEmail',
    handler: async ({ to, body }) => {
      const userId = getCurrentUserId();
      const count = toolCallCounts.get(userId) || 0;

      // Max 10 emails per hour
      if (count >= 10) {
        return { success: false, error: 'Rate limit exceeded' };
      }

      await sendEmail(to, body);
      toolCallCounts.set(userId, count + 1);

      // Reset after 1 hour
      setTimeout(() => toolCallCounts.delete(userId), 60 * 60 * 1000);

      return { success: true };
    },
  },
];
```

### Sanitize Tool Results

Clean tool results before sending to AI:

```tsx
{
  name: 'searchUsers',
  handler: async ({ query }) => {
    const users = await searchUsers(query);

    // ❌ Don't return sensitive fields
    // return { success: true, users };

    // ✅ Return only public fields
    return {
      success: true,
      users: users.map(u => ({
        id: u.id,
        name: u.name,
        // Omit: email, password, ssn, etc.
      })),
    };
  },
}
```

## HTTPS Requirements

### Always Use HTTPS in Production

```tsx
// ✅ Production - HTTPS only
<InAppAI endpoint="https://api.yourapp.com" />

// ⚠️ Development only - HTTP acceptable
<InAppAI endpoint="http://localhost:3001" />
```

### Enforce HTTPS on Backend

```typescript
// Express.js middleware
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' && !req.secure) {
    return res.redirect('https://' + req.headers.host + req.url);
  }
  next();
});
```

### HSTS Headers

```typescript
import helmet from 'helmet';

app.use(helmet.hsts({
  maxAge: 31536000,  // 1 year
  includeSubDomains: true,
  preload: true,
}));
```

## CORS Configuration

### Restrict Origins

```typescript
import cors from 'cors';

// ❌ Dangerous - allows all origins
app.use(cors({ origin: '*' }));

// ✅ Safe - specific origins only
app.use(cors({
  origin: [
    'https://yourapp.com',
    'https://www.yourapp.com',
  ],
  credentials: true,
}));
```

### Handle Preflight Requests

```typescript
app.options('/api/chat', cors());  // Enable preflight
app.post('/api/chat', cors(), chatHandler);
```

## Input Validation

### Sanitize User Messages

```typescript
import DOMPurify from 'isomorphic-dompurify';

app.post('/api/chat', (req, res) => {
  const { message } = req.body;

  // Sanitize user input
  const cleanMessage = DOMPurify.sanitize(message, {
    ALLOWED_TAGS: [],  // Strip all HTML
  });

  // Validate length
  if (cleanMessage.length > 5000) {
    return res.status(400).json({ error: 'Message too long' });
  }

  // Process clean message
  const response = await getAIResponse(cleanMessage);
  res.json(response);
});
```

### Validate Request Structure

```typescript
import Joi from 'joi';

const chatSchema = Joi.object({
  message: Joi.string().required().max(5000),
  conversationId: Joi.string().optional(),
  context: Joi.object().optional(),
  tools: Joi.array().optional(),
});

app.post('/api/chat', (req, res) => {
  const { error } = chatSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  // Process valid request
});
```

## Rate Limiting

### Backend Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';

// Limit to 20 requests per minute per user
const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user.id,  // Rate limit per user
});

app.post('/api/chat', authenticate, chatLimiter, chatHandler);
```

### Token Usage Limits

```typescript
const userTokenUsage = new Map();

app.post('/api/chat', authenticate, async (req, res) => {
  const userId = req.user.id;
  const usage = userTokenUsage.get(userId) || 0;

  // Max 100k tokens per day
  if (usage >= 100000) {
    return res.status(429).json({
      error: 'Daily token limit exceeded',
    });
  }

  const response = await getAIResponse(req.body);

  // Track usage
  const tokensUsed = response.usage.total_tokens;
  userTokenUsage.set(userId, usage + tokensUsed);

  res.json(response);
});
```

## XSS Prevention

InAppAI React uses `react-markdown` which sanitizes by default. However:

### Additional XSS Protection

```tsx
// Install DOMPurify
npm install dompurify isomorphic-dompurify

// Sanitize message content before storing
import DOMPurify from 'isomorphic-dompurify';

const handleMessagesChange = (newMessages: Message[]) => {
  const sanitizedMessages = newMessages.map(msg => ({
    ...msg,
    content: DOMPurify.sanitize(msg.content),
  }));

  setMessages(sanitizedMessages);
};
```

### CSP Headers

```typescript
import helmet from 'helmet';

app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"],  // Required for inline styles
    imgSrc: ["'self'", 'data:', 'https:'],
    connectSrc: ["'self'", 'https://api.yourapp.com'],
  },
}));
```

## Data Privacy

### GDPR Compliance

```tsx
// Allow users to delete their data
const tools: Tool[] = [
  {
    name: 'deleteMyData',
    description: 'Delete all my conversation history',
    parameters: { type: 'object', properties: {}, required: [] },
    handler: async () => {
      const userId = getCurrentUserId();

      // Delete from localStorage
      localStorage.removeItem(`conversation_${userId}`);

      // Delete from backend
      await fetch(`/api/users/${userId}/conversations`, {
        method: 'DELETE',
      });

      return { success: true };
    },
  },
];
```

### Data Retention

```typescript
// Backend - Auto-delete old conversations
import cron from 'node-cron';

// Run daily at midnight
cron.schedule('0 0 * * *', async () => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  await db.conversations.deleteMany({
    updatedAt: { $lt: thirtyDaysAgo },
  });
});
```

### Encryption at Rest

```typescript
import crypto from 'crypto';

const algorithm = 'aes-256-gcm';
const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');

function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
}

function decrypt(encrypted: string): string {
  const [ivHex, authTagHex, encryptedText] = encrypted.split(':');

  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const decipher = crypto.createDecipheriv(algorithm, key, iv);

  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

// Store encrypted messages
await db.conversations.create({
  userId: userId,
  messages: encrypt(JSON.stringify(messages)),
});
```

## Audit Logging

Track security events:

```typescript
import winston from 'winston';

const securityLogger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'security.log' }),
  ],
});

app.post('/api/chat', authenticate, (req, res) => {
  // Log security events
  securityLogger.info('Chat request', {
    userId: req.user.id,
    ip: req.ip,
    timestamp: new Date().toISOString(),
    messageLength: req.body.message.length,
  });

  // Process request
});
```

## Security Checklist

- [ ] API keys stored server-side only (never in client)
- [ ] HTTPS enabled in production
- [ ] JWT authentication implemented
- [ ] Token expiration set (≤1 hour)
- [ ] CORS restricted to specific origins
- [ ] Input validation on all endpoints
- [ ] Rate limiting enabled (per user)
- [ ] XSS protection via CSP headers
- [ ] Tool parameters validated
- [ ] Sensitive data excluded from context
- [ ] Audit logging implemented
- [ ] Data encryption at rest
- [ ] GDPR compliance (data deletion)
- [ ] Regular security audits scheduled

## Security Incident Response

If you discover a security vulnerability:

1. **Don't panic** - Most issues can be fixed quickly
2. **Assess impact** - Which users are affected?
3. **Patch immediately** - Deploy fixes ASAP
4. **Notify users** - If data was compromised
5. **Review logs** - Check for unauthorized access
6. **Improve defenses** - Add tests to prevent recurrence

## Next Steps

- [Authentication Guide](../guides/authentication.md) - Implement JWT auth
- [Backend Integration](./backend-integration.md) - Secure backend setup
- [Architecture](./architecture.md) - Understand security model
