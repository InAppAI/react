import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { trackThemeChange, trackDisplayModeChange } from '../analytics/events';

// Types for theme and display mode
export type Theme = 'light' | 'dark' | 'professional' | 'playful' | 'minimal' | 'ocean' | 'sunset';
export type DisplayMode = 'popup' | 'sidebar-left' | 'sidebar-right' | 'panel-left' | 'panel-right';

// Preferences interface
export interface Preferences {
  theme: Theme;
  displayMode: DisplayMode;
}

// Default preferences
const DEFAULT_PREFERENCES: Preferences = {
  theme: 'light',
  displayMode: 'popup',
};

// Context value interface
interface PreferenceContextValue {
  preferences: Preferences;
  setTheme: (theme: Theme) => void;
  setDisplayMode: (mode: DisplayMode) => void;
  resetPreferences: () => void;
}

// Create context
const PreferenceContext = createContext<PreferenceContextValue | undefined>(undefined);

// LocalStorage key
const STORAGE_KEY = 'inappai-demo-preferences';

// Provider props
interface PreferenceProviderProps {
  children: ReactNode;
}

// Provider component
export function PreferenceProvider({ children }: PreferenceProviderProps) {
  const [preferences, setPreferences] = useState<Preferences>(() => {
    // Load from localStorage on mount
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Validate parsed data
        if (parsed.theme && parsed.displayMode) {
          return parsed as Preferences;
        }
      }
    } catch (error) {
      console.error('Failed to load preferences from localStorage:', error);
    }
    return DEFAULT_PREFERENCES;
  });

  // Save to localStorage whenever preferences change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch (error) {
      console.error('Failed to save preferences to localStorage:', error);
    }
  }, [preferences]);

  // Set theme
  const setTheme = (theme: Theme) => {
    setPreferences((prev) => ({ ...prev, theme }));
    trackThemeChange(theme);
  };

  // Set display mode
  const setDisplayMode = (mode: DisplayMode) => {
    setPreferences((prev) => ({ ...prev, displayMode: mode }));
    trackDisplayModeChange(mode);
  };

  // Reset to defaults
  const resetPreferences = () => {
    setPreferences(DEFAULT_PREFERENCES);
  };

  const value: PreferenceContextValue = {
    preferences,
    setTheme,
    setDisplayMode,
    resetPreferences,
  };

  return (
    <PreferenceContext.Provider value={value}>
      {children}
    </PreferenceContext.Provider>
  );
}

// Custom hook to use preferences
// eslint-disable-next-line react-refresh/only-export-components
export function usePreferences(): PreferenceContextValue {
  const context = useContext(PreferenceContext);
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferenceProvider');
  }
  return context;
}

// Theme metadata for UI display
// eslint-disable-next-line react-refresh/only-export-components
export const THEME_METADATA: Record<Theme, { name: string; description: string; colors: string[] }> = {
  light: {
    name: 'Light',
    description: 'Clean and bright',
    colors: ['#ffffff', '#f5f5f5', '#4CAF50'],
  },
  dark: {
    name: 'Dark',
    description: 'Easy on the eyes',
    colors: ['#1e1e1e', '#2d2d2d', '#4CAF50'],
  },
  professional: {
    name: 'Professional',
    description: 'Corporate blue tones',
    colors: ['#f8f9fa', '#e9ecef', '#0066cc'],
  },
  playful: {
    name: 'Playful',
    description: 'Vibrant and fun',
    colors: ['#fff9e6', '#ffe6f0', '#ff6b9d'],
  },
  minimal: {
    name: 'Minimal',
    description: 'Simple and clean',
    colors: ['#fafafa', '#f0f0f0', '#333333'],
  },
  ocean: {
    name: 'Ocean',
    description: 'Blue and teal palette',
    colors: ['#e0f7fa', '#b2ebf2', '#00acc1'],
  },
  sunset: {
    name: 'Sunset',
    description: 'Warm orange and pink',
    colors: ['#fff3e0', '#ffe0b2', '#ff6f00'],
  },
};

// Display mode metadata for UI display
// eslint-disable-next-line react-refresh/only-export-components
export const DISPLAY_MODE_METADATA: Record<DisplayMode, { name: string; description: string; icon: string }> = {
  popup: {
    name: 'Popup',
    description: 'Floating chat window',
    icon: '💬',
  },
  'sidebar-left': {
    name: 'Sidebar Left',
    description: 'Fixed panel on left',
    icon: '◧',
  },
  'sidebar-right': {
    name: 'Sidebar Right',
    description: 'Fixed panel on right',
    icon: '◨',
  },
  'panel-left': {
    name: 'Panel Left',
    description: 'Expandable left panel',
    icon: '☰',
  },
  'panel-right': {
    name: 'Panel Right',
    description: 'Expandable right panel',
    icon: '☰',
  },
};
