# InAppAI React Demo - Setup Guide

This guide will help you set up and run the InAppAI React demo application.

## Prerequisites

Before you begin, make sure you have:

1. **Node.js 18+** installed
2. **npm** installed
3. **InAppAI Agent ID** from [app.inappai.com](https://app.inappai.com/)

## Quick Start

### 1. Install Dependencies

From the root of the `react` repository:

```bash
npm install
```

### 2. Configure Environment Variables

The demo requires configuration to connect to the InAppAI cloud backend.

**Copy the example environment file:**

```bash
cd examples/demo
cp .env.example .env
```

**Edit the `.env` file** and update with your Agent ID:

```env
# Your InAppAI Agent ID (get this from app.inappai.com)
VITE_AGENT_ID=your_agent_id_here

# API Base URL (InAppAI cloud backend)
VITE_API_BASE_URL=https://api.inappai.com/api
```

### Getting Your Agent ID

1. Sign up at [app.inappai.com](https://app.inappai.com/)
2. Create a subscription
3. Get your Agent ID from the dashboard
4. Add your development domain to allowed origins (e.g., `http://localhost:5173`)

### 3. Build the Package

Before running the demo, you need to build the `@inappai/react` package:

```bash
# From the root of the react repo
npm run build:package
```

### 4. Run the Demo

```bash
npm run dev:demo
```

The demo will be available at: **http://localhost:5173/**

## Demo Features

The demo showcases:

### 🎨 **Themes**
- Light, Dark, Professional, Playful, Minimal, Ocean, Sunset
- Custom theme configuration

### 💬 **Display Modes**
- Popup (floating chat widget)
- Sidebar (left/right)
- Panel (full-height left/right)

### 📍 **Positioning**
- Bottom-right, Bottom-left, Top-right, Top-left

### 🛠️ **Function Calling**
- Todo management tools
- Natural language task management

### 🤖 **AI Providers**
- OpenAI (GPT-4, GPT-4o)
- Anthropic (Claude)
- Google (Gemini)

## Configuration Options

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_AGENT_ID` | Your InAppAI Agent ID | `1SR0ARDl8ZSL5WM34jegu42m` |
| `VITE_API_BASE_URL` | Backend API base URL | `https://api.inappai.com/api` |

## Troubleshooting

### Error: "Missing configuration"

**Problem:** Environment variables not set.

**Solution:**
1. Check that `.env` file exists in `examples/demo/`
2. Verify `VITE_AGENT_ID` is set
3. Restart the dev server

### Error: "Failed to connect to backend"

**Problem:** Network or configuration issue.

**Solution:**
1. Verify your internet connection
2. Check that the `VITE_AGENT_ID` is correct
3. Verify your subscription is active at [app.inappai.com](https://app.inappai.com/)

### Error: "Origin not allowed by CORS policy"

**Problem:** Your origin is not in the allowed origins list.

**Solution:**
1. Go to your InAppAI dashboard at [app.inappai.com](https://app.inappai.com/)
2. Navigate to your subscription settings
3. Add `http://localhost:5173` to allowed origins

### Error: "Unauthorized" or 403

**Problem:** Invalid Agent ID or no access.

**Solution:**
1. Verify your Agent ID is correct
2. Check that your subscription is active
3. Ensure you have access to the agent

## Development

### Hot Reload

The demo uses Vite's hot module replacement. Changes to the demo code will auto-reload.

**Note:** Changes to the `@inappai/react` package require rebuilding:

```bash
npm run build:package
```

Then refresh the browser.

### Building for Production

```bash
# Build the package
npm run build:package

# Build the demo
cd examples/demo
npm run build

# Preview the build
npm run preview
```

## Project Structure

```
examples/demo/
├── src/
│   ├── pages/             # Page components
│   ├── contexts/          # React contexts
│   ├── hooks/             # Custom hooks
│   ├── Router.tsx         # Simple router
│   └── main.tsx           # Entry point
├── .env.example           # Example config (commit this)
├── .env                   # Your config (gitignored)
├── package.json
└── vite.config.ts
```

## Next Steps

1. **Explore the Demo**
   - Try different themes
   - Test function calling on the todo page
   - Try different display modes

2. **Integrate into Your App**
   - Install `@inappai/react` package
   - Follow the [main documentation](https://www.inappai.com/docs/)
   - Configure your Agent ID

3. **Customize**
   - Create custom themes
   - Add your own tools
   - Build custom components

## Support

- 🐛 Issues: [GitHub Issues](https://github.com/InAppAI/react/issues)
- 📖 Docs: [Full Documentation](https://www.inappai.com/docs/)

---

**Happy coding!** 🚀
