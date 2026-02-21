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

// Tool action record for conversation memory
export interface ToolAction {
  tool: string;
  args: Record<string, any>;
  result: any;
}

// Message type for controlled mode
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  toolActions?: ToolAction[];
}

export interface InAppAIProps {
  endpoint?: string;
  agentId: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  displayMode?: 'popup' | 'sidebar-left' | 'sidebar-right' | 'panel-left' | 'panel-right' | 'embedded';
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
  // Message management (required - controlled mode only)
  messages: Message[];
  onMessagesChange: (messages: Message[]) => void;
  // Conversation ID for backend context
  conversationId?: string;
  // Embedded mode props
  showHeader?: boolean;
  // Authentication - JWT token for per-user rate limiting
  authToken?: string | (() => string | null | undefined);
  // Maximum number of tool execution rounds per message (default: 10)
  maxToolRounds?: number;
}
