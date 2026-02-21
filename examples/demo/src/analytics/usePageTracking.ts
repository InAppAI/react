/**
 * Hook: usePageTracking
 *
 * Tracks virtual page views for SPA route changes.
 * Place inside a component with React Router context.
 */

import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from './events';

export function usePageTracking(): void {
  const location = useLocation();
  const previousPath = useRef<string>('');

  useEffect(() => {
    if (location.pathname !== previousPath.current) {
      trackPageView(location.pathname);
      previousPath.current = location.pathname;
    }
  }, [location.pathname]);
}
