/**
 * Hook to initialize and interact with the InAppAI Knowledge Base
 */

import { useState, useEffect, useCallback } from 'react';
import { knowledgeBaseDocuments } from './knowledge-base-content';

// Endpoint configuration from environment variables
const subscriptionId = import.meta.env.VITE_SUBSCRIPTION_ID;
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const KB_API_URL = `${apiBaseUrl}/${subscriptionId}`;

interface KnowledgeBaseState {
  initialized: boolean;
  loading: boolean;
  error: string | null;
  stats: any | null;
}

export function useKnowledgeBase() {
  const [state, setState] = useState<KnowledgeBaseState>({
    initialized: false,
    loading: false,
    error: null,
    stats: null,
  });

  // Initialize knowledge base
  const initialize = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Cloud Functions KB is subscription-scoped and always available
      // Just upload documents using the batch endpoint
      const docsResponse = await fetch(`${KB_API_URL}/kb/documents/batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documents: knowledgeBaseDocuments,
        }),
      });

      if (!docsResponse.ok) {
        const errorText = await docsResponse.text();
        throw new Error(`Failed to add documents to knowledge base: ${errorText}`);
      }

      const docsResult = await docsResponse.json();

      setState({
        initialized: true,
        loading: false,
        error: null,
        stats: docsResult.stats || { documentsAdded: docsResult.documentsAdded },
      });
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message,
      }));
    }
  }, []);

  // Search knowledge base
  const search = useCallback(async (query: string) => {
    try {
      const response = await fetch(`${KB_API_URL}/kb/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          options: {
            limit: 3,
            minScore: 0.7,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const result = await response.json();
      return result.results;
    } catch (error) {
      return [];
    }
  }, []);

  return {
    ...state,
    initialize,
    search,
  };
}
