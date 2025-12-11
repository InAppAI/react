# Message Hooks

> React to message events in your application

**Message hooks** are callback functions that let you respond to message events. Use them to track analytics, update UI, trigger actions, or integrate with other systems.

## Available Hooks

InAppAI React provides hooks for key message lifecycle events:

| Hook | When It Fires | Use Case |
|------|---------------|----------|
| `onMessageSent` | User sends a message | Track user questions, analytics |
| `onMessageReceived` | AI responds | Track AI responses, update UI |
| `onMessagesChange` | Messages array changes | Persistence, state management |
| `onError` | Error occurs | Error handling, logging |

## Basic Usage

```tsx
import { InAppAI, Message } from '@inappai/react';
import { useState } from 'react';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);

  return (
    <InAppAI
      
      agentId="your-agent-id"
      messages={messages}
      onMessagesChange={setMessages}

      // Message hooks
      onMessageSent={(message) => {
        console.log('User asked:', message.content);
      }}

      onMessageReceived={(message) => {
        console.log('AI responded:', message.content);
      }}

      onError={(error) => {
        console.error('Error occurred:', error);
      }}
    />
  );
}
```

## onMessagesChange (Required)

This is the primary hook for controlled mode. It's called whenever the messages array changes.

```tsx
const [messages, setMessages] = useState<Message[]>([]);

<InAppAI
  messages={messages}
  onMessagesChange={(newMessages) => {
    console.log('Messages changed:', newMessages);
    setMessages(newMessages);
  }}
/>
```

### Common Patterns

**Save to localStorage:**

```tsx
onMessagesChange={(newMessages) => {
  setMessages(newMessages);
  localStorage.setItem('messages', JSON.stringify(newMessages));
}}
```

**Save to backend:**

```tsx
onMessagesChange={async (newMessages) => {
  setMessages(newMessages);
  await api.saveMessages(conversationId, newMessages);
}}
```

**Update conversation title:**

```tsx
onMessagesChange={(newMessages) => {
  setMessages(newMessages);

  // Auto-generate title from first message
  if (newMessages.length === 1) {
    const firstMessage = newMessages[0];
    setConversationTitle(firstMessage.content.slice(0, 50));
  }
}}
```

## onMessageSent

Called when the user sends a message (before AI responds).

```tsx
<InAppAI
  onMessageSent={(message) => {
    console.log('User message:', message);
    // message.id - unique message ID
    // message.role - 'user'
    // message.content - message text
    // message.timestamp - when sent
  }}
/>
```

### Use Cases

**Track Analytics:**

```tsx
onMessageSent={(message) => {
  analytics.track('User Sent Message', {
    messageLength: message.content.length,
    conversationId: conversationId,
    timestamp: message.timestamp,
  });
}}
```

**Show Typing Indicator:**

```tsx
const [aiTyping, setAiTyping] = useState(false);

<InAppAI
  onMessageSent={() => {
    setAiTyping(true);
  }}
  onMessageReceived={() => {
    setAiTyping(false);
  }}
/>

{aiTyping && <div>AI is typing...</div>}
```

**Trigger External Actions:**

```tsx
onMessageSent={(message) => {
  // Notify support team for urgent questions
  if (message.content.toLowerCase().includes('urgent')) {
    notifySupportTeam(message);
  }
}}
```

**Validate Input:**

```tsx
onMessageSent={(message) => {
  // Log problematic inputs
  if (message.content.length > 5000) {
    logWarning('Very long message sent', { length: message.content.length });
  }
}}
```

## onMessageReceived

Called when the AI responds to a user message.

```tsx
<InAppAI
  onMessageReceived={(message) => {
    console.log('AI response:', message);
    // message.id - unique message ID
    // message.role - 'assistant'
    // message.content - AI's response text
    // message.timestamp - when received
    // message.usage - token usage (optional)
  }}
/>
```

### Use Cases

**Track Response Time:**

```tsx
const [lastUserMessage, setLastUserMessage] = useState<Date | null>(null);

<InAppAI
  onMessageSent={(message) => {
    setLastUserMessage(message.timestamp || new Date());
  }}

  onMessageReceived={(message) => {
    if (lastUserMessage) {
      const responseTime = Date.now() - lastUserMessage.getTime();
      analytics.track('AI Response Time', { ms: responseTime });
    }
  }}
/>
```

**Show Notifications:**

```tsx
onMessageReceived={(message) => {
  // Show notification if chat is minimized
  if (!isChatVisible) {
    showNotification('New message from AI', {
      body: message.content.slice(0, 100),
    });
  }
}}
```

**Track Token Usage:**

```tsx
const [totalTokens, setTotalTokens] = useState(0);

<InAppAI
  onMessageReceived={(message) => {
    if (message.usage) {
      setTotalTokens(prev => prev + message.usage.totalTokens);
      console.log('Total tokens used:', totalTokens);
    }
  }}
/>
```

**Auto-scroll to Latest:**

```tsx
const chatEndRef = useRef<HTMLDivElement>(null);

<InAppAI
  onMessageReceived={() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }}
/>
```

## onError

Called when an error occurs (network error, API error, etc.).

```tsx
<InAppAI
  onError={(error) => {
    console.error('Chat error:', error);
    // error.message - error description
    // error.code - error code (if available)
  }}
/>
```

### Use Cases

**Show Error Messages:**

```tsx
const [errorMessage, setErrorMessage] = useState<string | null>(null);

<InAppAI
  onError={(error) => {
    setErrorMessage(error.message);
  }}
/>

{errorMessage && (
  <div className="error-banner">
    Error: {errorMessage}
    <button onClick={() => setErrorMessage(null)}>Dismiss</button>
  </div>
)}
```

**Log to Error Tracking:**

```tsx
onError={(error) => {
  Sentry.captureException(error, {
    tags: {
      component: 'InAppAI',
      conversationId: conversationId,
    },
  });
}}
```

**Retry Logic:**

```tsx
const [retryCount, setRetryCount] = useState(0);

<InAppAI
  onError={(error) => {
    if (retryCount < 3) {
      console.log(`Retrying... (${retryCount + 1}/3)`);
      setRetryCount(prev => prev + 1);
      // Trigger retry logic
    } else {
      showError('Failed after 3 attempts');
    }
  }}
/>
```

**Fallback to Support:**

```tsx
onError={(error) => {
  if (error.message.includes('rate limit')) {
    showMessage('AI is busy. Would you like to contact support instead?');
  }
}}
```

## Real-World Example: Complete Analytics

```tsx
import { useState } from 'react';
import { InAppAI, Message } from '@inappai/react';

function AnalyticsApp() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [stats, setStats] = useState({
    messagesSent: 0,
    messagesReceived: 0,
    totalTokens: 0,
    errors: 0,
    avgResponseTime: 0,
  });

  const [lastMessageTime, setLastMessageTime] = useState<number>(0);

  return (
    <div>
      {/* Stats Dashboard */}
      <div className="stats">
        <div>Messages Sent: {stats.messagesSent}</div>
        <div>AI Responses: {stats.messagesReceived}</div>
        <div>Tokens Used: {stats.totalTokens}</div>
        <div>Errors: {stats.errors}</div>
        <div>Avg Response Time: {stats.avgResponseTime}ms</div>
      </div>

      <InAppAI
        
        agentId="your-agent-id"
        messages={messages}
        onMessagesChange={setMessages}

        onMessageSent={(message) => {
          setStats(prev => ({
            ...prev,
            messagesSent: prev.messagesSent + 1,
          }));
          setLastMessageTime(Date.now());

          // Track to analytics service
          analytics.track('User Message Sent', {
            length: message.content.length,
            conversationLength: messages.length,
          });
        }}

        onMessageReceived={(message) => {
          const responseTime = Date.now() - lastMessageTime;

          setStats(prev => ({
            ...prev,
            messagesReceived: prev.messagesReceived + 1,
            totalTokens: prev.totalTokens + (message.usage?.totalTokens || 0),
            avgResponseTime: Math.round(
              (prev.avgResponseTime * prev.messagesReceived + responseTime) /
              (prev.messagesReceived + 1)
            ),
          }));

          analytics.track('AI Response Received', {
            responseTime,
            tokens: message.usage?.totalTokens,
          });
        }}

        onError={(error) => {
          setStats(prev => ({
            ...prev,
            errors: prev.errors + 1,
          }));

          Sentry.captureException(error);
          analytics.track('Chat Error', {
            error: error.message,
          });
        }}
      />
    </div>
  );
}
```

## Real-World Example: User Engagement

```tsx
function EngagementTracker() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionStart] = useState(Date.now());

  return (
    <InAppAI
      
      agentId="your-agent-id"
      messages={messages}
      onMessagesChange={setMessages}

      onMessageSent={(message) => {
        const sessionDuration = Date.now() - sessionStart;

        // Track user engagement
        analytics.track('Chat Engagement', {
          messageNumber: messages.filter(m => m.role === 'user').length + 1,
          sessionDuration,
          messageLength: message.content.length,
        });

        // A/B testing
        if (Math.random() < 0.5) {
          experimentVariant = 'A';
        }
      }}

      onMessageReceived={(message) => {
        // Track AI performance
        const wasHelpful = message.content.length > 50;
        analytics.track('AI Response Quality', {
          responseLength: message.content.length,
          likelyHelpful: wasHelpful,
        });
      }}
    />
  );
}
```

## Best Practices

### 1. Keep Hooks Fast

Hooks are called on the main thread. Keep them lightweight:

```tsx
// ✅ Good - async operations
onMessageReceived={async (message) => {
  await fetch('/api/log', { method: 'POST', body: JSON.stringify(message) });
}}

// ❌ Bad - heavy synchronous work
onMessageReceived={(message) => {
  for (let i = 0; i < 1000000; i++) {
    // Heavy computation
  }
}}
```

### 2. Handle Errors in Hooks

```tsx
onMessageSent={async (message) => {
  try {
    await analytics.track('Message Sent', message);
  } catch (error) {
    console.error('Analytics failed:', error);
    // Don't throw - let the chat continue
  }
}}
```

### 3. Avoid Infinite Loops

Don't call `setMessages` in `onMessagesChange` without conditions:

```tsx
// ❌ Infinite loop
onMessagesChange={(newMessages) => {
  setMessages([...newMessages, someExtraMessage]); // Calls onMessagesChange again!
}}

// ✅ Correct
onMessagesChange={(newMessages) => {
  setMessages(newMessages); // Just update state
}}
```

### 4. Debounce Analytics

For high-frequency events, debounce analytics calls:

```tsx
import { debounce } from 'lodash';

const trackMessage = debounce((message) => {
  analytics.track('Message', message);
}, 500);

<InAppAI
  onMessageSent={trackMessage}
/>
```

## Examples

See complete implementations:

- [Sidebar with Hooks](../../examples/snippets/sidebar-docs.tsx) - Analytics tracking
- [Multi-Conversation](../../examples/snippets/multi-conversation.tsx) - Title updates

## Next Steps

- [Context Passing](./context.md) - Send app state to AI
- [Conversation Persistence](./persistence.md) - Save conversations
- [Examples](../examples/) - See hooks in action
