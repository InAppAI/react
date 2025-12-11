/**
 * Knowledge Base Content for InAppAI Demo
 * This content helps users understand how to use the demo and implement InAppAI in their apps
 */

export const knowledgeBaseDocuments = [
  {
    id: 'doc-todo-list-basics',
    content: `# Using the Todo List Feature

The InAppAI demo includes an intelligent todo list that you can interact with using natural language. Here's how to use it:

## Adding Tasks
Simply tell the AI assistant what you want to add:
- "Add a task to buy groceries"
- "Remind me to call the doctor"
- "I need to finish the project report"

The AI will understand your intent and add the task to your list.

## Completing Tasks
Mark tasks as done by saying:
- "I finished buying groceries"
- "Mark the doctor call as complete"
- "I'm done with the project report"

## Checking Status
Ask about your tasks:
- "What's on my todo list?"
- "Show me my tasks"
- "What's my completion rate?"
- "How many tasks do I have left?"

## Priority Management
The AI can help prioritize:
- "Make the project report high priority"
- "This is urgent"
- "That can wait"

## Natural Language Understanding
The AI understands context and natural language, so you don't need to use specific commands. Just talk naturally about your tasks!`,
    metadata: {
      category: 'features',
      title: 'Using the Todo List',
      tags: ['todo', 'tasks', 'features'],
    },
  },

  {
    id: 'doc-display-modes',
    content: `# AI Assistant Display Modes

InAppAI supports multiple display modes to fit different use cases and screen sizes.

## Available Modes

### 1. Panel Mode (Default)
- Opens in a side panel
- Slides in from the right
- Doesn't block the main content
- Perfect for desktop applications
- Use: \`<InAppAI mode="panel" />\`

### 2. Popup Mode
- Opens in a centered modal/popup
- Overlays the main content
- Good for focused interactions
- Works well on all screen sizes
- Use: \`<InAppAI mode="popup" />\`

### 3. Inline Mode
- Embeds directly in your page
- No overlay or panel
- Always visible
- Great for dedicated chat pages
- Use: \`<InAppAI mode="inline" />\`

### 4. Bottom Mode
- Docked at the bottom of the screen
- Slides up when opened
- Mobile-friendly
- Messenger-style interface
- Use: \`<InAppAI mode="bottom" />\`

### 5. Fullscreen Mode
- Takes over the entire screen
- Immersive chat experience
- Perfect for mobile apps
- Maximum focus
- Use: \`<InAppAI mode="fullscreen" />\`

## Switching Modes in Demo
In the demo app, you can change modes using the buttons at the top of the interface. Try each one to see which fits your needs best!

## Choosing the Right Mode
- **Desktop web apps**: Panel or Popup
- **Mobile apps**: Bottom or Fullscreen
- **Chat-focused pages**: Inline
- **Customer support**: Panel or Bottom`,
    metadata: {
      category: 'ui',
      title: 'Display Modes',
      tags: ['modes', 'ui', 'panel', 'popup'],
    },
  },

  {
    id: 'doc-themes',
    content: `# Customizing AI Assistant Themes

InAppAI comes with multiple beautiful themes and supports custom theming.

## Built-in Themes

### 1. Default Theme
- Clean and professional
- Blue and purple gradient
- Works in light and dark environments
- \`theme="default"\`

### 2. Dark Theme
- Dark mode optimized
- Easy on the eyes
- Perfect for dark UIs
- \`theme="dark"\`

### 3. Light Theme
- Bright and clean
- High contrast
- Best for light backgrounds
- \`theme="light"\`

### 4. Minimal Theme
- Stripped down design
- Maximum content focus
- Subtle styling
- \`theme="minimal"\`

### 5. Colorful Theme
- Vibrant colors
- Playful design
- Great for creative apps
- \`theme="colorful"\`

### 6. Professional Theme
- Corporate look
- Serious and trustworthy
- Business-appropriate
- \`theme="professional"\`

### 7. Retro Theme
- Vintage terminal style
- Nostalgic feel
- Unique aesthetic
- \`theme="retro"\`

## Custom Themes
You can create custom themes by providing a theme object:

\`\`\`typescript
const customTheme = {
  primary: '#your-color',
  secondary: '#your-color',
  background: '#your-color',
  text: '#your-color',
  // ... more customization
};

<InAppAI theme={customTheme} />
\`\`\`

## Switching Themes in Demo
Use the theme selector dropdown in the demo to preview all available themes. Find the one that matches your brand!`,
    metadata: {
      category: 'ui',
      title: 'Themes',
      tags: ['themes', 'styling', 'customization'],
    },
  },

  {
    id: 'doc-implementation-guide',
    content: `# Implementing InAppAI in Your Web App

## Quick Start Guide

### Step 1: Install the Package
\`\`\`bash
npm install @inapp-ai/react
# or
yarn add @inapp-ai/react
# or
pnpm add @inapp-ai/react
\`\`\`

### Step 2: Import the Component
\`\`\`typescript
import { InAppAI } from '@inapp-ai/react';
import '@inapp-ai/react/dist/style.css';
\`\`\`

### Step 3: Set Up Your Backend
You need a backend server to handle AI requests securely:

\`\`\`typescript
// backend.ts
import express from 'express';
import { ProviderFactory } from '@inapp-ai/providers';

const app = express();
const provider = ProviderFactory.fromEnv();

app.post('/chat', async (req, res) => {
  const { message, conversationId } = req.body;
  const response = await provider.chat(message, conversationId);
  res.json(response);
});

app.listen(3001);
\`\`\`

### Step 4: Use the Component
\`\`\`typescript
function App() {
  return (
    <div>
      <h1>My App</h1>
      <InAppAI
        apiUrl="http://localhost:3001"
        mode="panel"
        theme="default"
        placeholder="Ask me anything..."
      />
    </div>
  );
}
\`\`\`

## Configuration Options

### Required Props
- \`apiUrl\`: Your backend API endpoint

### Optional Props
- \`mode\`: Display mode (panel, popup, inline, bottom, fullscreen)
- \`theme\`: Visual theme (default, dark, light, etc.)
- \`placeholder\`: Input placeholder text
- \`initialMessage\`: Welcome message
- \`tools\`: Function calling capabilities
- \`contextCapture\`: Capture app context for better responses

## Adding Function Calling
Enable the AI to perform actions in your app:

\`\`\`typescript
const tools = [
  {
    name: 'getUserProfile',
    description: 'Get user profile information',
    parameters: { /* ... */ },
    handler: async (params) => {
      const user = await fetchUser(params.userId);
      return { success: true, data: user };
    }
  }
];

<InAppAI apiUrl="..." tools={tools} />
\`\`\`

## Context Capture
Help the AI understand your app's state:

\`\`\`typescript
const contextCapture = {
  currentPage: window.location.pathname,
  userName: user.name,
  appMode: isDarkMode ? 'dark' : 'light',
};

<InAppAI apiUrl="..." contextCapture={contextCapture} />
\`\`\`

## Best Practices
1. Always use HTTPS in production
2. Implement authentication on your backend
3. Rate limit API requests
4. Cache responses when appropriate
5. Monitor API usage and costs
6. Test with different themes and modes
7. Provide clear error messages`,
    metadata: {
      category: 'implementation',
      title: 'Implementation Guide',
      tags: ['setup', 'integration', 'guide', 'installation'],
    },
  },

  {
    id: 'doc-backend-llm',
    content: `# Configuring Backend LLM Providers

InAppAI supports multiple LLM providers through a unified interface.

## Supported Providers

### 1. OpenAI (GPT-4, GPT-3.5)
\`\`\`bash
# .env
AI_PROVIDER=openai
AI_API_KEY=sk-...
AI_MODEL=gpt-4-turbo-preview
AI_TEMPERATURE=0.7
AI_MAX_TOKENS=500
\`\`\`

**Models:**
- gpt-4-turbo-preview (latest)
- gpt-4 (recommended)
- gpt-3.5-turbo (fast, economical)

### 2. Anthropic Claude
\`\`\`bash
# .env
AI_PROVIDER=anthropic
AI_API_KEY=sk-ant-...
AI_MODEL=claude-3-opus-20240229
AI_TEMPERATURE=0.7
AI_MAX_TOKENS=500
\`\`\`

**Models:**
- claude-3-opus (most capable)
- claude-3-sonnet (balanced)
- claude-3-haiku (fastest)

### 3. Google Gemini
\`\`\`bash
# .env
AI_PROVIDER=google
AI_API_KEY=...
AI_MODEL=gemini-pro
AI_TEMPERATURE=0.7
AI_MAX_TOKENS=500
\`\`\`

**Models:**
- gemini-pro (recommended)
- gemini-pro-vision (with images)

## Switching Providers

### Option 1: Environment Variables
Change your .env file and restart the backend:
\`\`\`bash
AI_PROVIDER=anthropic  # Change from openai to anthropic
\`\`\`

### Option 2: Programmatic Configuration
\`\`\`typescript
import { ProviderFactory } from '@inapp-ai/providers';

const provider = ProviderFactory.create({
  provider: 'anthropic',
  apiKey: process.env.ANTHROPIC_API_KEY,
  model: 'claude-3-sonnet-20240229',
  temperature: 0.7,
  maxTokens: 500,
});
\`\`\`

## Choosing the Right Provider

### OpenAI GPT-4
- **Best for:** General purpose, coding, complex reasoning
- **Pros:** Most capable, excellent function calling
- **Cons:** Higher cost, slower
- **Use when:** You need the best quality

### Anthropic Claude
- **Best for:** Long context, analysis, safety-focused
- **Pros:** 200K context window, ethical AI
- **Cons:** Limited function calling
- **Use when:** Processing long documents

### Google Gemini
- **Best for:** Multimodal (text + images), fast responses
- **Pros:** Fast, free tier available
- **Cons:** Newer, less proven
- **Use when:** Budget-conscious or need image support

## Cost Optimization
1. Use GPT-3.5 or Gemini for simple queries
2. Cache responses when possible
3. Implement rate limiting
4. Reduce max_tokens for shorter responses
5. Monitor usage with provider dashboards

## Model Parameters

### Temperature (0.0 - 2.0)
- **0.0-0.3:** Focused, deterministic (facts, code)
- **0.4-0.7:** Balanced (general chat)
- **0.8-1.0:** Creative (writing, brainstorming)
- **1.0+:** Very creative (experimental)

### Max Tokens
- **100-200:** Brief responses
- **500:** Default, good balance
- **1000+:** Detailed explanations
- **2000+:** Long-form content`,
    metadata: {
      category: 'backend',
      title: 'LLM Providers',
      tags: ['backend', 'llm', 'openai', 'anthropic', 'google'],
    },
  },

  {
    id: 'doc-function-calling',
    content: `# Function Calling / Tool Use

Enable your AI assistant to perform actions in your application.

## What is Function Calling?
Function calling allows the AI to execute functions in your app based on user requests. For example:
- "Show me my profile" → calls getUserProfile()
- "Create a new task" → calls createTask()
- "What's the weather?" → calls getWeather()

## Setting Up Tools

### Define Your Tools
\`\`\`typescript
const tools = [
  {
    name: 'createTask',
    description: 'Create a new todo task',
    parameters: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'The task title'
        },
        priority: {
          type: 'string',
          enum: ['low', 'medium', 'high'],
          description: 'Task priority'
        }
      },
      required: ['title']
    },
    handler: async (params) => {
      const task = await createTaskInDatabase(params);
      return {
        success: true,
        message: \`Created task: \${params.title}\`,
        data: task
      };
    }
  }
];
\`\`\`

### Pass to Component
\`\`\`typescript
<InAppAI
  apiUrl="http://localhost:3001"
  tools={tools}
/>
\`\`\`

## Backend Integration
Your backend needs to support tool calling:

\`\`\`typescript
app.post('/chat', async (req, res) => {
  const { message, tools } = req.body;

  const response = await provider.chat(message, {
    tools,
    toolChoice: 'auto'
  });

  // If AI wants to call a tool
  if (response.toolCalls) {
    // Execute tool handlers on client side
    res.json({ ...response, needsToolExecution: true });
  } else {
    res.json(response);
  }
});
\`\`\`

## Example Tools

### Database Operations
\`\`\`typescript
{
  name: 'searchUsers',
  description: 'Search for users in the database',
  handler: async (params) => {
    const users = await db.users.search(params.query);
    return { success: true, data: users };
  }
}
\`\`\`

### API Calls
\`\`\`typescript
{
  name: 'getWeather',
  description: 'Get current weather for a location',
  handler: async (params) => {
    const weather = await fetch(\`api.weather.com?q=\${params.city}\`);
    return { success: true, data: await weather.json() };
  }
}
\`\`\`

### UI Actions
\`\`\`typescript
{
  name: 'navigateTo',
  description: 'Navigate to a different page',
  handler: async (params) => {
    window.location.href = params.url;
    return { success: true, message: 'Navigating...' };
  }
}
\`\`\`

## Best Practices
1. Provide clear, detailed descriptions
2. Define strict parameter schemas
3. Handle errors gracefully
4. Return meaningful success/error messages
5. Keep handlers async for better UX
6. Log tool usage for debugging
7. Implement permissions/auth checks`,
    metadata: {
      category: 'features',
      title: 'Function Calling',
      tags: ['functions', 'tools', 'actions', 'features'],
    },
  },

  {
    id: 'doc-security',
    content: `# Security Best Practices

## API Key Protection

### Never Expose API Keys in Frontend
❌ **WRONG:**
\`\`\`typescript
// DON'T DO THIS!
<InAppAI apiKey="sk-..." />
\`\`\`

✅ **CORRECT:**
\`\`\`typescript
// Use a backend proxy
<InAppAI endpoint="https://api.inappai.com/api/{agentId}" />
\`\`\`

## Backend Security

### 1. Environment Variables
\`\`\`bash
# .env (never commit this file!)
AI_API_KEY=sk-...
AI_PROVIDER=openai
\`\`\`

### 2. CORS Configuration
\`\`\`typescript
app.use(cors({
  origin: ['https://your-app.com'],
  credentials: true
}));
\`\`\`

### 3. Rate Limiting
\`\`\`typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/chat', limiter);
\`\`\`

### 4. Authentication
\`\`\`typescript
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  if (!verifyToken(token)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

app.use('/chat', authMiddleware);
\`\`\`

### 5. Input Validation
\`\`\`typescript
app.post('/chat', (req, res) => {
  const { message } = req.body;

  if (!message || message.length > 5000) {
    return res.status(400).json({ error: 'Invalid message' });
  }

  // Process message...
});
\`\`\`

## Content Filtering

### Implement Content Moderation
\`\`\`typescript
import { moderateContent } from './moderation';

app.post('/chat', async (req, res) => {
  const { message } = req.body;

  const moderation = await moderateContent(message);
  if (moderation.flagged) {
    return res.status(400).json({
      error: 'Content policy violation'
    });
  }

  // Continue...
});
\`\`\`

## Production Checklist
- [ ] API keys in environment variables only
- [ ] HTTPS enabled
- [ ] CORS configured for specific origins
- [ ] Rate limiting implemented
- [ ] Authentication/authorization in place
- [ ] Input validation on all endpoints
- [ ] Error messages don't leak sensitive info
- [ ] Logging configured (without logging secrets)
- [ ] Content moderation enabled
- [ ] Regular security audits
- [ ] Dependency updates automated`,
    metadata: {
      category: 'security',
      title: 'Security Best Practices',
      tags: ['security', 'api-keys', 'authentication', 'cors'],
    },
  },

  {
    id: 'doc-context-capture',
    content: `# Context Capture

Help your AI assistant understand your application's state and provide better, context-aware responses.

## What is Context Capture?
Context capture allows you to pass information about your app's current state to the AI, enabling it to provide more relevant and helpful responses.

## Basic Usage

### Static Context
\`\`\`typescript
<InAppAI
  apiUrl="..."
  contextCapture={{
    appName: 'MyApp',
    version: '1.0.0',
    environment: 'production'
  }}
/>
\`\`\`

### Dynamic Context
\`\`\`typescript
const [contextCapture, setContextCapture] = useState({
  currentPage: window.location.pathname,
  userRole: user.role,
  isDarkMode: darkMode,
});

// Update context when it changes
useEffect(() => {
  setContextCapture({
    currentPage: window.location.pathname,
    userRole: user.role,
    isDarkMode: darkMode,
  });
}, [user, darkMode, window.location.pathname]);

<InAppAI apiUrl="..." contextCapture={contextCapture} />
\`\`\`

## What to Include

### User Context
\`\`\`typescript
{
  userId: user.id,
  userName: user.name,
  userRole: user.role,
  preferences: user.preferences,
  subscription: user.subscription
}
\`\`\`

### Application State
\`\`\`typescript
{
  currentPage: '/dashboard',
  currentView: 'analytics',
  selectedItems: [1, 2, 3],
  filters: { status: 'active' },
  sortBy: 'date'
}
\`\`\`

### UI State
\`\`\`typescript
{
  theme: 'dark',
  language: 'en',
  viewport: 'desktop',
  sidebarOpen: true
}
\`\`\`

### Business Context
\`\`\`typescript
{
  projectId: currentProject.id,
  projectName: currentProject.name,
  teamMembers: team.map(m => m.name),
  recentActivity: recentActions
}
\`\`\`

## Examples

### E-commerce App
\`\`\`typescript
<InAppAI
  contextCapture={{
    cartItems: cart.items.length,
    cartTotal: cart.total,
    currentProduct: product?.name,
    userLocation: user.address.city,
    wishlistCount: wishlist.length
  }}
/>
\`\`\`

Now users can ask:
- "How much is in my cart?" → AI knows from context
- "Do you ship to my location?" → AI knows user's city
- "What's in my wishlist?" → AI has the count

### Project Management App
\`\`\`typescript
<InAppAI
  contextCapture={{
    currentProject: project.name,
    openTasks: tasks.filter(t => t.status === 'open').length,
    teamSize: team.length,
    deadline: project.deadline,
    myRole: user.role
  }}
/>
\`\`\`

## Privacy Considerations
- Don't include sensitive data (passwords, tokens, PII)
- Sanitize context data before sending
- Implement user consent for context sharing
- Allow users to opt-out of context capture
- Log what context is being captured

## Performance Tips
- Keep context object small (< 10KB)
- Update only when necessary
- Debounce frequent changes
- Use memoization for computed values`,
    metadata: {
      category: 'features',
      title: 'Context Capture',
      tags: ['context', 'state', 'features'],
    },
  },

  {
    id: 'doc-troubleshooting',
    content: `# Troubleshooting Common Issues

## Connection Issues

### "Failed to fetch" Error
**Problem:** Can't connect to backend API

**Solutions:**
1. Check if backend server is running
2. Verify \`apiUrl\` is correct
3. Check CORS configuration on backend
4. Ensure no firewall blocking requests
5. Check browser console for detailed errors

\`\`\`typescript
// Test connection (replace YOUR_AGENT_ID with your actual agent ID)
fetch('http://localhost:3001/api/YOUR_AGENT_ID/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
\`\`\`

### CORS Errors
**Problem:** "Access blocked by CORS policy"

**Solution:** Configure CORS on backend:
\`\`\`typescript
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true
}));
\`\`\`

## API Key Issues

### "Invalid API Key"
**Problem:** LLM provider rejects API key

**Solutions:**
1. Verify API key in .env file
2. Check for extra spaces/newlines
3. Ensure key is for correct provider
4. Verify key has proper permissions
5. Check if key is expired or rate-limited

## Display Issues

### Component Not Showing
**Problem:** InAppAI component not visible

**Checklist:**
1. Import CSS: \`import '@inapp-ai/react/dist/style.css'\`
2. Check z-index conflicts
3. Verify \`mode\` prop is valid
4. Look for console errors
5. Check parent container size

### Theme Not Applied
**Problem:** Theme doesn't change appearance

**Solutions:**
1. Ensure CSS is imported
2. Check theme name is valid
3. Clear browser cache
4. Verify no conflicting global styles

## Performance Issues

### Slow Responses
**Problem:** AI takes too long to respond

**Solutions:**
1. Use faster models (gpt-3.5-turbo, gemini-pro)
2. Reduce \`max_tokens\` parameter
3. Implement response streaming
4. Add caching layer
5. Check network latency

### High Memory Usage
**Problem:** App uses too much memory

**Solutions:**
1. Limit conversation history
2. Clear old messages periodically
3. Reduce context capture size
4. Implement lazy loading

## Function Calling Issues

### Tool Not Being Called
**Problem:** AI doesn't use provided tools

**Solutions:**
1. Make function descriptions more specific
2. Check parameter schema is correct
3. Verify tool name matches exactly
4. Test with explicit user request
5. Check provider supports function calling

### Tool Execution Fails
**Problem:** Tool handler throws errors

**Solutions:**
1. Add try-catch in handlers
2. Validate parameters before use
3. Return clear error messages
4. Log errors for debugging
5. Handle async operations properly

## Getting Help

### Debug Mode
Enable verbose logging:
\`\`\`typescript
<InAppAI
  apiUrl="..."
  debug={true}
/>
\`\`\`

### Check Logs
- Browser console (F12)
- Backend server logs
- Network tab (for API calls)
- LLM provider dashboard

### Common Log Messages
- "Provider initialized" → Backend ready
- "Sending message" → Request sent
- "Received response" → Got reply
- "Tool execution requested" → Function call triggered

### Report Issues
If problems persist:
1. Check GitHub issues
2. Provide error messages
3. Include code snippets
4. Note browser/environment details
5. Share reproducible example`,
    metadata: {
      category: 'troubleshooting',
      title: 'Troubleshooting',
      tags: ['errors', 'debugging', 'help', 'issues'],
    },
  },
];
