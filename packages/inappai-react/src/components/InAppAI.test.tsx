import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { InAppAI } from './InAppAI';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock scrollIntoView (not available in jsdom)
Element.prototype.scrollIntoView = vi.fn();

describe('InAppAI', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    // Default mock for health check
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ status: 'ok' }),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('authToken prop', () => {
    it('should send Authorization header when authToken string is provided', async () => {
      const messages: any[] = [];
      const onMessagesChange = vi.fn();

      render(
        <InAppAI
          agentId="test-agent"
          endpoint="https://api.test.com"
          authToken="my-jwt-token"
          messages={messages}
          onMessagesChange={onMessagesChange}
          displayMode="embedded"
        />
      );

      // Wait for health check to be called
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });

      // Verify health check included Authorization header
      const healthCall = mockFetch.mock.calls.find(
        (call) => call[0].includes('/health')
      );
      expect(healthCall).toBeDefined();
      expect(healthCall![1]?.headers?.['Authorization']).toBe('Bearer my-jwt-token');
    });

    it('should send Authorization header when authToken function is provided', async () => {
      const messages: any[] = [];
      const onMessagesChange = vi.fn();
      const getToken = vi.fn(() => 'dynamic-token');

      render(
        <InAppAI
          agentId="test-agent"
          endpoint="https://api.test.com"
          authToken={getToken}
          messages={messages}
          onMessagesChange={onMessagesChange}
          displayMode="embedded"
        />
      );

      // Wait for health check
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });

      // Verify token function was called
      expect(getToken).toHaveBeenCalled();

      // Verify Authorization header
      const healthCall = mockFetch.mock.calls.find(
        (call) => call[0].includes('/health')
      );
      expect(healthCall).toBeDefined();
      expect(healthCall![1]?.headers?.['Authorization']).toBe('Bearer dynamic-token');
    });

    it('should NOT send Authorization header when authToken is not provided', async () => {
      const messages: any[] = [];
      const onMessagesChange = vi.fn();

      render(
        <InAppAI
          agentId="test-agent"
          endpoint="https://api.test.com"
          messages={messages}
          onMessagesChange={onMessagesChange}
          displayMode="embedded"
        />
      );

      // Wait for health check
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });

      // Verify no Authorization header
      const healthCall = mockFetch.mock.calls.find(
        (call) => call[0].includes('/health')
      );
      expect(healthCall).toBeDefined();
      expect(healthCall![1]?.headers?.['Authorization']).toBeUndefined();
    });

    it('should NOT send Authorization header when authToken function returns null', async () => {
      const messages: any[] = [];
      const onMessagesChange = vi.fn();
      const getToken = vi.fn(() => null);

      render(
        <InAppAI
          agentId="test-agent"
          endpoint="https://api.test.com"
          authToken={getToken}
          messages={messages}
          onMessagesChange={onMessagesChange}
          displayMode="embedded"
        />
      );

      // Wait for health check
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });

      // Verify no Authorization header
      const healthCall = mockFetch.mock.calls.find(
        (call) => call[0].includes('/health')
      );
      expect(healthCall).toBeDefined();
      expect(healthCall![1]?.headers?.['Authorization']).toBeUndefined();
    });

    it('should include Authorization header in chat requests', async () => {
      const messages: any[] = [];
      const onMessagesChange = vi.fn((newMessages) => {
        messages.length = 0;
        messages.push(...newMessages);
      });

      // Mock successful responses
      mockFetch.mockImplementation(async (url: string) => {
        if (url.includes('/health')) {
          return { ok: true, json: async () => ({ status: 'ok' }) };
        }
        if (url.includes('/chat')) {
          return {
            ok: true,
            json: async () => ({ message: 'Hello!', usage: { totalTokens: 10 } }),
          };
        }
        return { ok: false };
      });

      render(
        <InAppAI
          agentId="test-agent"
          endpoint="https://api.test.com"
          authToken="chat-token"
          messages={messages}
          onMessagesChange={onMessagesChange}
          displayMode="embedded"
        />
      );

      // Wait for component to be connected
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/type your message/i)).not.toBeDisabled();
      });

      // Type and send a message
      const input = screen.getByPlaceholderText(/type your message/i);
      fireEvent.change(input, { target: { value: 'Hello' } });
      fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });

      // Wait for chat request
      await waitFor(() => {
        const chatCall = mockFetch.mock.calls.find(
          (call) => call[0].includes('/chat')
        );
        expect(chatCall).toBeDefined();
      });

      // Verify chat request included Authorization header
      const chatCall = mockFetch.mock.calls.find(
        (call) => call[0].includes('/chat')
      );
      expect(chatCall).toBeDefined();
      expect(chatCall![1]?.headers?.['Authorization']).toBe('Bearer chat-token');
      expect(chatCall![1]?.headers?.['Content-Type']).toBe('application/json');
    });
  });
});
