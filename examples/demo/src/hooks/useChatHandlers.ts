import { useState, useCallback } from 'react';
import { useConversationStorage } from './useConversationStorage';

/**
 * Custom hook that encapsulates chat API logic and storage
 * Follows callback pattern for separation of concerns
 *
 * @param namespace - Namespace for conversation storage
 * @returns Chat handlers and state for use with ChatInterface component
 */
export function useChatHandlers(namespace: string) {
  const agentId = import.meta.env.VITE_AGENT_ID;
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const ENDPOINT = `${apiBaseUrl}/${agentId}/chat`;

  const {
    conversations,
    activeConversation,
    messages,
    createConversation,
    switchConversation,
    addMessage,
    deleteConversation,
    clearMessages,
    updateConversation,
  } = useConversationStorage(namespace);

  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handle sending a message - adds to storage and calls API
   */
  const handleSendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    // Add user message to storage
    addMessage({
      role: 'user',
      content: content.trim(),
    });

    setIsLoading(true);

    try {
      // Call API with full message history
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content.trim(),
          conversationId: activeConversation?.id,
          messages: messages.map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Add assistant message to storage
      addMessage({
        role: 'assistant',
        content: data.message,
        usage: data.tokens ? {
          promptTokens: data.tokens.prompt,
          completionTokens: data.tokens.completion,
          totalTokens: data.tokens.total,
        } : undefined,
      });
    } catch (error) {
      console.error('Error:', error);
      addMessage({
        role: 'assistant',
        content: `Error: ${error instanceof Error ? error.message : 'Failed to get response'}`,
      });
    } finally {
      setIsLoading(false);
    }
  }, [ENDPOINT, activeConversation, messages, addMessage, isLoading]);

  /**
   * Handle creating a new conversation
   */
  const handleNewConversation = useCallback(() => {
    createConversation();
  }, [createConversation]);

  return {
    // State
    conversations,
    activeConversation,
    messages,
    isLoading,

    // Handlers for ChatInterface
    handleSendMessage,
    handleNewConversation,

    // Additional conversation management
    switchConversation,
    deleteConversation,
    clearMessages,
    updateConversation,
  };
}
