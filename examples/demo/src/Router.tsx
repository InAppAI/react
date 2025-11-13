import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import DemoOriginal from './pages/DemoOriginal';
import ChatStandalone from './pages/ChatStandalone';
import ChatSidebar from './pages/ChatSidebar';
import ChatEmbedded from './pages/ChatEmbedded';
import ChatMultiConversation from './pages/ChatMultiConversation';
import Documentation from './pages/Documentation';

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/demo" element={<DemoOriginal />} />
        <Route path="/chat-standalone" element={<ChatStandalone />} />
        <Route path="/chat-sidebar" element={<ChatSidebar />} />
        <Route path="/chat-embedded" element={<ChatEmbedded />} />
        <Route path="/chat-multi-conversation" element={<ChatMultiConversation />} />
        <Route path="/docs" element={<Documentation />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
