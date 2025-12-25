# Demo Application Documentation

> Interactive demo showcasing InAppAI React features

The InAppAI React demo is a comprehensive example application that demonstrates all features of the library.

## 🚀 Live Demo

**[Try the Live Demo](https://react-demo.inappai.com/)**

## 📚 Documentation

- **[Quick Start](./quickstart.md)** - Get the demo running in minutes
- **[Setup Guide](./setup.md)** - Detailed local setup instructions
- **[Features](./features.md)** - Overview of demo features
- **[Customization](./customization.md)** - How to customize the demo
- **[Deployment](./deployment.md)** - Deploy the demo to production
- **[Architecture](./architecture.md)** - Code structure and patterns
- **[React 19 Upgrade](./react19-upgrade.md)** - React 19 migration notes

For full component documentation, visit **[www.inappai.com/docs](https://www.inappai.com/docs/)**.

## What's Included

The demo showcases:

### 1. **Home Page** - Interactive Tutorial
- Choose display modes (popup, sidebar, panel, embedded)
- Test all 7 built-in themes
- Live preview of customization options
- 4-step guided tutorial

### 2. **Todo Demo** - AI Tools & Context
- Real-world example of function calling
- AI assistant that can manage your todo list
- Context passing demonstration
- Natural language task management

### 3. **Multi-Conversation Chat** - Advanced Features
- ChatGPT-like fullscreen interface
- Multiple conversation support
- localStorage persistence
- Conversation switching

## Quick Start

```bash
# Clone the repository
git clone https://github.com/InAppAI/react.git
cd react

# Install dependencies
npm install

# Configure your Agent ID
cd examples/demo
cp .env.example .env
# Edit .env and add your VITE_AGENT_ID from https://app.inappai.com/

# Build the package and start the demo
cd ../..
npm run build:package
npm run dev:demo
```

Visit `http://localhost:5173` to see it in action.

## Getting Your Agent ID

1. Sign up at [app.inappai.com](https://app.inappai.com/)
2. Create a subscription
3. Copy your **Agent ID** from the dashboard
4. Add it to your `.env` file

## Demo Routes

The demo includes multiple routes:

- `/` - Home page with mode/theme selector and tutorial
- `/todo-demo` - Todo app with AI tools demonstration
- `/chat-multi-conversation` - Fullscreen multi-conversation chat

## Development

### Project Structure

```
examples/demo/
├── src/
│   ├── pages/                   # Demo pages
│   │   ├── Home.tsx            # Main tutorial page
│   │   ├── TodoDemo.tsx        # Tools & context demo
│   │   └── ChatMultiConversation.tsx
│   ├── contexts/               # React contexts
│   │   ├── PreferenceContext.tsx   # Theme/mode persistence
│   │   └── TodoContext.tsx         # Global todo state
│   ├── hooks/                  # Custom hooks
│   │   └── useConversationStorage.ts
│   └── Router.tsx             # App routing
├── public/                     # Static assets
└── package.json
```

### Key Files

- **Router.tsx** - Main app routing with route-based context
- **PreferenceContext.tsx** - Persists user preferences (theme, mode) to localStorage
- **TodoContext.tsx** - Global state management for todos
- **useConversationStorage.ts** - Multi-conversation persistence hook

## Environment Configuration

The demo requires environment variables:

```env
# .env
VITE_AGENT_ID=your-agent-id-here
VITE_API_BASE_URL=https://api.inappai.com/api
```

Get your Agent ID from [app.inappai.com](https://app.inappai.com/).

## Learning from the Demo

The demo code is designed to be educational:

### For Beginners
- See basic setup in `src/pages/Home.tsx`
- Learn display modes and themes
- Understand message state management

### For Intermediate Users
- Study tools implementation in `src/contexts/TodoContext.tsx`
- See context passing in `TodoDemo.tsx`
- Learn persistence patterns in `useConversationStorage.ts`

### For Advanced Users
- Explore multi-conversation architecture
- Study routing patterns with InAppAI
- See production-ready code organization

## Deployment

The demo can be deployed to:
- GitHub Pages
- Vercel
- Netlify
- Any static hosting

See [Deployment Guide](./deployment.md) for detailed instructions.

## Code Examples

The demo source code includes examples of:

- ✅ All display modes (popup, sidebar, panel, embedded)
- ✅ All 7 themes
- ✅ Custom styling
- ✅ Tools & function calling
- ✅ Context passing (static and dynamic)
- ✅ Conversation persistence (localStorage)
- ✅ Multi-conversation support
- ✅ Message hooks and callbacks
- ✅ Route integration
- ✅ State management patterns

## Troubleshooting

### Demo won't start

1. Ensure Node.js 18+ is installed
2. Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
3. Make sure you're in the root `react/` directory when running `npm run dev:demo`

### Chat not working

1. Verify your `.env` file has a valid `VITE_AGENT_ID`
2. Check browser console for errors
3. Ensure you've run `npm run build:package` first
4. Verify your domain is in the allowed origins (add `http://localhost:5173` in your dashboard)

### Build errors

1. Clear build cache: `npm run clean`
2. Rebuild package: `npm run build:package`
3. Try starting demo again

## Contributing

Want to improve the demo?

1. Add new examples to showcase features
2. Improve documentation
3. Add more tool examples
4. Enhance UI/UX
5. Add tests

See [Contributing Guide](../../CONTRIBUTING.md) for details.

## Related Documentation

- **[Full Documentation](https://www.inappai.com/docs/)** - Complete InAppAI documentation
- **[Getting Started](https://www.inappai.com/docs/getting-started/)** - Quick start guide
- **[Tools Guide](https://www.inappai.com/docs/react/tools/)** - Function calling documentation
- **[API Reference](https://www.inappai.com/docs/api/)** - Complete props reference

## Support

- 🐛 [GitHub Issues](https://github.com/InAppAI/react/issues)
