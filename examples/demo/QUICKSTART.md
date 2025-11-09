# Quick Start Guide

Get the React demo running in 3 minutes!

## Prerequisites

- Node.js 18+ installed
- OpenAI API key

## Step 1: Set up the Backend

```bash
# Navigate to backend folder
cd examples/backend

# Install dependencies (if not already done)
npm install

# Add your OpenAI API key to .env file
echo "OPENAI_API_KEY=your-key-here" >> .env

# Start the backend server
npm run start:openai
```

The backend will start on [http://localhost:3001](http://localhost:3001)

## Step 2: Start the React App

Open a **new terminal** window:

```bash
# Navigate to react-demo folder
cd examples/react-demo

# Install dependencies (if not already done)
npm install

# Start the development server
npm run dev
```

The app will start on [http://localhost:5173](http://localhost:5173) and should open automatically in your browser.

## Step 3: Try the AI Assistant!

1. You should see a purple floating button in the bottom-right corner
2. Click the button to open the AI chat interface
3. Type a message and press Enter
4. The AI will respond using OpenAI GPT-3.5-turbo!

## What You'll See

- **Todo List**: A functional task manager
- **AI Button**: Floating in the corner (customizable position)
- **Chat Interface**: Opens when you click the AI button
- **Real AI Responses**: Powered by OpenAI
- **Theme Toggle**: Switch between light and dark modes

## Troubleshooting

### "Cannot connect to backend"
- Make sure the backend server is running on port 3001
- Check that your OpenAI API key is set correctly
- Verify no firewall is blocking localhost connections

### "AI button doesn't appear"
- Check browser console for errors (F12)
- Clear browser cache and reload
- Make sure the React app compiled without errors

### Port already in use
- **3001 in use**: Another service is using the backend port
- **5173 in use**: Change the port in `vite.config.ts`

## Quick Commands

```bash
# Backend
cd examples/backend && npm run start:openai

# React App
cd examples/react-demo && npm run dev

# Both at once (in two terminals)
Terminal 1: cd examples/backend && npm run start:openai
Terminal 2: cd examples/react-demo && npm run dev
```

## What to Try

Ask the AI:
- "What can you help me with?"
- "Suggest 5 productive tasks for my todo list"
- "Explain how React works"
- "Tell me a joke about programming"
- "What's the weather like?" (will explain it can't access real-time data)

## Next Steps

- **Customize**: Change the AI button position and theme
- **Integrate**: Copy the InAppAI component to your own project
- **Explore**: Check out the component code in `src/components/InAppAI.tsx`
- **Build**: Run `npm run build` to create a production build

## Architecture

```
┌─────────────────┐
│  React App      │  <- You are here
│  :5173          │
└────────┬────────┘
         │ fetch()
         ▼
┌─────────────────┐
│  Backend        │
│  Express :3001  │
└────────┬────────┘
         │ API call
         ▼
┌─────────────────┐
│  OpenAI API     │
│  GPT-3.5-turbo  │
└─────────────────┘
```

## Support

- Read the full [README.md](README.md)
- Check the [backend integration guide](../backend/README.md)
- Review the component source code

Happy coding! 🚀
