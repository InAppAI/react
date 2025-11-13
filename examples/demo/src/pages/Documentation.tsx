import { Link } from 'react-router-dom';

function Documentation() {
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>📚 Documentation</h1>
      <p>Complete API docs, guides, and examples</p>
      <p style={{ color: '#666' }}>Coming soon...</p>
      <div style={{ marginTop: '20px' }}>
        <Link to="/" style={{ color: '#667eea', textDecoration: 'none' }}>
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}

export default Documentation;
