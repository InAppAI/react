# Component Props

> Complete API reference for the InAppAI component

The `<InAppAI />` component is the main export of the `@inappai/react` package. This page documents all available props and their usage.

## Required Props

These props must be provided:

### endpoint

- **Type**: `string`
- **Default**: `'https://api.inappai.com/api'`
- **Required**: No (Advanced only)
- **Description**: Backend API endpoint URL

**Most users can omit this prop** - it defaults to the hosted InAppAI backend.

```tsx
<InAppAI
  agentId="your-agent-id"
  // endpoint is optional - uses https://api.inappai.com/api by default
/>
```

**For self-hosted backends:**

```tsx
<InAppAI
  endpoint="https://your-backend.com/api"
  agentId="your-agent-id"
/>
```

**For local development**, use environment variables instead:

```bash
# .env.local (Vite)
VITE_INAPPAI_ENDPOINT=http://localhost:3001

# .env.local (Create React App)
REACT_APP_INAPPAI_ENDPOINT=http://localhost:3001
```

Then use normally without the endpoint prop.

### agentId

- **Type**: `string`
- **Required**: Yes
- **Description**: Your AI agent ID from the InAppAI platform

```tsx
<InAppAI agentId="your-agent-id" />
```

Get your agent ID from [inappai.com](https://inappai.com).

### messages

- **Type**: `Message[]`
- **Required**: Yes (controlled mode)
- **Description**: Array of conversation messages

```tsx
const [messages, setMessages] = useState<Message[]>([]);

<InAppAI
  messages={messages}
  onMessagesChange={setMessages}
/>
```

See [Message type](./types.md#message) for details.

### onMessagesChange

- **Type**: `(messages: Message[]) => void`
- **Required**: Yes (controlled mode)
- **Description**: Callback when messages array changes

```tsx
<InAppAI
  messages={messages}
  onMessagesChange={(newMessages) => {
    setMessages(newMessages);
    // Optionally save to backend or localStorage
  }}
/>
```

## Display Configuration

### displayMode

- **Type**: `'popup' | 'sidebar-left' | 'sidebar-right' | 'panel-left' | 'panel-right' | 'embedded'`
- **Default**: `'popup'`
- **Description**: Layout mode for the chat interface

```tsx
{/* Popup with floating button */}
<InAppAI displayMode="popup" />

{/* Sidebar overlay */}
<InAppAI displayMode="sidebar-right" />

{/* Resizable panel */}
<InAppAI displayMode="panel-left" />

{/* Embedded in your layout */}
<InAppAI displayMode="embedded" />
```

See [Display Modes Guide](../guides/display-modes.md) for details.

### position

- **Type**: `'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'`
- **Default**: `'bottom-right'`
- **Description**: Button position (popup mode only)

```tsx
<InAppAI
  displayMode="popup"
  position="bottom-left"
/>
```

### defaultFolded

- **Type**: `boolean`
- **Default**: `false`
- **Description**: Start in folded state (sidebar/panel mode only)

```tsx
<InAppAI
  displayMode="sidebar-right"
  defaultFolded={true}
/>
```

### showHeader

- **Type**: `boolean`
- **Default**: `true`
- **Description**: Show/hide the chat header

```tsx
<InAppAI
  displayMode="embedded"
  showHeader={false}  // Hide header for custom layouts
/>
```

## Styling & Theming

### theme

- **Type**: `'light' | 'dark' | 'professional' | 'playful' | 'minimal' | 'ocean' | 'sunset'`
- **Default**: `'light'`
- **Description**: Built-in theme to use

```tsx
<InAppAI theme="dark" />
```

See [Themes Guide](../guides/themes.md) for preview and details.

### customStyles

- **Type**: `CustomStyles`
- **Default**: `{}`
- **Description**: Override theme with custom styles

```tsx
<InAppAI
  theme="light"
  customStyles={{
    primaryColor: '#6366f1',
    buttonIcon: '💬',
    headerTitle: 'Support',
    windowWidth: '500px',
  }}
/>
```

See [CustomStyles API](./styling.md) for all available properties.

## Context & Data

### context

- **Type**: `Record<string, any> | (() => Record<string, any>)`
- **Default**: `undefined`
- **Description**: Application context sent to AI with each message

**Static context** (object):

```tsx
<InAppAI
  context={{
    page: 'dashboard',
    userId: user.id,
    userRole: user.role,
  }}
/>
```

**Dynamic context** (function):

```tsx
<InAppAI
  context={() => ({
    currentUrl: window.location.pathname,
    scrollPosition: window.scrollY,
    selectedText: window.getSelection()?.toString(),
  })}
/>
```

See [Context Passing Guide](../guides/context.md) for best practices.

### conversationId

- **Type**: `string`
- **Default**: Auto-generated
- **Description**: Conversation identifier sent to backend

```tsx
<InAppAI
  conversationId="user-123-support"
  messages={messages}
  onMessagesChange={setMessages}
/>
```

Useful for:
- Multi-conversation apps
- Backend conversation tracking
- Analytics and logging

### authToken

- **Type**: `string`
- **Default**: `undefined`
- **Description**: JWT token for authenticated requests

```tsx
const { token } = useAuth();

<InAppAI
  authToken={token}
  context={{
    userId: user.id,
    userName: user.name,
  }}
/>
```

See [Authentication Guide](../guides/authentication.md) for details.

## Tools & Function Calling

### tools

- **Type**: `Tool[]`
- **Default**: `[]`
- **Description**: Array of tools the AI can execute

```tsx
const tools: Tool[] = [
  {
    name: 'search',
    description: 'Search for information',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query' },
      },
      required: ['query'],
    },
    handler: async ({ query }) => {
      const results = await search(query);
      return { success: true, results };
    },
  },
];

<InAppAI tools={tools} />
```

See [Tools Guide](../guides/tools.md) for complete documentation.

## Panel-Specific Props

These props only apply when `displayMode` is `panel-left` or `panel-right`:

### panelMinWidth

- **Type**: `string`
- **Default**: `'20%'`
- **Description**: Minimum panel width (percentage or pixels)

```tsx
<InAppAI
  displayMode="panel-right"
  panelMinWidth="300px"
/>
```

### panelMaxWidth

- **Type**: `string`
- **Default**: `'33.33%'`
- **Description**: Maximum panel width (percentage or pixels)

```tsx
<InAppAI
  displayMode="panel-right"
  panelMaxWidth="50%"
/>
```

### panelDefaultWidth

- **Type**: `string`
- **Default**: `'25%'`
- **Description**: Initial panel width

```tsx
<InAppAI
  displayMode="panel-right"
  panelDefaultWidth="400px"
/>
```

### onPanelResize

- **Type**: `(width: number) => void`
- **Default**: `undefined`
- **Description**: Callback when panel is resized

```tsx
<InAppAI
  displayMode="panel-right"
  onPanelResize={(width) => {
    console.log('Panel width:', width);
    localStorage.setItem('panelWidth', width.toString());
  }}
/>
```

## Message Hooks

### onMessageSent

- **Type**: `(message: Message) => void`
- **Default**: `undefined`
- **Description**: Called when user sends a message

```tsx
<InAppAI
  onMessageSent={(message) => {
    console.log('User sent:', message.content);
    analytics.track('Message Sent', { length: message.content.length });
  }}
/>
```

### onMessageReceived

- **Type**: `(message: Message) => void`
- **Default**: `undefined`
- **Description**: Called when AI responds

```tsx
<InAppAI
  onMessageReceived={(message) => {
    console.log('AI responded:', message.content);
    if (message.usage) {
      trackTokenUsage(message.usage.totalTokens);
    }
  }}
/>
```

### onError

- **Type**: `(error: Error) => void`
- **Default**: `undefined`
- **Description**: Called when an error occurs

```tsx
<InAppAI
  onError={(error) => {
    console.error('Chat error:', error);
    Sentry.captureException(error);
  }}
/>
```

See [Message Hooks Guide](../guides/message-hooks.md) for detailed usage.

## Complete Example

```tsx
import { useState } from 'react';
import { InAppAI, Message, Tool } from '@inappai/react';
import '@inappai/react/styles.css';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);

  const tools: Tool[] = [
    {
      name: 'getWeather',
      description: 'Get current weather for a city',
      parameters: {
        type: 'object',
        properties: {
          city: { type: 'string', description: 'City name' },
        },
        required: ['city'],
      },
      handler: async ({ city }) => {
        // Fetch weather data
        return { temperature: 72, condition: 'Sunny' };
      },
    },
  ];

  return (
    <InAppAI
      // Required
      
      agentId="your-agent-id"
      messages={messages}
      onMessagesChange={setMessages}

      // Display
      displayMode="sidebar-right"
      position="bottom-right"
      defaultFolded={false}
      showHeader={true}

      // Styling
      theme="professional"
      customStyles={{
        headerTitle: 'Customer Support',
        buttonIcon: '💬',
        primaryColor: '#6366f1',
      }}

      // Context & Data
      context={() => ({
        page: window.location.pathname,
        userId: 'user-123',
      })}
      conversationId="support-chat-1"
      authToken="your-jwt-token"

      // Tools
      tools={tools}

      // Panel (if using panel mode)
      panelMinWidth="300px"
      panelMaxWidth="600px"
      panelDefaultWidth="400px"
      onPanelResize={(width) => console.log('Width:', width)}

      // Hooks
      onMessageSent={(msg) => console.log('Sent:', msg)}
      onMessageReceived={(msg) => console.log('Received:', msg)}
      onError={(err) => console.error('Error:', err)}
    />
  );
}
```

## TypeScript Support

All props are fully typed. Import types from the package:

```tsx
import type { InAppAIProps, Message, Tool, CustomStyles } from '@inappai/react';
```

See [TypeScript Types](./types.md) for complete type definitions.

## Next Steps

- [TypeScript Types](./types.md) - Type definitions
- [Custom Styles](./styling.md) - Complete styling API
- [Display Modes Guide](../guides/display-modes.md) - Choose the right layout
- [Examples](../examples/) - See real-world usage
