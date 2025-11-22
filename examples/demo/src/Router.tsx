import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { PreferenceProvider, usePreferences } from './contexts/PreferenceContext';
import { TodoProvider, useTodos } from './contexts/TodoContext';
import { InAppAI } from './components/InAppAI-Enhanced';
import Home from './pages/Home';
import TodoDemo from './pages/TodoDemo';
import ChatMultiConversation from './pages/ChatMultiConversation';
import Documentation from './pages/Documentation';

// Routes that should NOT show the shared AI assistant
// These routes have their own standalone fullscreen chat interfaces
const ROUTES_WITHOUT_AI = ['/chat-multi-conversation'];

function AppContent() {
  const location = useLocation();
  const { preferences } = usePreferences();
  const todoContext = useTodos();

  // Check if current route should show the shared AI assistant
  const showSharedAI = !ROUTES_WITHOUT_AI.includes(location.pathname);
  const isPanel = preferences.displayMode.startsWith('panel');

  // Determine tools and context based on current route
  const isOnTodoPage = location.pathname === '/todo-demo';
  const aiTools = isOnTodoPage ? todoContext.tools : [];
  const aiContextGetter = () => {
    const baseContext = { page: location.pathname };
    if (isOnTodoPage) {
      return { ...baseContext, ...todoContext.context() };
    }
    return baseContext;
  };

  // For panel mode, use flex layout to put AI and content side-by-side
  if (showSharedAI && isPanel) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: preferences.displayMode === 'panel-right' ? 'row-reverse' : 'row',
        height: '100vh',
        width: '100%',
        margin: 0,
        padding: 0,
        overflow: 'hidden'
      }}>
        <InAppAI
          endpoint={import.meta.env.VITE_API_BASE_URL}
          subscriptionId={import.meta.env.VITE_SUBSCRIPTION_ID}
          displayMode={preferences.displayMode}
          theme={preferences.theme}
          conversationId="shared-demo-assistant"
          context={aiContextGetter}
          tools={aiTools}
          customStyles={{
            headerTitle: '🤖 AI Assistant',
          }}
          panelMinWidth="20%"
          panelMaxWidth="33.33%"
          panelDefaultWidth="25%"
        />
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/todo-demo" element={<TodoDemo />} />
            <Route path="/chat-multi-conversation" element={<ChatMultiConversation />} />
            <Route path="/docs" element={<Documentation />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    );
  }

  // For non-panel modes (popup, sidebar, or no AI)
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/todo-demo" element={<TodoDemo />} />
        <Route path="/chat-multi-conversation" element={<ChatMultiConversation />} />
        <Route path="/docs" element={<Documentation />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Shared AI Assistant - persists across route changes */}
      {showSharedAI && (
        <InAppAI
          endpoint={import.meta.env.VITE_API_BASE_URL}
          subscriptionId={import.meta.env.VITE_SUBSCRIPTION_ID}
          displayMode={preferences.displayMode}
          theme={preferences.theme}
          conversationId="shared-demo-assistant"
          context={aiContextGetter}
          tools={aiTools}
          customStyles={{
            headerTitle: '🤖 AI Assistant',
          }}
        />
      )}
    </>
  );
}

function Router() {
  return (
    <BrowserRouter>
      <PreferenceProvider>
        <TodoProvider>
          <AppContent />
        </TodoProvider>
      </PreferenceProvider>
    </BrowserRouter>
  );
}

export default Router;
