# Internal Documentation

This directory contains documentation for **maintainers and contributors** of the InAppAI React repository.

## Files in this Directory

- **[DEVELOPMENT.md](./DEVELOPMENT.md)** - Local development guide for contributors
- **[PUBLISHING.md](./PUBLISHING.md)** - NPM publishing workflow for maintainers
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - GitHub Pages deployment guide for maintainers

## For Package Users

If you're using `@inappai/react` in your project, see:

- **[Package README](../../packages/inappai-react/README.md)** - Quick start and API reference
- **[Documentation](../../docs/README.md)** - Complete guides and examples
- **[Live Demo](https://inappai.github.io/react)** - Interactive examples

## For Contributors

If you want to contribute to InAppAI React:

1. Start with **[CONTRIBUTING.md](../../CONTRIBUTING.md)**
2. Review **[DEVELOPMENT.md](./DEVELOPMENT.md)** for local setup
3. Follow **[CODE_OF_CONDUCT.md](../../CODE_OF_CONDUCT.md)**

## For Maintainers

Publishing and deployment workflows:

1. **Publishing**: See [PUBLISHING.md](./PUBLISHING.md) for NPM release process
2. **Deployment**: See [DEPLOYMENT.md](./DEPLOYMENT.md) for GitHub Pages setup
3. **Workflows**: See [workflows/README.md](../workflows/README.md) for GitHub Actions

## Repository Structure

```
react/
├── .github/
│   ├── docs/              # You are here (maintainer docs)
│   └── workflows/         # GitHub Actions CI/CD
├── docs/                  # User-facing documentation
├── packages/
│   └── inappai-react/     # Main NPM package
├── examples/
│   ├── demo/              # Live demo application
│   └── snippets/          # Code examples
├── CONTRIBUTING.md        # Contributor guidelines
├── CODE_OF_CONDUCT.md     # Community guidelines
├── SECURITY.md            # Security policy
├── CHANGELOG.md           # Version history
└── README.md              # Repository overview
```
