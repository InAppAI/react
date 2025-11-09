import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { CustomStyles, Tool, InAppAIProps } from '../types';
import './themes.css';
import './InAppAI.css';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

// Loading skeleton component
function LoadingSkeleton() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        padding: '12px 16px',
        background: 'var(--inapp-ai-assistant-bg)',
        borderRadius: 'var(--inapp-ai-border-radius)',
      }}
    >
      <div
        style={{
          height: '14px',
          background: 'linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite',
          borderRadius: '4px',
        }}
      />
      <div
        style={{
          height: '14px',
          width: '90%',
          background: 'linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite',
          animationDelay: '0.1s',
          borderRadius: '4px',
        }}
      />
      <div
        style={{
          height: '14px',
          width: '75%',
          background: 'linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite',
          animationDelay: '0.2s',
          borderRadius: '4px',
        }}
      />
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}

// Error message component with enhanced display
interface ErrorMessageProps {
  error: string;
  onDismiss: () => void;
}

function ErrorMessage({ error, onDismiss }: ErrorMessageProps) {
  // Determine error type based on message
  const getErrorType = (msg: string) => {
    if (msg.includes('not responding') || msg.includes('connection') || msg.includes('network')) {
      return { type: 'connection', icon: '🔌', title: 'Connection Error' };
    }
    if (msg.includes('timeout')) {
      return { type: 'timeout', icon: '⏱️', title: 'Request Timeout' };
    }
    if (msg.includes('rate limit')) {
      return { type: 'rateLimit', icon: '🚦', title: 'Rate Limit' };
    }
    if (msg.includes('authentication') || msg.includes('unauthorized')) {
      return { type: 'auth', icon: '🔒', title: 'Authentication Error' };
    }
    return { type: 'generic', icon: '⚠️', title: 'Error' };
  };

  const errorInfo = getErrorType(error);

  return (
    <div
      className="inapp-ai-error-banner"
      role="alert"
      aria-live="assertive"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        padding: '14px 16px',
        background: 'linear-gradient(135deg, #fff3cd 0%, #ffe9a6 100%)',
        borderLeft: '4px solid #ff9800',
        borderRadius: '0',
      }}
    >
      <span style={{ fontSize: '20px' }}>{errorInfo.icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, marginBottom: '4px', color: '#856404' }}>
          {errorInfo.title}
        </div>
        <div style={{ fontSize: '13px', color: '#856404', wordBreak: 'break-word' }}>
          {error}
        </div>
        {errorInfo.type === 'connection' && (
          <div style={{ fontSize: '12px', marginTop: '6px', color: '#997404' }}>
            💡 Make sure the backend server is running on the correct port
          </div>
        )}
      </div>
      <button
        onClick={onDismiss}
        style={{
          background: 'none',
          border: 'none',
          color: '#856404',
          cursor: 'pointer',
          padding: '4px 8px',
          fontSize: '16px',
          lineHeight: 1,
        }}
        aria-label="Dismiss error"
      >
        ✕
      </button>
    </div>
  );
}

// Code block component with syntax highlighting and copy button
interface CodeBlockProps {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

function CodeBlock({ inline, className, children, ...props }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  // Extract language from className (format: language-js, language-python, etc.)
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';

  const codeString = String(children).replace(/\n$/, '');

  const handleCopy = () => {
    navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Inline code (backticks)
  if (inline) {
    return <code className={className} {...props}>{children}</code>;
  }

  // Code block with syntax highlighting
  return (
    <div style={{ position: 'relative', marginTop: '8px', marginBottom: '8px' }}>
      <button
        onClick={handleCopy}
        style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          padding: '4px 8px',
          background: copied ? '#28a745' : 'rgba(255, 255, 255, 0.1)',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '12px',
          zIndex: 1,
          transition: 'background 0.2s',
        }}
        aria-label="Copy code"
      >
        {copied ? '✓ Copied!' : '📋 Copy'}
      </button>
      <SyntaxHighlighter
        language={language || 'text'}
        style={vscDarkPlus}
        customStyle={{
          borderRadius: '8px',
          padding: '16px',
          fontSize: '13px',
          marginTop: 0,
          marginBottom: 0,
        }}
        {...props}
      >
        {codeString}
      </SyntaxHighlighter>
    </div>
  );
}

export function InAppAI({
  endpoint = 'http://localhost:3001',
  position = 'bottom-right',
  displayMode = 'popup',
  defaultFolded = false,
  theme = 'light',
  context,
  customStyles = {},
  tools = [],
  panelMinWidth = '20%',
  panelMaxWidth = '33.33%',
  panelDefaultWidth = '25%',
  onPanelResize
}: InAppAIProps) {
  const [isOpen, setIsOpen] = useState(displayMode.startsWith('sidebar') || displayMode.startsWith('panel'));
  const [isFolded, setIsFolded] = useState(defaultFolded && (displayMode.startsWith('sidebar') || displayMode.startsWith('panel')));
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [panelWidth, setPanelWidth] = useState(panelDefaultWidth);
  const [isResizing, setIsResizing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const conversationId = useRef(`react-demo-${Date.now()}`);
  const resizeRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isSidebar = displayMode.startsWith('sidebar');
  const isPanel = displayMode.startsWith('panel');
  const isLeftSidebar = displayMode === 'sidebar-left';
  // const isRightSidebar = displayMode === 'sidebar-right';
  const isLeftPanel = displayMode === 'panel-left';
  // const isRightPanel = displayMode === 'panel-right';

  // For sidebar and panel mode, start open
  useEffect(() => {
    if (isSidebar || isPanel) {
      setIsOpen(true);
    }
  }, [isSidebar, isPanel]);

  // Panel resize handlers
  useEffect(() => {
    if (!isPanel || !isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const container = resizeRef.current?.parentElement;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      let newWidth: number;

      if (isLeftPanel) {
        newWidth = e.clientX;
      } else {
        newWidth = containerRect.width - e.clientX;
      }

      // Convert to percentage
      const widthPercent = (newWidth / containerRect.width) * 100;

      // Parse min/max widths
      const minPercent = parseFloat(panelMinWidth);
      const maxPercent = parseFloat(panelMaxWidth);

      // Clamp width between min and max
      const clampedPercent = Math.max(minPercent, Math.min(maxPercent, widthPercent));
      const newWidthStr = `${clampedPercent}%`;

      setPanelWidth(newWidthStr);
      if (onPanelResize) {
        onPanelResize(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, isPanel, isLeftPanel, panelMinWidth, panelMaxWidth, onPanelResize]);

  // Check backend connection
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch(`${endpoint}/health`);
        if (response.ok) {
          setIsConnected(true);
          setError(null);
        } else {
          setError('Backend not responding');
        }
      } catch (err) {
        setError('Failed to connect to backend');
        setIsConnected(false);
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, [endpoint]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Refocus input after loading completes
  useEffect(() => {
    if (!isLoading && isConnected) {
      // Small delay to ensure DOM has updated
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isLoading, isConnected]);

  const sendMessage = async () => {
    const message = inputValue.trim();
    if (!message || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: `${Date.now()}-user`,
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      // Helper to get fresh context (supports both static and function contexts)
      const getContext = () => typeof context === 'function' ? context() : context;

      // Prepare tool definitions (without handlers) for backend in OpenAI format
      const toolDefinitions = tools.map(({ name, description, parameters }) => ({
        type: 'function' as const,
        function: {
          name,
          description,
          parameters,
        },
      }));

      const response = await fetch(`${endpoint}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          conversationId: conversationId.current,
          context: getContext(),
          tools: toolDefinitions.length > 0 ? toolDefinitions : undefined,
          disableCache: false,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      // Check if AI returned tool calls
      if (data.toolCalls && data.toolCalls.length > 0) {
        // Execute tool handlers locally
        const results = await Promise.all(
          data.toolCalls.map(async (toolCall: any) => {
            // OpenAI format: {id, type, function: {name, arguments}}
            const toolName = toolCall.function?.name || toolCall.name;
            const toolArgs = toolCall.function?.arguments
              ? JSON.parse(toolCall.function.arguments)
              : toolCall.parameters;

            const tool = tools.find(t => t.name === toolName);
            if (!tool) {
              return { success: false, error: `Tool '${toolName}' not found` };
            }
            try {
              const result = await Promise.resolve(tool.handler(toolArgs));
              return result;
            } catch (error: any) {
              console.error(`Tool '${tool.name}' failed:`, error);
              return { success: false, error: error.message };
            }
          })
        );

        // Send tool results back to AI for natural language response
        const toolResultsMessage = results
          .map((r: any, idx: any) => {
            const toolCall = data.toolCalls[idx];
            const toolName = toolCall.function?.name || toolCall.name;
            return `Tool "${toolName}" result: ${JSON.stringify(r)}`;
          })
          .join('\n');

        // IMPORTANT: Get fresh context after tool execution
        // Tool handlers may have updated state (e.g., added/completed todos)
        // By calling getContext() again, we ensure the AI sees the updated state
        const followUpResponse = await fetch(`${endpoint}/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: toolResultsMessage,
            conversationId: conversationId.current,
            context: getContext(), // Fresh context after tool execution
            disableCache: false,
          }),
        });

        if (!followUpResponse.ok) {
          throw new Error('Failed to get AI response for tool results');
        }

        const followUpData = await followUpResponse.json();

        const assistantMessage: Message = {
          id: `${Date.now()}-assistant`,
          role: 'assistant',
          content: followUpData.message || 'I executed the tools successfully.',
          timestamp: new Date(),
          usage: followUpData.usage,
        };

        setMessages(prev => [...prev, assistantMessage]);
      } else {
        const assistantMessage: Message = {
          id: `${Date.now()}-assistant`,
          role: 'assistant',
          content: data.message,
          timestamp: new Date(),
          usage: data.usage,
        };

        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (err) {
      console.error('❌ Error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearMessages = () => {
    setMessages([]);
    conversationId.current = `react-demo-${Date.now()}`;
  };

  const toggleFolded = () => {
    setIsFolded(!isFolded);
  };

  const positionClass = `inapp-ai-${position}`;
  // Don't add a theme class for 'light' since it's the default
  const themeClass = theme && theme !== 'light' ? `inapp-ai-theme-${theme}` : '';
  const modeClass = isSidebar
    ? `inapp-ai-sidebar inapp-ai-${displayMode}`
    : isPanel
    ? `inapp-ai-panel inapp-ai-${displayMode}`
    : 'inapp-ai-popup';
  const foldedClass = isFolded ? 'inapp-ai-folded' : '';

  // Build custom button style
  const buttonStyle: React.CSSProperties = {
    ...(customStyles.buttonBackgroundColor && { background: customStyles.buttonBackgroundColor }),
    ...(customStyles.buttonTextColor && { color: customStyles.buttonTextColor }),
    ...(customStyles.buttonSize && {
      width: customStyles.buttonSize,
      height: customStyles.buttonSize,
      fontSize: `calc(${customStyles.buttonSize} * 0.5)`
    }),
    ...(customStyles.buttonBorderRadius && { borderRadius: customStyles.buttonBorderRadius }),
    ...(customStyles.boxShadow && { boxShadow: customStyles.boxShadow }),
  };

  // Build custom window style
  const windowStyle: React.CSSProperties = {
    ...(customStyles.windowWidth && !isSidebar && !isPanel && { width: customStyles.windowWidth }),
    ...(customStyles.windowHeight && !isSidebar && !isPanel && { height: customStyles.windowHeight }),
    ...(customStyles.windowBorderRadius && { borderRadius: customStyles.windowBorderRadius }),
    ...(customStyles.fontFamily && { fontFamily: customStyles.fontFamily }),
    ...(customStyles.fontSize && { fontSize: customStyles.fontSize }),
    ...(customStyles.sidebarWidth && isSidebar && !isFolded && { width: customStyles.sidebarWidth }),
    ...(customStyles.sidebarFoldedWidth && isSidebar && isFolded && { width: customStyles.sidebarFoldedWidth }),
    ...(isPanel && { width: panelWidth }),
  };

  return (
    <>
      {/* Chat Button (only for popup mode) */}
      {!isSidebar && !isPanel && (
        <button
          className={`inapp-ai-button ${positionClass} ${themeClass}`}
          style={buttonStyle}
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close AI Assistant" : "Open AI Assistant"}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          tabIndex={0}
        >
          {isOpen ? '✕' : (customStyles.buttonIcon || '🤖')}
          {!isConnected && (
            <span
              className="inapp-ai-offline-indicator"
              role="status"
              aria-label="Backend disconnected"
            />
          )}
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          ref={resizeRef}
          role="dialog"
          aria-label="AI Assistant Chat"
          aria-modal={!isSidebar && !isPanel ? "true" : undefined}
          className={`inapp-ai-window ${modeClass} ${isSidebar || isPanel ? '' : positionClass} ${themeClass} ${foldedClass}`}
          style={windowStyle}
        >
          {/* Resize Handle for Panel */}
          {isPanel && (
            <div
              className={`inapp-ai-resize-handle ${isLeftPanel ? 'inapp-ai-resize-handle-right' : 'inapp-ai-resize-handle-left'}`}
              onMouseDown={() => setIsResizing(true)}
              title="Drag to resize"
            />
          )}

          {/* Folded State Content */}
          {(isSidebar || isPanel) && isFolded ? (
            <div
              className="inapp-ai-folded-content"
              onClick={toggleFolded}
              style={{ cursor: 'pointer' }}
              title="Click to unfold"
            >
              <div className="inapp-ai-folded-icon">
                {customStyles.buttonIcon || '🤖'}
              </div>
              <div className="inapp-ai-folded-text">
                AI
              </div>
              {messages.length > 0 && (
                <div className="inapp-ai-message-count">
                  {messages.length}
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="inapp-ai-header" style={{
                ...(customStyles.headerBackground && { background: customStyles.headerBackground }),
                ...(customStyles.headerTextColor && { color: customStyles.headerTextColor }),
              }}>
                <div className="inapp-ai-header-title">
                  <span className="inapp-ai-header-icon">{customStyles.buttonIcon || '🤖'}</span>
                  <div>
                    <h3>{customStyles.headerTitle || 'AI Assistant'}</h3>
                    <p>
                      {isConnected ? (
                        <span className="inapp-ai-status-connected">
                          <span className="inapp-ai-status-dot" />
                          Connected
                        </span>
                      ) : (
                        <span className="inapp-ai-status-disconnected">
                          <span className="inapp-ai-status-dot" />
                          Disconnected
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                {/* Fold button for panels (in header top right) */}
                {(isSidebar || isPanel) && (
                  <button
                    className="inapp-ai-header-fold-btn"
                    onClick={toggleFolded}
                    aria-label={isFolded ? `Unfold ${isSidebar ? 'sidebar' : 'panel'}` : `Fold ${isSidebar ? 'sidebar' : 'panel'}`}
                    title={isFolded ? `Unfold ${isSidebar ? 'sidebar' : 'panel'}` : `Fold ${isSidebar ? 'sidebar' : 'panel'}`}
                  >
                    {(isLeftSidebar || isLeftPanel) ? '◀' : '▶'}
                  </button>
                )}
                {/* Close button for popup mode */}
                {!isSidebar && !isPanel && (
                  <button
                    className="inapp-ai-close-btn"
                    onClick={() => setIsOpen(false)}
                    aria-label="Close"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Error Banner */}
              {error && (
                <ErrorMessage error={error} onDismiss={() => setError(null)} />
              )}

              {/* Messages */}
              <div
                className="inapp-ai-messages"
                role="log"
                aria-live="polite"
                aria-label="Chat messages"
              >
                {messages.length === 0 ? (
                  <div className="inapp-ai-empty-state" role="status">
                    <div className="inapp-ai-empty-icon" aria-hidden="true">💬</div>
                    <h4>Start a conversation</h4>
                    <p>Ask me anything! I'm powered by OpenAI.</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`inapp-ai-message inapp-ai-message-${msg.role}`}
                      role="article"
                      aria-label={`${msg.role === 'user' ? 'User' : 'Assistant'} message`}
                    >
                      <div className="inapp-ai-message-icon" aria-hidden="true">
                        {msg.role === 'user' ? '👤' : '🤖'}
                      </div>
                      <div className="inapp-ai-message-content">
                        <div className="inapp-ai-message-text" style={{
                          ...(msg.role === 'user' && customStyles.userMessageBackground && { background: customStyles.userMessageBackground }),
                          ...(msg.role === 'user' && customStyles.userMessageColor && { color: customStyles.userMessageColor }),
                          ...(msg.role === 'assistant' && customStyles.assistantMessageBackground && { background: customStyles.assistantMessageBackground }),
                          ...(msg.role === 'assistant' && customStyles.assistantMessageColor && { color: customStyles.assistantMessageColor }),
                          ...(customStyles.borderRadius && { borderRadius: customStyles.borderRadius }),
                        }}>
                          {msg.role === 'assistant' ? (
                            <ReactMarkdown
                              components={{
                                code: CodeBlock as any,
                              }}
                            >
                              {msg.content}
                            </ReactMarkdown>
                          ) : (
                            msg.content
                          )}
                        </div>
                        <div className="inapp-ai-message-time">
                          {msg.timestamp.toLocaleTimeString()}
                          {msg.usage && (
                            <span className="inapp-ai-message-tokens">
                              {' • '}{msg.usage.totalTokens} tokens
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                {isLoading && (
                  <div className="inapp-ai-message inapp-ai-message-assistant">
                    <div className="inapp-ai-message-icon">
                      <div style={{ animation: 'pulse 2s infinite' }}>🤖</div>
                    </div>
                    <div className="inapp-ai-message-content">
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div className="inapp-ai-typing-indicator">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                        <LoadingSkeleton />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="inapp-ai-input-area" role="form" aria-label="Message input">
                {messages.length > 0 && (
                  <button
                    className="inapp-ai-clear-btn"
                    onClick={clearMessages}
                    disabled={isLoading}
                    aria-label="Clear conversation history"
                    tabIndex={0}
                  >
                    <span aria-hidden="true">🗑️</span> Clear
                  </button>
                )}
                <div className="inapp-ai-input-wrapper">
                  <input
                    ref={inputRef}
                    type="text"
                    className="inapp-ai-input"
                    placeholder={customStyles.inputPlaceholder || "Type your message..."}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading || !isConnected}
                    aria-label="Message input"
                    aria-describedby="send-hint"
                    tabIndex={0}
                    style={{
                      ...(customStyles.inputBackground && { background: customStyles.inputBackground }),
                      ...(customStyles.inputBorderColor && { borderColor: customStyles.inputBorderColor }),
                      ...(customStyles.inputTextColor && { color: customStyles.inputTextColor }),
                    }}
                  />
                  <button
                    className="inapp-ai-send-btn"
                    onClick={sendMessage}
                    disabled={isLoading || !isConnected || !inputValue.trim()}
                    aria-label="Send message"
                    tabIndex={0}
                  >
                    <span aria-hidden="true">{isLoading ? '⏳' : '⬆'}</span>
                    <span className="sr-only">
                      {isLoading ? 'Sending...' : 'Send message'}
                    </span>
                  </button>
                  <span id="send-hint" className="sr-only">
                    Press Enter to send
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
