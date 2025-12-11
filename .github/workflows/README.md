# GitHub Actions Workflows

## Deploy Demo to GitHub Pages

**File**: `deploy-demo.yml`

### Purpose
Automatically deploys the demo application to GitHub Pages when changes are pushed to the `examples/demo/` directory.

### Trigger Conditions

The workflow runs when:
1. **Push to main branch** AND changes in:
   - `examples/demo/**` (any demo files)
   - `.github/workflows/deploy-demo.yml` (the workflow itself)
2. **Manual trigger** via GitHub Actions UI

### How It Works

1. **Checkout code** - Gets latest code from repository
2. **Setup Node.js 18** - Installs Node.js with NPM cache (demo-only)
3. **Switch to NPM package** - Changes `@inappai/react` from `*` to `^1.0.0`
4. **Install demo dependencies** - Runs `npm ci` in demo directory with NPM package
5. **Build demo** - Runs production build with base path
6. **Deploy to GitHub Pages** - Publishes to GitHub Pages

**Note:** The workflow skips root-level dependency installation to avoid workspace linking issues.

### Configuration

#### Base Path
Edit in `deploy-demo.yml` to match your deployment URL:

- **Custom domain**: `VITE_BASE_PATH: '/'`
- **GitHub Pages subdirectory**: `VITE_BASE_PATH: '/react'`

#### Agent Configuration
Configure these repository secrets for the demo to work:

1. Go to repository **Settings** → **Secrets and variables** → **Actions**
2. Add the following secrets:
   - `VITE_AGENT_ID` - Your InAppAI agent ID
   - `VITE_API_BASE_URL` - Your API base URL (e.g., `https://api.inappai.com`)

#### GitHub Pages Setup

1. Go to repository **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**
3. Workflow will deploy automatically on next trigger

### Local Testing

```bash
cd examples/demo

# Test production build
npm run use-npm
npm install
npm run build
npm run preview

# Switch back to local dev
npm run use-local
npm install
```

### Development vs Production

| Aspect | Local Dev | GitHub Pages |
|--------|-----------|--------------|
| Package | Local workspace (`*`) | NPM (`^1.0.0`) |
| Build | `npm run build` | `npm run build:prod` |
| Trigger | Manual | Auto on demo changes |
