# Installation

> Install the InAppAI React package in your project

## Prerequisites

Before installing InAppAI React, ensure you have:

- **Node.js** 16.x or higher
- **React** 18.x or higher
- **npm**, **yarn**, or **pnpm** package manager

## Install the Package

Choose your preferred package manager:

### npm

```bash
npm install @inappai/react
```

### yarn

```bash
yarn add @inappai/react
```

### pnpm

```bash
pnpm add @inappai/react
```

## Import the Styles

InAppAI React requires its CSS file to be imported. Add this to your main application file (e.g., `App.tsx` or `main.tsx`):

```tsx
import '@inappai/react/styles.css';
```

## Get Your Agent ID

To use InAppAI React, you need an Agent ID from the InAppAI platform:

1. **Sign up** at [inappai.com](https://inappai.com)
2. **Create an agent** in your dashboard
3. **Copy your Agent ID** - you'll use this in your component

The Agent ID is a public identifier (similar to Stripe's publishable key) that connects your frontend to the InAppAI backend.

## Verify Installation

Create a simple test to verify the package is installed correctly:

```tsx
import { InAppAI } from '@inappai/react';
import '@inappai/react/styles.css';

console.log('InAppAI imported successfully:', InAppAI);
```

If there are no errors, you're ready to proceed!

## TypeScript Support

InAppAI React is written in TypeScript and includes type definitions out of the box. No additional `@types` packages are needed.

```tsx
import { InAppAI, Message, Tool, CustomStyles } from '@inappai/react';
// All types are available automatically
```

## Troubleshooting

### Module not found error

If you see `Cannot find module '@inappai/react'`:

1. Ensure the package is installed: `npm list @inappai/react`
2. Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
3. Check your `package.json` includes the package in dependencies

### CSS not loading

If styles aren't applied:

1. Verify you've imported the CSS: `import '@inappai/react/styles.css'`
2. Ensure your bundler supports CSS imports (Vite, Create React App, Next.js all support this by default)
3. Check browser console for CSS loading errors

### Version conflicts

If you have React version conflicts:

```bash
npm list react
# Ensure React version is 18.x or higher
```

## Next Steps

Now that you've installed the package, continue to:

- **[Quick Start](./quick-start.md)** - Build your first chat component in 5 minutes
- **[Basic Usage](./basic-usage.md)** - Learn common patterns and configuration
