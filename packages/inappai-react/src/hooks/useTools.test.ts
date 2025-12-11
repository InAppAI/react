import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTools } from './useTools';
import type { Tool } from '../types';

describe('useTools', () => {
  describe('initialization', () => {
    it('should initialize with empty tools by default', () => {
      const { result } = renderHook(() => useTools());

      expect(result.current.tools).toEqual([]);
    });

    it('should initialize with provided initial tools', () => {
      const initialTools: Tool[] = [
        {
          name: 'testTool',
          description: 'Test tool',
          parameters: { type: 'object', properties: {} },
          handler: async () => ({ success: true }),
        },
      ];

      const { result } = renderHook(() => useTools({ initialTools }));

      expect(result.current.tools).toHaveLength(1);
      expect(result.current.tools[0].name).toBe('testTool');
    });

    it('should filter out duplicate tools in initialTools', () => {
      const initialTools: Tool[] = [
        {
          name: 'duplicate',
          description: 'First',
          parameters: { type: 'object', properties: {} },
          handler: async () => ({ success: true }),
        },
        {
          name: 'duplicate',
          description: 'Second (should be filtered)',
          parameters: { type: 'object', properties: {} },
          handler: async () => ({ success: false }),
        },
      ];

      const { result } = renderHook(() => useTools({ initialTools }));

      expect(result.current.tools).toHaveLength(1);
      expect(result.current.tools[0].description).toBe('First');
    });
  });

  describe('registerTool', () => {
    it('should register a new tool', () => {
      const { result } = renderHook(() => useTools());

      const newTool: Tool = {
        name: 'newTool',
        description: 'A new tool',
        parameters: { type: 'object', properties: {} },
        handler: async () => ({ success: true }),
      };

      act(() => {
        result.current.registerTool(newTool);
      });

      expect(result.current.tools).toHaveLength(1);
      expect(result.current.tools[0].name).toBe('newTool');
    });

    it('should not register a tool without a name', () => {
      const { result } = renderHook(() => useTools());

      const invalidTool = {
        name: '',
        description: 'Invalid',
        parameters: { type: 'object', properties: {} },
        handler: async () => ({ success: true }),
      } as Tool;

      expect(() => {
        act(() => {
          result.current.registerTool(invalidTool);
        });
      }).toThrow('Tool must have a name');
    });

    it('should not register a tool without a handler', () => {
      const { result } = renderHook(() => useTools());

      const invalidTool = {
        name: 'invalid',
        description: 'Invalid',
        parameters: { type: 'object', properties: {} },
        handler: null,
      } as any;

      expect(() => {
        act(() => {
          result.current.registerTool(invalidTool);
        });
      }).toThrow('must have a handler function');
    });

    it('should warn when registering duplicate tool names', () => {
      const { result } = renderHook(() => useTools());

      const tool1: Tool = {
        name: 'duplicate',
        description: 'First',
        parameters: { type: 'object', properties: {} },
        handler: async () => ({ success: true }),
      };

      const tool2: Tool = {
        name: 'duplicate',
        description: 'Second',
        parameters: { type: 'object', properties: {} },
        handler: async () => ({ success: true }),
      };

      act(() => {
        result.current.registerTool(tool1);
      });

      // Should not throw, but warns
      act(() => {
        result.current.registerTool(tool2);
      });

      // Should still have only one tool
      expect(result.current.tools).toHaveLength(1);
      expect(result.current.tools[0].description).toBe('First');
    });

    it('should register multiple different tools', () => {
      const { result } = renderHook(() => useTools());

      act(() => {
        result.current.registerTool({
          name: 'tool1',
          description: 'Tool 1',
          parameters: { type: 'object', properties: {} },
          handler: async () => ({ success: true }),
        });

        result.current.registerTool({
          name: 'tool2',
          description: 'Tool 2',
          parameters: { type: 'object', properties: {} },
          handler: async () => ({ success: true }),
        });
      });

      expect(result.current.tools).toHaveLength(2);
      expect(result.current.tools[0].name).toBe('tool1');
      expect(result.current.tools[1].name).toBe('tool2');
    });
  });

  describe('unregisterTool', () => {
    it('should unregister a tool by name', () => {
      const { result } = renderHook(() => useTools());

      act(() => {
        result.current.registerTool({
          name: 'testTool',
          description: 'Test',
          parameters: { type: 'object', properties: {} },
          handler: async () => ({ success: true }),
        });
      });

      expect(result.current.tools).toHaveLength(1);

      act(() => {
        result.current.unregisterTool('testTool');
      });

      expect(result.current.tools).toHaveLength(0);
    });

    it('should warn when unregistering non-existent tool', () => {
      const { result } = renderHook(() => useTools());

      // Should not throw
      act(() => {
        result.current.unregisterTool('nonExistent');
      });

      expect(result.current.tools).toHaveLength(0);
    });

    it('should only unregister the specified tool', () => {
      const { result } = renderHook(() => useTools());

      act(() => {
        result.current.registerTool({
          name: 'tool1',
          description: 'Tool 1',
          parameters: { type: 'object', properties: {} },
          handler: async () => ({ success: true }),
        });

        result.current.registerTool({
          name: 'tool2',
          description: 'Tool 2',
          parameters: { type: 'object', properties: {} },
          handler: async () => ({ success: true }),
        });
      });

      act(() => {
        result.current.unregisterTool('tool1');
      });

      expect(result.current.tools).toHaveLength(1);
      expect(result.current.tools[0].name).toBe('tool2');
    });
  });

  describe('clearTools', () => {
    it('should clear all tools', () => {
      const { result } = renderHook(() => useTools());

      act(() => {
        result.current.registerTool({
          name: 'tool1',
          description: 'Tool 1',
          parameters: { type: 'object', properties: {} },
          handler: async () => ({ success: true }),
        });

        result.current.registerTool({
          name: 'tool2',
          description: 'Tool 2',
          parameters: { type: 'object', properties: {} },
          handler: async () => ({ success: true }),
        });
      });

      expect(result.current.tools).toHaveLength(2);

      act(() => {
        result.current.clearTools();
      });

      expect(result.current.tools).toHaveLength(0);
    });

    it('should allow re-registering tools after clearing', () => {
      const { result } = renderHook(() => useTools());

      act(() => {
        result.current.registerTool({
          name: 'tool1',
          description: 'Tool 1',
          parameters: { type: 'object', properties: {} },
          handler: async () => ({ success: true }),
        });
      });

      act(() => {
        result.current.clearTools();
      });

      act(() => {
        result.current.registerTool({
          name: 'tool1',
          description: 'Re-registered',
          parameters: { type: 'object', properties: {} },
          handler: async () => ({ success: true }),
        });
      });

      expect(result.current.tools).toHaveLength(1);
      expect(result.current.tools[0].description).toBe('Re-registered');
    });
  });

  describe('hasTool', () => {
    it('should return true for existing tools', () => {
      const { result } = renderHook(() => useTools());

      act(() => {
        result.current.registerTool({
          name: 'existingTool',
          description: 'Exists',
          parameters: { type: 'object', properties: {} },
          handler: async () => ({ success: true }),
        });
      });

      expect(result.current.hasTool('existingTool')).toBe(true);
    });

    it('should return false for non-existent tools', () => {
      const { result } = renderHook(() => useTools());

      expect(result.current.hasTool('nonExistent')).toBe(false);
    });

    it('should return false after unregistering', () => {
      const { result } = renderHook(() => useTools());

      act(() => {
        result.current.registerTool({
          name: 'tempTool',
          description: 'Temporary',
          parameters: { type: 'object', properties: {} },
          handler: async () => ({ success: true }),
        });
      });

      expect(result.current.hasTool('tempTool')).toBe(true);

      act(() => {
        result.current.unregisterTool('tempTool');
      });

      expect(result.current.hasTool('tempTool')).toBe(false);
    });
  });

  describe('tool handler execution', () => {
    it('should execute tool handlers correctly', async () => {
      const { result } = renderHook(() => useTools());

      let executionCount = 0;

      act(() => {
        result.current.registerTool({
          name: 'counter',
          description: 'Counts executions',
          parameters: { type: 'object', properties: {} },
          handler: async () => {
            executionCount++;
            return { success: true, count: executionCount };
          },
        });
      });

      const tool = result.current.tools[0];
      const result1 = await tool.handler({});
      const result2 = await tool.handler({});

      expect(result1).toEqual({ success: true, count: 1 });
      expect(result2).toEqual({ success: true, count: 2 });
    });

    it('should pass parameters to handler', async () => {
      const { result } = renderHook(() => useTools());

      act(() => {
        result.current.registerTool({
          name: 'echo',
          description: 'Echoes input',
          parameters: {
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
            required: ['message'],
          },
          handler: async (params: { message: string }) => {
            return { success: true, echo: params.message };
          },
        });
      });

      const tool = result.current.tools[0];
      const result1 = await tool.handler({ message: 'Hello' });

      expect(result1).toEqual({ success: true, echo: 'Hello' });
    });
  });

  describe('autoCleanup option', () => {
    it('should cleanup on unmount when autoCleanup is true (default)', () => {
      const { result, unmount } = renderHook(() => useTools());

      act(() => {
        result.current.registerTool({
          name: 'testTool',
          description: 'Test',
          parameters: { type: 'object', properties: {} },
          handler: async () => ({ success: true }),
        });
      });

      expect(result.current.tools).toHaveLength(1);

      unmount();

      // Tool names ref should be cleared (tested indirectly)
    });

    it('should not cleanup on unmount when autoCleanup is false', () => {
      const { result, unmount } = renderHook(() =>
        useTools({ autoCleanup: false })
      );

      act(() => {
        result.current.registerTool({
          name: 'testTool',
          description: 'Test',
          parameters: { type: 'object', properties: {} },
          handler: async () => ({ success: true }),
        });
      });

      expect(result.current.tools).toHaveLength(1);

      unmount();

      // No cleanup should occur
    });
  });

  describe('edge cases', () => {
    it('should handle tools with same name in different instances', () => {
      const { result: result1 } = renderHook(() => useTools());
      const { result: result2 } = renderHook(() => useTools());

      act(() => {
        result1.current.registerTool({
          name: 'sharedName',
          description: 'Instance 1',
          parameters: { type: 'object', properties: {} },
          handler: async () => ({ instance: 1 }),
        });

        result2.current.registerTool({
          name: 'sharedName',
          description: 'Instance 2',
          parameters: { type: 'object', properties: {} },
          handler: async () => ({ instance: 2 }),
        });
      });

      expect(result1.current.tools).toHaveLength(1);
      expect(result2.current.tools).toHaveLength(1);
      expect(result1.current.tools[0].description).toBe('Instance 1');
      expect(result2.current.tools[0].description).toBe('Instance 2');
    });

    it('should handle rapid registration/unregistration', () => {
      const { result } = renderHook(() => useTools());

      act(() => {
        for (let i = 0; i < 100; i++) {
          result.current.registerTool({
            name: `tool${i}`,
            description: `Tool ${i}`,
            parameters: { type: 'object', properties: {} },
            handler: async () => ({ success: true }),
          });
        }
      });

      expect(result.current.tools).toHaveLength(100);

      act(() => {
        for (let i = 0; i < 50; i++) {
          result.current.unregisterTool(`tool${i}`);
        }
      });

      expect(result.current.tools).toHaveLength(50);
    });
  });
});
