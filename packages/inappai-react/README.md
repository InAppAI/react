# @inappai/react

[![npm version](https://img.shields.io/npm/v/@inappai/react.svg)](https://www.npmjs.com/package/@inappai/react)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Beautiful, customizable AI chat component for React applications. Built by [InAppAI](https://www.inappai.com).

## Features

- ✨ **Beautiful UI** - Polished interface out of the box
- 🎨 **7 Built-in Themes** - Light, dark, professional, playful, minimal, ocean, sunset
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- 🎯 **Multiple Display Modes** - Popup, sidebar, panel, or embedded
- 🎛️ **Controlled Mode** - Full control over message state
- 🔧 **Tool Support** - Function calling for AI agent interactions
- ⚡ **Zero Config** - Works with sensible defaults
- 📦 **Lightweight** - Minimal bundle size (~60KB)
- 🔷 **TypeScript** - Full type safety included
- ⚛️ **React 18 & 19** - Supports both React 18 and 19

## Installation

```bash
npm install @inappai/react
```

## Quick Start

```tsx
import { useState } from 'react';
import { InAppAI, Message } from '@inappai/react';
import '@inappai/react/styles.css';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);

  return (
    <InAppAI
      agentId="your-agent-id"
      messages={messages}
      onMessagesChange={setMessages}
    />
  );
}
```

Get your agent ID from [inappai.com](https://www.inappai.com).

## Display Modes

### Popup Mode (Default)

Chat appears as a floating bubble in the corner:

```tsx
<InAppAI
  agentId="your-agent-id"
  messages={messages}
  onMessagesChange={setMessages}
  displayMode="popup"
  position="bottom-right"
/>
```

### Sidebar Mode

Chat slides in from the side:

```tsx
<InAppAI
  agentId="your-agent-id"
  messages={messages}
  onMessagesChange={setMessages}
  displayMode="sidebar-right"
/>
```

### Panel Mode

Resizable panel overlay:

```tsx
<InAppAI
  agentId="your-agent-id"
  messages={messages}
  onMessagesChange={setMessages}
  displayMode="panel-right"
  panelDefaultWidth="400px"
/>
```

### Embedded Mode

Embed chat directly in your layout:

```tsx
<div style={{ height: '600px', width: '400px' }}>
  <InAppAI
    agentId="your-agent-id"
    messages={messages}
    onMessagesChange={setMessages}
    displayMode="embedded"
    showHeader={false}
  />
</div>
```

## Themes

Choose from 7 built-in themes:

```tsx
<InAppAI
  agentId="your-agent-id"
  messages={messages}
  onMessagesChange={setMessages}
  theme="dark" // light | dark | professional | playful | minimal | ocean | sunset
/>
```

## Custom Styling

Override styles with custom CSS:

```tsx
<InAppAI
  agentId="your-agent-id"
  messages={messages}
  onMessagesChange={setMessages}
  customStyles={{
    primaryColor: '#FF6B6B',
    headerTitle: 'Support Chat',
    buttonIcon: '💬',
  }}
/>
```

## Tool Support

Register custom tools for AI function calling:

```tsx
import { InAppAI, Tool } from '@inappai/react';

const tools: Tool[] = [
  {
    name: 'get_weather',
    description: 'Get current weather for a location',
    parameters: {
      type: 'object',
      properties: {
        location: { type: 'string', description: 'City name' },
      },
      required: ['location'],
    },
    handler: async ({ location }) => {
      const weather = await fetchWeather(location);
      return { temperature: weather.temp, condition: weather.condition };
    },
  },
];

function App() {
  const [messages, setMessages] = useState<Message[]>([]);

  return (
    <InAppAI
      agentId="your-agent-id"
      messages={messages}
      onMessagesChange={setMessages}
      tools={tools}
    />
  );
}
```

## Context Passing

Send application context to make responses more relevant:

```tsx
<InAppAI
  agentId="your-agent-id"
  messages={messages}
  onMessagesChange={setMessages}
  context={{
    page: 'dashboard',
    userId: user.id,
    userRole: user.role,
  }}
/>
```

Or use dynamic context:

```tsx
<InAppAI
  agentId="your-agent-id"
  messages={messages}
  onMessagesChange={setMessages}
  context={() => ({
    currentUrl: window.location.pathname,
    selectedText: window.getSelection()?.toString(),
  })}
/>
```

## API Reference

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `agentId` | `string` | Your agent ID from InAppAI platform |
| `messages` | `Message[]` | Array of conversation messages |
| `onMessagesChange` | `(messages: Message[]) => void` | Callback when messages change |

### Display Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `displayMode` | `'popup' \| 'sidebar-left' \| 'sidebar-right' \| 'panel-left' \| 'panel-right' \| 'embedded'` | `'popup'` | Layout mode |
| `position` | `'bottom-right' \| 'bottom-left' \| 'top-right' \| 'top-left'` | `'bottom-right'` | Button position (popup only) |
| `defaultFolded` | `boolean` | `false` | Start folded (sidebar/panel only) |
| `showHeader` | `boolean` | `true` | Show/hide header |

### Styling Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `theme` | `'light' \| 'dark' \| 'professional' \| 'playful' \| 'minimal' \| 'ocean' \| 'sunset'` | `'light'` | Built-in theme |
| `customStyles` | `CustomStyles` | `{}` | Custom style overrides |

### Data Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `context` | `Record<string, any> \| (() => Record<string, any>)` | - | App context sent with messages |
| `conversationId` | `string` | Auto-generated | Conversation identifier |
| `authToken` | `string` | - | JWT token for authentication |
| `tools` | `Tool[]` | `[]` | Custom tools for function calling |

### Panel Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `panelMinWidth` | `string` | `'20%'` | Minimum panel width |
| `panelMaxWidth` | `string` | `'33.33%'` | Maximum panel width |
| `panelDefaultWidth` | `string` | `'25%'` | Initial panel width |
| `onPanelResize` | `(width: number) => void` | - | Panel resize callback |

### Event Hooks

| Prop | Type | Description |
|------|------|-------------|
| `onMessageSent` | `(message: Message) => void` | Called when user sends message |
| `onMessageReceived` | `(message: Message) => void` | Called when AI responds |
| `onError` | `(error: Error) => void` | Called on errors |

### Types

```typescript
interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: number;
}

interface Tool {
  name: string;
  description: string;
  parameters: object;
  handler: (args: any) => Promise<any>;
}

interface CustomStyles {
  primaryColor?: string;
  headerTitle?: string;
  buttonIcon?: string;
  windowWidth?: string;
  // ... and many more
}
```

## Resources

- [Documentation](https://www.inappai.com/docs/) - Complete guides and API reference
- [GitHub Repository](https://github.com/InAppAI/react)
- [InAppAI Platform](https://www.inappai.com)
- [Live Demo](https://inappai.github.io/react)

## Requirements

- React 18.0.0 or higher (supports React 19)
- Modern browser with ES2020 support

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

Contributions are welcome! Please see our [GitHub repository](https://github.com/InAppAI/react) for contribution guidelines.

## Support

- [GitHub Issues](https://github.com/InAppAI/react/issues)
- [Website](https://www.inappai.com)

## License

MIT © [InAppAI](https://www.inappai.com)

---

Built with ❤️ by the [InAppAI](https://www.inappai.com) team
