import { Link } from 'react-router-dom';

function ChatEmbedded() {
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>📝 Embedded Pattern</h1>
      <p>Chat embedded in tutorial/documentation sections</p>
      <p style={{ color: '#666' }}>Coming soon...</p>
      <div style={{ marginTop: '20px' }}>
        <Link to="/" style={{ color: '#667eea', textDecoration: 'none' }}>
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}

export default ChatEmbedded;
