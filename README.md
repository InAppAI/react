# InAppAI React

> Open-source React components for AI agents that operate your UI — not just chat

[![npm version](https://img.shields.io/npm/v/@inappai/react.svg)](https://www.npmjs.com/package/@inappai/react)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

<!-- TODO: Replace with actual demo GIF once recorded (see marketing/VIRAL_MECHANICS.md) -->
<p align="center">
  <img src="https://inappai.com/images/demo/hero-demo.gif" alt="InAppAI Demo: AI agent operating a todo app through natural language" width="700">
</p>
<p align="center"><em>User says "Add three tasks" — the AI agent creates them. Not a chatbot — an agent that operates your UI.</em></p>

**InAppAI React** is an open-source React component that lets you embed AI agents into your web application in minutes. Users state their intent in natural language, and the AI executes actions through your app's tools. Built for modern React applications with full TypeScript support.

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

**[📖 Read the Full Documentation →](https://www.inappai.com/docs/)**

## 🎮 Demo

🚀 **[Try the Live Demo](https://react-demo.inappai.com/)**

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

## 📚 Documentation

Complete documentation is available at **[www.inappai.com/docs](https://www.inappai.com/docs/)**

### Getting Started

- **[Quick Start](https://www.inappai.com/docs/getting-started/)** - Get your first chat component running in 5 minutes
- **[Installation](https://www.inappai.com/docs/react/installation/)** - Install the package and dependencies

### React Guides

- **[Display Modes](https://www.inappai.com/docs/react/display-modes/)** - Popup, sidebar, panel, and embedded layouts
- **[Themes](https://www.inappai.com/docs/react/themes/)** - Built-in themes and custom styling
- **[Tools](https://www.inappai.com/docs/react/tools/)** - Enable the AI to execute functions in your app
- **[Context](https://www.inappai.com/docs/react/context/)** - Send application context to make responses relevant
- **[Persistence](https://www.inappai.com/docs/react/persistence/)** - Save and restore conversations
- **[Authentication](https://www.inappai.com/docs/react/authentication/)** - JWT authentication and user identity

### API Reference

- **[Components](https://www.inappai.com/docs/api/components/)** - All InAppAI component props
- **[Types](https://www.inappai.com/docs/api/types/)** - TypeScript type definitions
- **[Styling](https://www.inappai.com/docs/api/styling/)** - Custom styles API reference
- **[Hooks](https://www.inappai.com/docs/api/hooks/)** - useTools and useToolRegistry

### Advanced Topics

- **[Security](https://www.inappai.com/docs/advanced/security/)** - Security best practices
- **[Troubleshooting](https://www.inappai.com/docs/advanced/troubleshooting/)** - Common issues and solutions

**[📖 Browse All Documentation →](https://www.inappai.com/docs/)**

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
├── docs/                        # Developer documentation
│   └── demo/                    # Demo app architecture & setup
└── README.md                    # This file
```

## 🚀 Starter Templates

Get started in under 5 minutes with a clone-and-run template:

| Template | Description | |
|----------|-------------|--|
| [Todo Starter](https://github.com/InAppAI/starter-todo) | Minimal todo app with AI agent | `git clone https://github.com/InAppAI/starter-todo.git` |
| CRM Starter | CRM with AI-powered contact management | Coming soon |

## 🌟 Built with InAppAI

| Project | Description | Link |
|---------|-------------|------|
| Todo Demo | Official demo with AI-powered task management | [Live](https://react-demo.inappai.com) |
| *Your project here* | *[Submit a PR](./CONTRIBUTING.md) to add your project* | |

## 🤝 Contributing

Contributions are welcome! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

For developers working on the demo app, see the [Demo Documentation](./docs/demo/) for architecture details and setup guides.

## 📝 Publishing

For maintainers: See [Publishing Guide](./.github/docs/PUBLISHING.md) for the complete guide on building and publishing to NPM.

## 📄 License

MIT © [InAppAI](https://github.com/InAppAI)

## 💬 Support

- 🐛 **[GitHub Issues](https://github.com/InAppAI/react/issues)** - Report bugs or request features
- 🌐 **[Website](https://inappai.com)** - Get your Agent ID

## 🔗 Links

- **[NPM Package](https://www.npmjs.com/package/@inappai/react)**
- **[Live Demo](https://react-demo.inappai.com/)**
- **[Documentation](https://www.inappai.com/docs/)**
- **[Code Examples](./examples/snippets/)**
- **[Changelog](./CHANGELOG.md)**
- **[Security Policy](./SECURITY.md)**
- **[Code of Conduct](./CODE_OF_CONDUCT.md)**

---

**Built with ❤️ by the InAppAI team**
