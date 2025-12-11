# Development Guide

> Instructions for developing with InAppAI React locally

This guide is for developers working on InAppAI React itself or testing with a local backend.

## Local Backend Development

When developing locally, you'll want to point InAppAI to your local backend instead of the production API.

### Option 1: Environment Variables (Recommended)

Set the backend endpoint via environment variables:

#### For Vite Projects

Create `.env.local`:

```bash
VITE_INAPPAI_ENDPOINT=http://localhost:3001
```

#### For Create React App

Create `.env.local`:

```bash
REACT_APP_INAPPAI_ENDPOINT=http://localhost:3001
```

Then use the component normally without the `endpoint` prop:

```tsx
<InAppAI
  agentId="dev-agent"
  messages={messages}
  onMessagesChange={setMessages}
/>
```

The component will automatically use the environment variable.

### Option 2: Direct Override (Quick Testing)

For quick testing, you can override the endpoint directly:

```tsx
<InAppAI
  endpoint="http://localhost:3001"
  agentId="dev-agent"
  messages={messages}
  onMessagesChange={setMessages}
/>
```

**⚠️ Note**: Don't commit code with hardcoded local endpoints!

## Running the Demo Locally

### 1. Install Dependencies

```bash
npm install
```

### 2. Build the Package

```bash
npm run build:package
```

### 3. Start Local Backend (Optional)

If you're testing with a local backend:

```bash
# In a separate terminal
cd path/to/your/backend
npm start
```

### 4. Run the Demo

```bash
# Uses local backend at http://localhost:3001
npm run dev:demo

# Or use production backend
VITE_INAPPAI_ENDPOINT=https://api.inappai.com/api npm run dev:demo
```

Visit `http://localhost:5173`

## Development Scripts

```json
{
  "scripts": {
    "dev:demo": "npm run build:package && vite",
    "dev:demo:prod": "VITE_INAPPAI_ENDPOINT=https://api.inappai.com/api npm run dev:demo",
    "build:package": "cd packages/inapp-ai-react && npm run build",
    "watch": "cd packages/inapp-ai-react && npm run build -- --watch"
  }
}
```

## Package Development

### Watch Mode

For active development on the package:

```bash
# Terminal 1: Watch package changes
npm run watch

# Terminal 2: Run demo
npm run dev:demo
```

This will rebuild the package automatically when you make changes.

### Testing Changes

1. Make changes to `packages/inapp-ai-react/src/`
2. Package rebuilds automatically (if using watch mode)
3. Demo app hot-reloads with new changes

## Environment Variables

The component checks for endpoints in this order:

1. `endpoint` prop (if provided)
2. `process.env.REACT_APP_INAPPAI_ENDPOINT` (Create React App)
3. `import.meta.env.VITE_INAPPAI_ENDPOINT` (Vite)
4. `https://api.inappai.com/api` (default)

## Local Backend Setup

See [Custom Backend Guide](./docs/advanced/custom-backend.md) for instructions on running your own backend.

Quick start:

```bash
# Clone backend repo (if separate)
git clone https://github.com/your-org/inappai-backend
cd inappai-backend

# Install dependencies
npm install

# Set environment variables
cp .env.example .env
# Edit .env with your API keys

# Start backend
npm start
```

Backend should run on `http://localhost:3001`

## Debugging

### Enable Verbose Logging

Add logging to track endpoint resolution:

```tsx
// Temporary debugging
console.log('Endpoint:', endpoint);
console.log('Env (CRA):', process.env.REACT_APP_INAPPAI_ENDPOINT);
console.log('Env (Vite):', import.meta.env.VITE_INAPPAI_ENDPOINT);
```

### Check Network Requests

1. Open DevTools (F12)
2. Go to Network tab
3. Look for requests to your backend
4. Verify the URL matches your expected endpoint

## Common Issues

### "Backend not responding"

**Cause**: Backend isn't running or wrong port

**Solution**:
1. Check backend is running: `curl http://localhost:3001/health`
2. Verify environment variable is set correctly
3. Check for CORS errors in console

### Environment Variable Not Working

**Cause**: Environment variable naming or framework mismatch

**Solution**:
- **Vite**: Must start with `VITE_`
- **CRA**: Must start with `REACT_APP_`
- **Restart dev server** after changing .env files

### CORS Errors

**Cause**: Backend CORS not configured for localhost

**Solution**: Update backend CORS config:

```typescript
// Backend
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));
```

## Production Testing

Test with production backend locally:

```bash
VITE_INAPPAI_ENDPOINT=https://api.inappai.com/api npm run dev:demo
```

Or create `.env.production.local`:

```bash
VITE_INAPPAI_ENDPOINT=https://api.inappai.com/api
```

Then:

```bash
npm run build
npm run preview
```

## Contributing

When contributing, ensure:

1. ✅ Don't commit `.env.local` files
2. ✅ Don't hardcode `endpoint` in examples
3. ✅ Test with both local and production backends
4. ✅ Update documentation if changing endpoint behavior

## Next Steps

- [Custom Backend Setup](../../docs/advanced/custom-backend.md)
- [Backend Integration](../../docs/advanced/backend-integration.md)
- [Contributing Guide](../../CONTRIBUTING.md)
