# InAppAI React

> Beautiful, customizable AI chat component for React applications

[![npm version](https://img.shields.io/npm/v/@inappai/react.svg)](https://www.npmjs.com/package/@inappai/react)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**InAppAI React** is an open-source React component that lets you embed a beautiful AI chat assistant into your web application in minutes. Built for modern React applications with full TypeScript support.

## ✨ Features

- 🎯 **Multiple Display Modes** - Popup, Sidebar, Panel, or Embedded layouts
- 🎨 **7 Built-in Themes** - Light, Dark, Professional, Playful, Minimal, Ocean, Sunset
- 🔧 **Function Calling** - Let AI execute actions in your app via tools
- 📱 **Fully Responsive** - Works perfectly on desktop, tablet, and mobile
- 🎛️ **Controlled Mode** - Full control over message state and persistence
- 🔒 **Secure by Default** - Origin allowlist, JWT auth, server-side API keys
- ⚡ **TypeScript** - Complete type safety and autocomplete
- 📦 **Tiny Bundle** - Minimal dependencies, optimized for performance

## 🚀 Quick Start

### Installation

```bash
npm install @inappai/react
```

### Basic Usage

```tsx
import { useState } from 'react';
import { InAppAI, Message } from '@inappai/react';
import '@inappai/react/styles.css';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);

  return (
    <InAppAI
      agentId="your-agent-id"
      messages={messages}
      onMessagesChange={setMessages}
    />
  );
}
```

**[📖 Read the Full Quick Start Guide →](./docs/getting-started/quick-start.md)**

## 📚 Documentation

### Getting Started

Perfect for developers who are new to InAppAI React:

- **[Installation](./docs/getting-started/installation.md)** - Install the package and dependencies
- **[Quick Start](./docs/getting-started/quick-start.md)** - Get your first chat component running in 5 minutes
- **[Basic Usage](./docs/getting-started/basic-usage.md)** - Common patterns and basic configuration

### Guides

Feature-specific guides for building your chat interface:

- **[Display Modes](./docs/guides/display-modes.md)** - Popup, sidebar, panel, and embedded layouts
- **[Themes & Customization](./docs/guides/themes.md)** - Built-in themes and custom styling
- **[Tools & Function Calling](./docs/guides/tools.md)** - Enable the AI to execute functions in your app
- **[Context Passing](./docs/guides/context.md)** - Send application context to make responses relevant
- **[Conversation Persistence](./docs/guides/persistence.md)** - Save and restore conversations
- **[Message Hooks](./docs/guides/message-hooks.md)** - React to message events
- **[Authentication](./docs/guides/authentication.md)** - JWT authentication and user identity

### API Reference

Complete API documentation:

- **[Component Props](./docs/api/components.md)** - All InAppAI component props and their usage
- **[TypeScript Types](./docs/api/types.md)** - Message, Tool, and other type definitions
- **[Custom Styles](./docs/api/styling.md)** - Complete CustomStyles API reference

### Advanced Topics

Deep dives for advanced users:

- **[Architecture](./docs/advanced/architecture.md)** - How the component works internally
- **[Performance](./docs/advanced/performance.md)** - Optimization tips and best practices
- **[Security](./docs/advanced/security.md)** - Security best practices and architecture
- **[Backend Integration](./docs/advanced/backend-integration.md)** - Setting up your backend
- **[Custom Backend](./docs/advanced/custom-backend.md)** - Self-hosting the InAppAI backend
- **[Troubleshooting](./docs/advanced/troubleshooting.md)** - Common issues and solutions

**[📖 Browse All Documentation →](./docs/)**

## 💻 Code Snippets

Ready-to-use code examples you can copy and paste:

- **[Basic Setup](./examples/snippets/basic-setup.tsx)** - Minimal working example
- **[Popup Chat](./examples/snippets/popup-chat.tsx)** - Popup mode with customization
- **[Sidebar for Docs](./examples/snippets/sidebar-docs.tsx)** - Documentation site pattern
- **[Panel for IDE](./examples/snippets/panel-editor.tsx)** - Code editor integration
- **[Embedded Chat](./examples/snippets/embedded-chat.tsx)** - Custom layout example
- **[Multi-Conversation](./examples/snippets/multi-conversation.tsx)** - ChatGPT-style interface
- **[Todo with Tools](./examples/snippets/todo-with-tools.tsx)** - Function calling example
- **[With Persistence](./examples/snippets/with-persistence.tsx)** - Save conversations
- **[Custom Theme](./examples/snippets/custom-theme.tsx)** - Full customization
- **[View All Snippets →](./examples/snippets/)**

## 🎮 Demo

🚀 **[Try the Live Demo](https://inappai.github.io/react/)**

The demo showcases all features with an interactive 3-step tutorial, todo app with AI tools, and ChatGPT-like multi-conversation interface.

### Run Demo Locally

```bash
git clone https://github.com/InAppAI/react.git
cd react
npm install
npm run build:package
npm run dev:demo
```

Visit `http://localhost:5173` to see it in action.

**[📖 Demo Documentation →](./docs/demo/)**

## 🏗️ Project Structure

```
react/
├── packages/
│   └── inapp-ai-react/          # Main NPM package (@inappai/react)
│       ├── src/
│       │   ├── components/      # Core React components
│       │   ├── hooks/           # Custom React hooks
│       │   ├── types.ts         # TypeScript type definitions
│       │   └── index.ts         # Package exports
│       └── package.json
├── examples/
│   ├── demo/                    # Interactive demo application
│   └── snippets/                # Copy-paste code examples
├── docs/                        # Complete documentation
│   ├── getting-started/         # Installation & tutorials
│   ├── guides/                  # Feature guides
│   ├── api/                     # API reference
│   ├── advanced/                # Advanced topics
│   └── demo/                    # Demo documentation
└── README.md                    # This file
```

## 🤝 Contributing

Contributions are welcome! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Publishing

For maintainers: See [Publishing Guide](./.github/docs/PUBLISHING.md) for the complete guide on building and publishing to NPM.

## 📄 License

MIT © [InAppAI](https://github.com/InAppAI)

## 💬 Support

- 📧 **Email**: support@inappai.com
- 💬 **[Discord Community](https://discord.gg/inappai)** - Get help and discuss
- 🐛 **[GitHub Issues](https://github.com/InAppAI/react/issues)** - Report bugs or request features
- 🌐 **[Website](https://inappai.com)** - Get your Agent ID

## 🔗 Links

- **[NPM Package](https://www.npmjs.com/package/@inappai/react)**
- **[Live Demo](https://inappai.github.io/react/)**
- **[Documentation](./docs/)**
- **[Code Examples](./examples/snippets/)**
- **[Changelog](./CHANGELOG.md)**
- **[Security Policy](./SECURITY.md)**
- **[Code of Conduct](./CODE_OF_CONDUCT.md)**

---

**Built with ❤️ by the InAppAI team**
