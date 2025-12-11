# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2024-12-07

### Changed
- **BREAKING**: Switched to controlled-only component pattern (removed uncontrolled mode)
- **BREAKING**: `messages` and `onMessagesChange` props are now required
- `endpoint` prop is now optional and defaults to `https://api.inappai.com/api`
- Package now uses React 18 (^18.3.1) instead of React 19 for better ecosystem compatibility
- Downgraded `react-markdown` to v9 for React 18 compatibility

### Added
- Environment variable support for local development:
  - `VITE_INAPPAI_ENDPOINT` for Vite projects
  - `REACT_APP_INAPPAI_ENDPOINT` for Create React App projects
- Comprehensive documentation (14 guides, 3 API references, 6 advanced topics)
- `DEVELOPMENT.md` guide for local development workflow
- Complete test suite (50 tests) with 100% pass rate
- TypeScript build configuration for better type safety

### Fixed
- TypeScript compilation issues with React 18 JSX types
- Test suite compatibility with React 18
- Package build process now generates proper ESM/CJS/DTS outputs

## [0.1.0] - 2024-11-23

### Added
- Initial release of `@inappai/react` package
- **InAppAI Component**: Embeddable AI chat widget for React applications
- **Display Modes**: Popup, sidebar (left/right), and panel (left/right) modes
- **Themes**: Light, dark, professional, playful, minimal, ocean, and sunset themes
- **Custom Styling**: Full customization via `customStyles` prop
  - Button customization (color, size, icon, border radius)
  - Window customization (width, height, border radius)
  - Header customization (background, text color, title)
  - Message bubble customization (user/assistant colors)
  - Typography customization (font family, size)
  - Input area customization (background, border, placeholder)
- **Positioning**: Bottom-right, bottom-left, top-right, top-left positions
- **Controlled Component**: Full control over messages via props
- **Function Calling**: Support for custom tools with `onToolCall` callback
- **Streaming**: Real-time streaming responses from AI
- **Token Usage**: Display token usage information
- **TypeScript**: Full TypeScript support with exported types

### Documentation
- Comprehensive README with installation and usage guide
- CONTRIBUTING.md for contributor guidelines
- PUBLISHING.md for NPM publishing instructions
- SECURITY.md for security policy
- CODE_OF_CONDUCT.md for community guidelines
- Demo application with examples

### Demo Features
- Session-only integration pattern (Router.tsx)
- localStorage persistence pattern (ChatMultiConversation)
- Multi-conversation management
- Function calling examples (Todo tools)
- Theme switching
- Display mode switching

---

## Version History

### Pre-release Development

The package was developed as part of the InAppAI platform to provide an easy-to-integrate AI chat widget for React applications. Key development milestones:

- **Architecture**: React component with controlled state pattern
- **Styling**: CSS-in-JS with theme support
- **API Integration**: HTTP-based communication with InAppAI backend
- **Build System**: TypeScript + tsup for ESM/CJS bundles

---

## Upgrade Guide

### From Uncontrolled to Controlled Mode

If you were using an earlier version with uncontrolled mode, update your code:

**Before (uncontrolled):**
```tsx
<InAppAI
  endpoint="https://api.example.com"
  agentId="your-id"
/>
```

**After (controlled):**
```tsx
const [messages, setMessages] = useState<Message[]>([]);

<InAppAI
  endpoint="https://api.example.com"
  agentId="your-id"
  messages={messages}
  onMessagesChange={setMessages}
/>
```

This gives you full control over message state and enables custom persistence strategies.

---

[Unreleased]: https://github.com/InAppAI/react/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/InAppAI/react/releases/tag/v0.1.0
