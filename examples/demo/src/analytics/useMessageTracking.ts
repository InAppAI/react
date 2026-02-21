/**
 * Hook: useMessageTracking
 *
 * Observes a messages array and fires analytics events
 * when new user messages or assistant responses appear.
 */

import { useEffect, useRef } from 'react';
import { trackChatMessageSent, trackAIResponseReceived } from './events';

interface TrackableMessage {
  role: 'user' | 'assistant' | 'system' | string;
  usage?: {
    totalTokens?: number;
    [key: string]: unknown;
  };
}

export function useMessageTracking(
  messages: TrackableMessage[],
  pageContext: string
): void {
  const prevCountRef = useRef<number>(messages.length);

  useEffect(() => {
    const prevCount = prevCountRef.current;
    const currentCount = messages.length;

    if (currentCount > prevCount) {
      const newMessages = messages.slice(prevCount);
      for (const msg of newMessages) {
        if (msg.role === 'user') {
          trackChatMessageSent(pageContext);
        } else if (msg.role === 'assistant') {
          trackAIResponseReceived(pageContext, msg.usage?.totalTokens);
        }
      }
    }

    prevCountRef.current = currentCount;
  }, [messages, pageContext]);
}
