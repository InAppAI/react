import { Link } from 'react-router-dom';
import './Home.css';

interface RouteCard {
  path: string;
  title: string;
  description: string;
  icon: string;
  focus: string;
  tags: string[];
}

const routes: RouteCard[] = [
  {
    path: '/demo',
    title: 'Original Demo',
    description: 'Test DOM context reading, tool execution, and display modes',
    icon: '🎯',
    focus: 'Context + Tools + Display Modes',
    tags: ['context', 'tools', 'themes', 'modes'],
  },
  {
    path: '/chat-standalone',
    title: 'Standalone Chat',
    description: 'ChatGPT-style full-page conversation experience',
    icon: '💬',
    focus: 'Full-Page Interface',
    tags: ['focused', 'conversation', 'chatgpt-like'],
  },
  {
    path: '/chat-sidebar',
    title: 'Sidebar Pattern',
    description: 'Permanent sidebar for continuous assistance',
    icon: '📊',
    focus: 'Always-On Assistant',
    tags: ['sidebar', 'persistent', 'context-aware'],
  },
  {
    path: '/chat-embedded',
    title: 'Embedded Pattern',
    description: 'Chat embedded in tutorial/documentation sections',
    icon: '📝',
    focus: 'In-Context Help',
    tags: ['embedded', 'tutorial', 'contextual'],
  },
  {
    path: '/chat-multi-conversation',
    title: 'Multi-Conversation',
    description: 'Advanced conversation organization with folders/tags',
    icon: '🗂️',
    focus: 'History Management',
    tags: ['folders', 'tags', 'search', 'analytics'],
  },
  {
    path: '/docs',
    title: 'Documentation',
    description: 'Complete API docs, guides, and examples',
    icon: '📚',
    focus: 'Library Reference',
    tags: ['api', 'guides', 'examples'],
  },
];

function Home() {
  return (
    <div className="home-container">
      {/* Header */}
      <header className="home-header">
        <h1>🤖 InAppAI Demo Suite v3.0</h1>
        <p className="subtitle">Privacy-First • Client-Side Storage • Multiple Patterns</p>
      </header>

      {/* Feature Highlight */}
      <section className="feature-highlight">
        <h2>✨ New: Privacy-First Architecture</h2>
        <div className="feature-grid">
          <div className="feature-item">
            <span className="feature-icon">🔒</span>
            <h3>Client-Side Storage</h3>
            <p>All conversations stored locally in your browser</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🚫</span>
            <h3>No Server Storage</h3>
            <p>Zero message persistence on the server</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">💾</span>
            <h3>Export/Import</h3>
            <p>Backup and restore your conversation history</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🔄</span>
            <h3>Cross-Route Sharing</h3>
            <p>Access conversations across all demo routes</p>
          </div>
        </div>
      </section>

      {/* Route Cards */}
      <section className="routes-section">
        <h2>📋 Demo Routes</h2>
        <div className="routes-grid">
          {routes.map((route) => (
            <Link key={route.path} to={route.path} className="route-card">
              <div className="route-icon">{route.icon}</div>
              <h3>{route.title}</h3>
              <p className="route-focus">{route.focus}</p>
              <p className="route-description">{route.description}</p>
              <div className="route-tags">
                {route.tags.map((tag) => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
              <div className="route-action">Launch Demo →</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Comparison Table */}
      <section className="comparison-section">
        <h2>⚖️ Pattern Comparison</h2>
        <table className="comparison-table">
          <thead>
            <tr>
              <th>Pattern</th>
              <th>Best For</th>
              <th>Key Benefit</th>
              <th>Trade-off</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Original Demo</strong></td>
              <td>Testing features</td>
              <td>All display modes, tools</td>
              <td>Complex UI</td>
            </tr>
            <tr>
              <td><strong>Standalone</strong></td>
              <td>Extended conversations</td>
              <td>Maximum focus</td>
              <td>Full-screen only</td>
            </tr>
            <tr>
              <td><strong>Sidebar</strong></td>
              <td>Documentation/Help</td>
              <td>Always available</td>
              <td>Takes screen space</td>
            </tr>
            <tr>
              <td><strong>Embedded</strong></td>
              <td>Tutorials/Guides</td>
              <td>Contextual help</td>
              <td>Multiple conversations</td>
            </tr>
            <tr>
              <td><strong>Multi-Conversation</strong></td>
              <td>Power users</td>
              <td>Organization at scale</td>
              <td>More complex</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <p>Built with InAppAI React Component</p>
        <p>All demos share the same conversation storage</p>
      </footer>
    </div>
  );
}

export default Home;
