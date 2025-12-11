/**
 * Panel Mode for Code Editor Example
 *
 * Demonstrates resizable panel mode for IDE-like interfaces.
 * The panel pushes content and is resizable.
 *
 * @see https://github.com/InAppAI/react/docs/guides/display-modes.md
 */

import { useState } from 'react';
import { InAppAI, Message } from '@inappai/react';
import '@inappai/react/styles.css';

function CodeEditorApp() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [panelWidth, setPanelWidth] = useState(30); // percentage

  const handlePanelResize = (width: number) => {
    // Update panel width when user resizes
    setPanelWidth((width / window.innerWidth) * 100);
    console.log('Panel width:', width, 'px');
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row-reverse',  // Panel on right
      height: '100vh',
    }}>
      {/* AI Copilot Panel */}
      <InAppAI
        agentId="your-agent-id"
        messages={messages}
        onMessagesChange={setMessages}

        // Panel configuration
        displayMode="panel-right"      // or: panel-left
        panelMinWidth="25%"             // Minimum width
        panelMaxWidth="50%"             // Maximum width
        panelDefaultWidth="30%"         // Initial width
        onPanelResize={handlePanelResize}

        // Dark theme for code editor
        theme="dark"
        customStyles={{
          headerTitle: 'AI Copilot',
          buttonIcon: '🤖',
        }}

        // Pass editor context
        context={{
          openFiles: ['src/App.tsx', 'src/main.tsx'],
          currentFile: 'src/App.tsx',
          language: 'typescript',
          hasErrors: false,
        }}
      />

      {/* Code Editor Area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
        backgroundColor: '#1e1e1e',
        color: '#d4d4d4',
      }}>
        <h2>Code Editor</h2>
        <pre>
          <code>
            {`function hello() {
  console.log('Hello, World!');
}`}
          </code>
        </pre>
      </div>
    </div>
  );
}

export default CodeEditorApp;
