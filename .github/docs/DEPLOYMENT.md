# Deployment Guide

This document describes how demo deployment works for the InAppAI React repository.

## Overview

- **Local Development**: Uses local workspace package (`@inappai/react@*`)
- **GitHub Pages**: Uses published NPM package (`@inappai/react@^1.0.0`)
- **Deployment**: Automatic on demo changes, manual trigger available

## Quick Reference

### Local Development

```bash
cd examples/demo

# Start dev server (uses local package)
npm run dev

# Build locally
npm run build

# Preview local build
npm run preview
```

### Production Testing

```bash
cd examples/demo

# Build with NPM package (like production)
npm run build:prod

# Preview production build
npm run preview

# Switch back to local development
npm run use-local
npm install
```

### Switching Package Sources

```bash
# Use NPM package (for testing production build)
npm run use-npm
npm install

# Use local workspace (for development)
npm run use-local
npm install
```

## GitHub Actions Deployment

### Automatic Deployment

The demo deploys automatically when:
1. You push to `main` branch
2. Files in `examples/demo/` have changed

**Example workflow:**
```bash
# Make changes to demo
cd examples/demo
# ... edit files ...

# Commit and push
git add .
git commit -m "feat(demo): add new example"
git push origin main

# GitHub Actions will automatically:
# 1. Detect changes in examples/demo/
# 2. Build using NPM package @inappai/react@^1.0.0
# 3. Deploy to GitHub Pages
```

### Manual Deployment

To manually trigger deployment:
1. Go to GitHub repository → **Actions** tab
2. Select **Deploy Demo to GitHub Pages**
3. Click **Run workflow** → **Run workflow**

## Configuration

### Base Path

Edit `.github/workflows/deploy-demo.yml` line 55:

```yaml
env:
  # For custom domain (https://react-demo.inappai.com)
  VITE_BASE_PATH: '/'
  
  # For GitHub Pages subdirectory (https://username.github.io/react)
  VITE_BASE_PATH: '/react'
```

### GitHub Pages Setup

1. Go to repository **Settings** → **Pages**
2. Under **Build and deployment**:
   - Source: **GitHub Actions**
3. Save

The workflow will handle deployment automatically.

## How It Works

### Local Development Flow
```
Developer → npm run dev → Local Package → Vite Dev Server
```

### Production Deployment Flow
```
Git Push → GitHub Actions → Switch to NPM → Build → Deploy → GitHub Pages
```

### Package Resolution

| Environment | Package Source | Version |
|------------|----------------|---------|
| Local Dev | Workspace | `*` (linked) |
| GitHub Actions | NPM Registry | `^1.0.0` |
| Production Build Test | NPM Registry | `^1.0.0` |

## Scripts Reference

### Demo Scripts (`examples/demo/package.json`)

```json
{
  "scripts": {
    "dev": "vite",                          // Start dev server
    "build": "vite build",                  // Build with local package
    "build:prod": "npm run use-npm && vite build",  // Build with NPM package
    "preview": "vite preview",              // Preview built demo
    "use-npm": "node scripts/use-npm-package.js",   // Switch to NPM
    "use-local": "node scripts/use-local-package.js" // Switch to local
  }
}
```

## Troubleshooting

### Demo not updating after push

**Cause**: Changes might not be in `examples/demo/` directory

**Solution**: Check GitHub Actions tab to see if workflow ran

### Build fails with "Cannot find module @inappai/react"

**Cause**: Package not published to NPM or wrong version

**Solution**: 
1. Publish package to NPM first
2. Update version in `use-npm-package.js` if needed

### 404 errors on deployed site

**Cause**: Base path mismatch

**Solution**: 
1. Check `VITE_BASE_PATH` in workflow
2. Verify it matches your GitHub Pages URL

### Local dev using NPM package instead of workspace

**Cause**: `use-npm` was run but `use-local` wasn't run after

**Solution**:
```bash
cd examples/demo
npm run use-local
npm install
```

## Deployment Checklist

Before enabling GitHub Pages deployment:

- [ ] Publish `@inappai/react@1.0.0` to NPM
- [ ] Configure GitHub Pages in repository settings
- [ ] Verify `VITE_BASE_PATH` in workflow matches your URL
- [ ] Test production build locally with `npm run build:prod`
- [ ] Ensure `package.json` uses `@inappai/react: "*"` in git
- [ ] Push a demo change to trigger first deployment
- [ ] Verify deployment succeeded in Actions tab
- [ ] Visit deployed URL to confirm it works

## File Structure

```
.github/
  workflows/
    deploy-demo.yml          # Deployment workflow
    README.md                # Workflow documentation

examples/
  demo/
    scripts/
      use-npm-package.js     # Switch to NPM package
      use-local-package.js   # Switch to local package
    package.json             # Demo dependencies
    vite.config.ts           # Vite config with base path support
```

## Best Practices

1. **Always commit with local workspace**
   - Keep `@inappai/react: "*"` in git
   - Don't commit `^1.0.0` version

2. **Test production builds before releasing**
   ```bash
   npm run build:prod
   npm run preview
   ```

3. **Update NPM package version when needed**
   - Edit `scripts/use-npm-package.js`
   - Change `^1.0.0` to new version

4. **Manual deployments for hotfixes**
   - Use GitHub Actions manual trigger
   - Don't need to push code changes

## Related Documentation

- [GitHub Actions Workflow Details](../workflows/README.md)
- [Demo Development](../../examples/demo/README.md)
- [Package Development](./DEVELOPMENT.md)
