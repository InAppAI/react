import { useState, useCallback, useEffect, useRef } from 'react';
import type { Tool } from '../types';

/**
 * Options for the useTools hook
 */
export interface UseToolsOptions {
  /**
   * Initial tools to register
   */
  initialTools?: Tool[];

  /**
   * Whether to automatically cleanup tools on unmount
   * @default true
   */
  autoCleanup?: boolean;
}

/**
 * Return value from the useTools hook
 */
export interface UseToolsReturn {
  /**
   * Current array of registered tools
   */
  tools: Tool[];

  /**
   * Register a new tool
   * @param tool - Tool to register
   * @throws {Error} If tool with same name already exists
   */
  registerTool: (tool: Tool) => void;

  /**
   * Unregister a tool by name
   * @param name - Name of the tool to unregister
   */
  unregisterTool: (name: string) => void;

  /**
   * Clear all registered tools
   */
  clearTools: () => void;

  /**
   * Check if a tool with the given name exists
   * @param name - Tool name to check
   * @returns true if tool exists, false otherwise
   */
  hasTool: (name: string) => boolean;
}

/**
 * Hook for managing tools dynamically in React components
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { tools, registerTool, unregisterTool } = useTools();
 *   const [todos, setTodos] = useState([]);
 *
 *   useEffect(() => {
 *     registerTool({
 *       name: 'addTodo',
 *       description: 'Add a new todo',
 *       parameters: {
 *         type: 'object',
 *         properties: {
 *           task: { type: 'string' }
 *         }
 *       },
 *       handler: async ({ task }) => {
 *         setTodos(prev => [...prev, { id: Date.now(), text: task }]);
 *         return { success: true };
 *       }
 *     });
 *
 *     return () => unregisterTool('addTodo');
 *   }, [registerTool, unregisterTool, setTodos]);
 *
 *   return <InAppAI endpoint="..." tools={tools} />;
 * }
 * ```
 *
 * @param options - Configuration options
 * @returns Tool management functions and current tools array
 */
export function useTools(options: UseToolsOptions = {}): UseToolsReturn {
  const { initialTools = [], autoCleanup = true } = options;

  // Use ref to track tool names for validation
  const toolNamesRef = useRef<Set<string>>(new Set());

  // State for tools array
  const [tools, setTools] = useState<Tool[]>(() => {
    // Initialize with initial tools
    initialTools.forEach(tool => {
      if (toolNamesRef.current.has(tool.name)) {
        console.warn(
          `[useTools] Duplicate tool name in initialTools: "${tool.name}". ` +
          `Only the first occurrence will be used.`
        );
      } else {
        toolNamesRef.current.add(tool.name);
      }
    });

    return initialTools.filter((tool, index) => {
      // Filter out duplicates
      return initialTools.findIndex(t => t.name === tool.name) === index;
    });
  });

  /**
   * Register a new tool
   */
  const registerTool = useCallback((tool: Tool) => {
    if (!tool.name) {
      throw new Error('[useTools] Tool must have a name');
    }

    if (toolNamesRef.current.has(tool.name)) {
      console.warn(
        `[useTools] Tool "${tool.name}" is already registered. ` +
        `Use unregisterTool() first if you want to replace it.`
      );
      return;
    }

    // Validate tool structure
    if (!tool.description) {
      console.warn(`[useTools] Tool "${tool.name}" is missing description`);
    }

    if (!tool.parameters) {
      console.warn(`[useTools] Tool "${tool.name}" is missing parameters schema`);
    }

    if (typeof tool.handler !== 'function') {
      throw new Error(`[useTools] Tool "${tool.name}" must have a handler function`);
    }

    toolNamesRef.current.add(tool.name);
    setTools(prev => [...prev, tool]);
  }, []);

  /**
   * Unregister a tool by name
   */
  const unregisterTool = useCallback((name: string) => {
    if (!toolNamesRef.current.has(name)) {
      console.warn(`[useTools] Tool "${name}" is not registered`);
      return;
    }

    toolNamesRef.current.delete(name);
    setTools(prev => prev.filter(tool => tool.name !== name));
  }, []);

  /**
   * Clear all tools
   */
  const clearTools = useCallback(() => {
    toolNamesRef.current.clear();
    setTools([]);
  }, []);

  /**
   * Check if a tool exists
   */
  const hasTool = useCallback((name: string): boolean => {
    return toolNamesRef.current.has(name);
  }, []);

  /**
   * Cleanup on unmount if autoCleanup is enabled
   */
  useEffect(() => {
    if (autoCleanup) {
      return () => {
        toolNamesRef.current.clear();
      };
    }
  }, [autoCleanup]);

  return {
    tools,
    registerTool,
    unregisterTool,
    clearTools,
    hasTool,
  };
}
