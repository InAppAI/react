import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
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

interface CustomStyles {
  // Primary branding colors
  primaryColor?: string;
  primaryGradient?: string;

  // Button customization
  buttonBackgroundColor?: string;
  buttonTextColor?: string;
  buttonSize?: string;
  buttonBorderRadius?: string;
  buttonIcon?: string;

  // Window customization
  windowWidth?: string;
  windowHeight?: string;
  windowBorderRadius?: string;

  // Header customization
  headerBackground?: string;
  headerTextColor?: string;
  headerTitle?: string;
  headerSubtitle?: string;

  // Message bubbles
  userMessageBackground?: string;
  userMessageColor?: string;
  assistantMessageBackground?: string;
  assistantMessageColor?: string;

  // Typography
  fontFamily?: string;
  fontSize?: string;

  // Input area
  inputBackground?: string;
  inputBorderColor?: string;
  inputTextColor?: string;
  inputPlaceholder?: string;

  // Other
  borderRadius?: string;
  boxShadow?: string;
}

interface InAppAIProps {
  endpoint: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  theme?: 'light' | 'dark';
  context?: Record<string, any>;
  customStyles?: CustomStyles;
}

export function InAppAI({
  endpoint = 'http://localhost:3001',
  position = 'bottom-right',
  theme = 'light',
  context,
  customStyles = {}
}: InAppAIProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const conversationId = useRef(`react-demo-${Date.now()}`);

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
      const response = await fetch(`${endpoint}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          conversationId: conversationId.current,
          context,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: `${Date.now()}-assistant`,
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
        usage: data.usage,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
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

  const positionClass = `inapp-ai-${position}`;
  const themeClass = `inapp-ai-theme-${theme}`;

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
    ...(customStyles.windowWidth && { width: customStyles.windowWidth }),
    ...(customStyles.windowHeight && { height: customStyles.windowHeight }),
    ...(customStyles.windowBorderRadius && { borderRadius: customStyles.windowBorderRadius }),
    ...(customStyles.fontFamily && { fontFamily: customStyles.fontFamily }),
    ...(customStyles.fontSize && { fontSize: customStyles.fontSize }),
  };

  return (
    <>
      {/* Chat Button */}
      <button
        className={`inapp-ai-button ${positionClass} ${themeClass}`}
        style={buttonStyle}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle AI Assistant"
      >
        {isOpen ? '✕' : (customStyles.buttonIcon || '🤖')}
        {!isConnected && <span className="inapp-ai-offline-indicator" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className={`inapp-ai-window ${positionClass} ${themeClass}`} style={windowStyle}>
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
            <button
              className="inapp-ai-close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="inapp-ai-error-banner">
              <span>⚠️</span>
              <span>{error}</span>
              <button onClick={() => setError(null)}>✕</button>
            </div>
          )}

          {/* Messages */}
          <div className="inapp-ai-messages">
            {messages.length === 0 ? (
              <div className="inapp-ai-empty-state">
                <div className="inapp-ai-empty-icon">💬</div>
                <h4>Start a conversation</h4>
                <p>Ask me anything! I'm powered by OpenAI.</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className={`inapp-ai-message inapp-ai-message-${msg.role}`}>
                  <div className="inapp-ai-message-icon">
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
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
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
                <div className="inapp-ai-message-icon">🤖</div>
                <div className="inapp-ai-message-content">
                  <div className="inapp-ai-typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="inapp-ai-input-area">
            {messages.length > 0 && (
              <button
                className="inapp-ai-clear-btn"
                onClick={clearMessages}
                disabled={isLoading}
              >
                🗑️ Clear
              </button>
            )}
            <div className="inapp-ai-input-wrapper">
              <input
                type="text"
                className="inapp-ai-input"
                placeholder={customStyles.inputPlaceholder || "Type your message..."}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading || !isConnected}
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
              >
                {isLoading ? '⏳' : '➤'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
