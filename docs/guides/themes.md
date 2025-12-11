# Themes & Customization

> Customize the appearance to match your brand

InAppAI React comes with 7 built-in themes and extensive customization options to match your brand identity. You can use themes as-is or override them with custom styles.

## Built-in Themes

Choose from 7 professionally designed themes:

| Theme | Description | Best For |
|-------|-------------|----------|
| **light** | Clean white background, blue accents | General purpose, modern apps |
| **dark** | Dark background, reduced eye strain | Night mode, developer tools |
| **professional** | Refined blues and grays | Business apps, enterprise |
| **playful** | Vibrant colors, rounded corners | Consumer apps, casual use |
| **minimal** | Monochrome, ultra-clean | Documentation, minimalist design |
| **ocean** | Blue and teal gradient | Marine, travel, water themes |
| **sunset** | Orange and pink gradient | Creative, warm branding |

## Using Built-in Themes

Simply set the `theme` prop:

```tsx
import { InAppAI, Message } from '@inappai/react';
import { useState } from 'react';
import '@inappai/react/styles.css';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);

  return (
    <InAppAI
      
      agentId="your-agent-id"
      messages={messages}
      onMessagesChange={setMessages}
      theme="dark"  // or: light, professional, playful, minimal, ocean, sunset
    />
  );
}
```

## Custom Styling

Override any aspect of the appearance using the `customStyles` prop.

### Complete Customization Example

```tsx
<InAppAI
  
  agentId="your-agent-id"
  messages={messages}
  onMessagesChange={setMessages}

  // Start with a base theme (optional)
  theme="light"

  // Override with your brand styles
  customStyles={{
    // Primary branding
    primaryColor: '#6366f1',
    primaryGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',

    // Chat button
    buttonBackgroundColor: '#6366f1',
    buttonTextColor: '#ffffff',
    buttonSize: '60px',
    buttonBorderRadius: '50%',
    buttonIcon: '💬',
    buttonBoxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',

    // Chat window
    windowWidth: '420px',
    windowHeight: '650px',
    windowBorderRadius: '16px',
    windowBoxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',

    // Header
    headerBackground: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    headerTextColor: '#ffffff',
    headerTitle: 'Support Assistant',
    headerSubtitle: 'How can we help?',
    headerHeight: '80px',

    // Message bubbles
    userMessageBackground: '#6366f1',
    userMessageTextColor: '#ffffff',
    assistantMessageBackground: '#f3f4f6',
    assistantMessageTextColor: '#1f2937',
    messageBorderRadius: '12px',
    messageMargin: '8px 0',

    // Input area
    inputBackground: '#ffffff',
    inputTextColor: '#1f2937',
    inputBorderColor: '#e5e7eb',
    inputPlaceholder: 'Type your message...',
    inputHeight: '50px',

    // Send button
    sendButtonBackground: '#6366f1',
    sendButtonTextColor: '#ffffff',
    sendButtonHoverBackground: '#4f46e5',

    // Typography
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto',
    fontSize: '15px',

    // Sidebar (for sidebar mode)
    sidebarWidth: '380px',
    sidebarBackground: '#ffffff',
    sidebarBorderColor: '#e5e7eb',

    // Panel (for panel mode)
    panelBackground: '#ffffff',
    panelBorderColor: '#e5e7eb',
  }}
/>
```

## CustomStyles API Reference

For the complete list of all available style properties, see the [Custom Styles API Reference](../api/styling.md).

### Common Customizations

#### Change Button Icon

```tsx
customStyles={{
  buttonIcon: '🤖',  // Any emoji or text
  buttonSize: '64px',
}}
```

#### Brand Colors

```tsx
customStyles={{
  primaryColor: '#ff6b6b',
  buttonBackgroundColor: '#ff6b6b',
  userMessageBackground: '#ff6b6b',
  sendButtonBackground: '#ff6b6b',
}}
```

#### Custom Header

```tsx
customStyles={{
  headerTitle: 'Customer Support',
  headerSubtitle: 'We reply in minutes',
  headerBackground: 'linear-gradient(to right, #667eea, #764ba2)',
  headerTextColor: '#ffffff',
  headerHeight: '100px',
}}
```

#### Typography

```tsx
customStyles={{
  fontFamily: '"Inter", sans-serif',
  fontSize: '16px',
}}
```

#### Window Size

```tsx
customStyles={{
  windowWidth: '500px',
  windowHeight: '700px',
  windowBorderRadius: '20px',
}}
```

#### Sidebar Width

For `sidebar-left` or `sidebar-right` display modes:

```tsx
customStyles={{
  sidebarWidth: '450px',
  sidebarFoldedWidth: '60px',  // When collapsed
}}
```

## Mixing Themes and Custom Styles

You can use a built-in theme as a base and override specific properties:

```tsx
<InAppAI
  theme="dark"  // Start with dark theme
  customStyles={{
    // Override just the accent color
    primaryColor: '#f59e0b',
    buttonBackgroundColor: '#f59e0b',
    userMessageBackground: '#f59e0b',
  }}
/>
```

This approach gives you the polish of a complete theme while allowing brand customization.

## Responsive Design

All themes and custom styles are responsive by default. The component automatically adjusts:

- **Mobile**: Full-screen chat on small screens
- **Tablet**: Smaller window size, adjusted sidebar width
- **Desktop**: Full custom dimensions

To customize responsive behavior, use CSS media queries in your app:

```css
@media (max-width: 768px) {
  /* Your responsive overrides */
}
```

## Examples

### E-Commerce Brand

```tsx
<InAppAI
  theme="light"
  customStyles={{
    buttonIcon: '🛍️',
    primaryColor: '#10b981',
    headerTitle: 'Shopping Assistant',
    headerBackground: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  }}
/>
```

### Developer Tool

```tsx
<InAppAI
  theme="dark"
  customStyles={{
    buttonIcon: '⚡',
    fontFamily: '"Fira Code", monospace',
    headerTitle: 'AI Assistant',
  }}
/>
```

### Corporate Dashboard

```tsx
<InAppAI
  theme="professional"
  customStyles={{
    buttonIcon: '💼',
    primaryColor: '#2563eb',
    headerTitle: 'Enterprise Support',
    headerSubtitle: 'Available 24/7',
  }}
/>
```

## Best Practices

1. **Start with a theme** - Use built-in themes as a base, override only what you need
2. **Maintain contrast** - Ensure text is readable on all backgrounds
3. **Be consistent** - Match your app's design system
4. **Test on mobile** - Verify appearance on different screen sizes
5. **Use gradients sparingly** - They can be powerful but shouldn't overwhelm

## Code Snippets

See these complete examples:

- [Custom Theme Example](../../examples/snippets/custom-theme.tsx) - Full customization
- [Popup Chat](../../examples/snippets/popup-chat.tsx) - Light customization
- [Sidebar Docs](../../examples/snippets/sidebar-docs.tsx) - Professional theme

## Next Steps

- [Display Modes](./display-modes.md) - Choose the right layout
- [Custom Styles API](../api/styling.md) - Complete style reference
- [Examples](../examples/) - See real-world implementations
