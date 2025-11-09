# InAppAI React

> Beautiful, customizable AI chat component for React applications

[![npm version](https://img.shields.io/npm/v/@inappai/react.svg)](https://www.npmjs.com/package/@inappai/react)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**InAppAI React** is an open-source React component that lets you embed a beautiful AI chat assistant into your web application in minutes. Built for modern React applications with full TypeScript support.

## Features

✨ **Beautiful UI** - Polished, professional chat interface out of the box
🎯 **Multiple Display Modes** - Popup, Sidebar, or integrated Panel layouts
🎨 **Fully Customizable** - Theme system + custom styles for complete brand control
📱 **Responsive** - Works perfectly on desktop, tablet, and mobile
🌓 **Multiple Themes** - Light, Dark, Professional, Playful, Minimal, Ocean, Sunset
⚡ **Zero Config** - Works immediately with sensible defaults
🔧 **TypeScript** - Full type safety and autocomplete
📦 **Tiny Bundle** - Minimal dependencies, optimized for performance
🔒 **Secure** - Designed to work with your secure backend
🔄 **Resizable Panels** - Drag-to-resize with constraints (panel mode)
📍 **Collapsible Sidebars** - Fold/unfold to save screen space

## Quick Start

### Installation

```bash
npm install @inappai/react
# or
yarn add @inappai/react
# or
pnpm add @inappai/react
```

### Basic Usage

```tsx
import { InAppAI } from '@inappai/react';
import '@inappai/react/styles.css';

function App() {
  return (
    <div>
      <h1>My App</h1>
      <InAppAI
        endpoint="https://api.inappai.com/api/{subscriptionId}"
        position="bottom-right"
        theme="light"
      />
    </div>
  );
}
```

That's it! You now have a fully functional AI chat assistant in your app.

## Backend Setup

The InAppAI component requires a backend server to securely handle AI API calls. This keeps your API keys safe and gives you full control over usage, costs, and rate limiting.

**Get Started:**

- Sign up at [inappai.com](https://inappai.com) to get your subscription ID
- Use the hosted SaaS backend endpoint
- Start building immediately with no infrastructure setup required

## Customization

### Themes

InAppAI comes with built-in light and dark themes:

```tsx
<InAppAI
  endpoint="https://api.inappai.com/api/{subscriptionId}"
  theme="dark"  // or "light"
/>
```

### Custom Styles

Fully customize the appearance to match your brand:

```tsx
<InAppAI
  endpoint="https://api.inappai.com/api/{subscriptionId}"
  customStyles={{
    // Branding
    primaryColor: '#6366f1',

    // Button
    buttonBackgroundColor: '#6366f1',
    buttonTextColor: '#ffffff',
    buttonSize: '60px',
    buttonIcon: '💬',

    // Window
    windowWidth: '400px',
    windowHeight: '600px',

    // Header
    headerBackground: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    headerTitle: 'Support Chat',

    // Typography
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto',
    fontSize: '14px',
  }}
/>
```

### Positioning

Place the chat widget anywhere on your page:

```tsx
<InAppAI
  endpoint="https://api.inappai.com/api/{subscriptionId}"
  position="bottom-right"  // bottom-left, top-right, top-left
/>
```

### Display Modes

InAppAI supports multiple display modes to fit different use cases:

#### Popup Mode (Default)

A floating chat window that can be positioned in any corner:

```tsx
<InAppAI
  endpoint="https://api.inappai.com/api/{subscriptionId}"
  displayMode="popup"  // default
  position="bottom-right"
/>
```

#### Sidebar Mode

Full-height sidebar on left or right side of the screen. Perfect for persistent chat interfaces:

```tsx
<InAppAI
  endpoint="https://api.inappai.com/api/{subscriptionId}"
  displayMode="sidebar-right"  // or 'sidebar-left'
  defaultFolded={false}  // Start expanded or folded
/>
```

**Sidebar Features:**
- Full viewport height
- Collapsible/foldable interface
- Overlay mode (doesn't push content)
- Perfect for documentation sites or dashboards

#### Panel Mode

Integrated resizable panels that push page content. Ideal for split-screen layouts:

```tsx
<InAppAI
  endpoint="https://api.inappai.com/api/{subscriptionId}"
  displayMode="panel-right"  // or 'panel-left'
  panelMinWidth="20%"
  panelMaxWidth="50%"
  panelDefaultWidth="30%"
  onPanelResize={(width) => console.log('Panel width:', width)}
/>
```

**Panel Features:**
- Resizable with drag handle
- Pushes page content (not overlay)
- Min/max width constraints
- Resize callbacks for layout adjustments
- Perfect for IDE-like interfaces

### Context Passing

Send application context to make responses more relevant:

```tsx
<InAppAI
  endpoint="https://api.inappai.com/api/{subscriptionId}"
  context={{
    page: window.location.pathname,
    user: {
      plan: 'premium',
      feature: 'analytics'
    }
  }}
/>
```

## API Reference

### InAppAIProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `endpoint` | `string` | **required** | Your backend API endpoint |
| `position` | `'bottom-right' \| 'bottom-left' \| 'top-right' \| 'top-left'` | `'bottom-right'` | Position of the chat widget (popup mode only) |
| `displayMode` | `'popup' \| 'sidebar-left' \| 'sidebar-right' \| 'panel-left' \| 'panel-right'` | `'popup'` | Display mode for the chat interface |
| `defaultFolded` | `boolean` | `false` | Start sidebar/panel in folded state |
| `theme` | `'light' \| 'dark' \| 'professional' \| 'playful' \| 'minimal' \| 'ocean' \| 'sunset'` | `'light'` | Color theme |
| `context` | `Record<string, any> \| () => Record<string, any>` | `undefined` | Application context to send with messages (can be function for fresh context) |
| `customStyles` | `CustomStyles` | `{}` | Custom styling options |
| `tools` | `Tool[]` | `[]` | Custom tools/functions the AI can call |
| `panelMinWidth` | `string` | `'20%'` | Minimum panel width (panel mode only) |
| `panelMaxWidth` | `string` | `'33.33%'` | Maximum panel width (panel mode only) |
| `panelDefaultWidth` | `string` | `'25%'` | Default panel width (panel mode only) |
| `onPanelResize` | `(width: number) => void` | `undefined` | Callback when panel is resized |

### CustomStyles

See [CustomStyles Documentation](./docs/CUSTOM_STYLES.md) for the full list of customization options.

## Examples

### E-Commerce Support (Popup)

```tsx
<InAppAI
  endpoint="https://api.inappai.com/api/{subscriptionId}"
  displayMode="popup"
  position="bottom-right"
  customStyles={{
    headerTitle: 'Shopping Assistant',
    buttonIcon: '🛍️',
    primaryColor: '#10b981',
  }}
  context={{
    cart: cart.items,
    page: 'product-details',
    productId: currentProduct.id,
  }}
/>
```

### Documentation Site (Sidebar)

```tsx
<InAppAI
  endpoint="https://api.inappai.com/api/{subscriptionId}"
  displayMode="sidebar-right"
  defaultFolded={true}
  customStyles={{
    headerTitle: 'Documentation Assistant',
    buttonIcon: '📚',
    sidebarWidth: '400px',
  }}
  context={() => ({
    // Fresh context on each message
    currentPage: window.location.pathname,
    scrollPosition: window.scrollY,
    selectedText: window.getSelection()?.toString(),
  })}
/>
```

### Code Editor (Panel)

```tsx
<InAppAI
  endpoint="https://api.inappai.com/api/{subscriptionId}"
  displayMode="panel-right"
  panelMinWidth="25%"
  panelMaxWidth="50%"
  panelDefaultWidth="30%"
  theme="dark"
  customStyles={{
    headerTitle: 'AI Copilot',
    buttonIcon: '🤖',
  }}
  context={{
    openFiles: editor.getOpenFiles(),
    currentFile: editor.getCurrentFile(),
    language: editor.getLanguage(),
  }}
  onPanelResize={(width) => {
    editor.layout(); // Adjust editor layout
  }}
/>
```

### SaaS Dashboard (Sidebar)

```tsx
<InAppAI
  endpoint="https://api.inappai.com/api/{subscriptionId}"
  displayMode="sidebar-left"
  theme="professional"
  customStyles={{
    headerTitle: 'AI Assistant',
    headerSubtitle: 'Always here to help',
  }}
  context={{
    user: user.email,
    plan: user.subscriptionTier,
    feature: currentFeature,
  }}
/>
```

## Demo

🚀 **[Try the Live Demo](https://inappai.github.io/react/)** - See all display modes in action!

### Run Locally

Try the demo locally in the `examples/demo` directory:

#### Quick Start

```bash
# Clone the repo
git clone https://github.com/InAppAI/react.git
cd react

# Install dependencies
npm install

# Configure your subscription ID
cd examples/demo
cp .env.example .env
# Edit .env and add your VITE_SUBSCRIPTION_ID

# Build the package and start the demo
cd ../..
npm run build:package
npm run dev:demo
```

Visit `http://localhost:5173` to see it in action.

**📖 For detailed setup instructions, see [examples/demo/SETUP.md](./examples/demo/SETUP.md)**

## Development

### Setup

```bash
# Install dependencies
npm install

# Build the package
npm run build:package

# Run the demo
npm run dev:demo
```

### Project Structure

```
inapp-ai-react/
├── packages/
│   └── inapp-ai-react/    # Main React component package
│       ├── src/
│       │   ├── components/
│       │   │   ├── InAppAI.tsx
│       │   │   └── InAppAI.css
│       │   └── index.ts
│       └── package.json
├── examples/
│   └── demo/              # Demo application
│       └── src/
├── docs/                  # Documentation
└── README.md
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

## Publishing

For maintainers: See [PUBLISHING.md](./PUBLISHING.md) for the complete guide on building and publishing to NPM.

## License

MIT © [InAppAI](https://github.com/InAppAI)

## Support

- 📧 Email: support@inappai.com
- 💬 Discord: [Join our community](https://discord.gg/inappai)
- 🐛 Issues: [GitHub Issues](https://github.com/InAppAI/react/issues)

## Roadmap

- [x] Core chat component
- [x] Theme system
- [x] Custom styling API
- [ ] Streaming responses
- [ ] File uploads
- [ ] Voice input
- [ ] Code syntax highlighting
- [ ] Multi-language support
- [ ] Plugin system

## Related Projects

- **[InAppAI Backend](https://github.com/InAppAI/app)** - Multi-tenant SaaS backend for self-hosting

---

**Built with ❤️ by the InAppAI team**
