import { Link } from 'react-router-dom';

function ChatStandalone() {
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>💬 Standalone Chat</h1>
      <p>Full-page ChatGPT-like conversation interface</p>
      <p style={{ color: '#666' }}>Coming soon...</p>
      <div style={{ marginTop: '20px' }}>
        <Link to="/" style={{ color: '#667eea', textDecoration: 'none' }}>
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}

export default ChatStandalone;
