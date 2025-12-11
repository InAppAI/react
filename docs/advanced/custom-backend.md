# Custom Backend

> Build a full-featured InAppAI backend from scratch

This guide shows you how to build a production-ready backend for InAppAI React with all the features you need.

## Full Backend Implementation

Here's a complete, production-ready backend implementation.

### Project Structure

```
backend/
├── src/
│   ├── server.ts           # Main server file
│   ├── routes/
│   │   ├── health.ts       # Health check endpoint
│   │   └── chat.ts         # Chat endpoint
│   ├── middleware/
│   │   ├── auth.ts         # Authentication
│   │   ├── rateLimit.ts    # Rate limiting
│   │   └── validate.ts     # Request validation
│   ├── services/
│   │   ├── ai.ts           # AI provider service
│   │   ├── conversation.ts # Conversation management
│   │   └── cache.ts        # Response caching
│   ├── models/
│   │   └── conversation.ts # Database models
│   └── utils/
│       ├── logger.ts       # Logging utility
│       └── errors.ts       # Error handling
├── package.json
├── tsconfig.json
└── .env
```

### Dependencies

```json
{
  "name": "inappai-backend",
  "version": "1.0.0",
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.5",
    "jsonwebtoken": "^9.0.2",
    "openai": "^4.24.1",
    "pg": "^8.11.3",
    "node-cache": "^5.1.2",
    "winston": "^3.11.0",
    "joi": "^17.11.0",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "@types/node": "^20.10.6",
    "@types/jsonwebtoken": "^9.0.5",
    "typescript": "^5.3.3",
    "tsx": "^4.7.0"
  }
}
```

### Main Server

```typescript
// src/server.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import healthRouter from './routes/health';
import chatRouter from './routes/chat';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'],
  credentials: true,
}));

// Body parsing
app.use(express.json({ limit: '1mb' }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });
  next();
});

// Routes
app.use('/:agentId', healthRouter);
app.use('/:agentId', chatRouter);

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

export default app;
```

### Health Check Route

```typescript
// src/routes/health.ts
import { Router } from 'express';

const router = Router();

router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    agentId: req.params.agentId,
  });
});

export default router;
```

### Chat Route

```typescript
// src/routes/chat.ts
import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { chatLimiter } from '../middleware/rateLimit';
import { validateChatRequest } from '../middleware/validate';
import { AIService } from '../services/ai';
import { ConversationService } from '../services/conversation';
import { CacheService } from '../services/cache';
import { logger } from '../utils/logger';

const router = Router();

router.post(
  '/chat',
  authenticate,
  chatLimiter,
  validateChatRequest,
  async (req, res, next) => {
    try {
      const { agentId } = req.params;
      const { message, conversationId = 'default', context, tools } = req.body;
      const userId = req.user?.id || 'anonymous';

      // Check cache
      const cacheKey = CacheService.generateKey(message, context);
      const cachedResponse = await CacheService.get(cacheKey);

      if (cachedResponse) {
        logger.info('Cache hit', { userId, cacheKey });
        return res.json(cachedResponse);
      }

      // Load conversation history
      const history = await ConversationService.load(
        userId,
        agentId,
        conversationId
      );

      // Add user message
      history.push({
        role: 'user',
        content: message,
      });

      // Get AI response
      const aiService = new AIService();
      const response = await aiService.chat({
        history,
        context,
        tools,
      });

      // Handle tool calls
      if (response.toolCalls) {
        // Return tool calls for client-side execution
        return res.json({ toolCalls: response.toolCalls });
      }

      // Add assistant response to history
      history.push({
        role: 'assistant',
        content: response.message,
      });

      // Save conversation
      await ConversationService.save(userId, agentId, conversationId, history);

      // Cache response
      await CacheService.set(cacheKey, response, 3600);

      // Return response
      res.json({
        message: response.message,
        usage: response.usage,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
```

### Authentication Middleware

```typescript
// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/errors';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  // Optional authentication - allow anonymous users
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next();  // Continue without user
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'default-secret'
    ) as any;

    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role || 'user',
    };

    next();
  } catch (error) {
    throw new AppError('Invalid authentication token', 401);
  }
};

// Require authentication
export const requireAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }
  next();
};
```

### Rate Limiting Middleware

```typescript
// src/middleware/rateLimit.ts
import rateLimit from 'express-rate-limit';

export const chatLimiter = rateLimit({
  windowMs: 60 * 1000,  // 1 minute
  max: (req: any) => {
    // Authenticated users: 20 requests/min
    if (req.user) return 20;
    // Anonymous users: 5 requests/min
    return 5;
  },
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: any) => req.user?.id || req.ip,
});
```

### Validation Middleware

```typescript
// src/middleware/validate.ts
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { AppError } from '../utils/errors';

const chatSchema = Joi.object({
  message: Joi.string().required().max(5000),
  conversationId: Joi.string().optional(),
  context: Joi.object().optional(),
  tools: Joi.array().optional(),
});

export const validateChatRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = chatSchema.validate(req.body);

  if (error) {
    throw new AppError(error.message, 400);
  }

  next();
};
```

### AI Service

```typescript
// src/services/ai.ts
import { OpenAI } from 'openai';
import { logger } from '../utils/logger';
import { AppError } from '../utils/errors';

export class AIService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async chat(params: {
    history: Array<{ role: string; content: string }>;
    context?: any;
    tools?: any[];
  }) {
    try {
      const systemMessage = {
        role: 'system',
        content: `You are a helpful AI assistant.${
          params.context
            ? ` Context: ${JSON.stringify(params.context)}`
            : ''
        }`,
      };

      const completion = await this.openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4',
        messages: [systemMessage, ...params.history],
        tools: params.tools,
        temperature: 0.7,
        max_tokens: 2000,
      });

      const message = completion.choices[0].message;

      // Check for tool calls
      if (message.tool_calls) {
        return { toolCalls: message.tool_calls };
      }

      return {
        message: message.content || '',
        usage: {
          promptTokens: completion.usage?.prompt_tokens || 0,
          completionTokens: completion.usage?.completion_tokens || 0,
          totalTokens: completion.usage?.total_tokens || 0,
        },
      };
    } catch (error: any) {
      logger.error('OpenAI error', { error: error.message });

      if (error.status === 429) {
        throw new AppError('Rate limit exceeded', 429);
      }

      if (error.status === 401) {
        throw new AppError('Invalid API key', 500);
      }

      throw new AppError('AI service error', 500);
    }
  }
}
```

### Conversation Service

```typescript
// src/services/conversation.ts
import { Pool } from 'pg';
import { logger } from '../utils/logger';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export class ConversationService {
  static async load(
    userId: string,
    agentId: string,
    conversationId: string
  ): Promise<any[]> {
    try {
      const result = await pool.query(
        `SELECT messages FROM conversations
         WHERE user_id = $1 AND agent_id = $2 AND conversation_id = $3`,
        [userId, agentId, conversationId]
      );

      return result.rows[0]?.messages || [];
    } catch (error) {
      logger.error('Failed to load conversation', { error });
      return [];
    }
  }

  static async save(
    userId: string,
    agentId: string,
    conversationId: string,
    messages: any[]
  ): Promise<void> {
    try {
      await pool.query(
        `INSERT INTO conversations (user_id, agent_id, conversation_id, messages)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (user_id, agent_id, conversation_id)
         DO UPDATE SET messages = $4, updated_at = NOW()`,
        [userId, agentId, conversationId, JSON.stringify(messages)]
      );
    } catch (error) {
      logger.error('Failed to save conversation', { error });
    }
  }

  static async delete(
    userId: string,
    agentId: string,
    conversationId: string
  ): Promise<void> {
    try {
      await pool.query(
        `DELETE FROM conversations
         WHERE user_id = $1 AND agent_id = $2 AND conversation_id = $3`,
        [userId, agentId, conversationId]
      );
    } catch (error) {
      logger.error('Failed to delete conversation', { error });
    }
  }
}

// Initialize database
export async function initDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS conversations (
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      agent_id VARCHAR(255) NOT NULL,
      conversation_id VARCHAR(255) NOT NULL,
      messages JSONB NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(user_id, agent_id, conversation_id)
    )
  `);

  logger.info('Database initialized');
}
```

### Cache Service

```typescript
// src/services/cache.ts
import NodeCache from 'node-cache';
import crypto from 'crypto';

const cache = new NodeCache({
  stdTTL: 3600,  // 1 hour default
  checkperiod: 600,  // Check for expired entries every 10 minutes
});

export class CacheService {
  static generateKey(message: string, context?: any): string {
    const data = `${message}:${JSON.stringify(context || {})}`;
    return crypto.createHash('md5').update(data).digest('hex');
  }

  static async get(key: string): Promise<any | null> {
    return cache.get(key) || null;
  }

  static async set(key: string, value: any, ttl?: number): Promise<void> {
    cache.set(key, value, ttl || 3600);
  }

  static async delete(key: string): Promise<void> {
    cache.del(key);
  }

  static async clear(): Promise<void> {
    cache.flushAll();
  }
}
```

### Logger

```typescript
// src/utils/logger.ts
import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}
```

### Error Handling

```typescript
// src/utils/errors.ts
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { logger } from '../utils/logger';

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
  });

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
    });
  }

  res.status(500).json({
    error: 'Internal server error',
  });
};
```

### Environment Variables

```bash
# .env

# Server
PORT=3001
NODE_ENV=production
ALLOWED_ORIGINS=https://yourapp.com,https://www.yourapp.com

# AI Provider
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/chatdb

# Security
JWT_SECRET=your-super-secret-key

# Logging
LOG_LEVEL=info
```

### TypeScript Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

### Running the Backend

```bash
# Install dependencies
npm install

# Run in development
npm run dev

# Build for production
npm run build

# Run in production
npm start
```

### Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3001

CMD ["node", "dist/server.js"]
```

```bash
# Build and run
docker build -t inappai-backend .
docker run -p 3001:3001 --env-file .env inappai-backend
```

## Next Steps

- [Backend Integration](./backend-integration.md) - Integration guide
- [Security](./security.md) - Secure your backend
- [Performance](./performance.md) - Optimize performance
