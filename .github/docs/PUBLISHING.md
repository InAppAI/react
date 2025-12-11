# Publishing Guide

This guide explains how to build and publish the `@inappai/react` package to NPM.

## Prerequisites

Before publishing, ensure you have:

- [x] NPM account (sign up at [npmjs.com](https://www.npmjs.com/signup))
- [x] Verified email on NPM
- [x] Write access to the package (for updates)
- [x] Node.js 18+ installed
- [x] Git repository is clean (no uncommitted changes)

## Publishing Workflow

### 1. Update Version

Follow [Semantic Versioning](https://semver.org/):

- **Patch** (0.1.0 → 0.1.1): Bug fixes, minor changes
- **Minor** (0.1.0 → 0.2.0): New features, backward compatible
- **Major** (0.1.0 → 1.0.0): Breaking changes

```bash
cd packages/inappai-react

# For patch release (bug fixes)
npm version patch

# For minor release (new features)
npm version minor

# For major release (breaking changes)
npm version major

# Or set specific version
npm version 0.2.0
```

This will:
- Update `package.json` version
- Create a git commit
- Create a git tag

### 2. Update CHANGELOG (Optional but Recommended)

Create `packages/inappai-react/CHANGELOG.md` if it doesn't exist:

```markdown
# Changelog

## [0.2.0] - 2025-11-08

### Added
- New feature X
- New prop Y

### Changed
- Improved performance of Z

### Fixed
- Fixed bug A
```

### 3. Build the Package

From the **root** of the repository:

```bash
npm run build:package
```

This runs: `tsup src/index.ts --format esm,cjs --dts --external react --external react-dom --minify --clean`

**What it does:**
- Compiles TypeScript to JavaScript
- Generates type declarations (.d.ts)
- Creates ESM and CommonJS bundles
- Bundles CSS
- Minifies code
- Outputs to `packages/inappai-react/dist/`

### 4. Verify Build Output

```bash
cd packages/inappai-react

# Check dist directory
ls -lh dist/

# Expected files:
# - index.js       (CommonJS bundle)
# - index.mjs      (ESM bundle)
# - index.d.ts     (TypeScript declarations)
# - index.d.mts    (ESM TypeScript declarations)
# - index.css      (Styles)
# - *.map          (Source maps)
```

### 5. Test the Package (Optional but Recommended)

#### Option A: Dry Run

```bash
cd packages/inappai-react

# See what will be published
npm pack --dry-run

# Create tarball to inspect
npm pack
# Creates: inappai-react-1.0.0.tgz

# View contents
tar -tzf inappai-react-1.0.0.tgz
```

#### Option B: Local Test

```bash
# In the package directory
npm pack

# In a test project
npm install /path/to/react/packages/inappai-react/inappai-react-1.0.0.tgz

# Test that it works
```

### 6. Login to NPM

```bash
npm login

# Enter your credentials:
# - Username
# - Password
# - Email
# - OTP (if 2FA enabled)

# Verify login
npm whoami
```

### 7. Publish to NPM

```bash
cd packages/inappai-react

# Publish
npm publish

# For scoped packages (if name is @yourorg/inapp-ai-react)
npm publish --access public

# For beta/alpha versions
npm publish --tag beta
```

### 8. Verify Publication

```bash
# Check on NPM
npm view inapp-ai-react

# Or visit
open https://www.npmjs.com/package/inapp-ai-react

# Test installation
npm install inapp-ai-react
```

### 9. Push Git Tags

```bash
# Push the version commit and tag
git push
git push --tags

# Or combine
git push --follow-tags
```

### 10. Create GitHub Release (Optional)

1. Go to your GitHub repository
2. Click "Releases" → "Draft a new release"
3. Choose the tag (e.g., `v0.2.0`)
4. Title: `v0.2.0`
5. Description: Copy from CHANGELOG
6. Click "Publish release"

## Quick Reference

### Full Publishing Checklist

```bash
# 1. Ensure clean git state
git status

# 2. Update version
cd packages/inappai-react
npm version patch  # or minor, major

# 3. Update CHANGELOG (optional)
# Edit CHANGELOG.md

# 4. Build
cd ../..
npm run build:package

# 5. Verify build
cd packages/inappai-react
ls -lh dist/

# 6. Test (optional)
npm pack --dry-run

# 7. Login to NPM
npm login

# 8. Publish
npm publish

# 9. Push to Git
cd ../..
git push --follow-tags

# 10. Done! 🎉
```

## Version Strategy

### Pre-1.0.0 Releases

While the package is in initial development (0.x.x):

- **0.1.x**: Initial releases, expect breaking changes
- **0.2.x**: First stable API
- **0.9.x**: Release candidates for 1.0.0

### Post-1.0.0 Releases

After reaching 1.0.0:

- **1.x.x**: Stable, production-ready
- **2.x.x**: Major version with breaking changes

### Beta/Alpha Releases

For testing before official release:

```bash
# Set beta version
npm version 0.2.0-beta.1

# Publish as beta
npm publish --tag beta

# Users install with:
npm install inapp-ai-react@beta
```

## Package Contents

The published package includes only:

```json
{
  "files": [
    "dist",
    "README.md"
  ]
}
```

Everything else (src/, examples/, tests/) is **not** published to keep the package size small.

### Checking Package Size

```bash
# After building
du -sh packages/inappai-react/dist

# Current size target: < 50KB minified + gzipped
```

## Troubleshooting

### Error: "You do not have permission to publish"

**Problem:** Package name already exists on NPM

**Solution:**
1. Choose a different package name
2. Update `name` in `package.json`
3. Or request access if you should own the package

### Error: "npm ERR! need auth"

**Problem:** Not logged in to NPM

**Solution:**
```bash
npm login
```

### Error: "This package has been marked as private"

**Problem:** `private: true` in package.json

**Solution:**
```bash
# Remove or set to false
"private": false
```

### Build Fails

**Problem:** TypeScript errors or build issues

**Solution:**
```bash
# Check for errors
npm run type-check --workspace=packages/inappai-react

# Clean and rebuild
npm run clean --workspace=packages/inappai-react
npm run build:package
```

### Wrong Files Published

**Problem:** Unexpected files in the package

**Solution:**
```bash
# Check what will be included
npm pack --dry-run

# Update "files" field in package.json
```

## Updating an Existing Package

```bash
# 1. Update version
npm version patch

# 2. Build and publish
npm run build:package
cd packages/inappai-react
npm publish

# 3. Users update with:
npm update inapp-ai-react
```

## Unpublishing (Use Sparingly!)

**Warning:** Only unpublish if absolutely necessary (security issue, major error).

```bash
# Unpublish specific version (within 72 hours)
npm unpublish inapp-ai-react@0.1.0

# Deprecate instead (preferred)
npm deprecate inapp-ai-react@0.1.0 "Please use 0.1.1 instead"
```

**Note:** NPM doesn't allow re-publishing the same version after unpublishing.

## Automation (Future)

For automated publishing, see [.github/workflows/publish.yml](.github/workflows/publish.yml).

To enable:
1. Add `NPM_TOKEN` to GitHub secrets
2. Create a GitHub release
3. Workflow automatically publishes

## Support

- NPM Documentation: https://docs.npmjs.com/
- Semantic Versioning: https://semver.org/
- Package Publishing Guide: https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry

---

**Happy publishing!** 🚀
