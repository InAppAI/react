import { Link } from 'react-router-dom';

function ChatMultiConversation() {
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>🗂️ Multi-Conversation Manager</h1>
      <p>Advanced conversation organization with folders/tags</p>
      <p style={{ color: '#666' }}>Coming soon...</p>
      <div style={{ marginTop: '20px' }}>
        <Link to="/" style={{ color: '#667eea', textDecoration: 'none' }}>
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}

export default ChatMultiConversation;
