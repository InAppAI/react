export interface CustomStyles {
  // Primary branding colors
  primaryColor?: string;
  primaryGradient?: string;

  // Button customization
  buttonBackgroundColor?: string;
  buttonTextColor?: string;
  buttonSize?: string;
  buttonBorderRadius?: string;
  buttonIcon?: string;

  // Window customization
  windowWidth?: string;
  windowHeight?: string;
  windowBorderRadius?: string;

  // Header customization
  headerBackground?: string;
  headerTextColor?: string;
  headerTitle?: string;
  headerSubtitle?: string;

  // Message bubbles
  userMessageBackground?: string;
  userMessageColor?: string;
  assistantMessageBackground?: string;
  assistantMessageColor?: string;

  // Typography
  fontFamily?: string;
  fontSize?: string;

  // Input area
  inputBackground?: string;
  inputBorderColor?: string;
  inputTextColor?: string;
  inputPlaceholder?: string;

  // Sidebar
  sidebarWidth?: string;
  sidebarFoldedWidth?: string;

  // Other
  borderRadius?: string;
  boxShadow?: string;
}

export interface Tool {
  name: string;
  description: string;
  parameters: any;
  handler: (params: any) => Promise<any> | any;
}

export interface InAppAIProps {
  endpoint: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  displayMode?: 'popup' | 'sidebar-left' | 'sidebar-right' | 'panel-left' | 'panel-right';
  defaultFolded?: boolean;
  theme?: 'light' | 'dark' | 'professional' | 'playful' | 'minimal' | 'ocean' | 'sunset';
  context?: Record<string, any> | (() => Record<string, any>);
  customStyles?: CustomStyles;
  tools?: Tool[];
  // Panel-specific props
  panelMinWidth?: string;
  panelMaxWidth?: string;
  panelDefaultWidth?: string;
  onPanelResize?: (width: number) => void;
}
