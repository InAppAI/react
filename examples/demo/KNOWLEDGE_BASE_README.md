# InAppAI Knowledge Base Integration

The InAppAI demo now includes a comprehensive knowledge base that helps users understand how to use the demo and implement the AI assistant in their own applications.

## What's Included

The knowledge base contains 9 comprehensive documents covering:

### 1. **Using the Todo List** (`doc-todo-list-basics`)
- How to add tasks naturally
- Completing tasks
- Checking status and completion rate
- Priority management
- Natural language understanding

### 2. **AI Assistant Display Modes** (`doc-display-modes`)
- Panel Mode (default)
- Popup Mode
- Inline Mode
- Bottom Mode (mobile-friendly)
- Fullscreen Mode
- Guidance on choosing the right mode

### 3. **Themes and Customization** (`doc-themes`)
- 7 built-in themes (default, dark, light, minimal, colorful, professional, retro)
- Custom theme creation
- Switching themes in the demo

### 4. **Implementation Guide** (`doc-implementation-guide`)
- Quick start instructions
- Package installation
- Backend setup
- Component usage
- Function calling setup
- Context capture
- Best practices

### 5. **Backend LLM Configuration** (`doc-backend-llm`)
- OpenAI (GPT-4, GPT-3.5)
- Anthropic Claude (Opus, Sonnet, Haiku)
- Google Gemini
- Switching providers
- Model parameters (temperature, max_tokens)
- Cost optimization tips

### 6. **Function Calling / Tool Use** (`doc-function-calling`)
- What is function calling
- Defining tools
- Backend integration
- Example tools (database, API calls, UI actions)
- Best practices

### 7. **Security Best Practices** (`doc-security`)
- API key protection
- Backend security (CORS, rate limiting, authentication)
- Input validation
- Content filtering
- Production checklist

### 8. **Context Capture** (`doc-context-capture`)
- What is context capture
- Static vs dynamic context
- What to include (user, app state, UI state, business context)
- E-commerce and project management examples
- Privacy considerations
- Performance tips

### 9. **Troubleshooting** (`doc-troubleshooting`)
- Connection issues
- CORS errors
- API key problems
- Display issues
- Performance optimization
- Function calling debugging
- Getting help

## Files Created

### Backend
- **`knowledge-base-routes.ts`** - REST API endpoints for knowledge base operations
  - 13 endpoints including init, search, RAG query, document management
- **`KNOWLEDGE_BASE_API.md`** - Complete API documentation with examples

### Frontend
- **`knowledge-base-content.ts`** - All 9 documentation documents
- **`useKnowledgeBase.ts`** - React hook for KB initialization and queries

### Integration
- **`unified-backend.ts`** - Updated to mount knowledge base routes

## How It Works

### 1. Knowledge Base Initialization

When the demo loads, it can initialize the knowledge base:

```typescript
import { useKnowledgeBase } from './useKnowledgeBase';

const { initialized, loading, initialize, ragQuery } = useKnowledgeBase();

// Initialize on mount
useEffect(() => {
  initialize();
}, []);
```

### 2. RAG-Enhanced Responses

The AI assistant can now use RAG (Retrieval Augmented Generation) to answer questions about:
- How to use the demo
- How to implement InAppAI
- Configuration options
- Troubleshooting

```typescript
// When user asks a question
const context = await ragQuery("How do I change themes?");

// Context includes:
// - Retrieved relevant documentation chunks
// - Formatted context with citations
// - System prompt for the LLM
// - Full prompt ready to send
```

### 3. Natural Interaction

Users can ask questions like:
- "How do I change the theme?"
- "What display modes are available?"
- "How do I add tasks to the todo list?"
- "How do I implement this in my app?"
- "What LLM providers are supported?"
- "How do I configure the backend?"

The AI will retrieve relevant documentation and provide accurate, cited answers.

## API Usage Examples

### Initialize Knowledge Base
```bash
curl -X POST http://localhost:3001/kb/init \
  -H "Content-Type: application/json" \
  -d '{
    "embeddingProvider": {
      "type": "openai",
      "model": "text-embedding-ada-002"
    }
  }'
```

### Search Documentation
```bash
curl -X POST http://localhost:3001/kb/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "How do I change themes?",
    "options": { "limit": 3 }
  }'
```

### RAG Query for Enhanced Responses
```bash
curl -X POST http://localhost:3001/kb/rag/query \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Explain display modes",
    "config": {
      "topK": 3,
      "includeCitations": true
    }
  }'
```

## Benefits

### For Demo Users
- **Self-Service Help**: Get answers without leaving the app
- **Contextual Guidance**: Learn by doing with in-context help
- **Examples Included**: See code examples and best practices

### For Developers
- **Implementation Guide**: Step-by-step instructions
- **Best Practices**: Security, performance, and architecture tips
- **Troubleshooting**: Solutions to common problems
- **Multiple Providers**: Guidance on OpenAI, Claude, Gemini

### For Integration
- **RAG System**: Production-ready retrieval augmented generation
- **Semantic Search**: Find relevant info using vector embeddings
- **Citation Tracking**: Know where answers come from
- **Auto-Updated**: Add new docs without code changes

## Architecture

```
User Question
    ↓
Frontend (useKnowledgeBase hook)
    ↓
Backend API (/kb/rag/query)
    ↓
Knowledge Base (9 documents)
    ↓
Vector Search (semantic similarity)
    ↓
RAG Context Builder
    ↓
LLM Prompt (with context & citations)
    ↓
AI Response (accurate, cited answer)
```

## Technical Details

### Embeddings
- Model: `text-embedding-ada-002` (OpenAI)
- Dimension: 1536
- Chunking: 800 chars with 150 char overlap

### Vector Store
- Type: In-memory (demo mode)
- Persistence: Disabled for demo (can be enabled)
- Search: Cosine similarity

### RAG Configuration
- Top-K: 3 most relevant chunks
- Min Score: 0.6 similarity threshold
- Max Context: 2000 characters
- Citations: Enabled
- Deduplication: Enabled

## Future Enhancements

Potential additions to the knowledge base:
1. Video tutorials (embedded links)
2. Interactive code playgrounds
3. API reference documentation
4. Migration guides for different versions
5. Performance benchmarks
6. Community examples and templates
7. FAQ section with common questions
8. Versioned documentation

## Testing

To test the knowledge base:

1. **Start backend** with knowledge base support:
   ```bash
   cd examples/backend
   npm install  # Installs @inapp-ai/knowledge-base
   npm run start:unified
   ```

2. **Start frontend**:
   ```bash
   cd examples/react-demo
   pnpm dev
   ```

3. **Initialize KB** (automatic or manual):
   - Automatic: Hook calls `initialize()` on mount
   - Manual: Use API endpoints directly

4. **Ask questions** in the AI assistant:
   - "How do I change themes?"
   - "What display modes are available?"
   - "How do I implement this in my React app?"
   - "Tell me about function calling"

## Maintenance

### Adding New Documents

Add to `knowledge-base-content.ts`:

```typescript
{
  id: 'doc-new-feature',
  content: `# New Feature Guide

  Your documentation here...`,
  metadata: {
    category: 'features',
    title: 'New Feature',
    tags: ['new', 'feature'],
  },
}
```

### Updating Existing Docs

Edit the content in `knowledge-base-content.ts` and restart the backend. The knowledge base will reinitialize with updated content.

### Monitoring

Check backend logs for:
- `✅ Knowledge base initialized` - Successful init
- Document/chunk counts
- Search queries and results
- RAG context generation

## Configuration

Environment variables:

```bash
AI_API_KEY=sk-...  # Required for embeddings
AI_PROVIDER=openai      # For chat responses
AI_MODEL=gpt-4          # Model for responses
PORT=3001               # Backend port
```

## Conclusion

The knowledge base transforms the InAppAI demo from a simple showcase into an interactive learning experience. Users can discover features, learn implementation patterns, and troubleshoot issues—all through natural conversation with the AI assistant.

The same RAG system can be adapted for:
- Customer support chatbots
- Internal documentation assistants
- Product help systems
- Educational applications
- Technical support bots

The modular architecture makes it easy to swap out the vector store, embedding provider, or add new document sources as needs evolve.
