# InAppAI React Demo

A beautiful React application demonstrating the InAppAI embedded AI assistant component.

## Features

- 🎨 **Beautiful UI** - Modern, responsive design with multiple themes
- 💬 **AI Chat Widget** - Floating AI assistant with chat interface
- 🎯 **Configurable** - Position, theme, and style customization
- ⚡ **Real-time** - Powered by your configured LLM provider
- 📝 **Todo App** - Functional demo app with AI assistance
- 🔌 **Easy Integration** - Drop-in component for any React app
- 🛠️ **Function Calling** - AI can interact with your app via tools

## Getting Started

### Prerequisites

- Node.js 18+
- An InAppAI subscription ID
- Backend server running (Cloud Run or local)

### Installation

```bash
# From the demo directory
cd react/examples/demo
npm install
```

### Configuration

Create a `.env` file based on `.env.example`:

```bash
# Your InAppAI subscription ID
VITE_SUBSCRIPTION_ID=your_subscription_id_here

# API Base URL (includes /api path)
VITE_API_BASE_URL=http://localhost:8081/api
```

### Running the Demo

```bash
# Start the React app
npm run dev
```

The app will open at [http://localhost:5173](http://localhost:5173)

> **Note**: Make sure your backend (Cloud Run) is running and accessible at the configured `VITE_API_BASE_URL`.

## Project Structure

```
demo/
├── src/
│   ├── components/
│   │   ├── InAppAI-Enhanced.tsx  # Demo AI component
│   │   └── InAppAI-Enhanced.css  # Component styles
│   ├── contexts/                  # React contexts
│   ├── hooks/                     # Custom hooks
│   ├── pages/                     # Demo pages
│   ├── tools/                     # AI tool definitions
│   ├── Router.tsx                 # App router
│   └── main.tsx                   # Entry point
├── .env.example                   # Environment template
├── package.json                   # Dependencies
├── tsconfig.json                  # TypeScript config
└── vite.config.ts                 # Vite config
```

## Using the InAppAI Component

### Basic Usage

```tsx
import { InAppAI } from '@inappai/react';
import '@inappai/react/styles.css';

function App() {
  return (
    <div>
      <h1>My App</h1>

      {/* Add the AI assistant */}
      <InAppAI
        endpoint="https://api.inappai.com/api"
        subscriptionId="your-subscription-id"
      />
    </div>
  );
}
```

### With Configuration

```tsx
<InAppAI
  endpoint="https://api.inappai.com/api"
  subscriptionId="your-subscription-id"
  position="bottom-right"
  displayMode="popup"
  theme="light"
  customStyles={{
    headerTitle: 'My AI Assistant',
  }}
/>
```

## Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `endpoint` | string | required | Backend API base URL (e.g., `https://api.inappai.com/api`) |
| `subscriptionId` | string | required | Your InAppAI subscription ID |
| `position` | string | `"bottom-right"` | Button position (`bottom-right`, `bottom-left`, `top-right`, `top-left`) |
| `displayMode` | string | `"popup"` | Display mode (`popup`, `sidebar-left`, `sidebar-right`, `panel-left`, `panel-right`) |
| `theme` | string | `"light"` | Theme (`light`, `dark`, `professional`, `playful`, `minimal`, `ocean`, `sunset`) |
| `context` | object/function | - | Context data passed to AI |
| `tools` | array | `[]` | Tool definitions for function calling |
| `customStyles` | object | `{}` | Custom styling options |

## Features in the Demo

### Display Modes
- **Popup**: Floating button with expandable chat window
- **Sidebar**: Fixed sidebar on left or right
- **Panel**: Resizable panel integrated with your layout

### AI Assistant
- Click the floating AI button to open chat
- Natural conversation with your configured LLM
- Maintains conversation history
- Shows token usage
- Connection status indicator

### Todo Demo
- AI-powered task management
- Add, complete, and delete tasks via natural language
- Demonstrates function calling capabilities

### Customization
- Multiple built-in themes
- Custom styling via `customStyles` prop
- Responsive design for mobile

## Development

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Integration Guide

To add the InAppAI component to your own React app:

1. **Install the package:**
   ```bash
   npm install @inappai/react
   ```

2. **Import in your app:**
   ```tsx
   import { InAppAI } from '@inappai/react';
   import '@inappai/react/styles.css';
   ```

3. **Add to your JSX:**
   ```tsx
   <InAppAI
     endpoint="https://api.inappai.com/api"
     subscriptionId="YOUR_SUBSCRIPTION_ID"
   />
   ```

4. **Get your subscription ID:**
   Sign up at [inappai.com](https://inappai.com) to get your subscription ID.

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **CSS3** - Styling with animations

## Architecture

```
┌─────────────────┐
│  React App      │  <- You are here
│  :5173          │
└────────┬────────┘
         │ fetch()
         ▼
┌─────────────────┐
│  Cloud Run      │
│  Backend API    │
└────────┬────────┘
         │ API call
         ▼
┌─────────────────┐
│  LLM Provider   │
│  (OpenAI, etc)  │
└─────────────────┘
```

## Troubleshooting

### AI button not responding
- Check that the backend is running and accessible
- Verify your subscription ID is correct
- Check browser console for errors

### Connection failed
- Ensure CORS is enabled on the backend
- Verify the endpoint URL is correct
- Check network tab for failed requests

### Styles not loading
- Make sure to import `@inappai/react/styles.css`
- Clear browser cache and reload

## License

MIT

## Support

For issues or questions:
- Check the main InAppAI documentation
- Open an issue on GitHub
