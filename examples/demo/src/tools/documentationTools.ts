/**
 * Documentation Tools
 * Tools for searching and listing InAppAI documentation
 */

import { Tool } from '@inapp-ai/core';

export interface DocumentationToolsParams {
  kbInitialized: boolean;
  endpoint: string;
}

export function createDocumentationTools(params: DocumentationToolsParams): Tool[] {
  const { kbInitialized, endpoint } = params;

  return [
    {
      name: 'listDocuments',
      description: 'List all available documentation topics in the knowledge base. Use this when the user asks what documentation is available or what topics they can ask about.',
      parameters: {
        type: 'object',
        properties: {},
        required: [],
      },
      handler: async () => {
        return `The InAppAI Knowledge Base contains documentation on the following topics:

1. **Todo List Usage** - How to use the AI-powered todo list feature
2. **Display Modes** - Panel, popup, sidebar, inline, and bottom modes
3. **Themes** - 7 built-in themes (default, dark, light, minimal, colorful, professional, retro) plus custom theming
4. **Implementation Guide** - Step-by-step integration instructions for your web app
5. **Backend LLM Configuration** - How to configure OpenAI, Claude (Anthropic), or Gemini (Google)
6. **Function Calling & Tool Use** - How to add custom tools and actions
7. **Security Best Practices** - CORS, rate limiting, authentication, and API key management
8. **Context Capture** - Static and dynamic context for better AI responses
9. **Troubleshooting** - Common issues and solutions

You can ask me questions about any of these topics! For example:
- "How do I change themes?"
- "What display modes are available?"
- "How do I implement InAppAI in my React app?"
- "How do I switch from OpenAI to Claude?"`;
      },
    },
    {
      name: 'searchDocumentation',
      description: 'Search the InAppAI documentation for information about features, configuration, implementation, themes, display modes, etc. Use this WHENEVER the user asks questions about how to use InAppAI, change settings, or understand features. This tool returns the full answer from documentation, so you should present it to the user.',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'The user\'s question or search query',
          },
        },
        required: ['query'],
      },
      handler: async (params: { query: string }) => {
        if (!kbInitialized) {
          return 'Knowledge base is still initializing. Please try again in a moment.';
        }

        try {
          // Use Cloud Functions /kb/search endpoint
          const response = await fetch(`${endpoint}/kb/search`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              query: params.query,
              limit: 3,
              threshold: 0.7,
            }),
          });

          if (!response.ok) {
            throw new Error(`Search failed: ${response.statusText}`);
          }

          const result = await response.json();

          if (result.results && result.results.length > 0) {
            // Format the results
            const relevantDocs = result.results
              .map((r: any) => r.document.content)
              .join('\n\n---\n\n');
            return `Based on the InAppAI documentation:\n\n${relevantDocs}`;
          }
          return 'I couldn\'t find relevant documentation for that question. Please try rephrasing your question or ask about: themes, display modes, implementation, configuration, or troubleshooting.';
        } catch (error: any) {
          return `Error searching documentation: ${error.message}`;
        }
      },
    },
  ];
}
