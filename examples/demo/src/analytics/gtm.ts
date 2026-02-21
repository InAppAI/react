/**
 * Google Tag Manager Data Layer Utility
 *
 * Provides type-safe data layer push for GTM tracking.
 * GTM is loaded via script tag in index.html (container: GTM-NNCCCLJW).
 */

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

/**
 * Push an event to the GTM data layer.
 * Safe to call before GTM loads — events queue in the array.
 */
export function pushEvent(event: Record<string, unknown> & { event: string }): void {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(event);
}

/**
 * Check if analytics should be active.
 * Enabled in production builds. Opt-in for dev via VITE_ENABLE_ANALYTICS=true
 * or at runtime via window.__ANALYTICS_ENABLED__ = true (useful for testing).
 */
export function isAnalyticsEnabled(): boolean {
  if (import.meta.env.PROD) return true;
  if ((window as any).__ANALYTICS_ENABLED__) return true;
  return import.meta.env.VITE_ENABLE_ANALYTICS === 'true';
}
