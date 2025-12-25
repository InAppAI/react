# GitHub Pages Deployment Guide

This React demo is configured to be deployed to GitHub Pages with a custom domain.

## Custom Domain

The demo is deployed to: **https://react-demo.inappai.com**

## Configuration Files

### 1. CNAME File
- **Location**: `public/CNAME`
- **Content**: `react-demo.inappai.com`
- This file tells GitHub Pages to serve the site on the custom domain
- It gets automatically copied to the `dist/` folder during build

### 2. Vite Configuration
- **File**: `vite.config.ts`
- **Base Path**: Set to `/` for custom domain (not subdirectory)
- **Public Dir**: Configured to copy files from `public/` directory

### 3. GitHub Actions Workflow
- **File**: `.github/workflows/deploy-react-demo.yml`
- **Triggers**:
  - Push to `main` branch when demo or package files change
  - Manual trigger via `workflow_dispatch`
- **Build Process**:
  1. Builds the `inapp-ai-react` package
  2. Builds the demo application
  3. Uploads build artifacts to GitHub Pages
  4. Deploys to production

## DNS Configuration

To make the custom domain work, configure these DNS records in your domain registrar:

### Option 1: Using A Records (Recommended)
```
Type: A
Name: react-demo (or @ for root domain)
Value: 185.199.108.153
```
Also add these additional A records for redundancy:
- 185.199.109.153
- 185.199.110.153
- 185.199.111.153

### Option 2: Using CNAME Record
```
Type: CNAME
Name: react-demo
Value: <your-github-username>.github.io
```

## GitHub Repository Settings

1. Go to your repository **Settings** → **Pages**
2. Under **Source**, select:
   - Source: `Deploy from a branch` or `GitHub Actions` (recommended)
   - Branch: `gh-pages` (if using branch) or leave as is (if using Actions)
3. Under **Custom domain**, enter: `react-demo.inappai.com`
4. Check **Enforce HTTPS** (recommended)

## Manual Deployment

To manually trigger a deployment:

1. Go to the **Actions** tab in your GitHub repository
2. Select the **Deploy React Demo to GitHub Pages** workflow
3. Click **Run workflow**
4. Select the `main` branch
5. Click **Run workflow**

## Local Build Testing

To test the production build locally:

```bash
# Build the demo
cd react/examples/demo
npm run build

# Preview the build
npm run preview
```

The build output will be in `react/examples/demo/dist/`

## Troubleshooting

### CNAME file not in build output
- Ensure `public/CNAME` exists
- Check that `publicDir: 'public'` is set in `vite.config.ts`
- Rebuild the project

### Custom domain not working
- Verify DNS records are properly configured
- Wait for DNS propagation (can take up to 48 hours)
- Check GitHub Pages settings in repository

### Build failures
- Check GitHub Actions logs
- Ensure all dependencies are up to date
- Verify the `inapp-ai-react` package builds successfully

### 404 errors on page refresh
- This is normal for SPAs on GitHub Pages
- The build includes proper routing configuration
- If issues persist, check `index.html` is in the root of dist

## Files Modified for Deployment

1. `public/CNAME` - Custom domain configuration
2. `vite.config.ts` - Build configuration for GitHub Pages
3. `.github/workflows/deploy-react-demo.yml` - CI/CD pipeline
4. `package.json` - Updated dependencies to latest versions

## Deployment Workflow

The deployment happens automatically:

1. Developer pushes changes to `main` branch
2. GitHub Actions detects changes in demo or package files
3. Workflow builds the React package
4. Workflow builds the demo application
5. Built files are deployed to GitHub Pages
6. Site becomes available at https://react-demo.inappai.com

## Security Notes

- HTTPS is enforced by default
- No sensitive environment variables should be in the build
- API keys and secrets must be configured in GitHub Secrets if needed
