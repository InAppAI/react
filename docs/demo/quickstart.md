# Quick Start Guide

Get the React demo running in 3 minutes!

## Prerequisites

- Node.js 18+ installed
- An InAppAI Agent ID from [app.inappai.com](https://app.inappai.com/)

## Step 1: Clone and Install

```bash
# Clone the repository
git clone https://github.com/InAppAI/react.git
cd react

# Install dependencies
npm install
```

## Step 2: Configure Environment

```bash
# Navigate to demo folder
cd examples/demo

# Copy environment template
cp .env.example .env

# Edit .env with your values
```

Update your `.env` file:

```bash
# Your InAppAI Agent ID (from app.inappai.com)
VITE_AGENT_ID=your_agent_id_here

# API Base URL (InAppAI cloud backend)
VITE_API_BASE_URL=https://api.inappai.com/api
```

## Step 3: Build and Run

```bash
# Go back to root
cd ../..

# Build the package
npm run build:package

# Start the demo
npm run dev:demo
```

The app will start on [http://localhost:5173](http://localhost:5173).

## Step 4: Try the AI Assistant!

1. You should see a floating button in the bottom-right corner
2. Click the button to open the AI chat interface
3. Type a message and press Enter
4. The AI will respond!

## What You'll See

- **AI Button**: Floating in the corner (customizable position)
- **Chat Interface**: Opens when you click the AI button
- **Real AI Responses**: Powered by your configured AI provider
- **Theme Toggle**: Switch between multiple themes
- **Display Modes**: Try popup, sidebar, or panel modes

## Troubleshooting

### "Cannot connect to backend"
- Make sure you have a valid Agent ID from [app.inappai.com](https://app.inappai.com/)
- Check that your Agent ID is set correctly in `.env`
- Verify your subscription is active

### "Origin not allowed"
- Add `http://localhost:5173` to your allowed origins in the InAppAI dashboard

### "AI button doesn't appear"
- Check browser console for errors (F12)
- Clear browser cache and reload
- Make sure the React app compiled without errors

### Port already in use
- **5173 in use**: Vite will automatically try the next available port

## Quick Commands

```bash
# Install dependencies
npm install

# Build the package
npm run build:package

# Start development server
npm run dev:demo

# Build for production
cd examples/demo && npm run build

# Preview production build
npm run preview
```

## What to Try

Ask the AI:
- "What can you help me with?"
- "Add a task to buy groceries" (on the Todo Demo page)
- "What themes are available?"
- "Tell me a joke about programming"

## Architecture

```
┌─────────────────┐
│  React App      │  <- You are here
│  :5173          │
└────────┬────────┘
         │ fetch()
         ▼
┌─────────────────┐
│  InAppAI Cloud  │
│  Backend API    │
└────────┬────────┘
         │ API call
         ▼
┌─────────────────┐
│  AI Provider    │
│  (OpenAI, etc)  │
└─────────────────┘
```

## API Endpoints Used

The demo uses these endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/{agentId}/health` | GET | Health check |
| `/{agentId}/chat` | POST | Send chat message |

## Next Steps

- **Customize**: Change the AI button position and theme
- **Integrate**: Use the `@inappai/react` package in your own project
- **Explore**: Check out the component code in `src/`
- **Build**: Run `npm run build` to create a production build

## Support

- Read the full [Setup Guide](./setup.md)
- Check the [Customization Guide](./customization.md)
- Visit [Full Documentation](https://www.inappai.com/docs/)

Happy coding! 🚀
