# Performance

> Optimization tips and best practices

This guide covers performance optimization techniques for InAppAI React, helping you build fast, responsive chat experiences.

## Overview

InAppAI React is optimized out-of-the-box, but there are several ways to further improve performance depending on your use case.

## Bundle Size Optimization

### 1. Import Only What You Need

```tsx
// ✅ Good - tree-shakeable imports
import { InAppAI } from '@inappai/react';
import type { Message, Tool } from '@inappai/react';

// ❌ Bad - imports everything
import * as InAppAI from '@inappai/react';
```

### 2. Lazy Load the Component

For apps where the chat isn't immediately visible:

```tsx
import { lazy, Suspense } from 'react';

// Lazy load InAppAI
const InAppAI = lazy(() => import('@inappai/react').then(mod => ({
  default: mod.InAppAI
})));

function App() {
  return (
    <Suspense fallback={<div>Loading chat...</div>}>
      <InAppAI
        
        agentId="your-agent-id"
        messages={messages}
        onMessagesChange={setMessages}
      />
    </Suspense>
  );
}
```

This reduces initial bundle size by ~95KB.

### 3. Code Splitting by Route

Only load chat on routes that need it:

```tsx
// App.tsx
const ChatPage = lazy(() => import('./pages/ChatPage'));

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/support" element={
        <Suspense fallback={<Loading />}>
          <ChatPage />
        </Suspense>
      } />
    </Routes>
  );
}

// pages/ChatPage.tsx
import { InAppAI } from '@inappai/react';

export default function ChatPage() {
  return <InAppAI {...props} />;
}
```

### 4. Analyze Bundle

Use tools to analyze your bundle:

```bash
# Webpack Bundle Analyzer
npm install --save-dev webpack-bundle-analyzer

# Vite Bundle Analyzer
npm install --save-dev rollup-plugin-visualizer
```

## Message State Optimization

### 1. Debounce Persistence

When saving messages to backend, debounce to avoid excessive requests:

```tsx
import { useCallback } from 'react';
import debounce from 'lodash/debounce';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);

  // Debounced save to backend
  const saveToBackend = useCallback(
    debounce(async (messages: Message[]) => {
      await fetch('/api/messages', {
        method: 'POST',
        body: JSON.stringify({ messages }),
      });
    }, 1000),
    []
  );

  const handleMessagesChange = (newMessages: Message[]) => {
    setMessages(newMessages);
    saveToBackend(newMessages);  // Debounced
  };

  return (
    <InAppAI
      messages={messages}
      onMessagesChange={handleMessagesChange}
    />
  );
}
```

### 2. Limit Message History

For long conversations, limit displayed messages:

```tsx
const MAX_DISPLAYED_MESSAGES = 100;

function App() {
  const [allMessages, setAllMessages] = useState<Message[]>([]);

  // Show only recent messages
  const displayedMessages = allMessages.slice(-MAX_DISPLAYED_MESSAGES);

  return (
    <InAppAI
      messages={displayedMessages}
      onMessagesChange={setAllMessages}
    />
  );
}
```

### 3. Virtualize Long Message Lists

For very long conversations (1000+ messages), use virtualization:

```tsx
// Note: This requires modifying the component or creating a custom wrapper
// InAppAI doesn't support virtualization out-of-the-box
// Consider limiting message history instead (recommended)
```

## Context Optimization

### 1. Memoize Context Functions

Avoid recreating context functions on every render:

```tsx
import { useCallback } from 'react';

function App() {
  // ❌ Bad - new function on every render
  <InAppAI
    context={() => ({
      currentUrl: window.location.pathname,
    })}
  />

  // ✅ Good - memoized function
  const getContext = useCallback(() => ({
    currentUrl: window.location.pathname,
    scrollPosition: window.scrollY,
  }), []);

  return (
    <InAppAI context={getContext} />
  );
}
```

### 2. Keep Context Lightweight

```tsx
// ❌ Bad - large context sent with every message
context={{
  user: entireUserObject,        // Could be 50KB
  products: allProducts,         // Could be 1MB
  history: fullBrowsingHistory,  // Could be huge
}}

// ✅ Good - minimal context
context={{
  userId: user.id,
  currentProduct: products.find(p => p.id === currentId),
  recentPages: history.slice(-3),
}}
```

### 3. Use Static Context When Possible

```tsx
// If context doesn't change, use static object
const staticContext = {
  appVersion: '2.1.0',
  environment: 'production',
};

<InAppAI context={staticContext} />
```

## Tool Optimization

### 1. Make Tool Handlers Async

Use async handlers to avoid blocking the main thread:

```tsx
const tools: Tool[] = [
  {
    name: 'search',
    handler: async ({ query }) => {
      // ✅ Non-blocking async operation
      const results = await searchAPI(query);
      return { success: true, results };
    },
  },
];
```

### 2. Batch Tool Operations

If a tool updates multiple items, batch the updates:

```tsx
{
  name: 'addMultipleTodos',
  handler: async ({ todos }) => {
    // ✅ Good - single state update
    setTodos(prev => [...prev, ...todos]);

    // ❌ Bad - multiple state updates
    // todos.forEach(todo => setTodos(prev => [...prev, todo]));

    return { success: true, count: todos.length };
  },
}
```

### 3. Optimize Tool Results

Return minimal data in tool results:

```tsx
{
  name: 'searchProducts',
  handler: async ({ query }) => {
    const products = await searchProducts(query);

    // ❌ Bad - return full product objects
    // return { success: true, products };

    // ✅ Good - return only needed fields
    return {
      success: true,
      products: products.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
      })),
    };
  },
}
```

## Rendering Optimization

### 1. Avoid Unnecessary Re-renders

Use `React.memo` for parent components:

```tsx
import { memo } from 'react';

const ChatSection = memo(({ messages, onMessagesChange }: Props) => {
  return (
    <InAppAI
      
      agentId="your-agent-id"
      messages={messages}
      onMessagesChange={onMessagesChange}
    />
  );
});
```

### 2. Stabilize Callbacks

Use `useCallback` for event handlers:

```tsx
const handleMessageSent = useCallback((message: Message) => {
  analytics.track('Message Sent', { length: message.content.length });
}, []);

const handleError = useCallback((error: Error) => {
  Sentry.captureException(error);
}, []);

<InAppAI
  onMessageSent={handleMessageSent}
  onError={handleError}
/>
```

### 3. Memoize Custom Styles

```tsx
const customStyles = useMemo(() => ({
  primaryColor: '#6366f1',
  headerTitle: 'Support',
  buttonIcon: '💬',
}), []);  // Empty deps = stable reference

<InAppAI customStyles={customStyles} />
```

## Network Optimization

### 1. Enable HTTP/2

Configure your backend to use HTTP/2:

```nginx
# Nginx config
listen 443 ssl http2;
```

HTTP/2 multiplexes requests, reducing latency.

### 2. Use CDN for Backend

Deploy your InAppAI backend to a CDN edge:

```tsx
// Use geographically distributed endpoints
const endpoint = getClosestEndpoint(userLocation);

<InAppAI endpoint={endpoint} />
```

### 3. Implement Request Caching

Cache backend responses when appropriate:

```typescript
// Backend (Express.js example)
import cache from 'node-cache';

const responseCache = new cache({ stdTTL: 60 });

app.post('/api/chat', (req, res) => {
  const cacheKey = `${req.body.message}-${JSON.stringify(req.body.context)}`;

  // Check cache
  const cached = responseCache.get(cacheKey);
  if (cached) {
    return res.json(cached);
  }

  // ... generate response
  responseCache.set(cacheKey, response);
  res.json(response);
});
```

### 4. Compress Responses

Enable gzip/brotli compression:

```typescript
// Backend
import compression from 'compression';

app.use(compression());
```

## Local Storage Optimization

### 1. Limit Stored Messages

```tsx
const MAX_STORED_MESSAGES = 50;

const handleMessagesChange = (newMessages: Message[]) => {
  setMessages(newMessages);

  // Store only recent messages
  const recentMessages = newMessages.slice(-MAX_STORED_MESSAGES);
  localStorage.setItem('messages', JSON.stringify(recentMessages));
};
```

### 2. Compress Stored Data

```tsx
import LZString from 'lz-string';

// Save
const compressed = LZString.compress(JSON.stringify(messages));
localStorage.setItem('messages', compressed);

// Load
const compressed = localStorage.getItem('messages');
const messages = JSON.parse(LZString.decompress(compressed));
```

### 3. Use IndexedDB for Large Data

For large conversation histories:

```tsx
import { openDB } from 'idb';

const db = await openDB('chat-db', 1, {
  upgrade(db) {
    db.createObjectStore('conversations');
  },
});

// Save
await db.put('conversations', messages, conversationId);

// Load
const messages = await db.get('conversations', conversationId);
```

## Monitoring Performance

### 1. Track Response Times

```tsx
const [lastMessageTime, setLastMessageTime] = useState<number>(0);

<InAppAI
  onMessageSent={() => {
    setLastMessageTime(Date.now());
  }}
  onMessageReceived={() => {
    const responseTime = Date.now() - lastMessageTime;
    console.log('Response time:', responseTime, 'ms');

    // Track slow responses
    if (responseTime > 5000) {
      analytics.track('Slow Response', { responseTime });
    }
  }}
/>
```

### 2. Monitor Bundle Size

```bash
# Check size after build
du -sh dist/assets/*.js

# Set size budgets
# package.json
{
  "bundlesize": [
    {
      "path": "./dist/assets/*.js",
      "maxSize": "500kb"
    }
  ]
}
```

### 3. Use Performance API

```tsx
const handleMessageSent = (message: Message) => {
  performance.mark('message-sent');
};

const handleMessageReceived = (message: Message) => {
  performance.mark('message-received');
  performance.measure('response-time', 'message-sent', 'message-received');

  const measure = performance.getEntriesByName('response-time')[0];
  console.log('Response time:', measure.duration, 'ms');
};
```

## Real-World Benchmarks

Typical performance metrics (based on our testing):

| Metric | Value |
|--------|-------|
| Initial render | ~50ms |
| Message render | ~5ms |
| Tool execution | <10ms (local) |
| Network request | 200-2000ms (varies) |
| Re-render on message | ~3ms |
| Memory per message | ~2KB |

## Performance Checklist

- [ ] Lazy load InAppAI if not immediately visible
- [ ] Debounce backend persistence (1-2 seconds)
- [ ] Limit message history (50-100 recent messages)
- [ ] Keep context under 5KB
- [ ] Use memoization for callbacks and styles
- [ ] Enable HTTP/2 and compression on backend
- [ ] Cache backend responses when appropriate
- [ ] Compress localStorage data if >1MB
- [ ] Monitor response times in production
- [ ] Set bundle size budgets

## Common Performance Issues

### Issue: Slow Initial Load

**Solution**: Lazy load the component

```tsx
const InAppAI = lazy(() => import('@inappai/react'));
```

### Issue: Laggy Typing

**Solution**: Debounce backend saves

```tsx
const saveToBackend = debounce(async (messages) => {
  await api.save(messages);
}, 1000);
```

### Issue: High Memory Usage

**Solution**: Limit message history

```tsx
const recentMessages = allMessages.slice(-100);
```

### Issue: Slow Tool Execution

**Solution**: Make handlers async and optimize logic

```tsx
handler: async ({ query }) => {
  // Use efficient algorithms
  const results = await optimizedSearch(query);
  return results;
}
```

## Advanced Optimization

### Web Workers

For CPU-intensive tool operations:

```tsx
// worker.ts
self.addEventListener('message', async (e) => {
  const { query } = e.data;
  const results = await expensiveComputation(query);
  self.postMessage(results);
});

// Tool handler
const worker = new Worker('worker.ts');

{
  name: 'heavyComputation',
  handler: async ({ query }) => {
    return new Promise((resolve) => {
      worker.postMessage({ query });
      worker.onmessage = (e) => resolve(e.data);
    });
  },
}
```

### Request Deduplication

Prevent duplicate requests:

```tsx
const pendingRequests = new Map();

const sendMessage = async (message: string) => {
  const key = message;

  if (pendingRequests.has(key)) {
    return pendingRequests.get(key);
  }

  const promise = fetch('/api/chat', { ... });
  pendingRequests.set(key, promise);

  try {
    const result = await promise;
    return result;
  } finally {
    pendingRequests.delete(key);
  }
};
```

## Next Steps

- [Architecture](./architecture.md) - Understand internal workings
- [Security](./security.md) - Security best practices
- [Troubleshooting](./troubleshooting.md) - Debug performance issues
