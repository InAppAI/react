/**
 * Popup Chat Example
 *
 * Demonstrates popup mode with customization options.
 * The chat appears as a floating button that opens a popup window.
 *
 * @see https://github.com/InAppAI/react/docs/guides/display-modes.md
 */

import { useState } from 'react';
import { InAppAI, Message } from '@inappai/react';
import '@inappai/react/styles.css';

function PopupChatApp() {
  const [messages, setMessages] = useState<Message[]>([]);

  return (
    <div className="app">
      <header>
        <h1>E-Commerce Store</h1>
      </header>

      <main>
        {/* Your main content */}
        <div className="products">
          {/* Product listings */}
        </div>
      </main>

      {/* Popup Chat Assistant */}
      <InAppAI
        agentId="your-agent-id"
        messages={messages}
        onMessagesChange={setMessages}

        // Display configuration
        displayMode="popup"              // Default: floating popup
        position="bottom-right"          // Button position

        // Theming
        theme="light"                    // or: dark, professional, playful, minimal, ocean, sunset

        // Custom styling
        customStyles={{
          buttonIcon: '🛍️',            // Shopping bag icon
          buttonSize: '60px',
          headerTitle: 'Shopping Assistant',
          headerBackground: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          primaryColor: '#667eea',
        }}

        // Context for better responses
        context={{
          page: 'store',
          cartItems: 3,
          userStatus: 'logged-in',
        }}
      />
    </div>
  );
}

export default PopupChatApp;
