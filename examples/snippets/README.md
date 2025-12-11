# Code Snippets

> Ready-to-use code examples for InAppAI React

This directory contains complete, runnable code examples demonstrating various InAppAI features and use cases. Each snippet is self-contained and well-documented.

## Available Snippets

### Getting Started

1. **[basic-setup.tsx](./basic-setup.tsx)**
   - Minimal code to get started
   - Perfect for new users
   - Just add your Agent ID and you're ready!

### Display Modes

2. **[popup-chat.tsx](./popup-chat.tsx)**
   - Popup mode with customization
   - Custom styling and theming
   - Context passing example

3. **[sidebar-docs.tsx](./sidebar-docs.tsx)**
   - Sidebar mode for documentation sites
   - Dynamic context (current page, scroll position)
   - Message hooks for analytics

4. **[panel-editor.tsx](./panel-editor.tsx)**
   - Panel mode for IDE-like interfaces
   - Resizable panel with callbacks
   - Dark theme example

5. **[embedded-chat.tsx](./embedded-chat.tsx)**
   - Embedded mode for custom layouts
   - No floating button
   - Custom header example

### Advanced Features

6. **[multi-conversation.tsx](./multi-conversation.tsx)**
   - ChatGPT-style multi-conversation interface
   - Create, switch, and delete conversations
   - Complete conversation management

7. **[todo-with-tools.tsx](./todo-with-tools.tsx)**
   - AI tools (function calling) example
   - Todo app with natural language commands
   - Complete CRUD operations via AI

8. **[with-persistence.tsx](./with-persistence.tsx)**
   - Three persistence patterns:
     - localStorage (development)
     - Backend API (production)
     - Hybrid (best UX)

9. **[custom-theme.tsx](./custom-theme.tsx)**
   - Complete custom styling example
   - Match your brand identity
   - All customization options

## How to Use These Snippets

### Option 1: Copy-Paste into Your App

1. Copy the snippet code
2. Replace `your-agent-id` with your actual Agent ID
3. Install InAppAI: `npm install @inappai/react`
4. Import styles: `import '@inappai/react/styles.css'`
5. Run your app!

### Option 2: Run Snippets Standalone

Each snippet can be used as a complete component:

```tsx
// In your App.tsx
import BasicSetup from './snippets/basic-setup';

function App() {
  return <BasicSetup />;
}
```

### Option 3: Learn and Customize

Use snippets as learning examples:
- Read the comments to understand each feature
- Modify to fit your needs
- Combine patterns from multiple snippets

## Quick Reference

### Which Snippet Should I Use?

**I want to...**

- ✅ **Get started quickly** → [basic-setup.tsx](./basic-setup.tsx)
- 🎨 **Match my brand** → [custom-theme.tsx](./custom-theme.tsx)
- 💬 **Add chat to my website** → [popup-chat.tsx](./popup-chat.tsx)
- 📚 **Help users in my docs** → [sidebar-docs.tsx](./sidebar-docs.tsx)
- 🖥️ **Build an IDE feature** → [panel-editor.tsx](./panel-editor.tsx)
- 🗨️ **Create a chat app** → [embedded-chat.tsx](./embedded-chat.tsx) or [multi-conversation.tsx](./multi-conversation.tsx)
- 🔧 **Let AI control my app** → [todo-with-tools.tsx](./todo-with-tools.tsx)
- 💾 **Save conversations** → [with-persistence.tsx](./with-persistence.tsx)

## Snippet Features Matrix

| Snippet | Display Mode | Tools | Context | Persistence | Custom Styles |
|---------|--------------|-------|---------|-------------|---------------|
| basic-setup | Popup | ❌ | ❌ | ❌ | ❌ |
| popup-chat | Popup | ❌ | ✅ | ❌ | ✅ |
| sidebar-docs | Sidebar | ❌ | ✅ | ❌ | ✅ |
| panel-editor | Panel | ❌ | ✅ | ❌ | ✅ |
| embedded-chat | Embedded | ❌ | ✅ | ❌ | ❌ |
| multi-conversation | Embedded | ❌ | ✅ | ✅ | ❌ |
| todo-with-tools | Popup | ✅ | ✅ | ❌ | ✅ |
| with-persistence | Popup | ❌ | ❌ | ✅ | ❌ |
| custom-theme | Popup | ❌ | ❌ | ❌ | ✅ |

## Next Steps

After trying these snippets:

1. **[Read the Guides](../../docs/guides/)** - Deep dive into each feature
2. **[API Reference](../../docs/api/components.md)** - Complete props documentation
3. **[Examples](../../docs/examples/)** - Real-world use cases
4. **[Try the Demo](../demo/)** - Interactive demo application

## Contributing

Have a useful snippet to share?

1. Create a new `.tsx` file
2. Add comprehensive comments
3. Include a header comment explaining the snippet
4. Update this README
5. Submit a PR

## Support

Questions about these snippets?

- 📖 [Documentation](../../docs/)
- 💬 [Discord Community](https://discord.gg/inappai)
- 📧 Email: support@inappai.com
- 🐛 [GitHub Issues](https://github.com/InAppAI/react/issues)
