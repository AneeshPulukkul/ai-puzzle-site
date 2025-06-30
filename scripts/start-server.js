#!/usr/bin/env node
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Path to the server directory
const serverDir = path.join(__dirname, '..', 'server');

// Check if the server directory exists
if (!fs.existsSync(serverDir)) {
  console.error('Server directory not found!');
  process.exit(1);
}

// Check if node_modules exists in the server directory
if (!fs.existsSync(path.join(serverDir, 'node_modules'))) {
  console.log('Installing server dependencies...');
  execSync('npm install', { cwd: serverDir, stdio: 'inherit' });
}

// Run the server
console.log('Starting API server...');
try {
  execSync('npm run dev', { cwd: serverDir, stdio: 'inherit' });
} catch (error) {
  console.error('Failed to start server:', error);
  process.exit(1);
}
