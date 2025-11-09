import { useState, useEffect, useMemo, useRef } from 'react';
import { InAppAI } from './components/InAppAI-Enhanced';
import type { Tool } from '@inapp-ai/core';
import { useKnowledgeBase } from './useKnowledgeBase';
import { createDocumentationTools, createTodoTools } from './tools';
import type { Todo } from './tools';
import './Demo-Enhanced.css';

type DisplayMode = 'popup' | 'sidebar-left' | 'sidebar-right' | 'panel-left' | 'panel-right';
type Position = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
type Theme = 'light' | 'dark' | 'professional' | 'playful' | 'minimal' | 'ocean' | 'sunset';

interface ProviderInfo {
  current: string;
  supported: string[];
  message: string;
}

function Demo() {
  // Endpoint configuration from environment variables
  const subscriptionId = import.meta.env.VITE_SUBSCRIPTION_ID;
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const ENDPOINT = `${apiBaseUrl}/${subscriptionId}`;

  // Validate configuration
  if (!subscriptionId || !apiBaseUrl) {
    console.error('Missing configuration. Please copy .env.example to .env and configure your subscription ID.');
  }

  const [displayMode, setDisplayMode] = useState<DisplayMode>('popup');
  const [position, setPosition] = useState<Position>('bottom-right');
  const [theme, setTheme] = useState<Theme>('light');
  const [defaultFolded, setDefaultFolded] = useState(false);
  const [panelWidth, setPanelWidth] = useState<number>(0);
  const [providerInfo, setProviderInfo] = useState<ProviderInfo | null>(null);

  // Todo state
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: 'Buy groceries', completed: false, priority: 'high' },
    { id: 2, text: 'Finish project report', completed: false, priority: 'high' },
    { id: 3, text: 'Call dentist', completed: true, priority: 'medium' },
  ]);
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');

  // Store todos in ref so context getter can access latest value
  const todosRef = useRef(todos);
  useEffect(() => {
    todosRef.current = todos;
  }, [todos]);

  // Knowledge base integration
  const { initialized: kbInitialized, loading: kbLoading, error: kbError, initialize: initKB } = useKnowledgeBase();

  // Fetch provider info on mount
  useEffect(() => {
    // Provider info endpoint not implemented in Cloud Functions
    // Skipping for now - the demo will work without it
    // fetch(`${ENDPOINT}/providers`)
    //   .then(res => res.json())
    //   .then(data => setProviderInfo(data))
    //   .catch(err => console.error('Failed to fetch provider info:', err));
  }, []);

  // Initialize knowledge base on mount
  // DISABLED: KB is now managed through the main app's Knowledge Base UI
  // The backend will automatically use the URL-based KB for RAG
  // useEffect(() => {
  //   if (!kbInitialized && !kbLoading) {
  //     initKB();
  //   }
  // }, [kbInitialized, kbLoading, initKB]);

  const isPanel = displayMode.startsWith('panel');

  // Manual add todo
  const handleAddTodo = () => {
    if (!newTaskText.trim()) return;
    const newTodo: Todo = {
      id: Date.now(),
      text: newTaskText,
      completed: false,
      priority: newTaskPriority,
    };
    setTodos([...todos, newTodo]);
    setNewTaskText('');
    setNewTaskPriority('medium');
  };

  // Combine tools from different modules
  const tools = useMemo(() => {
    // DISABLED: Documentation tools removed - KB is now managed via main app
    // The backend automatically uses URL-based KB for RAG in chat responses
    // const documentationTools = createDocumentationTools({
    //   kbInitialized,
    //   endpoint: ENDPOINT,
    // });

    const todoTools = createTodoTools({
      todos,
      setTodos,
    });

    // Only include todo tools - KB works automatically via backend RAG
    return [
      // ...documentationTools,  // DISABLED
      ...todoTools,
    ];
  }, [todos, setTodos]);

  // Toggle todo completion manually
  const toggleTodo = (id: number) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)));
  };

  // Delete todo manually
  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const activeTodos = todos.filter((t) => !t.completed);
  const completedTodos = todos.filter((t) => t.completed);

  // Render panel mode with completely different layout
  if (isPanel) {
    return (
      <div style={{ display: 'flex', flexDirection: displayMode === 'panel-right' ? 'row-reverse' : 'row', height: '100vh', width: '100%', margin: 0, padding: 0 }}>
        <InAppAI
          key={`${displayMode}-${position}-${theme}-${defaultFolded}`}
          endpoint={ENDPOINT}
          displayMode={displayMode}
          position={position}
          defaultFolded={defaultFolded}
          theme={theme}
          panelMinWidth="20%"
          panelMaxWidth="33.33%"
          panelDefaultWidth="25%"
          onPanelResize={(width) => setPanelWidth(width)}
          customStyles={{
            headerTitle: "AI Assistant",
            buttonIcon: "🤖",
          }}
          context={() => {
            // Use a function to get FRESH context on every call
            // This ensures AI sees updated todos after tool execution
            // Use ref to get truly current value (not closure)
            const currentTodos = todosRef.current;
            const currentCompleted = currentTodos.filter((t) => t.completed);
            const currentActive = currentTodos.filter((t) => !t.completed);

            return {
              page: 'demo-enhanced',
              mode: displayMode,
              todos: currentTodos.map((t) => ({
                id: t.id,
                text: t.text,
                completed: t.completed,
                priority: t.priority,
              })),
              stats: {
                total: currentTodos.length,
                completed: currentCompleted.length,
                active: currentActive.length,
              },
            };
          }}
          tools={tools}
        />
        <div style={{ flex: 1, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '40px 20px', overflowY: 'auto' }}>
          <div className="demo-control-panel">
            <h1>🤖 InAppAI Demo</h1>
            <p className="demo-subtitle">
              Interactive AI assistant with function calling, multiple display modes, and task management
            </p>

            {/* Provider Info & Context - Compact Design */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              {/* Provider Info */}
              {providerInfo && (
                <div style={{ background: 'white', borderRadius: '8px', padding: '12px', border: '1px solid #667eea' }}>
                  <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '6px' }}>🚀 AI Provider</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#667eea', marginBottom: '4px' }}>
                    {providerInfo.current === 'openai' && '🟢 OpenAI'}
                    {providerInfo.current === 'anthropic' && '🟣 Claude'}
                    {providerInfo.current === 'google' && '🔵 Gemini'}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#888' }}>
                    Supports: {providerInfo.supported.join(', ')}
                  </div>
                </div>
              )}

              {/* Context Capture */}
              <div style={{ background: 'white', borderRadius: '8px', padding: '12px', border: '1px solid #764ba2' }}>
                <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '6px' }}>📊 Context Stats</div>
                <div style={{ display: 'flex', gap: '8px', fontSize: '0.85rem' }}>
                  <div>
                    <span style={{ fontWeight: 'bold', color: '#667eea' }}>{todos.length}</span>
                    <span style={{ color: '#888', fontSize: '0.7rem' }}> total</span>
                  </div>
                  <div>
                    <span style={{ fontWeight: 'bold', color: '#10b981' }}>{completedTodos.length}</span>
                    <span style={{ color: '#888', fontSize: '0.7rem' }}> done</span>
                  </div>
                  <div>
                    <span style={{ fontWeight: 'bold', color: '#f59e0b' }}>{activeTodos.length}</span>
                    <span style={{ color: '#888', fontSize: '0.7rem' }}> active</span>
                  </div>
                  <div>
                    <span style={{ fontWeight: 'bold', color: '#ef4444' }}>{todos.filter(t => t.priority === 'high').length}</span>
                    <span style={{ color: '#888', fontSize: '0.7rem' }}> high</span>
                  </div>
                </div>
                <div style={{ fontSize: '0.65rem', color: '#888', marginTop: '4px' }}>
                  💡 AI has real-time access to this data
                </div>
              </div>
            </div>

            {/* Todo List */}
            <div style={{ background: 'white', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
              <h3>📝 Todo List (AI can manage this!)</h3>
              <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '15px' }}>
                💬 Try: "Add a task to buy milk" • "What's my completion rate?" • "I bought groceries" • "Make it high priority"
              </p>

              {/* Manual Add Task */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}>
                <input
                  type="text"
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
                  placeholder="Add a new task..."
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    outline: 'none',
                  }}
                />
                <select
                  value={newTaskPriority}
                  onChange={(e) => setNewTaskPriority(e.target.value as 'low' | 'medium' | 'high')}
                  style={{
                    padding: '10px 14px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    outline: 'none',
                    background: 'white',
                  }}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <button
                  onClick={handleAddTodo}
                  style={{
                    padding: '10px 20px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                  }}
                >
                  Add Task
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {todos.map((todo) => (
                  <div
                    key={todo.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px',
                      background: todo.completed ? '#f0f0f0' : '#f8f9fa',
                      borderRadius: '8px',
                      opacity: todo.completed ? 0.6 : 1,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id)}
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    <span
                      style={{
                        flex: 1,
                        textDecoration: todo.completed ? 'line-through' : 'none',
                        fontSize: '0.95rem',
                      }}
                    >
                      {todo.text} <span style={{ fontSize: '0.75rem', color: '#999' }}>(ID: {todo.id})</span>
                    </span>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: todo.priority === 'high' ? '#f8d7da' : todo.priority === 'medium' ? '#fff3cd' : '#d1f4e0',
                        color: todo.priority === 'high' ? '#721c24' : todo.priority === 'medium' ? '#856404' : '#1e7e34',
                      }}
                    >
                      {todo.priority}
                    </span>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      style={{
                        padding: '6px 14px',
                        background: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                      }}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '15px', padding: '12px', background: '#e7f3ff', borderRadius: '8px', fontSize: '0.9rem' }}>
                <strong>Stats:</strong> {todos.length} total, {activeTodos.length} active, {completedTodos.length} completed
              </div>
            </div>

            <div className="demo-controls">
              {/* Display Mode */}
              <div className="control-group">
                <label>Display Mode:</label>
                <div className="button-group">
                  <button
                    className={displayMode === 'popup' ? 'active' : ''}
                    onClick={() => setDisplayMode('popup')}
                  >
                    💬 Popup
                  </button>
                  <button
                    className={displayMode === 'sidebar-left' ? 'active' : ''}
                    onClick={() => setDisplayMode('sidebar-left')}
                  >
                    ← Sidebar Left
                  </button>
                  <button
                    className={displayMode === 'sidebar-right' ? 'active' : ''}
                    onClick={() => setDisplayMode('sidebar-right')}
                  >
                    Sidebar Right →
                  </button>
                  <button
                    className={displayMode === 'panel-left' ? 'active' : ''}
                    onClick={() => setDisplayMode('panel-left')}
                  >
                    ⬅ Panel Left
                  </button>
                  <button
                    className={displayMode === 'panel-right' ? 'active' : ''}
                    onClick={() => setDisplayMode('panel-right')}
                  >
                    Panel Right ➡
                  </button>
                </div>
              </div>

              {/* Theme */}
              <div className="control-group">
                <label>Theme:</label>
                <div className="button-group">
                  <button
                    className={theme === 'light' ? 'active' : ''}
                    onClick={() => setTheme('light')}
                  >
                    ☀️ Light
                  </button>
                  <button
                    className={theme === 'dark' ? 'active' : ''}
                    onClick={() => setTheme('dark')}
                  >
                    🌙 Dark
                  </button>
                  <button
                    className={theme === 'professional' ? 'active' : ''}
                    onClick={() => setTheme('professional')}
                  >
                    💼 Professional
                  </button>
                  <button
                    className={theme === 'playful' ? 'active' : ''}
                    onClick={() => setTheme('playful')}
                  >
                    🎨 Playful
                  </button>
                  <button
                    className={theme === 'minimal' ? 'active' : ''}
                    onClick={() => setTheme('minimal')}
                  >
                    ⚪ Minimal
                  </button>
                  <button
                    className={theme === 'ocean' ? 'active' : ''}
                    onClick={() => setTheme('ocean')}
                  >
                    🌊 Ocean
                  </button>
                  <button
                    className={theme === 'sunset' ? 'active' : ''}
                    onClick={() => setTheme('sunset')}
                  >
                    🌅 Sunset
                  </button>
                </div>
              </div>
            </div>

            {/* Feature List */}
            <div className="demo-features">
              <h3>✨ Features</h3>
              <ul>
                <li>
                  <strong>Function Calling:</strong> AI can add, complete, and delete tasks
                </li>
                <li>
                  <strong>Popup Mode:</strong> Traditional floating chat button with popup window
                </li>
                <li>
                  <strong>Sidebar Modes:</strong> Full-height sidebar on left or right side (overlay)
                </li>
                <li>
                  <strong>Panel Modes:</strong> Integrated resizable panels that push page content
                </li>
                <li>
                  <strong>Resizable Panels:</strong> Drag the edge to resize (min 20%, max 33%)
                  {panelWidth > 0 && (
                    <span style={{ color: '#667eea', marginLeft: '8px' }}>
                      Current: {Math.round(panelWidth)}px
                    </span>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render non-panel modes (popup and sidebar)
  return (
    <div className="demo-container">
      {/* Control Panel */}
      <div className="demo-control-panel">
        <h1>🤖 InAppAI Demo</h1>
        <p className="demo-subtitle">
          Interactive AI assistant with function calling, multiple display modes, and task management
        </p>

        {/* Provider Info & Context - Compact Design */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
          {/* Provider Info */}
          {providerInfo && (
            <div style={{ background: 'white', borderRadius: '8px', padding: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', border: '1px solid #667eea' }}>
              <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '6px' }}>🚀 AI Provider</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#667eea', marginBottom: '4px' }}>
                {providerInfo.current === 'openai' && '🟢 OpenAI'}
                {providerInfo.current === 'anthropic' && '🟣 Claude'}
                {providerInfo.current === 'google' && '🔵 Gemini'}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#888' }}>
                Supports: {providerInfo.supported.join(', ')}
              </div>
            </div>
          )}

          {/* Context Capture */}
          <div style={{ background: 'white', borderRadius: '8px', padding: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', border: '1px solid #764ba2' }}>
            <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '6px' }}>📊 Context Stats</div>
            <div style={{ display: 'flex', gap: '8px', fontSize: '0.85rem' }}>
              <div>
                <span style={{ fontWeight: 'bold', color: '#667eea' }}>{todos.length}</span>
                <span style={{ color: '#888', fontSize: '0.7rem' }}> total</span>
              </div>
              <div>
                <span style={{ fontWeight: 'bold', color: '#10b981' }}>{completedTodos.length}</span>
                <span style={{ color: '#888', fontSize: '0.7rem' }}> done</span>
              </div>
              <div>
                <span style={{ fontWeight: 'bold', color: '#f59e0b' }}>{activeTodos.length}</span>
                <span style={{ color: '#888', fontSize: '0.7rem' }}> active</span>
              </div>
              <div>
                <span style={{ fontWeight: 'bold', color: '#ef4444' }}>{todos.filter(t => t.priority === 'high').length}</span>
                <span style={{ color: '#888', fontSize: '0.7rem' }}> high</span>
              </div>
            </div>
            <div style={{ fontSize: '0.65rem', color: '#888', marginTop: '4px' }}>
              💡 AI has real-time access to this data
            </div>
          </div>
        </div>

        {/* Todo List */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3>📝 Todo List (AI can manage this!)</h3>
          <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '15px' }}>
            💬 Try: "Add a task to buy milk" • "What's my completion rate?" • "I bought groceries" • "Make it high priority"
          </p>

          {/* Manual Add Task */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}>
            <input
              type="text"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
              placeholder="Add a new task..."
              style={{
                flex: 1,
                padding: '10px 14px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '0.95rem',
                outline: 'none',
              }}
            />
            <select
              value={newTaskPriority}
              onChange={(e) => setNewTaskPriority(e.target.value as 'low' | 'medium' | 'high')}
              style={{
                padding: '10px 14px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '0.95rem',
                cursor: 'pointer',
                outline: 'none',
                background: 'white',
              }}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <button
              onClick={handleAddTodo}
              style={{
                padding: '10px 20px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontWeight: 600,
                whiteSpace: 'nowrap',
              }}
            >
              Add Task
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {todos.map((todo) => (
              <div
                key={todo.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  background: todo.completed ? '#f0f0f0' : '#f8f9fa',
                  borderRadius: '8px',
                  opacity: todo.completed ? 0.6 : 1,
                }}
              >
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <span
                  style={{
                    flex: 1,
                    textDecoration: todo.completed ? 'line-through' : 'none',
                    fontSize: '0.95rem',
                  }}
                >
                  {todo.text} <span style={{ fontSize: '0.75rem', color: '#999' }}>(ID: {todo.id})</span>
                </span>
                <span
                  style={{
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    background: todo.priority === 'high' ? '#f8d7da' : todo.priority === 'medium' ? '#fff3cd' : '#d1f4e0',
                    color: todo.priority === 'high' ? '#721c24' : todo.priority === 'medium' ? '#856404' : '#1e7e34',
                  }}
                >
                  {todo.priority}
                </span>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  style={{
                    padding: '6px 14px',
                    background: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                  }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '15px', padding: '12px', background: '#e7f3ff', borderRadius: '8px', fontSize: '0.9rem' }}>
            <strong>Stats:</strong> {todos.length} total, {activeTodos.length} active, {completedTodos.length} completed
          </div>
        </div>

        <div className="demo-controls">
          {/* Display Mode */}
          <div className="control-group">
            <label>Display Mode:</label>
            <div className="button-group">
              <button
                className={displayMode === 'popup' ? 'active' : ''}
                onClick={() => setDisplayMode('popup')}
              >
                💬 Popup
              </button>
              <button
                className={displayMode === 'sidebar-left' ? 'active' : ''}
                onClick={() => setDisplayMode('sidebar-left')}
              >
                ← Sidebar Left
              </button>
              <button
                className={displayMode === 'sidebar-right' ? 'active' : ''}
                onClick={() => setDisplayMode('sidebar-right')}
              >
                Sidebar Right →
              </button>
              <button
                className={displayMode === 'panel-left' ? 'active' : ''}
                onClick={() => setDisplayMode('panel-left')}
              >
                ⬅ Panel Left
              </button>
              <button
                className={displayMode === 'panel-right' ? 'active' : ''}
                onClick={() => setDisplayMode('panel-right')}
              >
                Panel Right ➡
              </button>
            </div>
          </div>

          {/* Position (only for popup) */}
          {displayMode === 'popup' && (
            <div className="control-group">
              <label>Position:</label>
              <div className="button-group">
                <button
                  className={position === 'bottom-right' ? 'active' : ''}
                  onClick={() => setPosition('bottom-right')}
                >
                  ↘ Bottom Right
                </button>
                <button
                  className={position === 'bottom-left' ? 'active' : ''}
                  onClick={() => setPosition('bottom-left')}
                >
                  ↙ Bottom Left
                </button>
                <button
                  className={position === 'top-right' ? 'active' : ''}
                  onClick={() => setPosition('top-right')}
                >
                  ↗ Top Right
                </button>
                <button
                  className={position === 'top-left' ? 'active' : ''}
                  onClick={() => setPosition('top-left')}
                >
                  ↖ Top Left
                </button>
              </div>
            </div>
          )}

          {/* Default Folded (only for sidebar) */}
          {displayMode.startsWith('sidebar') && (
            <div className="control-group">
              <label>
                <input
                  type="checkbox"
                  checked={defaultFolded}
                  onChange={(e) => setDefaultFolded(e.target.checked)}
                />
                Start Folded
              </label>
            </div>
          )}

          {/* Theme */}
          <div className="control-group">
            <label>Theme:</label>
            <div className="button-group">
              <button
                className={theme === 'light' ? 'active' : ''}
                onClick={() => setTheme('light')}
              >
                ☀️ Light
              </button>
              <button
                className={theme === 'dark' ? 'active' : ''}
                onClick={() => setTheme('dark')}
              >
                🌙 Dark
              </button>
              <button
                className={theme === 'professional' ? 'active' : ''}
                onClick={() => setTheme('professional')}
              >
                💼 Professional
              </button>
              <button
                className={theme === 'playful' ? 'active' : ''}
                onClick={() => setTheme('playful')}
              >
                🎨 Playful
              </button>
              <button
                className={theme === 'minimal' ? 'active' : ''}
                onClick={() => setTheme('minimal')}
              >
                ⚪ Minimal
              </button>
              <button
                className={theme === 'ocean' ? 'active' : ''}
                onClick={() => setTheme('ocean')}
              >
                🌊 Ocean
              </button>
              <button
                className={theme === 'sunset' ? 'active' : ''}
                onClick={() => setTheme('sunset')}
              >
                🌅 Sunset
              </button>
            </div>
          </div>
        </div>

        {/* Feature List */}
        <div className="demo-features">
          <h3>✨ Features</h3>
          <ul>
            <li>
              <strong>Function Calling:</strong> AI can add, complete, and delete tasks
            </li>
            <li>
              <strong>Popup Mode:</strong> Traditional floating chat button with popup window
            </li>
            <li>
              <strong>Sidebar Modes:</strong> Full-height sidebar on left or right side (overlay)
            </li>
            <li>
              <strong>Panel Modes:</strong> Integrated resizable panels that push page content
            </li>
            <li>
              <strong>Fold/Unfold:</strong> Sidebars can collapse to a narrow column (60px)
            </li>
          </ul>
        </div>
      </div>

      {/* InAppAI Component for non-panel modes */}
      <InAppAI
        key={`${displayMode}-${position}-${theme}-${defaultFolded}`}
        endpoint={ENDPOINT}
        displayMode={displayMode}
        position={position}
        defaultFolded={defaultFolded}
        theme={theme}
        customStyles={{
          headerTitle: "AI Assistant",
          buttonIcon: "🤖",
        }}
        context={() => {
          // Use a function to get FRESH context on every call
          // This ensures AI sees updated todos after tool execution
          // Use ref to get truly current value (not closure)
          const currentTodos = todosRef.current;
          const currentCompleted = currentTodos.filter((t) => t.completed);
          const currentActive = currentTodos.filter((t) => !t.completed);

          return {
            page: 'demo-enhanced',
            mode: displayMode,
            todos: currentTodos.map((t) => ({
              id: t.id,
              text: t.text,
              completed: t.completed,
              priority: t.priority,
            })),
            stats: {
              total: currentTodos.length,
              completed: currentCompleted.length,
              active: currentActive.length,
            },
          };
        }}
        tools={tools}
      />
    </div>
  );
}

export default Demo;
