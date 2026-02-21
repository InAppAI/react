/**
 * Analytics Event Definitions
 *
 * Type-safe helpers for pushing structured events to GTM's data layer.
 * Event names use snake_case to align with GA4 conventions.
 */

import { pushEvent, isAnalyticsEnabled } from './gtm';

/** Guarded push — only fires when analytics is enabled */
function track(event: string, params: Record<string, unknown> = {}): void {
  if (!isAnalyticsEnabled()) return;
  pushEvent({ event, ...params });
}

// ─── Page Tracking ───────────────────────────────────────────────────

export function trackPageView(path: string, title?: string): void {
  track('page_view', {
    page_path: path,
    page_title: title || document.title,
  });
}

// ─── Preference Events ───────────────────────────────────────────────

export function trackThemeChange(theme: string): void {
  track('theme_change', { theme_name: theme });
}

export function trackDisplayModeChange(displayMode: string): void {
  track('display_mode_change', { display_mode: displayMode });
}

// ─── Chat Events ─────────────────────────────────────────────────────

export function trackChatMessageSent(page: string): void {
  track('chat_message_sent', { page_context: page });
}

export function trackAIResponseReceived(page: string, tokenCount?: number): void {
  track('ai_response_received', {
    page_context: page,
    token_count: tokenCount,
  });
}

// ─── Todo Events ─────────────────────────────────────────────────────

export function trackTodoAction(
  action: 'add' | 'complete' | 'delete' | 'update_priority',
  details?: { priority?: string; todo_count?: number }
): void {
  track('todo_action', { todo_action: action, ...details });
}

// ─── AI Tool Execution Events ────────────────────────────────────────

export function trackToolExecution(toolName: string, success: boolean): void {
  track('ai_tool_execution', { tool_name: toolName, tool_success: success });
}

// ─── Conversation Management Events ──────────────────────────────────

export function trackConversationAction(
  action: 'create' | 'switch' | 'delete' | 'clear_all' | 'export' | 'import' | 'tag' | 'color'
): void {
  track('conversation_action', { conversation_action: action });
}
