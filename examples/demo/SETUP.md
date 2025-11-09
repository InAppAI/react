# InAppAI React Demo - Setup Guide

This guide will help you set up and run the InAppAI React demo application.

## Prerequisites

Before you begin, make sure you have:

1. **Node.js 18+** installed
2. **npm** installed
3. **InAppAI subscription** (or access to the backend API)

## Quick Start

### 1. Install Dependencies

From the root of the `react` repository:

```bash
npm install
```

### 2. Configure Environment Variables

The demo requires configuration to connect to the InAppAI backend API.

**Copy the example environment file:**

```bash
cd examples/demo
cp .env.example .env
```

**Edit the `.env` file** and update with your credentials:

```env
# Your InAppAI subscription ID (without "sub_" prefix)
# Example: 1SR0ARDl8ZSL5WM34jegu42m
VITE_SUBSCRIPTION_ID=your_subscription_id_here

# API Base URL
VITE_API_BASE_URL=http://localhost:5001/inapp-ai-dev/us-central1/inappai/api
```

#### Getting Your Subscription ID

**Option 1: Use the SaaS Backend**
1. Sign up at [inappai.com](https://inappai.com)
2. Get your subscription ID from the dashboard
3. Use the production API URL:
   ```
   VITE_API_BASE_URL=https://us-central1-inapp-ai-prod.cloudfunctions.net/inappai/api
   ```

**Option 2: Run Backend Locally**
1. Clone the backend: `git clone https://github.com/InAppAI/app.git`
2. Navigate to `app/` directory
3. Start Firebase emulators:
   ```bash
   cd app
   npm install
   firebase emulators:start
   ```
4. Use the local emulator URL:
   ```
   VITE_API_BASE_URL=http://localhost:5001/inapp-ai-dev/us-central1/inappai/api
   ```
5. Create a test subscription (see backend docs)

**Option 3: Self-Hosted Backend**
1. Deploy the backend to your infrastructure
2. Use your custom API URL:
   ```
   VITE_API_BASE_URL=https://your-domain.com/api
   ```

### 3. Build the Package

Before running the demo, you need to build the `inapp-ai-react` package:

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
- Documentation search tools

### 📚 **Knowledge Base**
- URL-based document ingestion
- Semantic search
- RAG (Retrieval Augmented Generation)

### 🤖 **AI Providers**
- OpenAI (GPT-4, GPT-3.5)
- Anthropic (Claude)
- Google (Gemini)

## Configuration Options

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SUBSCRIPTION_ID` | Your InAppAI subscription ID (without "sub_" prefix) | `1SR0ARDl8ZSL5WM34jegu42m` |
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:5001/...` |

### Backend Requirements

The demo requires a running InAppAI backend with:

1. **Valid subscription** configured in Firestore
2. **AI provider API key** (OpenAI, Anthropic, or Google)
3. **Knowledge Base enabled** (optional, for KB features)
4. **Allowed origins configured** (if using CORS)

See the [Backend Setup Guide](../../../app/README.md) for details.

## Troubleshooting

### Error: "Missing configuration"

**Problem:** Environment variables not set.

**Solution:**
1. Check that `.env` file exists in `examples/demo/`
2. Verify `VITE_SUBSCRIPTION_ID` and `VITE_API_BASE_URL` are set
3. Restart the dev server

### Error: "Failed to connect to backend"

**Problem:** Backend not running or wrong URL.

**Solution:**
1. Check that the backend is running
2. Verify the `VITE_API_BASE_URL` is correct
3. Check browser console for CORS errors

### Error: "Origin not allowed by CORS policy"

**Problem:** Your origin is not in the allowed origins list.

**Solution:**
1. Go to your InAppAI dashboard
2. Navigate to Agent Settings → Allowed Origins
3. Add `http://localhost:5173`

### Error: "Unauthorized" or 403

**Problem:** Invalid subscription ID or no access.

**Solution:**
1. Verify your subscription ID is correct
2. Check that the subscription exists in the backend
3. Ensure you have access to the subscription

### Knowledge Base Not Working

**Problem:** KB features return errors.

**Solution:**
1. Check that KB is enabled in Agent Settings
2. Verify documents are added to the KB
3. Check backend logs for KB-related errors

## Development

### Hot Reload

The demo uses Vite's hot module replacement. Changes to the demo code will auto-reload.

**Note:** Changes to the `inapp-ai-react` package require rebuilding:

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
│   ├── components/         # InAppAI components
│   ├── tools/             # Function calling tools
│   ├── Demo.tsx           # Main demo app
│   ├── Router.tsx         # Simple router
│   ├── useKnowledgeBase.ts # KB integration hook
│   └── main.tsx           # Entry point
├── .env.example           # Example config (commit this)
├── .env                   # Your config (gitignored)
├── package.json
├── vite.config.ts
└── SETUP.md              # This file
```

## Next Steps

1. **Explore the Demo**
   - Try different themes
   - Test function calling
   - Add documents to the KB

2. **Integrate into Your App**
   - Install `inapp-ai-react` package
   - Follow the [main README](../../README.md)
   - Configure your backend

3. **Customize**
   - Create custom themes
   - Add your own tools
   - Build custom components

## Support

- 📧 Email: support@inappai.com
- 💬 Discord: [Join our community](https://discord.gg/inappai)
- 🐛 Issues: [GitHub Issues](https://github.com/InAppAI/react/issues)
- 📖 Docs: [Full Documentation](../../README.md)

---

**Happy coding!** 🚀
