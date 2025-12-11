#!/usr/bin/env node
/**
 * Switch to using the published NPM package
 * Used for GitHub Pages deployment
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJsonPath = join(__dirname, '..', 'package.json');

const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

// Change from workspace ("*") to latest NPM version
packageJson.dependencies['@inappai/react'] = '^1.0.0';

writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');

console.log('✅ Switched to NPM package: @inappai/react@^1.0.0');
console.log('Run "npm install" to install from NPM registry');
