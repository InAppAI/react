# Display Modes

> Choose the layout that fits your application

InAppAI React supports multiple display modes to fit different use cases. Each mode offers unique features and is suited for specific application layouts.

## Overview

| Mode | Best For | Layout Behavior |
|------|----------|----------------|
| **Popup** | General websites, marketing sites | Floating button + popup window |
| **Sidebar** | Documentation, dashboards | Full-height overlay sidebar |
| **Panel** | Code editors, IDEs | Resizable panel that pushes content |
| **Embedded** | Custom layouts, multi-chat apps | Fills parent container |

## Popup Mode (Default)

A floating chat button that opens a popup window. This is the default mode.

### Usage

```tsx
<InAppAI
  
  agentId="your-agent-id"
  messages={messages}
  onMessagesChange={setMessages}
  displayMode="popup"  // default, can be omitted
  position="bottom-right"
/>
```

### Positioning

Control where the button appears:

```tsx
<InAppAI
  position="bottom-right"  // Default
  // or: bottom-left, top-right, top-left
/>
```

### Features

- ✅ Unobtrusive - doesn't affect page layout
- ✅ Familiar pattern - users expect it
- ✅ Works everywhere - any page layout
- ✅ Customizable button and window size

### Best For

- Marketing websites
- E-commerce sites
- General web applications
- Landing pages

### Example

```tsx
import { useState } from 'react';
import { InAppAI, Message } from '@inappai/react';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);

  return (
    <div>
      <YourWebsiteContent />

      <InAppAI
        
        agentId="your-agent-id"
        messages={messages}
        onMessagesChange={setMessages}
        position="bottom-right"
        customStyles={{
          buttonIcon: '💬',
          buttonSize: '60px',
        }}
      />
    </div>
  );
}
```

## Sidebar Mode

Full-height sidebar that slides in from the left or right side.

### Usage

```tsx
<InAppAI
  displayMode="sidebar-right"  // or sidebar-left
  defaultFolded={false}         // Start expanded or folded
  // ... required props
/>
```

### Sidebar Position

Choose left or right side:

```tsx
// Right sidebar (default)
<InAppAI displayMode="sidebar-right" />

// Left sidebar
<InAppAI displayMode="sidebar-left" />
```

### Folding State

Control initial state:

```tsx
// Start expanded
<InAppAI
  displayMode="sidebar-right"
  defaultFolded={false}
/>

// Start folded
<InAppAI
  displayMode="sidebar-right"
  defaultFolded={true}
/>
```

### Features

- ✅ Full viewport height
- ✅ Collapsible/foldable interface
- ✅ Overlay mode (doesn't push content)
- ✅ Smooth slide animations
- ✅ Customizable width

### Best For

- Documentation websites
- Admin dashboards
- SaaS applications
- Help centers

### Example

```tsx
import { useState } from 'react';
import { InAppAI, Message } from '@inappai/react';

function DocsApp() {
  const [messages, setMessages] = useState<Message[]>([]);

  return (
    <div>
      <DocumentationContent />

      <InAppAI
        
        agentId="your-agent-id"
        messages={messages}
        onMessagesChange={setMessages}
        displayMode="sidebar-right"
        defaultFolded={true}
        customStyles={{
          headerTitle: 'Documentation Assistant',
          sidebarWidth: '400px',
        }}
        context={() => ({
          currentPage: window.location.pathname,
          scrollPosition: window.scrollY,
        })}
      />
    </div>
  );
}
```

## Panel Mode

Resizable panel that pushes page content. Ideal for split-screen layouts.

### Usage

```tsx
<InAppAI
  displayMode="panel-right"  // or panel-left
  panelMinWidth="20%"
  panelMaxWidth="50%"
  panelDefaultWidth="30%"
  onPanelResize={(width) => console.log('Panel width:', width)}
  // ... required props
/>
```

### Panel Configuration

```tsx
<InAppAI
  displayMode="panel-right"
  panelMinWidth="300px"        // Minimum width (px or %)
  panelMaxWidth="800px"        // Maximum width (px or %)
  panelDefaultWidth="400px"    // Initial width (px or %)
  onPanelResize={(width) => {
    // Called when user resizes the panel
    console.log('New width:', width);
  }}
/>
```

### Layout Setup

Panel mode requires a flex layout wrapper:

```tsx
function App() {
  const [messages, setMessages] = useState<Message[]>([]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row-reverse',  // panel-right
      height: '100vh',
    }}>
      <InAppAI
        displayMode="panel-right"
        messages={messages}
        onMessagesChange={setMessages}
        // ... other props
      />

      <div style={{ flex: 1, overflowY: 'auto' }}>
        <YourMainContent />
      </div>
    </div>
  );
}
```

For `panel-left`, use `flexDirection: 'row'`:

```tsx
<div style={{
  display: 'flex',
  flexDirection: 'row',  // panel-left
  height: '100vh',
}}>
```

### Features

- ✅ Resizable with drag handle
- ✅ Pushes page content (not overlay)
- ✅ Min/max width constraints
- ✅ Resize event callbacks
- ✅ Persistent width (remembers size)

### Best For

- Code editors
- IDE-like interfaces
- Data analysis tools
- Design applications

### Example

```tsx
import { useState } from 'react';
import { InAppAI, Message } from '@inappai/react';

function CodeEditor() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [editorWidth, setEditorWidth] = useState('70%');

  const handlePanelResize = (width: number) => {
    // Adjust editor when panel is resized
    setEditorWidth(`${100 - (width / window.innerWidth * 100)}%`);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row-reverse',
      height: '100vh',
    }}>
      <InAppAI
        
        agentId="your-agent-id"
        messages={messages}
        onMessagesChange={setMessages}
        displayMode="panel-right"
        panelMinWidth="25%"
        panelMaxWidth="50%"
        panelDefaultWidth="30%"
        onPanelResize={handlePanelResize}
        theme="dark"
        customStyles={{
          headerTitle: 'AI Copilot',
        }}
      />

      <div style={{ width: editorWidth, overflowY: 'auto' }}>
        <CodeEditorComponent />
      </div>
    </div>
  );
}
```

## Embedded Mode

Integrate chat directly into your layout without any floating UI.

### Usage

```tsx
<div className="chat-container" style={{ height: '600px' }}>
  <InAppAI
    
    agentId="your-agent-id"
    displayMode="embedded"
    showHeader={false}  // Optional: hide header
    // ... required props
  />
</div>
```

### Features

- ✅ No floating button or popup wrapper
- ✅ Fills parent container (100% width and height)
- ✅ Optional header visibility
- ✅ Perfect for custom layouts
- ✅ Full control over positioning

### Best For

- Custom chat interfaces
- Multi-conversation apps (ChatGPT-style)
- Split-screen layouts
- Embedded widgets

### Example: Simple Embedded Chat

```tsx
import { useState } from 'react';
import { InAppAI, Message } from '@inappai/react';

function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);

  return (
    <div className="page-layout">
      <aside className="sidebar">
        <Navigation />
      </aside>

      <main className="main-content">
        <div style={{ height: '100%', maxWidth: '800px', margin: '0 auto' }}>
          <InAppAI
            
            agentId="your-agent-id"
            messages={messages}
            onMessagesChange={setMessages}
            displayMode="embedded"
            showHeader={true}
            customStyles={{
              headerTitle: 'Customer Support',
            }}
          />
        </div>
      </main>
    </div>
  );
}
```

### Example: Multi-Conversation (ChatGPT-style)

```tsx
import { useState } from 'react';
import { InAppAI, Message } from '@inappai/react';

function MultiChatApp() {
  const [conversations, setConversations] = useState<Record<string, Message[]>>({
    'conv-1': [],
    'conv-2': [],
  });
  const [activeConversation, setActiveConversation] = useState('conv-1');

  const messages = conversations[activeConversation] || [];
  const setMessages = (newMessages: Message[]) => {
    setConversations(prev => ({
      ...prev,
      [activeConversation]: newMessages,
    }));
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Conversation Sidebar */}
      <aside style={{ width: '250px', borderRight: '1px solid #ddd' }}>
        <ConversationList
          conversations={Object.keys(conversations)}
          activeConversation={activeConversation}
          onSelectConversation={setActiveConversation}
        />
      </aside>

      {/* Chat Area */}
      <main style={{ flex: 1 }}>
        <InAppAI
          
          agentId="your-agent-id"
          displayMode="embedded"
          showHeader={false}
          conversationId={activeConversation}
          messages={messages}
          onMessagesChange={setMessages}
        />
      </main>
    </div>
  );
}
```

## Choosing the Right Mode

### Use **Popup** if you want:
- Minimal interference with page layout
- Familiar chat widget pattern
- Simple drop-in solution

### Use **Sidebar** if you want:
- Persistent, always-visible chat option
- Documentation or help assistant
- Overlay that doesn't affect content

### Use **Panel** if you want:
- Split-screen workflow
- Resizable chat area
- IDE-like interface

### Use **Embedded** if you want:
- Full control over positioning
- Multi-conversation interface
- Custom chat page layout

## Switching Between Modes

You can dynamically change display modes:

```tsx
function App() {
  const [displayMode, setDisplayMode] = useState<'popup' | 'sidebar-right' | 'panel-right' | 'embedded'>('popup');
  const [messages, setMessages] = useState<Message[]>([]);

  return (
    <div>
      <select value={displayMode} onChange={(e) => setDisplayMode(e.target.value as any)}>
        <option value="popup">Popup</option>
        <option value="sidebar-right">Sidebar</option>
        <option value="panel-right">Panel</option>
        <option value="embedded">Embedded</option>
      </select>

      <InAppAI
        displayMode={displayMode}
        messages={messages}
        onMessagesChange={setMessages}
        // ... other props
      />
    </div>
  );
}
```

## Common Issues

### Panel not showing side-by-side

**Problem**: Panel appears below content instead of next to it.

**Solution**: Use flex layout as shown in the Panel Mode section above.

### Sidebar overlapping content

**Solution**: This is expected behavior. Sidebar uses overlay mode. If you want to push content, use Panel mode instead.

### Embedded mode not filling container

**Problem**: Chat doesn't fill the parent container.

**Solution**: Ensure parent has explicit height:

```tsx
<div style={{ height: '600px' }}>  {/* Must have height */}
  <InAppAI displayMode="embedded" />
</div>
```

## Code Examples

Ready-to-use code snippets demonstrating each display mode:

- **[Popup Chat](../../examples/snippets/popup-chat.tsx)** - Complete popup mode example with customization
- **[Sidebar for Docs](../../examples/snippets/sidebar-docs.tsx)** - Documentation assistant with dynamic context
- **[Panel for IDE](../../examples/snippets/panel-editor.tsx)** - Code editor integration with resizable panel
- **[Embedded Chat](../../examples/snippets/embedded-chat.tsx)** - Custom layout with embedded mode
- **[Multi-Conversation](../../examples/snippets/multi-conversation.tsx)** - ChatGPT-style interface with conversation management

## Next Steps

- **[Themes](./themes.md)** - Style your chat interface
- **[Customization](./customization.md)** - Deep dive into custom styles
- **[Examples](../examples/)** - See real-world implementations
