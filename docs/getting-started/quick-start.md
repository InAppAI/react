# Quick Start

> Get your first AI chat component running in 5 minutes

This guide will help you add an AI chat assistant to your React application in just a few steps.

## Prerequisites

- InAppAI React package installed ([Installation Guide](./installation.md))
- Agent ID from [inappai.com](https://inappai.com)

## Step 1: Import the Component

```tsx
import { useState } from 'react';
import { InAppAI, Message } from '@inappai/react';
import '@inappai/react/styles.css';
```

## Step 2: Add State for Messages

InAppAI uses controlled mode - you manage the conversation state:

```tsx
function App() {
  const [messages, setMessages] = useState<Message[]>([]);

  // ... rest of your component
}
```

## Step 3: Add the Component

```tsx
function App() {
  const [messages, setMessages] = useState<Message[]>([]);

  return (
    <div>
      <h1>My App</h1>

      <InAppAI
        
        agentId="your-agent-id"  // Replace with your actual Agent ID
        messages={messages}
        onMessagesChange={setMessages}
      />
    </div>
  );
}

export default App;
```

## Step 4: Replace the Agent ID

Replace `"your-agent-id"` with your actual Agent ID from your InAppAI dashboard.

## Step 5: Run Your App

Start your development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

You should see a chat button in the bottom-right corner of your app!

## Complete Example

Here's the complete code for a minimal working example:

```tsx
import { useState } from 'react';
import { InAppAI, Message } from '@inappai/react';
import '@inappai/react/styles.css';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);

  return (
    <div className="app">
      <header>
        <h1>My Awesome App</h1>
      </header>

      <main>
        <p>Welcome! Click the chat button to talk to our AI assistant.</p>
      </main>

      <InAppAI
        
        agentId="your-agent-id"
        messages={messages}
        onMessagesChange={setMessages}
        position="bottom-right"
        theme="light"
      />
    </div>
  );
}

export default App;
```

## What Just Happened?

Let's break down what each part does:

### `endpoint`
The backend API URL that handles AI requests securely. The default InAppAI SaaS endpoint is `https://api.inappai.com/api`.

### `agentId`
Your unique agent identifier from the InAppAI dashboard. This is a public ID (not secret).

### `messages` and `onMessagesChange`
You manage the conversation state. This gives you full control over persistence, allowing you to save messages to localStorage, your database, or anywhere else.

### `position`
Where the chat button appears (optional, defaults to `bottom-right`).

### `theme`
The color scheme (optional, defaults to `light`).

## Next Steps

Now that you have a working chat component, explore more features:

### Customize the Appearance
- **[Themes](../guides/themes.md)** - Use built-in themes (dark, professional, playful, etc.)
- **[Customization](../guides/customization.md)** - Match your brand with custom styles

### Change the Layout
- **[Display Modes](../guides/display-modes.md)** - Try sidebar, panel, or embedded modes

### Add Functionality
- **[Context Passing](../guides/context.md)** - Send app context to make responses relevant
- **[Tools](../guides/tools.md)** - Let the AI perform actions in your app
- **[Persistence](../guides/persistence.md)** - Save conversations across sessions

### Production Setup
- **[Security](../advanced/security.md)** - Configure origin allowlist and JWT auth
- **[Backend Integration](../advanced/backend-integration.md)** - Set up your backend properly

## Common Customizations

### Change Position

```tsx
<InAppAI
  position="bottom-left"  // or top-right, top-left
  // ... other props
/>
```

### Use Dark Theme

```tsx
<InAppAI
  theme="dark"
  // ... other props
/>
```

### Change Button Icon

```tsx
<InAppAI
  customStyles={{
    buttonIcon: '💬',
    headerTitle: 'Support Chat',
  }}
  // ... other props
/>
```

## Troubleshooting

### Chat button not appearing

1. Check that you've imported the CSS: `import '@inappai/react/styles.css'`
2. Verify your Agent ID is correct
3. Check browser console for errors
4. Ensure the component is rendered inside your app

### Messages not sending

1. Verify your Agent ID is valid
2. Check your network tab for failed requests
3. Ensure the endpoint URL is correct
4. Check if CORS is properly configured (for custom backends)

### TypeScript errors

If you see type errors with `messages`:

```tsx
import { Message } from '@inappai/react';

const [messages, setMessages] = useState<Message[]>([]);
```

## Need Help?

- 📖 **[Basic Usage Guide](./basic-usage.md)** - Learn common patterns
- 🐛 **[Troubleshooting](../advanced/troubleshooting.md)** - Solve common issues
- 💬 **[Discord Community](https://discord.gg/inappai)** - Get help from the community
- 📧 **Email**: support@inappai.com
