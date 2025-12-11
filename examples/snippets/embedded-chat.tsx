/**
 * Embedded Chat Example
 *
 * Demonstrates embedded mode where chat fills a container.
 * Perfect for custom layouts and chat-focused pages.
 *
 * @see https://github.com/InAppAI/react/docs/guides/display-modes.md
 */

import { useState } from 'react';
import { InAppAI, Message } from '@inappai/react';
import '@inappai/react/styles.css';

function EmbeddedChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar Navigation */}
      <aside style={{
        width: '250px',
        borderRight: '1px solid #ddd',
        padding: '20px',
      }}>
        <h2>Navigation</h2>
        <nav>
          <ul>
            <li>Home</li>
            <li>Chat</li>
            <li>Settings</li>
          </ul>
        </nav>
      </aside>

      {/* Main Chat Area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Custom Header */}
        <header style={{
          padding: '20px',
          borderBottom: '1px solid #ddd',
          backgroundColor: '#f5f5f5',
        }}>
          <h1>Customer Support Chat</h1>
          <p>We're here to help!</p>
        </header>

        {/* Embedded Chat - fills remaining space */}
        <div style={{ flex: 1, position: 'relative' }}>
          <InAppAI
            agentId="your-agent-id"
            messages={messages}
            onMessagesChange={setMessages}

            // Embedded mode - no floating button
            displayMode="embedded"
            showHeader={false}            // Hide default header (we have custom one)

            // Styling
            theme="light"
            customStyles={{
              // Custom styles for embedded chat
            }}

            // Context
            context={{
              page: 'support',
              userEmail: 'user@example.com',
            }}
          />
        </div>
      </main>
    </div>
  );
}

export default EmbeddedChatPage;
