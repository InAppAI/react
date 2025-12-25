#!/usr/bin/env node
/**
 * Switch to using the local workspace package
 * Used for local development
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJsonPath = join(__dirname, '..', 'package.json');

const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

// Change to workspace version
packageJson.dependencies['@inappai/react'] = '*';

writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');

console.log('✅ Switched to local workspace package: @inappai/react@*');
console.log('Run "npm install" to link local package');
