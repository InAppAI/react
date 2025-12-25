# Contributing to InAppAI React

Thank you for your interest in contributing to InAppAI React! This document provides guidelines for contributing to the project.

## Development Setup

### Prerequisites

- Node.js 18+ and npm
- Git

### Setup Steps

1. **Fork the repository**

2. **Clone your fork**
```bash
git clone https://github.com/YOUR_USERNAME/react.git
cd react
```

3. **Install dependencies**
```bash
npm install
```

4. **Build the package**
```bash
npm run build:package
```

5. **Run the demo**
```bash
npm run dev:demo
```

## Project Structure

```
react/
├── packages/
│   └── inapp-ai-react/      # Main React component package (@inappai/react)
│       ├── src/
│       │   ├── components/   # React components
│       │   └── index.ts      # Package entry point
│       ├── package.json
│       └── tsconfig.json
├── examples/
│   └── demo/                 # Demo application
│       ├── src/
│       ├── package.json
│       └── vite.config.ts
├── .github/
│   ├── docs/                 # Internal documentation (PUBLISHING.md, DEPLOYMENT.md, etc.)
│   └── workflows/            # GitHub Actions CI/CD
├── CONTRIBUTING.md
└── README.md
```

## Development Workflow

### Making Changes

1. **Create a branch**
```bash
git checkout -b feature/my-feature
# or
git checkout -b fix/my-bugfix
```

2. **Make your changes**
   - Write clean, readable code
   - Follow existing code style
   - Add TypeScript types
   - Update documentation if needed

3. **Test your changes**
```bash
# Build the package
npm run build:package

# Test in the demo
npm run dev:demo
```

4. **Commit your changes**
```bash
git add .
git commit -m "feat: add my awesome feature"
```

### Commit Message Format

We use conventional commits:

- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation changes
- `style:` formatting, missing semicolons, etc.
- `refactor:` code restructuring
- `test:` adding tests
- `chore:` maintenance tasks

Examples:
```
feat: add streaming response support
fix: resolve chat window positioning issue
docs: update API reference for custom styles
style: format InAppAI component code
refactor: extract message rendering logic
```

### Pull Request Process

1. **Push to your fork**
```bash
git push origin feature/my-feature
```

2. **Open a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Fill out the PR template

3. **PR Requirements**
   - Clear description of changes
   - Link to related issues
   - Screenshots for UI changes
   - Passes all checks

4. **Review Process**
   - Maintainers will review your PR
   - Address any feedback
   - Once approved, it will be merged

## Code Style

### TypeScript

- Use TypeScript for all code
- Export types and interfaces
- Add JSDoc comments for public APIs

```tsx
/**
 * Props for the InAppAI component
 */
export interface InAppAIProps {
  /** Backend API endpoint */
  endpoint: string;
  /** Widget position on screen */
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}
```

### React

- Use functional components with hooks
- Prefer named exports
- Use meaningful variable names

```tsx
export function InAppAI({ endpoint, position = 'bottom-right' }: InAppAIProps) {
  const [isOpen, setIsOpen] = useState(false);
  // ...
}
```

### CSS

- Use class naming convention: `inapp-ai-*`
- Keep styles modular
- Support both light and dark themes

```css
.inapp-ai-button {
  /* Base styles */
}

.inapp-ai-theme-dark .inapp-ai-button {
  /* Dark theme overrides */
}
```

## Adding Features

### New Component Props

1. Add to TypeScript interface
2. Update component logic
3. Document in README
4. Add example in demo

### New Customization Options

1. Add to `CustomStyles` interface
2. Apply in component
3. Document with example
4. Test in both themes

### New Themes

1. Add theme CSS classes
2. Update `theme` prop type
3. Document usage
4. Add theme preview

## Documentation

When adding features:

1. Update main [README.md](./README.md)
2. Add examples to demo
3. Update API reference
4. Add JSDoc comments

## Testing

Currently, we test manually using the demo app. Future improvements:

- [ ] Unit tests with Vitest
- [ ] Component tests with Testing Library
- [ ] E2E tests with Playwright
- [ ] Visual regression tests

## Questions?

- Open a [GitHub Issue](https://github.com/InAppAI/react/issues) for bug reports or feature requests

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
