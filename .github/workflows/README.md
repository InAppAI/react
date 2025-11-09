# GitHub Actions Workflows

This directory contains GitHub Actions workflows for automated CI/CD.

## Workflows

### 1. CI (`ci.yml`)

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`

**What it does:**
- Tests on Node.js 18.x and 20.x
- Installs dependencies
- Runs linting
- Runs TypeScript type checking
- Builds the package
- Builds the demo app (with test environment variables)
- Reports package size

**Purpose:** Ensures code quality and that the package builds successfully on multiple Node.js versions.

### 2. Deploy Demo (`deploy-demo.yml`)

**Triggers:**
- Push to `main` branch
- Manual workflow dispatch

**What it does:**
- Builds the package
- Builds the demo application with production settings
- Deploys to GitHub Pages at `https://inappai.github.io/react/`

**Purpose:** Automatically deploys the live demo whenever the main branch is updated.

**Setup Required:**
1. Enable GitHub Pages in repository settings:
   - Go to Settings → Pages
   - Source: GitHub Actions
2. The workflow will automatically deploy on push to main

**Demo URL:** https://inappai.github.io/react/

## Local Testing

You can test the CI workflow locally using [act](https://github.com/nektos/act):

```bash
# Install act
brew install act

# Test CI workflow
act push
```

## Status Badges

Add these to your README to show build and deployment status:

```markdown
[![CI](https://github.com/InAppAI/react/actions/workflows/ci.yml/badge.svg)](https://github.com/InAppAI/react/actions/workflows/ci.yml)
[![Deploy Demo](https://github.com/InAppAI/react/actions/workflows/deploy-demo.yml/badge.svg)](https://github.com/InAppAI/react/actions/workflows/deploy-demo.yml)
```

## Future Enhancements

- [ ] Add automated testing when tests are implemented
- [ ] Add code coverage reporting
- [ ] Add semantic versioning automation
- [ ] Add changelog generation
- [ ] Add security scanning (Dependabot, Snyk)
- [ ] Add performance benchmarking
- [ ] Add visual regression testing

## Publishing to NPM

Publishing is done manually. See [PUBLISHING.md](../../PUBLISHING.md) in the repository root for detailed instructions.

**Quick Reference:**

```bash
# 1. Update version
cd packages/inapp-ai-react
npm version patch  # or minor, major

# 2. Build the package
npm run build

# 3. Publish to NPM
npm publish

# 4. Create GitHub release (optional)
git tag v0.1.1
git push --tags
```

## Troubleshooting

### CI workflow fails with build errors

**Problem:** Package or demo fails to build

**Solution:**
1. Check the workflow logs for specific error messages
2. Run the build locally to reproduce:
   ```bash
   npm ci
   npm run build:package
   npm run build --workspace=examples/demo
   ```
3. Fix the errors and push again

### Build fails on Node.js 18.x but works on 20.x

**Problem:** Node.js version compatibility issue

**Solution:** Update minimum Node.js version in `package.json`:
```json
{
  "engines": {
    "node": ">=20.0.0"
  }
}
```

### CI workflow shows incorrect bundle size

**Problem:** Package size calculation seems off

**Solution:** The `du -sh` command measures the entire dist directory. To see detailed breakdown:
```bash
npm run build:package
ls -lh packages/inapp-ai-react/dist/
```

## Monitoring

- **Workflow runs:** GitHub Actions tab in your repository
- **Build times:** Check "Summary" of each workflow run
- **Package size:** Reported in CI workflow output
- **NPM downloads:** https://npm-stat.com/charts.html?package=@inappai/react

---

For more information on GitHub Actions, see [GitHub Actions Documentation](https://docs.github.com/en/actions).
