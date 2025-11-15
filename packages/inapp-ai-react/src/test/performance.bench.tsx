import { bench, describe } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { useTools } from '../hooks/useTools';
import { useToolRegistry, ToolRegistryProvider } from '../hooks/useToolRegistry';
import type { Tool } from '../types';

// Helper to create a test tool
const createTool = (name: string): Tool => ({
  name,
  description: `Tool ${name}`,
  parameters: {
    type: 'object',
    properties: {
      param: { type: 'string' },
    },
  },
  handler: async (params: any) => ({ success: true, ...params }),
});

describe('useTools Performance', () => {
  bench(
    'register 100 tools',
    () => {
      const { result } = renderHook(() => useTools());

      act(() => {
        for (let i = 0; i < 100; i++) {
          result.current.registerTool(createTool(`tool${i}`));
        }
      });
    },
    { iterations: 100 }
  );

  bench(
    'register and unregister 50 tools',
    () => {
      const { result } = renderHook(() => useTools());

      act(() => {
        for (let i = 0; i < 50; i++) {
          result.current.registerTool(createTool(`tool${i}`));
        }
      });

      act(() => {
        for (let i = 0; i < 50; i++) {
          result.current.unregisterTool(`tool${i}`);
        }
      });
    },
    { iterations: 100 }
  );

  bench(
    'check hasTool for 100 tools',
    () => {
      const { result } = renderHook(() => useTools());

      act(() => {
        for (let i = 0; i < 100; i++) {
          result.current.registerTool(createTool(`tool${i}`));
        }
      });

      for (let i = 0; i < 100; i++) {
        result.current.hasTool(`tool${i}`);
      }
    },
    { iterations: 100 }
  );

  bench(
    'execute tool handler 1000 times',
    async () => {
      const { result } = renderHook(() => useTools());

      act(() => {
        result.current.registerTool(createTool('testTool'));
      });

      const tool = result.current.tools[0];

      for (let i = 0; i < 1000; i++) {
        await tool.handler({ param: `test${i}` });
      }
    },
    { iterations: 10 }
  );

  bench(
    'clear and re-register 50 tools',
    () => {
      const { result } = renderHook(() => useTools());

      act(() => {
        for (let i = 0; i < 50; i++) {
          result.current.registerTool(createTool(`tool${i}`));
        }
      });

      act(() => {
        result.current.clearTools();
      });

      act(() => {
        for (let i = 0; i < 50; i++) {
          result.current.registerTool(createTool(`tool${i}`));
        }
      });
    },
    { iterations: 100 }
  );
});

describe('useToolRegistry Performance', () => {
  bench(
    'register 10 namespaces with 10 tools each',
    () => {
      const { result } = renderHook(() => useToolRegistry(), {
        wrapper: ({ children }) => (
          <ToolRegistryProvider>{children}</ToolRegistryProvider>
        ),
      });

      act(() => {
        for (let ns = 0; ns < 10; ns++) {
          const tools = [];
          for (let t = 0; t < 10; t++) {
            tools.push(createTool(`ns${ns}_tool${t}`));
          }
          result.current.register(`namespace${ns}`, tools);
        }
      });
    },
    { iterations: 100 }
  );

  bench(
    'getAllTools with 100 tools across 10 namespaces',
    () => {
      const { result } = renderHook(() => useToolRegistry(), {
        wrapper: ({ children }) => (
          <ToolRegistryProvider>{children}</ToolRegistryProvider>
        ),
      });

      act(() => {
        for (let ns = 0; ns < 10; ns++) {
          const tools = [];
          for (let t = 0; t < 10; t++) {
            tools.push(createTool(`ns${ns}_tool${t}`));
          }
          result.current.register(`namespace${ns}`, tools);
        }
      });

      for (let i = 0; i < 100; i++) {
        result.current.getAllTools();
      }
    },
    { iterations: 50 }
  );

  bench(
    'getTools for specific namespace 1000 times',
    () => {
      const { result } = renderHook(() => useToolRegistry(), {
        wrapper: ({ children }) => (
          <ToolRegistryProvider>{children}</ToolRegistryProvider>
        ),
      });

      act(() => {
        result.current.register('test', [
          createTool('tool1'),
          createTool('tool2'),
          createTool('tool3'),
        ]);
      });

      for (let i = 0; i < 1000; i++) {
        result.current.getTools('test');
      }
    },
    { iterations: 50 }
  );

  bench(
    'register/unregister 20 namespaces',
    () => {
      const { result } = renderHook(() => useToolRegistry(), {
        wrapper: ({ children }) => (
          <ToolRegistryProvider>{children}</ToolRegistryProvider>
        ),
      });

      act(() => {
        for (let i = 0; i < 20; i++) {
          result.current.register(`namespace${i}`, [createTool(`tool${i}`)]);
        }
      });

      act(() => {
        for (let i = 0; i < 20; i++) {
          result.current.unregister(`namespace${i}`);
        }
      });
    },
    { iterations: 100 }
  );

  bench(
    'getNamespaces with 50 namespaces',
    () => {
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

      for (let i = 0; i < 1000; i++) {
        result.current.getNamespaces();
      }
    },
    { iterations: 50 }
  );
});

describe('Tool Handler Performance', () => {
  bench(
    'simple sync handler execution',
    () => {
      const tool: Tool = {
        name: 'sync',
        description: 'Sync tool',
        parameters: { type: 'object', properties: {} },
        handler: (params) => ({ success: true, ...params }),
      };

      for (let i = 0; i < 1000; i++) {
        tool.handler({ iteration: i });
      }
    },
    { iterations: 100 }
  );

  bench(
    'simple async handler execution',
    async () => {
      const tool: Tool = {
        name: 'async',
        description: 'Async tool',
        parameters: { type: 'object', properties: {} },
        handler: async (params) => ({ success: true, ...params }),
      };

      for (let i = 0; i < 100; i++) {
        await tool.handler({ iteration: i });
      }
    },
    { iterations: 50 }
  );

  bench(
    'complex handler with validation',
    async () => {
      const tool: Tool = {
        name: 'complex',
        description: 'Complex tool',
        parameters: {
          type: 'object',
          properties: {
            email: { type: 'string' },
            age: { type: 'number' },
          },
          required: ['email', 'age'],
        },
        handler: async (params: { email: string; age: number }) => {
          // Simulate validation
          if (!params.email.includes('@')) {
            return { success: false, error: 'Invalid email' };
          }
          if (params.age < 18) {
            return { success: false, error: 'Too young' };
          }
          return { success: true, user: params };
        },
      };

      for (let i = 0; i < 100; i++) {
        await tool.handler({ email: `user${i}@example.com`, age: 25 });
      }
    },
    { iterations: 50 }
  );
});

describe('Memory Efficiency', () => {
  bench(
    'create and destroy 1000 tools',
    () => {
      const { result, unmount } = renderHook(() => useTools({ autoCleanup: true }));

      act(() => {
        for (let i = 0; i < 1000; i++) {
          result.current.registerTool(createTool(`tool${i}`));
        }
      });

      act(() => {
        result.current.clearTools();
      });

      unmount();
    },
    { iterations: 50 }
  );

  bench(
    'register 1000 tools across 100 namespaces',
    () => {
      const { result, unmount } = renderHook(() => useToolRegistry(), {
        wrapper: ({ children }) => (
          <ToolRegistryProvider>{children}</ToolRegistryProvider>
        ),
      });

      act(() => {
        for (let ns = 0; ns < 100; ns++) {
          const tools = [];
          for (let t = 0; t < 10; t++) {
            tools.push(createTool(`ns${ns}_tool${t}`));
          }
          result.current.register(`namespace${ns}`, tools);
        }
      });

      act(() => {
        result.current.clear();
      });

      unmount();
    },
    { iterations: 20 }
  );
});
