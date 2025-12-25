import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { useToolRegistry, ToolRegistryProvider } from './useToolRegistry';
import type { Tool } from '../types';

// Helper to create a test tool
const createTool = (name: string, description = 'Test tool'): Tool => ({
  name,
  description,
  parameters: { type: 'object', properties: {} },
  handler: async () => ({ success: true }),
});

describe('ToolRegistryProvider', () => {
  it('should render children', () => {
    const { result } = renderHook(
      () => {
        const registry = useToolRegistry();
        return registry;
      },
      {
        wrapper: ({ children }) => (
          <ToolRegistryProvider>{children}</ToolRegistryProvider>
        ),
      }
    );

    expect(result.current).toBeDefined();
  });

  it('should initialize with empty tools by default', () => {
    const { result } = renderHook(() => useToolRegistry(), {
      wrapper: ({ children }) => (
        <ToolRegistryProvider>{children}</ToolRegistryProvider>
      ),
    });

    expect(result.current.getAllTools()).toEqual([]);
    expect(result.current.getNamespaces()).toEqual([]);
  });

  it('should initialize with provided initialTools', () => {
    const initialTools = {
      todos: [createTool('addTodo'), createTool('deleteTodo')],
      calendar: [createTool('addEvent')],
    };

    const { result } = renderHook(() => useToolRegistry(), {
      wrapper: ({ children }) => (
        <ToolRegistryProvider initialTools={initialTools}>
          {children}
        </ToolRegistryProvider>
      ),
    });

    expect(result.current.getAllTools()).toHaveLength(3);
    expect(result.current.getNamespaces()).toEqual(['todos', 'calendar']);
  });
});

describe('useToolRegistry', () => {
  describe('error handling', () => {
    it('should throw error when used outside provider', () => {
      expect(() => {
        renderHook(() => useToolRegistry());
      }).toThrow('must be used within a ToolRegistryProvider');
    });
  });

  describe('register', () => {
    it('should register tools under a namespace', () => {
      const { result } = renderHook(() => useToolRegistry(), {
        wrapper: ({ children }) => (
          <ToolRegistryProvider>{children}</ToolRegistryProvider>
        ),
      });

      act(() => {
        result.current.register('todos', [
          createTool('addTodo'),
          createTool('deleteTodo'),
        ]);
      });

      expect(result.current.getTools('todos')).toHaveLength(2);
      expect(result.current.getAllTools()).toHaveLength(2);
    });

    it('should validate namespace format', () => {
      const { result } = renderHook(() => useToolRegistry(), {
        wrapper: ({ children }) => (
          <ToolRegistryProvider>{children}</ToolRegistryProvider>
        ),
      });

      expect(() => {
        act(() => {
          result.current.register('', [createTool('test')]);
        });
      }).toThrow('Namespace must be a non-empty string');

      expect(() => {
        act(() => {
          result.current.register('invalid namespace!', [createTool('test')]);
        });
      }).toThrow('Invalid namespace');
    });

    it('should accept valid namespace formats', () => {
      const { result } = renderHook(() => useToolRegistry(), {
        wrapper: ({ children }) => (
          <ToolRegistryProvider>{children}</ToolRegistryProvider>
        ),
      });

      const validNamespaces = [
        'simple',
        'with-hyphens',
        'with_underscores',
        'MixedCase123',
      ];

      validNamespaces.forEach((namespace) => {
        act(() => {
          result.current.register(namespace, [createTool('test')]);
        });
      });

      expect(result.current.getNamespaces()).toEqual(validNamespaces);
    });

    it('should validate tools is an array', () => {
      const { result } = renderHook(() => useToolRegistry(), {
        wrapper: ({ children }) => (
          <ToolRegistryProvider>{children}</ToolRegistryProvider>
        ),
      });

      expect(() => {
        act(() => {
          result.current.register('test', 'not an array' as any);
        });
      }).toThrow('Tools must be an array');
    });

    it('should warn about duplicate tool names within namespace', () => {
      const { result } = renderHook(() => useToolRegistry(), {
        wrapper: ({ children }) => (
          <ToolRegistryProvider>{children}</ToolRegistryProvider>
        ),
      });

      // Should not throw, but warns
      act(() => {
        result.current.register('todos', [
          createTool('duplicate'),
          createTool('duplicate'),
          createTool('unique'),
        ]);
      });

      expect(result.current.getTools('todos')).toHaveLength(3);
    });

    it('should replace tools when re-registering namespace', () => {
      const { result } = renderHook(() => useToolRegistry(), {
        wrapper: ({ children }) => (
          <ToolRegistryProvider>{children}</ToolRegistryProvider>
        ),
      });

      act(() => {
        result.current.register('todos', [createTool('addTodo')]);
      });

      expect(result.current.getTools('todos')).toHaveLength(1);

      act(() => {
        result.current.register('todos', [
          createTool('addTodo'),
          createTool('deleteTodo'),
        ]);
      });

      expect(result.current.getTools('todos')).toHaveLength(2);
    });

    it('should register multiple namespaces independently', () => {
      const { result } = renderHook(() => useToolRegistry(), {
        wrapper: ({ children }) => (
          <ToolRegistryProvider>{children}</ToolRegistryProvider>
        ),
      });

      act(() => {
        result.current.register('todos', [createTool('addTodo')]);
        result.current.register('calendar', [createTool('addEvent')]);
        result.current.register('notes', [createTool('createNote')]);
      });

      expect(result.current.getNamespaces()).toEqual([
        'todos',
        'calendar',
        'notes',
      ]);
      expect(result.current.getAllTools()).toHaveLength(3);
    });
  });

  describe('unregister', () => {
    it('should unregister a namespace', () => {
      const { result } = renderHook(() => useToolRegistry(), {
        wrapper: ({ children }) => (
          <ToolRegistryProvider>{children}</ToolRegistryProvider>
        ),
      });

      act(() => {
        result.current.register('todos', [createTool('addTodo')]);
        result.current.register('calendar', [createTool('addEvent')]);
      });

      expect(result.current.getNamespaces()).toHaveLength(2);

      act(() => {
        result.current.unregister('todos');
      });

      expect(result.current.getNamespaces()).toEqual(['calendar']);
      expect(result.current.getTools('todos')).toEqual([]);
    });

    it('should warn when unregistering non-existent namespace', () => {
      const { result } = renderHook(() => useToolRegistry(), {
        wrapper: ({ children }) => (
          <ToolRegistryProvider>{children}</ToolRegistryProvider>
        ),
      });

      // Should not throw, but warns
      act(() => {
        result.current.unregister('nonExistent');
      });

      expect(result.current.getNamespaces()).toEqual([]);
    });
  });

  describe('getTools', () => {
    it('should get tools for a specific namespace', () => {
      const { result } = renderHook(() => useToolRegistry(), {
        wrapper: ({ children }) => (
          <ToolRegistryProvider>{children}</ToolRegistryProvider>
        ),
      });

      const todoTools = [createTool('addTodo'), createTool('deleteTodo')];
      const calendarTools = [createTool('addEvent')];

      act(() => {
        result.current.register('todos', todoTools);
        result.current.register('calendar', calendarTools);
      });

      expect(result.current.getTools('todos')).toHaveLength(2);
      expect(result.current.getTools('calendar')).toHaveLength(1);
      expect(result.current.getTools('todos')[0].name).toBe('addTodo');
    });

    it('should return empty array for non-existent namespace', () => {
      const { result } = renderHook(() => useToolRegistry(), {
        wrapper: ({ children }) => (
          <ToolRegistryProvider>{children}</ToolRegistryProvider>
        ),
      });

      expect(result.current.getTools('nonExistent')).toEqual([]);
    });
  });

  describe('getAllTools', () => {
    it('should get all tools from all namespaces', () => {
      const { result } = renderHook(() => useToolRegistry(), {
        wrapper: ({ children }) => (
          <ToolRegistryProvider>{children}</ToolRegistryProvider>
        ),
      });

      act(() => {
        result.current.register('todos', [
          createTool('addTodo'),
          createTool('deleteTodo'),
        ]);
        result.current.register('calendar', [createTool('addEvent')]);
      });

      const allTools = result.current.getAllTools();
      expect(allTools).toHaveLength(3);

      const toolNames = allTools.map((t) => t.name);
      expect(toolNames).toContain('addTodo');
      expect(toolNames).toContain('deleteTodo');
      expect(toolNames).toContain('addEvent');
    });

    it('should return empty array when no tools registered', () => {
      const { result } = renderHook(() => useToolRegistry(), {
        wrapper: ({ children }) => (
          <ToolRegistryProvider>{children}</ToolRegistryProvider>
        ),
      });

      expect(result.current.getAllTools()).toEqual([]);
    });

    it('should warn about tool name conflicts across namespaces', () => {
      const { result } = renderHook(() => useToolRegistry(), {
        wrapper: ({ children }) => (
          <ToolRegistryProvider>{children}</ToolRegistryProvider>
        ),
      });

      act(() => {
        result.current.register('namespace1', [
          createTool('duplicate', 'First'),
        ]);
        result.current.register('namespace2', [
          createTool('duplicate', 'Second'),
        ]);
      });

      const allTools = result.current.getAllTools();

      // Should only include the first occurrence
      expect(allTools).toHaveLength(1);
      expect(allTools[0].description).toBe('First');
    });

    it('should handle multiple tools with unique names', () => {
      const { result } = renderHook(() => useToolRegistry(), {
        wrapper: ({ children }) => (
          <ToolRegistryProvider>{children}</ToolRegistryProvider>
        ),
      });

      act(() => {
        result.current.register('namespace1', [
          createTool('tool1'),
          createTool('tool2'),
        ]);
        result.current.register('namespace2', [
          createTool('tool3'),
          createTool('tool4'),
        ]);
      });

      const allTools = result.current.getAllTools();
      expect(allTools).toHaveLength(4);
    });
  });

  describe('clear', () => {
    it('should clear all tools from all namespaces', () => {
      const { result } = renderHook(() => useToolRegistry(), {
        wrapper: ({ children }) => (
          <ToolRegistryProvider>{children}</ToolRegistryProvider>
        ),
      });

      act(() => {
        result.current.register('todos', [createTool('addTodo')]);
        result.current.register('calendar', [createTool('addEvent')]);
      });

      expect(result.current.getAllTools()).toHaveLength(2);

      act(() => {
        result.current.clear();
      });

      expect(result.current.getAllTools()).toEqual([]);
      expect(result.current.getNamespaces()).toEqual([]);
    });

    it('should allow re-registering after clear', () => {
      const { result } = renderHook(() => useToolRegistry(), {
        wrapper: ({ children }) => (
          <ToolRegistryProvider>{children}</ToolRegistryProvider>
        ),
      });

      act(() => {
        result.current.register('todos', [createTool('addTodo')]);
        result.current.clear();
        result.current.register('todos', [createTool('addTodo')]);
      });

      expect(result.current.getAllTools()).toHaveLength(1);
    });
  });

  describe('getNamespaces', () => {
    it('should return all namespace names', () => {
      const { result } = renderHook(() => useToolRegistry(), {
        wrapper: ({ children }) => (
          <ToolRegistryProvider>{children}</ToolRegistryProvider>
        ),
      });

      act(() => {
        result.current.register('todos', [createTool('addTodo')]);
        result.current.register('calendar', [createTool('addEvent')]);
        result.current.register('notes', [createTool('createNote')]);
      });

      expect(result.current.getNamespaces()).toEqual([
        'todos',
        'calendar',
        'notes',
      ]);
    });

    it('should return empty array when no namespaces registered', () => {
      const { result } = renderHook(() => useToolRegistry(), {
        wrapper: ({ children }) => (
          <ToolRegistryProvider>{children}</ToolRegistryProvider>
        ),
      });

      expect(result.current.getNamespaces()).toEqual([]);
    });

    it('should update after registering/unregistering', () => {
      const { result } = renderHook(() => useToolRegistry(), {
        wrapper: ({ children }) => (
          <ToolRegistryProvider>{children}</ToolRegistryProvider>
        ),
      });

      act(() => {
        result.current.register('todos', [createTool('addTodo')]);
      });
      expect(result.current.getNamespaces()).toEqual(['todos']);

      act(() => {
        result.current.register('calendar', [createTool('addEvent')]);
      });
      expect(result.current.getNamespaces()).toEqual(['todos', 'calendar']);

      act(() => {
        result.current.unregister('todos');
      });
      expect(result.current.getNamespaces()).toEqual(['calendar']);
    });
  });

  describe('complex scenarios', () => {
    it('should handle dynamic namespace registration pattern', () => {
      const { result } = renderHook(() => useToolRegistry(), {
        wrapper: ({ children }) => (
          <ToolRegistryProvider>{children}</ToolRegistryProvider>
        ),
      });

      // Simulate multiple components registering/unregistering
      act(() => {
        // Component 1 mounts
        result.current.register('page1', [createTool('tool1')]);

        // Component 2 mounts
        result.current.register('page2', [createTool('tool2')]);

        // Component 1 updates
        result.current.register('page1', [
          createTool('tool1'),
          createTool('tool1b'),
        ]);

        // Component 2 unmounts
        result.current.unregister('page2');

        // Component 3 mounts
        result.current.register('page3', [createTool('tool3')]);
      });

      expect(result.current.getNamespaces()).toEqual(['page1', 'page3']);
      expect(result.current.getAllTools()).toHaveLength(3);
    });

    it('should handle rapid registration/unregistration', () => {
      const { result } = renderHook(() => useToolRegistry(), {
        wrapper: ({ children }) => (
          <ToolRegistryProvider>{children}</ToolRegistryProvider>
        ),
      });

      act(() => {
        for (let i = 0; i < 50; i++) {
          result.current.register(`namespace${i}`, [createTool(`tool${i}`)]);
        }
      });

      expect(result.current.getNamespaces()).toHaveLength(50);
      expect(result.current.getAllTools()).toHaveLength(50);

      act(() => {
        for (let i = 0; i < 25; i++) {
          result.current.unregister(`namespace${i}`);
        }
      });

      expect(result.current.getNamespaces()).toHaveLength(25);
      expect(result.current.getAllTools()).toHaveLength(25);
    });

    it('should maintain tool handler references', async () => {
      const { result } = renderHook(() => useToolRegistry(), {
        wrapper: ({ children }) => (
          <ToolRegistryProvider>{children}</ToolRegistryProvider>
        ),
      });

      let callCount = 0;
      const handler = async () => {
        callCount++;
        return { success: true, count: callCount };
      };

      act(() => {
        result.current.register('test', [
          {
            name: 'counter',
            description: 'Test',
            parameters: { type: 'object', properties: {} },
            handler,
          },
        ]);
      });

      const tool = result.current.getTools('test')[0];
      await tool.handler({});
      await tool.handler({});

      expect(callCount).toBe(2);
    });
  });

  describe('multiple provider instances', () => {
    it('should maintain separate registries for different providers', () => {
      const { result: result1 } = renderHook(() => useToolRegistry(), {
        wrapper: ({ children }) => (
          <ToolRegistryProvider>{children}</ToolRegistryProvider>
        ),
      });

      const { result: result2 } = renderHook(() => useToolRegistry(), {
        wrapper: ({ children }) => (
          <ToolRegistryProvider>{children}</ToolRegistryProvider>
        ),
      });

      act(() => {
        result1.current.register('todos', [createTool('addTodo')]);
      });

      act(() => {
        result2.current.register('calendar', [createTool('addEvent')]);
      });

      expect(result1.current.getNamespaces()).toEqual(['todos']);
      expect(result2.current.getNamespaces()).toEqual(['calendar']);
      expect(result1.current.getAllTools()).toHaveLength(1);
      expect(result2.current.getAllTools()).toHaveLength(1);
    });
  });
});
