# Custom Styles API

> Complete reference for the CustomStyles interface

The `customStyles` prop allows you to override any visual aspect of the InAppAI component to match your brand. All properties are optional.

## Overview

```tsx
import { InAppAI, CustomStyles } from '@inappai/react';

const customStyles: CustomStyles = {
  primaryColor: '#6366f1',
  buttonIcon: '💬',
  headerTitle: 'Support',
  // ... more customizations
};

<InAppAI
  theme="light"  // Start with a base theme
  customStyles={customStyles}  // Override specific properties
/>
```

## Primary Branding

### primaryColor

- **Type**: `string` (CSS color)
- **Default**: Theme-dependent
- **Description**: Primary brand color, affects buttons and accents

```tsx
customStyles={{ primaryColor: '#6366f1' }}
customStyles={{ primaryColor: 'rgb(99, 102, 241)' }}
customStyles={{ primaryColor: 'var(--brand-primary)' }}
```

### primaryGradient

- **Type**: `string` (CSS gradient)
- **Default**: Theme-dependent
- **Description**: Primary gradient for headers and buttons

```tsx
customStyles={{
  primaryGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
}}
```

## Chat Button

Controls the floating button appearance (popup mode only).

### buttonBackgroundColor

- **Type**: `string` (CSS color)
- **Default**: Theme-dependent
- **Description**: Button background color

```tsx
customStyles={{ buttonBackgroundColor: '#6366f1' }}
```

### buttonTextColor

- **Type**: `string` (CSS color)
- **Default**: `'#ffffff'`
- **Description**: Button text/icon color

```tsx
customStyles={{ buttonTextColor: '#ffffff' }}
```

### buttonSize

- **Type**: `string` (CSS size)
- **Default**: `'60px'`
- **Description**: Button width and height

```tsx
customStyles={{ buttonSize: '70px' }}
customStyles={{ buttonSize: '4rem' }}
```

### buttonBorderRadius

- **Type**: `string` (CSS size)
- **Default**: `'50%'` (circular)
- **Description**: Button corner rounding

```tsx
customStyles={{ buttonBorderRadius: '50%' }}  // Circle
customStyles={{ buttonBorderRadius: '12px' }}  // Rounded square
customStyles={{ buttonBorderRadius: '0' }}  // Square
```

### buttonIcon

- **Type**: `string` (text/emoji)
- **Default**: `'🤖'`
- **Description**: Button icon (emoji or text)

```tsx
customStyles={{ buttonIcon: '💬' }}
customStyles={{ buttonIcon: '🛍️' }}
customStyles={{ buttonIcon: 'AI' }}
```

## Chat Window

Controls the main chat window appearance.

### windowWidth

- **Type**: `string` (CSS size)
- **Default**: `'400px'`
- **Description**: Window width (popup mode only)

```tsx
customStyles={{ windowWidth: '450px' }}
customStyles={{ windowWidth: '30vw' }}
```

### windowHeight

- **Type**: `string` (CSS size)
- **Default**: `'600px'`
- **Description**: Window height (popup mode only)

```tsx
customStyles={{ windowHeight: '700px' }}
customStyles={{ windowHeight: '80vh' }}
```

### windowBorderRadius

- **Type**: `string` (CSS size)
- **Default**: `'12px'`
- **Description**: Window corner rounding

```tsx
customStyles={{ windowBorderRadius: '16px' }}
customStyles={{ windowBorderRadius: '0' }}  // Sharp corners
```

## Header

Controls the chat header appearance.

### headerBackground

- **Type**: `string` (CSS color or gradient)
- **Default**: Theme-dependent
- **Description**: Header background

```tsx
customStyles={{ headerBackground: '#6366f1' }}
customStyles={{
  headerBackground: 'linear-gradient(to right, #667eea, #764ba2)'
}}
```

### headerTextColor

- **Type**: `string` (CSS color)
- **Default**: `'#ffffff'`
- **Description**: Header text color

```tsx
customStyles={{ headerTextColor: '#ffffff' }}
```

### headerTitle

- **Type**: `string`
- **Default**: `'AI Assistant'`
- **Description**: Header title text

```tsx
customStyles={{ headerTitle: 'Customer Support' }}
customStyles={{ headerTitle: 'Ask Me Anything' }}
```

### headerSubtitle

- **Type**: `string`
- **Default**: Connection status
- **Description**: Header subtitle text (replaces status)

```tsx
customStyles={{ headerSubtitle: 'How can we help?' }}
customStyles={{ headerSubtitle: 'Available 24/7' }}
```

## Message Bubbles

Controls message appearance.

### userMessageBackground

- **Type**: `string` (CSS color)
- **Default**: Theme-dependent
- **Description**: User message bubble background

```tsx
customStyles={{ userMessageBackground: '#6366f1' }}
```

### userMessageColor

- **Type**: `string` (CSS color)
- **Default**: `'#ffffff'`
- **Description**: User message text color

```tsx
customStyles={{ userMessageColor: '#ffffff' }}
```

### assistantMessageBackground

- **Type**: `string` (CSS color)
- **Default**: Theme-dependent
- **Description**: Assistant message bubble background

```tsx
customStyles={{ assistantMessageBackground: '#f3f4f6' }}
```

### assistantMessageColor

- **Type**: `string` (CSS color)
- **Default**: Theme-dependent
- **Description**: Assistant message text color

```tsx
customStyles={{ assistantMessageColor: '#1f2937' }}
```

## Typography

Controls text styling throughout the component.

### fontFamily

- **Type**: `string` (CSS font-family)
- **Default**: System font stack
- **Description**: Font family for all text

```tsx
customStyles={{ fontFamily: 'Inter, sans-serif' }}
customStyles={{ fontFamily: '"Roboto", "Helvetica Neue", Arial' }}
customStyles={{ fontFamily: 'var(--font-body)' }}
```

### fontSize

- **Type**: `string` (CSS size)
- **Default**: `'14px'`
- **Description**: Base font size

```tsx
customStyles={{ fontSize: '15px' }}
customStyles={{ fontSize: '1rem' }}
```

## Input Area

Controls the message input styling.

### inputBackground

- **Type**: `string` (CSS color)
- **Default**: Theme-dependent
- **Description**: Input field background

```tsx
customStyles={{ inputBackground: '#ffffff' }}
```

### inputBorderColor

- **Type**: `string` (CSS color)
- **Default**: Theme-dependent
- **Description**: Input field border color

```tsx
customStyles={{ inputBorderColor: '#e5e7eb' }}
```

### inputTextColor

- **Type**: `string` (CSS color)
- **Default**: Theme-dependent
- **Description**: Input text color

```tsx
customStyles={{ inputTextColor: '#1f2937' }}
```

### inputPlaceholder

- **Type**: `string`
- **Default**: `'Type your message...'`
- **Description**: Input placeholder text

```tsx
customStyles={{ inputPlaceholder: 'Ask a question...' }}
customStyles={{ inputPlaceholder: 'How can we help?' }}
```

## Sidebar

Controls sidebar appearance (sidebar mode only).

### sidebarWidth

- **Type**: `string` (CSS size)
- **Default**: `'400px'`
- **Description**: Sidebar width when expanded

```tsx
customStyles={{ sidebarWidth: '450px' }}
customStyles={{ sidebarWidth: '30vw' }}
```

### sidebarFoldedWidth

- **Type**: `string` (CSS size)
- **Default**: `'60px'`
- **Description**: Sidebar width when folded

```tsx
customStyles={{ sidebarFoldedWidth: '50px' }}
```

## General Styling

### borderRadius

- **Type**: `string` (CSS size)
- **Default**: `'8px'`
- **Description**: General border radius for elements

```tsx
customStyles={{ borderRadius: '12px' }}
customStyles={{ borderRadius: '4px' }}
```

### boxShadow

- **Type**: `string` (CSS shadow)
- **Default**: Theme-dependent
- **Description**: Box shadow for window and button

```tsx
customStyles={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' }}
customStyles={{ boxShadow: 'none' }}
```

## Complete Example

```tsx
const customStyles: CustomStyles = {
  // Primary branding
  primaryColor: '#6366f1',
  primaryGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',

  // Button
  buttonBackgroundColor: '#6366f1',
  buttonTextColor: '#ffffff',
  buttonSize: '64px',
  buttonBorderRadius: '50%',
  buttonIcon: '💬',

  // Window
  windowWidth: '450px',
  windowHeight: '700px',
  windowBorderRadius: '16px',

  // Header
  headerBackground: 'linear-gradient(to right, #667eea, #764ba2)',
  headerTextColor: '#ffffff',
  headerTitle: 'Customer Support',
  headerSubtitle: 'We reply in minutes',

  // Messages
  userMessageBackground: '#6366f1',
  userMessageColor: '#ffffff',
  assistantMessageBackground: '#f3f4f6',
  assistantMessageColor: '#1f2937',

  // Typography
  fontFamily: '"Inter", -apple-system, sans-serif',
  fontSize: '15px',

  // Input
  inputBackground: '#ffffff',
  inputBorderColor: '#e5e7eb',
  inputTextColor: '#1f2937',
  inputPlaceholder: 'Ask us anything...',

  // Sidebar
  sidebarWidth: '420px',
  sidebarFoldedWidth: '50px',

  // General
  borderRadius: '12px',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
};

<InAppAI
  
  agentId="your-agent-id"
  messages={messages}
  onMessagesChange={setMessages}
  theme="light"
  customStyles={customStyles}
/>
```

## Responsive Design

All custom styles support responsive CSS values:

```tsx
customStyles={{
  windowWidth: 'min(450px, 90vw)',  // Max 450px, but 90% on small screens
  fontSize: 'clamp(14px, 1vw, 16px)',  // Responsive font size
  buttonSize: 'max(56px, 8vw)',  // Larger on small screens
}}
```

## CSS Variables

You can use CSS custom properties for dynamic theming:

```tsx
// Define in your CSS
:root {
  --brand-primary: #6366f1;
  --brand-secondary: #8b5cf6;
  --font-body: 'Inter', sans-serif;
}

// Use in customStyles
customStyles={{
  primaryColor: 'var(--brand-primary)',
  headerBackground: 'var(--brand-secondary)',
  fontFamily: 'var(--font-body)',
}}
```

## Theme-Specific Overrides

Customize differently for each theme:

```tsx
function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const customStyles: CustomStyles = {
    primaryColor: '#6366f1',
    // Override based on theme
    assistantMessageBackground: theme === 'dark' ? '#374151' : '#f3f4f6',
    assistantMessageColor: theme === 'dark' ? '#f9fafb' : '#1f2937',
  };

  return (
    <InAppAI
      theme={theme}
      customStyles={customStyles}
      // ...
    />
  );
}
```

## Common Patterns

### Match Your Brand

```tsx
customStyles={{
  primaryColor: '#your-brand-color',
  buttonIcon: 'your-logo-emoji',
  headerTitle: 'Your Company',
  fontFamily: 'Your Font, sans-serif',
}}
```

### Minimal Design

```tsx
customStyles={{
  borderRadius: '0',
  boxShadow: 'none',
  buttonBorderRadius: '0',
  windowBorderRadius: '0',
}}
```

### Compact Layout

```tsx
customStyles={{
  windowWidth: '360px',
  windowHeight: '500px',
  buttonSize: '50px',
  fontSize: '13px',
}}
```

### Large Format

```tsx
customStyles={{
  windowWidth: '600px',
  windowHeight: '800px',
  buttonSize: '80px',
  fontSize: '16px',
}}
```

## Best Practices

1. **Start with a theme** - Use built-in themes as a base, override only what you need
2. **Maintain contrast** - Ensure text is readable on all backgrounds (WCAG AA minimum)
3. **Test responsive** - Verify appearance on different screen sizes
4. **Use consistent spacing** - Keep borderRadius values harmonious
5. **Limit custom styles** - Only customize what's necessary for brand alignment

## Examples

See complete styling examples:

- [Custom Theme Example](../../examples/snippets/custom-theme.tsx) - Full customization
- [Popup Chat](../../examples/snippets/popup-chat.tsx) - Light customization
- [Themes Guide](../guides/themes.md) - Built-in theme showcase

## Next Steps

- [Themes Guide](../guides/themes.md) - Built-in themes and customization
- [Component Props](./components.md) - All component props
- [Examples](../examples/) - Real-world styling examples
