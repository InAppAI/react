# Troubleshooting

> Common issues and solutions

This guide helps you diagnose and fix common issues when using InAppAI React.

## Connection Issues

### "Backend not responding" Error

**Symptoms**: Error banner shows "Backend not responding" or "Failed to connect to backend"

**Causes**:
1. Backend server is not running
2. Wrong endpoint URL
3. CORS issues
4. Network/firewall blocking

**Solutions**:

1. **Check backend is running**:
```bash
# Test health endpoint
curl http://localhost:3001/your-agent-id/health

# Should return: {"status":"ok",...}
```

2. **Verify endpoint URL**:
```tsx
// Make sure endpoint matches your backend
<InAppAI
  endpoint="http://localhost:3001"  // For local dev
  // or
  endpoint="https://api.yourapp.com"  // For production
/>
```

3. **Check CORS configuration** (backend):
```typescript
app.use(cors({
  origin: ['http://localhost:5173'],  // Must match frontend URL
  credentials: true,
}));
```

4. **Check browser console** for CORS errors:
```
Access to fetch at 'http://localhost:3001' from origin 'http://localhost:5173'
has been blocked by CORS policy
```

### "Connection timeout" Error

**Causes**:
- Slow AI API response
- Network issues
- Backend overloaded

**Solutions**:

1. **Increase timeout** (if using custom fetch):
```typescript
const response = await fetch(`${endpoint}/chat`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message }),
  signal: AbortSignal.timeout(30000),  // 30 second timeout
});
```

2. **Check backend logs** for slow AI API calls

3. **Implement retry logic**:
```tsx
const [retryCount, setRetryCount] = useState(0);

<InAppAI
  onError={(error) => {
    if (error.message.includes('timeout') && retryCount < 3) {
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
        // Retry logic
      }, 2000);
    }
  }}
/>
```

## TypeScript Errors

### "Property 'messages' is missing"

**Error**:
```
Type '{}' is missing the following properties from type 'InAppAIProps':
endpoint, agentId, messages, onMessagesChange
```

**Solution**: Provide all required props:
```tsx
// ❌ Missing required props
<InAppAI />

// ✅ All required props provided
<InAppAI
  
  agentId="your-agent-id"
  messages={messages}
  onMessagesChange={setMessages}
/>
```

### "Type 'Message[]' is not assignable"

**Error**:
```
Type 'Message[]' is not assignable to type 'never[]'
```

**Solution**: Type your state correctly:
```tsx
// ❌ Wrong - no type annotation
const [messages, setMessages] = useState([]);

// ✅ Correct - explicit type
import type { Message } from '@inappai/react';
const [messages, setMessages] = useState<Message[]>([]);
```

### "Cannot find module '@inappai/react'"

**Solution**: Install the package:
```bash
npm install @inappai/react
```

Then import the CSS:
```tsx
import '@inappai/react/styles.css';
```

## Rendering Issues

### Chat Window Not Appearing

**Causes**:
1. Not clicking the button (popup mode)
2. CSS not imported
3. Z-index conflicts

**Solutions**:

1. **Import CSS**:
```tsx
// At the top of your file
import '@inappai/react/styles.css';
```

2. **Check display mode**:
```tsx
// Popup mode - click button to open
<InAppAI displayMode="popup" />

// Embedded mode - always visible
<InAppAI displayMode="embedded" />
```

3. **Fix z-index conflicts**:
```css
/* Your CSS */
.inapp-ai-button,
.inapp-ai-window {
  z-index: 9999 !important;
}
```

### Messages Not Displaying

**Causes**:
1. Empty messages array
2. Messages state not updating
3. onMessagesChange not called

**Solutions**:

1. **Verify messages state**:
```tsx
const [messages, setMessages] = useState<Message[]>([]);

console.log('Current messages:', messages);  // Debug

<InAppAI
  messages={messages}
  onMessagesChange={(newMessages) => {
    console.log('New messages:', newMessages);  // Debug
    setMessages(newMessages);
  }}
/>
```

2. **Check message structure**:
```tsx
// Messages must have id, role, content
const validMessage: Message = {
  id: '1',
  role: 'user',
  content: 'Hello',
};
```

### Styling Not Applied

**Causes**:
1. CSS not imported
2. Custom styles incorrect format
3. Theme class not applied

**Solutions**:

1. **Import CSS first**:
```tsx
import '@inappai/react/styles.css';
import { InAppAI } from '@inappai/react';
```

2. **Check custom styles format**:
```tsx
// ❌ Wrong - incorrect property names
customStyles={{
  color: '#6366f1',  // Wrong property
}}

// ✅ Correct - valid properties
customStyles={{
  primaryColor: '#6366f1',
  headerTitle: 'Support',
}}
```

3. **Verify theme prop**:
```tsx
<InAppAI theme="dark" />  // Valid themes: light, dark, professional, etc.
```

## Tool Execution Issues

### Tools Not Being Called

**Causes**:
1. Tool description unclear
2. Tool parameters incorrect
3. Backend not forwarding tools

**Solutions**:

1. **Improve tool descriptions**:
```tsx
// ❌ Vague description
{
  name: 'addTodo',
  description: 'Adds a todo',  // Too vague
}

// ✅ Clear description
{
  name: 'addTodo',
  description: 'Add a new todo item to the user\'s todo list when they ask to create, add, or remember a task',
}
```

2. **Verify parameters schema**:
```tsx
{
  name: 'searchProducts',
  parameters: {
    type: 'object',  // Must be 'object'
    properties: {
      query: {
        type: 'string',  // Must match JSON Schema types
        description: 'Search query',
      },
    },
    required: ['query'],  // List required params
  },
}
```

3. **Check backend forwarding**:
```typescript
// Backend must forward tools to AI API
const completion = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: history,
  tools: req.body.tools,  // Forward tools from request
});
```

### Tool Handler Errors

**Causes**:
1. Handler throws error
2. Handler returns wrong format
3. Async handler not awaited

**Solutions**:

1. **Wrap in try-catch**:
```tsx
{
  name: 'deleteTodo',
  handler: async ({ id }) => {
    try {
      await deleteTodo(id);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
}
```

2. **Return proper format**:
```tsx
// ❌ Wrong - no return value
handler: async ({ text }) => {
  addTodo(text);
}

// ✅ Correct - returns result
handler: async ({ text }) => {
  const todo = addTodo(text);
  return { success: true, todo };
}
```

3. **Use async/await**:
```tsx
// ✅ Async handler
handler: async ({ query }) => {
  const results = await searchAPI(query);  // Wait for async
  return { success: true, results };
}
```

## Performance Issues

### Slow Message Rendering

**Causes**:
1. Too many messages
2. Large messages
3. Re-rendering issues

**Solutions**:

1. **Limit message history**:
```tsx
const MAX_MESSAGES = 100;

const displayedMessages = messages.slice(-MAX_MESSAGES);

<InAppAI
  messages={displayedMessages}
  onMessagesChange={setMessages}
/>
```

2. **Memoize callbacks**:
```tsx
const handleMessagesChange = useCallback((newMessages: Message[]) => {
  setMessages(newMessages);
}, []);

<InAppAI onMessagesChange={handleMessagesChange} />
```

3. **Use React.memo** for parent:
```tsx
const ChatComponent = memo(({ messages, onMessagesChange }) => {
  return <InAppAI messages={messages} onMessagesChange={onMessagesChange} />;
});
```

### High Memory Usage

**Causes**:
- Large conversation history
- Messages not being cleaned up

**Solutions**:

1. **Clear old conversations**:
```tsx
// Clear conversations older than 7 days
useEffect(() => {
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('conversation_')) {
      const data = JSON.parse(localStorage.getItem(key));
      if (data.timestamp < sevenDaysAgo) {
        localStorage.removeItem(key);
      }
    }
  });
}, []);
```

2. **Compress messages**:
```tsx
import LZString from 'lz-string';

// Save compressed
const compressed = LZString.compress(JSON.stringify(messages));
localStorage.setItem('messages', compressed);

// Load and decompress
const compressed = localStorage.getItem('messages');
const messages = JSON.parse(LZString.decompress(compressed));
```

## Authentication Issues

### "Invalid token" Error

**Causes**:
1. Expired JWT
2. Wrong JWT secret
3. Token not sent correctly

**Solutions**:

1. **Check token expiration**:
```tsx
import jwt_decode from 'jwt-decode';

const token = localStorage.getItem('authToken');
const decoded = jwt_decode(token);

if (decoded.exp * 1000 < Date.now()) {
  // Token expired - refresh it
  const newToken = await refreshToken();
  setToken(newToken);
}
```

2. **Verify JWT secret** (backend):
```typescript
// Make sure frontend and backend use same secret
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

3. **Send token correctly**:
```tsx
// Frontend
<InAppAI authToken={token} />

// Backend receives as:
// req.headers.authorization = "Bearer YOUR_TOKEN"
```

## Build & Bundle Issues

### "Module not found" in Production

**Cause**: CSS file not found after build

**Solution**: Ensure CSS is in your build output:

```javascript
// vite.config.ts
export default {
  build: {
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
};
```

### Large Bundle Size

**Solutions**:

1. **Lazy load InAppAI**:
```tsx
const InAppAI = lazy(() => import('@inappai/react').then(m => ({ default: m.InAppAI })));

<Suspense fallback={<div>Loading...</div>}>
  <InAppAI {...props} />
</Suspense>
```

2. **Check bundle analyzer**:
```bash
npm install --save-dev webpack-bundle-analyzer
```

## Debugging Tips

### Enable Debug Logging

```tsx
// Add logging to track state changes
const [messages, setMessages] = useState<Message[]>([]);

useEffect(() => {
  console.log('[InAppAI] Messages updated:', messages.length);
}, [messages]);

<InAppAI
  messages={messages}
  onMessagesChange={(newMessages) => {
    console.log('[InAppAI] onMessagesChange called:', newMessages.length);
    setMessages(newMessages);
  }}
  onMessageSent={(msg) => {
    console.log('[InAppAI] Message sent:', msg);
  }}
  onMessageReceived={(msg) => {
    console.log('[InAppAI] Message received:', msg);
  }}
  onError={(error) => {
    console.error('[InAppAI] Error:', error);
  }}
/>
```

### Check Network Requests

Open browser DevTools (F12) → Network tab:

1. Look for requests to your endpoint
2. Check request/response payloads
3. Verify status codes (200 = success)
4. Check response times

### Inspect Component State

Use React DevTools to inspect component state in real-time.

## Getting Help

If you're still stuck:

1. **Check the logs** - Backend and browser console
2. **Minimal reproduction** - Create a minimal example
3. **Search GitHub issues** - Someone may have had the same issue
4. **Ask for help** - Create an issue with:
   - Error message
   - Code snippet
   - Expected vs actual behavior
   - Environment (Node version, browser, OS)

## Common Error Messages

### "InAppAI requires controlled mode"

**Error**: Component throws this error on mount

**Fix**: Provide both `messages` and `onMessagesChange`:
```tsx
<InAppAI
  messages={messages}           // Required
  onMessagesChange={setMessages} // Required
/>
```

### "Failed to get response"

**Cause**: Backend returned non-200 status

**Fix**: Check backend logs and ensure it's returning proper JSON

### "Tool 'toolName' not found"

**Cause**: AI tried to call a tool that doesn't exist

**Fix**: Ensure tool name matches exactly:
```tsx
const tools = [
  { name: 'addTodo', ... },  // Name must match exactly
];
```

## Next Steps

- [Architecture](./architecture.md) - Understand how it works
- [Performance](./performance.md) - Optimize your app
- [Backend Integration](./backend-integration.md) - Set up backend correctly
