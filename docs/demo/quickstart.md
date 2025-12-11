# Quick Start Guide

Get the React demo running in 3 minutes!

## Prerequisites

- Node.js 18+ installed
- An InAppAI Agent ID
- Backend API running (Cloud Run)

## Step 1: Configure Environment

```bash
# Navigate to demo folder
cd react/examples/demo

# Copy environment template
cp .env.example .env

# Edit .env with your values
```

Update your `.env` file:

```bash
# Your InAppAI Agent ID
VITE_AGENT_ID=your_agent_id_here

# API Base URL
VITE_API_BASE_URL=http://localhost:8081/api
```

## Step 2: Install Dependencies

```bash
npm install
```

## Step 3: Start the React App

```bash
npm run dev
```

The app will start on [http://localhost:5173](http://localhost:5173) and should open automatically in your browser.

> **Note**: Ensure your backend is running at the configured `VITE_API_BASE_URL`.

## Step 4: Try the AI Assistant!

1. You should see a floating button in the bottom-right corner
2. Click the button to open the AI chat interface
3. Type a message and press Enter
4. The AI will respond!

## What You'll See

- **AI Button**: Floating in the corner (customizable position)
- **Chat Interface**: Opens when you click the AI button
- **Real AI Responses**: Powered by your configured LLM
- **Theme Toggle**: Switch between multiple themes
- **Display Modes**: Try popup, sidebar, or panel modes

## Troubleshooting

### "Cannot connect to backend"
- Make sure the backend server is running
- Check that your Agent ID is set correctly in `.env`
- Verify the `VITE_API_BASE_URL` is correct

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

# Start development server
npm run dev

# Build for production
npm run build

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
│  Cloud Run API  │
│  /api/{subId}/* │
└────────┬────────┘
         │ API call
         ▼
┌─────────────────┐
│  LLM Provider   │
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
- **Explore**: Check out the component code in `src/components/`
- **Build**: Run `npm run build` to create a production build

## Support

- Read the full [README.md](README.md)
- Check the [CUSTOMIZATION.md](CUSTOMIZATION.md) guide
- Review the component source code

Happy coding! 🚀
