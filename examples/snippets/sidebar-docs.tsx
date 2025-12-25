/**
 * Sidebar Documentation Assistant Example
 *
 * Perfect for documentation sites. Shows a collapsible sidebar
 * that overlays the content when expanded.
 *
 * @see https://github.com/InAppAI/react/docs/guides/display-modes.md
 */

import { useState } from 'react';
import { InAppAI, Message } from '@inappai/react';
import '@inappai/react/styles.css';

function DocsApp() {
  const [messages, setMessages] = useState<Message[]>([]);

  return (
    <div className="docs-layout">
      {/* Documentation Content */}
      <main className="docs-content">
        <article>
          <h1>Getting Started</h1>
          <p>Welcome to our documentation...</p>
        </article>
      </main>

      {/* Sidebar Documentation Assistant */}
      <InAppAI
        agentId="your-agent-id"
        messages={messages}
        onMessagesChange={setMessages}

        // Sidebar configuration
        displayMode="sidebar-right"    // or: sidebar-left
        defaultFolded={true}            // Start collapsed

        // Styling
        theme="professional"
        customStyles={{
          headerTitle: 'Documentation Assistant',
          headerSubtitle: 'Ask me anything',
          sidebarWidth: '400px',
          buttonIcon: '📚',
        }}

        // Dynamic context - pass current page info
        context={() => ({
          currentPage: window.location.pathname,
          scrollPosition: window.scrollY,
          selectedText: window.getSelection()?.toString() || '',
        })}

        // Track user interactions
        onMessageSent={(message) => {
          console.log('User asked:', message);
          // Track analytics
        }}
        onMessageReceived={(message) => {
          console.log('AI responded:', message);
        }}
      />
    </div>
  );
}

export default DocsApp;
