# InAppAI Component Customization Guide

The InAppAI React component is fully customizable to match your app's branding and design.

## Basic Usage

```tsx
<InAppAI
  agentId="your-agent-id"
  position="bottom-right"
  theme="light"
/>
```

## Full Customization

```tsx
<InAppAI
  agentId="your-agent-id"
  position="bottom-right"
  theme="light"
  customStyles={{
    // Button customization
    buttonBackgroundColor: '#FF6B6B',
    buttonTextColor: '#FFFFFF',
    buttonSize: '70px',
    buttonBorderRadius: '50%',
    buttonIcon: '💬',

    // Window customization
    windowWidth: '450px',
    windowHeight: '650px',
    windowBorderRadius: '20px',

    // Header customization
    headerBackground: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)',
    headerTextColor: '#FFFFFF',
    headerTitle: 'Customer Support',

    // Message bubbles
    userMessageBackground: '#FF6B6B',
    userMessageColor: '#FFFFFF',
    assistantMessageBackground: '#F1F3F5',
    assistantMessageColor: '#212529',

    // Typography
    fontFamily: '"Inter", sans-serif',
    fontSize: '15px',

    // Input area
    inputBackground: '#FFFFFF',
    inputBorderColor: '#DEE2E6',
    inputTextColor: '#212529',
    inputPlaceholder: 'Ask us anything...',

    // Other
    borderRadius: '12px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
  }}
/>
```

## Customization Options

### Button Customization
| Property | Type | Description | Example |
|----------|------|-------------|---------|
| `buttonBackgroundColor` | string | Button background color | `'#FF6B6B'` |
| `buttonTextColor` | string | Button text/icon color | `'#FFFFFF'` |
| `buttonSize` | string | Button width and height | `'70px'` |
| `buttonBorderRadius` | string | Button corner rounding | `'50%'` or `'12px'` |
| `buttonIcon` | string | Icon/emoji for button | `'💬'` or `'🤖'` |

### Window Customization
| Property | Type | Description | Example |
|----------|------|-------------|---------|
| `windowWidth` | string | Chat window width | `'450px'` |
| `windowHeight` | string | Chat window height | `'650px'` |
| `windowBorderRadius` | string | Window corner rounding | `'20px'` |

### Header Customization
| Property | Type | Description | Example |
|----------|------|-------------|---------|
| `headerBackground` | string | Header background | `'#FF6B6B'` or gradient |
| `headerTextColor` | string | Header text color | `'#FFFFFF'` |
| `headerTitle` | string | Header title text | `'Customer Support'` |

### Message Bubble Customization
| Property | Type | Description | Example |
|----------|------|-------------|---------|
| `userMessageBackground` | string | User message bubble color | `'#FF6B6B'` |
| `userMessageColor` | string | User message text color | `'#FFFFFF'` |
| `assistantMessageBackground` | string | AI message bubble color | `'#F1F3F5'` |
| `assistantMessageColor` | string | AI message text color | `'#212529'` |

### Typography
| Property | Type | Description | Example |
|----------|------|-------------|---------|
| `fontFamily` | string | Font family for all text | `'"Inter", sans-serif'` |
| `fontSize` | string | Base font size | `'15px'` |

### Input Area
| Property | Type | Description | Example |
|----------|------|-------------|---------|
| `inputBackground` | string | Input field background | `'#FFFFFF'` |
| `inputBorderColor` | string | Input field border color | `'#DEE2E6'` |
| `inputTextColor` | string | Input text color | `'#212529'` |
| `inputPlaceholder` | string | Input placeholder text | `'Ask us anything...'` |

### Other
| Property | Type | Description | Example |
|----------|------|-------------|---------|
| `borderRadius` | string | Global border radius | `'12px'` |
| `boxShadow` | string | Window box shadow | `'0 10px 40px rgba(0,0,0,0.15)'` |

## Brand Examples

### Example 1: E-commerce Style (Red/Pink)
```tsx
customStyles={{
  buttonBackgroundColor: '#E94560',
  buttonIcon: '🛍️',
  headerBackground: 'linear-gradient(135deg, #E94560 0%, #FF6B9D 100%)',
  headerTitle: 'Shopping Assistant',
  userMessageBackground: '#E94560',
  inputPlaceholder: 'How can we help you shop?',
}}
```

### Example 2: Tech Startup (Blue/Purple)
```tsx
customStyles={{
  buttonBackgroundColor: '#667eea',
  buttonIcon: '⚡',
  headerBackground: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  headerTitle: 'AI Assistant',
  userMessageBackground: '#667eea',
  fontFamily: '"Space Grotesk", sans-serif',
}}
```

### Example 3: Financial Services (Green/Professional)
```tsx
customStyles={{
  buttonBackgroundColor: '#10B981',
  buttonIcon: '💼',
  headerBackground: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
  headerTitle: 'Financial Advisor',
  userMessageBackground: '#10B981',
  assistantMessageBackground: '#F0FDF4',
  inputPlaceholder: 'Ask about your finances...',
}}
```

### Example 4: Healthcare (Calm Blue)
```tsx
customStyles={{
  buttonBackgroundColor: '#3B82F6',
  buttonIcon: '🩺',
  headerBackground: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)',
  headerTitle: 'Health Assistant',
  userMessageBackground: '#3B82F6',
  assistantMessageBackground: '#EFF6FF',
  borderRadius: '16px',
  inputPlaceholder: 'Ask a health question...',
}}
```

### Example 5: Gaming (Dark/Neon)
```tsx
customStyles={{
  buttonBackgroundColor: '#8B5CF6',
  buttonIcon: '🎮',
  headerBackground: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
  headerTitle: 'Game Helper',
  userMessageBackground: '#8B5CF6',
  assistantMessageBackground: '#1F2937',
  assistantMessageColor: '#E5E7EB',
  fontFamily: '"Press Start 2P", monospace',
  boxShadow: '0 0 40px rgba(139, 92, 246, 0.4)',
}}
```

## Tips for Customization

1. **Match Your Brand Colors**: Use your primary brand color for buttons and user messages
2. **Maintain Readability**: Ensure good contrast between text and background colors
3. **Consistent Spacing**: Use similar border radius values throughout
4. **Font Pairing**: Choose fonts that complement your app's typography
5. **Test Both Themes**: Make sure your customizations work in both light and dark modes
6. **Mobile Friendly**: Test different window sizes on mobile devices

## Dynamic Styling

You can also change styles dynamically based on user preferences:

```tsx
const [userTheme, setUserTheme] = useState('default');

const getCustomStyles = () => {
  if (userTheme === 'vibrant') {
    return {
      buttonBackgroundColor: '#FF6B6B',
      headerBackground: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)',
      // ...
    };
  }
  return {}; // default styles
};

<InAppAI
  agentId="your-agent-id"
  customStyles={getCustomStyles()}
  // ...
/>
```

## Security Note

All custom styles are applied using React's inline styles, which are safe from XSS attacks. The component does not use `dangerouslySetInnerHTML` or execute any user-provided code.
