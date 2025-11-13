import { Link } from 'react-router-dom';

function ChatSidebar() {
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>📊 Sidebar Pattern</h1>
      <p>Permanent sidebar for continuous assistance</p>
      <p style={{ color: '#666' }}>Coming soon...</p>
      <div style={{ marginTop: '20px' }}>
        <Link to="/" style={{ color: '#667eea', textDecoration: 'none' }}>
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}

export default ChatSidebar;
