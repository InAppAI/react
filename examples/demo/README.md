# InAppAI React Demo

Live demonstration of the `@inappai/react` component with interactive examples.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit http://localhost:5173

## Available Scripts

### Development

```bash
npm run dev         # Start dev server (uses local package)
npm run build       # Build for production
npm run preview     # Preview production build
```

### Package Management

```bash
npm run use-local   # Switch to local workspace package (for development)
npm run use-npm     # Switch to NPM package (for testing production)
```

### Production Build

```bash
npm run build:prod  # Build using NPM package (like GitHub Pages)
```

## Package Modes

| Mode | Package Source | When to Use |
|------|---------------|-------------|
| **Local** (`*`) | Workspace | Development, testing local changes |
| **NPM** (`^1.0.0`) | NPM Registry | Production build, GitHub Pages |

**Default**: Local workspace (`*`)

## Development Workflow

### Normal Development

```bash
# 1. Start dev server
npm run dev

# 2. Make changes to demo or local package
# Changes to packages/inappai-react will auto-reload

# 3. Commit and push
git add .
git commit -m "feat: add new example"
git push
```

### Testing Production Build

```bash
# 1. Switch to NPM package
npm run build:prod

# 2. Preview build
npm run preview

# 3. Switch back to local
npm run use-local
npm install
```

## Deployment

The demo automatically deploys to GitHub Pages when:
- Changes are pushed to `examples/demo/` directory
- Workflow is manually triggered

See [DEPLOYMENT.md](../../.github/docs/DEPLOYMENT.md) for details.

## Features

- **Multi-page Demo**: Home, Features, Documentation, Chat examples
- **Interactive Examples**: Todo app with tools, multi-conversation
- **Theme Showcase**: All 7 built-in themes
- **Display Modes**: Popup, sidebar, panel, embedded
- **Code Snippets**: Copy-paste ready examples
- **Live Chat**: Working AI assistant with tools

## Project Structure

```
examples/demo/
├── public/           # Static assets
├── scripts/          # Package switching scripts
├── src/
│   ├── components/   # Demo UI components
│   ├── contexts/     # React contexts (Todo, etc.)
│   ├── pages/        # Demo pages
│   ├── tools/        # Tool handlers for InAppAI
│   └── Router.tsx    # App router
├── package.json      # Dependencies and scripts
└── vite.config.ts    # Vite configuration
```

## Customization

### Base Path

For GitHub Pages subdirectory deployment, set environment variable:

```bash
VITE_BASE_PATH=/react npm run build
```

### Backend Endpoint

Local development uses default endpoint. To override:

```bash
VITE_INAPPAI_ENDPOINT=http://localhost:3001 npm run dev
```

## Troubleshooting

### Demo shows old changes

Clear vite cache:
```bash
rm -rf node_modules/.vite
npm run dev
```

### Using wrong package version

Check current version:
```bash
grep '@inappai/react' package.json
```

Should show `"*"` for local development.

Switch back to local:
```bash
npm run use-local
npm install
```

### Build fails

1. Ensure package is built:
   ```bash
   cd ../../packages/inappai-react
   npm run build
   ```

2. Reinstall dependencies:
   ```bash
   cd ../../examples/demo
   npm install
   ```

## Documentation

- [Deployment Guide](../../.github/docs/DEPLOYMENT.md)
- [Package Development](../../.github/docs/DEVELOPMENT.md)
- [Workflow Details](../../.github/workflows/README.md)

## Links

- **Live Demo**: https://inappai.github.io/react (after deployment)
- **NPM Package**: https://npmjs.com/package/@inappai/react
- **Documentation**: https://github.com/InAppAI/react/tree/main/docs
