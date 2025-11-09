# InAppAI React Demo

A beautiful React application demonstrating the InAppAI embedded AI assistant component.

## Features

- 🎨 **Beautiful UI** - Modern, responsive design with light/dark themes
- 💬 **AI Chat Widget** - Floating AI assistant button with chat interface
- 🎯 **Configurable** - Position and theme customization
- ⚡ **Real-time** - Powered by OpenAI GPT-3.5-turbo
- 📝 **Todo App** - Functional demo app with AI assistance
- 🔌 **Easy Integration** - Drop-in component for any React app

## Getting Started

### Prerequisites

- Node.js 18+
- OpenAI API key (set in `examples/backend/.env`)
- Backend server running (see below)

### Installation

```bash
# From the react-demo directory
npm install
```

### Running the Demo

**Terminal 1: Start the OpenAI backend**
```bash
# From examples/backend directory
npm run start:openai
```

**Terminal 2: Start the React app**
```bash
# From react-demo directory
npm run dev
```

The app will open at [http://localhost:5173](http://localhost:5173)

## Project Structure

```
react-demo/
├── src/
│   ├── components/
│   │   ├── InAppAI.tsx       # Main AI component
│   │   └── InAppAI.css        # Component styles
│   ├── App.tsx                # Demo application
│   ├── App.css                # App styles
│   ├── main.tsx               # Entry point
│   └── index.css              # Global styles
├── index.html                 # HTML template
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript config
└── vite.config.ts             # Vite config
```

## Using the InAppAI Component

### Basic Usage

```tsx
import { InAppAI } from './components/InAppAI';

function App() {
  return (
    <div>
      <h1>My App</h1>

      {/* Add the AI assistant */}
      <InAppAI endpoint="http://localhost:3001" />
    </div>
  );
}
```

### With Configuration

```tsx
<InAppAI
  endpoint="http://localhost:3001"
  position="bottom-right"  // 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  theme="light"            // 'light' | 'dark'
/>
```

## Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `endpoint` | string | `"http://localhost:3001"` | Backend API endpoint |
| `position` | string | `"bottom-right"` | Position of the AI button |
| `theme` | string | `"light"` | Theme (light or dark) |

## Features in the Demo

### Todo List
- Add, complete, and delete tasks
- Track remaining and completed items
- Ask the AI for task suggestions!

### AI Assistant
- Click the floating AI button to open chat
- Natural conversation with GPT-3.5-turbo
- Maintains conversation history
- Shows token usage
- Connection status indicator

### Customization
- Toggle between light and dark themes
- Change AI button position
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

1. **Copy the component files:**
   - `src/components/InAppAI.tsx`
   - `src/components/InAppAI.css`

2. **Import in your app:**
   ```tsx
   import { InAppAI } from './components/InAppAI';
   ```

3. **Add to your JSX:**
   ```tsx
   <InAppAI endpoint="YOUR_BACKEND_URL" />
   ```

4. **Start your backend:**
   See `examples/backend/README.md` for backend setup

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **CSS3** - Styling with animations
- **OpenAI API** - AI backend

## Tips

- The AI button appears in the corner of your screen
- Click it to open the chat interface
- Try asking the AI:
  - "What can you help me with?"
  - "Suggest some productive tasks"
  - "Tell me a joke"
- The AI remembers the conversation context
- Use the Clear button to start fresh

## Troubleshooting

### AI button not responding
- Check that the backend is running on port 3001
- Verify your OpenAI API key is set in `examples/backend/.env`
- Check browser console for errors

### Connection failed
- Ensure CORS is enabled on the backend
- Verify the endpoint URL is correct
- Check network tab for failed requests

### Styles not loading
- Clear browser cache
- Check that CSS files are imported
- Verify Vite is bundling styles correctly

## License

MIT

## Support

For issues or questions:
- Check the main InAppAI documentation
- Review the backend integration guide
- Open an issue on GitHub
