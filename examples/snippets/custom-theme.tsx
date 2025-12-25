/**
 * Custom Theme Example
 *
 * Demonstrates how to completely customize the appearance of InAppAI
 * to match your brand identity.
 *
 * @see https://github.com/InAppAI/react/docs/guides/customization.md
 */

import { useState } from 'react';
import { InAppAI, Message } from '@inappai/react';
import '@inappai/react/styles.css';

function CustomThemeApp() {
  const [messages, setMessages] = useState<Message[]>([]);

  return (
    <div>
      <h1>Custom Branded Chat</h1>

      <InAppAI
        agentId="your-agent-id"
        messages={messages}
        onMessagesChange={setMessages}

        // Use a base theme as starting point
        theme="light"  // or "dark"

        // Override with custom styles
        customStyles={{
          // === Branding ===
          primaryColor: '#6366f1',           // Your brand color

          // === Button ===
          buttonBackgroundColor: '#6366f1',
          buttonTextColor: '#ffffff',
          buttonSize: '60px',
          buttonIcon: '💬',
          buttonBorderRadius: '50%',
          buttonBoxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',

          // === Window ===
          windowWidth: '420px',
          windowHeight: '650px',
          windowBorderRadius: '16px',
          windowBoxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',

          // === Header ===
          headerBackground: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          headerTextColor: '#ffffff',
          headerTitle: 'Support Assistant',
          headerSubtitle: 'How can we help you today?',
          headerHeight: '80px',

          // === Messages ===
          userMessageBackground: '#6366f1',
          userMessageTextColor: '#ffffff',
          assistantMessageBackground: '#f3f4f6',
          assistantMessageTextColor: '#1f2937',
          messageBorderRadius: '12px',
          messageMargin: '8px 0',

          // === Input ===
          inputBackground: '#ffffff',
          inputTextColor: '#1f2937',
          inputBorderColor: '#e5e7eb',
          inputPlaceholder: 'Type your message...',
          inputHeight: '50px',

          // === Send Button ===
          sendButtonBackground: '#6366f1',
          sendButtonTextColor: '#ffffff',
          sendButtonHoverBackground: '#4f46e5',

          // === Typography ===
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial',
          fontSize: '15px',

          // === Sidebar (if using sidebar mode) ===
          sidebarWidth: '380px',
          sidebarBackground: '#ffffff',
          sidebarBorderColor: '#e5e7eb',

          // === Panel (if using panel mode) ===
          panelBackground: '#ffffff',
          panelBorderColor: '#e5e7eb',
        }}
      />
    </div>
  );
}

export default CustomThemeApp;
