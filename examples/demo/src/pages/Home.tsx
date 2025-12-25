import { Link } from 'react-router-dom';
import { usePreferences, THEME_METADATA, DISPLAY_MODE_METADATA, Theme, DisplayMode } from '../contexts/PreferenceContext';
import './Home.css';

function Home() {
  const { preferences, setTheme, setDisplayMode } = usePreferences();

  const openFullscreenDemo = () => {
    window.open('/chat-multi-conversation', '_blank');
  };

  return (
    <div className="home-container">
      {/* Header */}
      <header className="home-header">
        <h1>🤖 InAppAI React Component Demo</h1>
        <p className="subtitle">Embed AI chat into your React app with 3 simple steps</p>
      </header>

      {/* Step 1: Choose Display Mode and Theme */}
      <section className="step-section">
        <div className="step-header">
          <span className="step-number">1</span>
          <h2>Choose Your Display Mode & Theme</h2>
        </div>
        <p className="step-description">
          Select how you want InAppAI to appear in your app. Your choice will apply to all demos below.
        </p>

        {/* Display Mode Selector - Show First */}
        <div className="preference-subsection">
          <h3>Display Mode</h3>
          <div className="display-mode-grid">
            {(Object.keys(DISPLAY_MODE_METADATA) as DisplayMode[]).map((modeKey) => {
              const mode = DISPLAY_MODE_METADATA[modeKey];
              return (
                <div
                  key={modeKey}
                  className={`display-mode-card ${preferences.displayMode === modeKey ? 'selected' : ''}`}
                  onClick={() => setDisplayMode(modeKey)}
                >
                  <span className="display-mode-icon">{mode.icon}</span>
                  <h4>{mode.name}</h4>
                  <p>{mode.description}</p>
                </div>
              );
            })}
            {/* Fullscreen Option */}
            <div
              className="display-mode-card fullscreen-card"
              onClick={openFullscreenDemo}
            >
              <span className="display-mode-icon">🖥️</span>
              <h4>Fullscreen</h4>
              <p>Open in new tab (multi-conversation)</p>
            </div>
          </div>
        </div>

        {/* Theme Selector */}
        <div className="preference-subsection">
          <h3>Theme</h3>
          <div className="theme-grid">
            {(Object.keys(THEME_METADATA) as Theme[]).map((themeKey) => {
              const theme = THEME_METADATA[themeKey];
              return (
                <div
                  key={themeKey}
                  className={`theme-card ${preferences.theme === themeKey ? 'selected' : ''}`}
                  onClick={() => setTheme(themeKey)}
                >
                  <div className="theme-colors">
                    {theme.colors.map((color, idx) => (
                      <div
                        key={idx}
                        className="theme-color"
                        style={{ background: color }}
                      />
                    ))}
                  </div>
                  <h4>{theme.name}</h4>
                  <p>{theme.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Current Selection Display */}
        <div className="current-selection">
          Selected: <strong>{DISPLAY_MODE_METADATA[preferences.displayMode].name}</strong> • <strong>{THEME_METADATA[preferences.theme].name}</strong> theme
        </div>
      </section>

      {/* Step 2: Try the Todo App */}
      <section className="step-section">
        <div className="step-header">
          <span className="step-number">2</span>
          <h2>Try the Todo App with AI Tools</h2>
        </div>
        <p className="step-description">
          Experience how InAppAI can control your app using <strong>Tools</strong> (function calling) and <strong>Context</strong>.
          The AI can see your current todos and manipulate them through natural language.
        </p>

        <div className="demo-card todo-card">
          <div className="demo-card-content">
            <div className="demo-icon">✅</div>
            <div>
              <h3>AI-Powered Todo List</h3>
              <p>
                The AI assistant has access to <strong>4 tools</strong> (<code>addTodo</code>, <code>completeTodo</code>,
                <code>deleteTodo</code>, <code>updatePriority</code>) and can see your <strong>current todos via Context</strong>.
                This allows it to understand what tasks exist and operate on them intelligently!
              </p>
              <div className="example-commands">
                <strong>Example commands:</strong>
                <ul>
                  <li>"Add a high priority task to review the code"</li>
                  <li>"Mark the first task as complete"</li>
                  <li>"What tasks do I have?"</li>
                  <li>"Delete all completed tasks"</li>
                </ul>
              </div>
            </div>
          </div>
          <Link to="/todo-demo" className="demo-button">
            Launch Todo Demo →
          </Link>
        </div>

        <div className="learn-more-box">
          <p>
            <strong>🔧 How Tools & Context Work:</strong> Tools allow the AI to execute functions in your app.
            Context provides the AI with real-time app state (like your current todos list).
            Together, they enable the AI to understand your app and take actions based on what it sees.
          </p>
          <a href="https://www.inappai.com/docs/" target="_blank" rel="noopener noreferrer" className="docs-link">Learn more about Tools & Context in the docs →</a>
        </div>
      </section>

      {/* Step 3: Read the Documentation */}
      <section className="step-section">
        <div className="step-header">
          <span className="step-number">3</span>
          <h2>Read the Documentation</h2>
        </div>
        <p className="step-description">
          Learn how to integrate InAppAI into your own React application with our comprehensive documentation.
        </p>

        <a href="https://www.inappai.com/docs/" target="_blank" rel="noopener noreferrer" className="docs-button">
          Read Full Documentation →
        </a>
      </section>

      {/* Step 4: GitHub */}
      <section className="step-section">
        <div className="step-header">
          <span className="step-number">4</span>
          <h2>View GitHub Repo</h2>
        </div>
        <p className="step-description">
          InAppAI is open source! Star the repo to show your support, contribute code, report bugs, or request features.
        </p>

        <a href="https://github.com/InAppAI/react" target="_blank" rel="noopener noreferrer" className="docs-button">
          Star & Contribute on GitHub →
        </a>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <p>🤖 InAppAI React Component - Privacy-First AI Chat for React Applications</p>
        <p>All conversations are stored locally in your browser • No server-side storage</p>
      </footer>
    </div>
  );
}

export default Home;
