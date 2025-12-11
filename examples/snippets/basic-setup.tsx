/**
 * Basic Setup Example
 *
 * This is the minimal code needed to add InAppAI to your React app.
 * Perfect for getting started quickly.
 *
 * @see https://github.com/InAppAI/react/docs/getting-started/quick-start.md
 */

import { useState } from 'react';
import { InAppAI, Message } from '@inappai/react';
import '@inappai/react/styles.css';

function App() {
  // Step 1: Create state for messages
  const [messages, setMessages] = useState<Message[]>([]);

  return (
    <div className="app">
      {/* Your app content */}
      <header>
        <h1>My Application</h1>
      </header>

      <main>
        <p>Welcome! The AI assistant is available in the bottom-right corner.</p>
      </main>

      {/* Step 2: Add the InAppAI component */}
      <InAppAI
        agentId="your-agent-id"        // Get from inappai.com
        messages={messages}             // Message state
        onMessagesChange={setMessages}  // Update handler
      />
    </div>
  );
}

export default App;
