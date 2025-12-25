import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import type { Tool } from '../types';

/**
 * Tool registry interface
 */
export interface ToolRegistry {
  /**
   * Register tools under a namespace
   * @param namespace - Unique namespace identifier
   * @param tools - Array of tools to register
   */
  register(namespace: string, tools: Tool[]): void;

  /**
   * Unregister all tools for a namespace
   * @param namespace - Namespace to unregister
   */
  unregister(namespace: string): void;

  /**
   * Get tools for a specific namespace
   * @param namespace - Namespace to query
   * @returns Array of tools for the namespace, or empty array if not found
   */
  getTools(namespace: string): Tool[];

  /**
   * Get all registered tools from all namespaces
   * @returns Combined array of all tools
   */
  getAllTools(): Tool[];

  /**
   * Clear all registered tools from all namespaces
   */
  clear(): void;

  /**
   * Get all registered namespace names
   * @returns Array of namespace names
   */
  getNamespaces(): string[];
}

/**
 * Context for the tool registry
 */
const ToolRegistryContext = createContext<ToolRegistry | null>(null);

/**
 * Props for ToolRegistryProvider
 */
export interface ToolRegistryProviderProps {
  /**
   * Child components
   */
  children: React.ReactNode;

  /**
   * Initial tools organized by namespace
   */
  initialTools?: Record<string, Tool[]>;
}

/**
 * Provider component for global tool registry
 *
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <ToolRegistryProvider>
 *       <MyApp />
 *     </ToolRegistryProvider>
 *   );
 * }
 * ```
 */
export function ToolRegistryProvider({
  children,
  initialTools = {},
}: ToolRegistryProviderProps): React.ReactElement {
  // State: Map of namespace -> tools
  const [toolsMap, setToolsMap] = useState<Map<string, Tool[]>>(
    () => new Map(Object.entries(initialTools))
  );

  /**
   * Register tools under a namespace
   */
  const register = useCallback((namespace: string, tools: Tool[]) => {
    // Validate namespace
    if (!namespace || typeof namespace !== 'string') {
      throw new Error('[ToolRegistry] Namespace must be a non-empty string');
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(namespace)) {
      throw new Error(
        `[ToolRegistry] Invalid namespace "${namespace}". ` +
        `Use only alphanumeric characters, hyphens, and underscores.`
      );
    }

    // Validate tools
    if (!Array.isArray(tools)) {
      throw new Error('[ToolRegistry] Tools must be an array');
    }

    // Check for duplicate tool names within the namespace
    const toolNames = new Set<string>();
    tools.forEach(tool => {
      if (toolNames.has(tool.name)) {
        console.warn(
          `[ToolRegistry] Duplicate tool name in namespace "${namespace}": "${tool.name}"`
        );
      }
      toolNames.add(tool.name);
    });

    setToolsMap(prev => {
      const next = new Map(prev);
      next.set(namespace, tools);
      return next;
    });
  }, []);

  /**
   * Unregister a namespace
   */
  const unregister = useCallback((namespace: string) => {
    setToolsMap(prev => {
      if (!prev.has(namespace)) {
        console.warn(`[ToolRegistry] Namespace "${namespace}" is not registered`);
        return prev;
      }

      const next = new Map(prev);
      next.delete(namespace);
      return next;
    });
  }, []);

  /**
   * Get tools for a specific namespace
   */
  const getTools = useCallback(
    (namespace: string): Tool[] => {
      return toolsMap.get(namespace) || [];
    },
    [toolsMap]
  );

  /**
   * Get all tools from all namespaces
   */
  const getAllTools = useCallback((): Tool[] => {
    const allTools: Tool[] = [];
    const seenNames = new Set<string>();

    // Iterate through namespaces
    for (const [namespace, tools] of toolsMap.entries()) {
      for (const tool of tools) {
        // Warn about name conflicts across namespaces
        if (seenNames.has(tool.name)) {
          console.warn(
            `[ToolRegistry] Tool name conflict: "${tool.name}" exists in multiple namespaces. ` +
            `Only the first occurrence will be used.`
          );
          continue;
        }

        seenNames.add(tool.name);
        allTools.push(tool);
      }
    }

    return allTools;
  }, [toolsMap]);

  /**
   * Clear all tools
   */
  const clear = useCallback(() => {
    setToolsMap(new Map());
  }, []);

  /**
   * Get all namespace names
   */
  const getNamespaces = useCallback((): string[] => {
    return Array.from(toolsMap.keys());
  }, [toolsMap]);

  // Memoize the registry value
  const registry = useMemo<ToolRegistry>(
    () => ({
      register,
      unregister,
      getTools,
      getAllTools,
      clear,
      getNamespaces,
    }),
    [register, unregister, getTools, getAllTools, clear, getNamespaces]
  );

  return (
    <ToolRegistryContext.Provider value={registry}>
      {children}
    </ToolRegistryContext.Provider>
  );
}

/**
 * Hook to access the tool registry
 *
 * @example
 * ```tsx
 * function TodoPage() {
 *   const registry = useToolRegistry();
 *   const [todos, setTodos] = useState([]);
 *
 *   useEffect(() => {
 *     registry.register('todos', [
 *       {
 *         name: 'addTodo',
 *         description: 'Add a todo',
 *         parameters: { type: 'object', properties: { task: { type: 'string' } } },
 *         handler: async ({ task }) => {
 *           setTodos(prev => [...prev, { id: Date.now(), text: task }]);
 *           return { success: true };
 *         }
 *       }
 *     ]);
 *
 *     return () => registry.unregister('todos');
 *   }, [registry, todos, setTodos]);
 *
 *   return <TodoList />;
 * }
 *
 * function ChatWidget() {
 *   const registry = useToolRegistry();
 *   const allTools = registry.getAllTools();
 *
 *   return <InAppAI endpoint="..." tools={allTools} />;
 * }
 * ```
 *
 * @throws {Error} If used outside of ToolRegistryProvider
 * @returns Tool registry instance
 */
export function useToolRegistry(): ToolRegistry {
  const registry = useContext(ToolRegistryContext);

  if (!registry) {
    throw new Error(
      '[useToolRegistry] must be used within a ToolRegistryProvider. ' +
      'Wrap your component tree with <ToolRegistryProvider>.'
    );
  }

  return registry;
}
