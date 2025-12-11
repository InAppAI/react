import { useState, useEffect, useCallback } from 'react';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface StoredConversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  metadata?: {
    totalTokens?: number;
    messageCount?: number;
    tags?: string[];
    folderId?: string;
    color?: string;
  };
}

interface ConversationStorageData {
  conversations: StoredConversation[];
  activeIds: Record<string, string>; // namespace -> conversationId
}

const STORAGE_KEY = 'inappai-conversations';

/**
 * Hook for managing conversations with localStorage persistence
 * @param namespace - Namespace for this route (e.g., 'demo', 'standalone-chat')
 */
export function useConversationStorage(namespace: string = 'default') {
  const [allConversations, setAllConversations] = useState<StoredConversation[]>([]);
  const [activeIds, setActiveIds] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data: ConversationStorageData = JSON.parse(stored);
        setAllConversations(data.conversations || []);
        setActiveIds(data.activeIds || {});
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    if (!loading) {
      try {
        const data: ConversationStorageData = {
          conversations: allConversations,
          activeIds,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (error) {
        console.error('Error saving conversations:', error);
      }
    }
  }, [allConversations, activeIds, loading]);

  // Get active conversation for this namespace
  const activeConversation = allConversations.find(
    c => c.id === activeIds[namespace]
  );

  // Generate conversation title from first user message
  const generateTitle = useCallback((messages: Message[]): string => {
    const firstUserMessage = messages.find(m => m.role === 'user');
    if (firstUserMessage) {
      const content = firstUserMessage.content;
      return content.length > 50 ? content.substring(0, 50) + '...' : content;
    }
    return 'New Conversation';
  }, []);

  // Create new conversation
  const createConversation = useCallback((): StoredConversation => {
    const newConv: StoredConversation = {
      id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: 'New Conversation',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: {
        totalTokens: 0,
        messageCount: 0,
      },
    };

    setAllConversations(prev => [newConv, ...prev]);
    setActiveIds(prev => ({ ...prev, [namespace]: newConv.id }));

    return newConv;
  }, [namespace]);

  // Switch active conversation
  const switchConversation = useCallback((id: string) => {
    setActiveIds(prev => ({ ...prev, [namespace]: id }));
  }, [namespace]);

  // Add message to active conversation
  const addMessage = useCallback((message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    };

    setAllConversations(prev => prev.map(conv => {
      if (conv.id === activeIds[namespace]) {
        const updatedMessages = [...conv.messages, newMessage];
        const totalTokens = (conv.metadata?.totalTokens || 0) + (message.usage?.totalTokens || 0);

        return {
          ...conv,
          messages: updatedMessages,
          updatedAt: new Date(),
          title: conv.messages.length === 0 ? generateTitle(updatedMessages) : conv.title,
          metadata: {
            ...conv.metadata,
            totalTokens,
            messageCount: updatedMessages.length,
          },
        };
      }
      return conv;
    }));

    return newMessage;
  }, [activeIds, namespace, generateTitle]);

  // Update conversation
  const updateConversation = useCallback((id: string, updates: Partial<StoredConversation>) => {
    setAllConversations(prev => prev.map(conv =>
      conv.id === id
        ? { ...conv, ...updates, updatedAt: new Date() }
        : conv
    ));
  }, []);

  // Delete conversation
  const deleteConversation = useCallback((id: string) => {
    setAllConversations(prev => prev.filter(c => c.id !== id));
    setActiveIds(prev => {
      const newActiveIds = { ...prev };
      Object.keys(newActiveIds).forEach(ns => {
        if (newActiveIds[ns] === id) {
          delete newActiveIds[ns];
        }
      });
      return newActiveIds;
    });
  }, []);

  // Clear all messages in active conversation
  const clearMessages = useCallback(() => {
    setAllConversations(prev => prev.map(conv => {
      if (conv.id === activeIds[namespace]) {
        return {
          ...conv,
          messages: [],
          updatedAt: new Date(),
          metadata: {
            ...conv.metadata,
            totalTokens: 0,
            messageCount: 0,
          },
        };
      }
      return conv;
    }));
  }, [activeIds, namespace]);

  // Clear all conversations and reset
  const clearAllConversations = useCallback(() => {
    setAllConversations([]);
    setActiveIds({});
  }, []);

  // Set all messages in active conversation (for controlled mode with InAppAI)
  const setMessages = useCallback((newMessages: Message[]) => {
    setAllConversations(prev => prev.map(conv => {
      if (conv.id === activeIds[namespace]) {
        const totalTokens = newMessages.reduce(
          (sum, msg) => sum + (msg.usage?.totalTokens || 0),
          0
        );
        return {
          ...conv,
          messages: newMessages,
          updatedAt: new Date(),
          title: conv.messages.length === 0 && newMessages.length > 0
            ? generateTitle(newMessages)
            : conv.title,
          metadata: {
            ...conv.metadata,
            totalTokens,
            messageCount: newMessages.length,
          },
        };
      }
      return conv;
    }));
  }, [activeIds, namespace, generateTitle]);

  // Export conversation as JSON
  const exportConversation = useCallback((id: string): string => {
    const conv = allConversations.find(c => c.id === id);
    if (!conv) return '';

    return JSON.stringify({
      version: '1.0',
      exportDate: new Date().toISOString(),
      source: 'InAppAI React Demo',
      conversation: conv,
    }, null, 2);
  }, [allConversations]);

  // Export all conversations
  const exportAll = useCallback((): string => {
    return JSON.stringify({
      version: '1.0',
      exportDate: new Date().toISOString(),
      source: 'InAppAI React Demo',
      conversations: allConversations,
    }, null, 2);
  }, [allConversations]);

  // Import conversations from JSON
  const importConversations = useCallback((json: string): boolean => {
    try {
      const data = JSON.parse(json);

      if (data.conversation) {
        // Single conversation import
        const conv = data.conversation;
        setAllConversations(prev => [conv, ...prev]);
        return true;
      } else if (data.conversations) {
        // Multiple conversations import
        const newConvs = data.conversations;
        setAllConversations(prev => [...newConvs, ...prev]);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error importing conversations:', error);
      return false;
    }
  }, []);

  return {
    // State
    conversations: allConversations,
    activeConversation,
    messages: activeConversation?.messages || [],
    loading,

    // Actions
    createConversation,
    switchConversation,
    addMessage,
    clearAllConversations,
    setMessages,
    updateConversation,
    deleteConversation,
    clearMessages,
    exportConversation,
    exportAll,
    importConversations,
  };
}
