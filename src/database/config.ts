// Database configuration for Azure PostgreSQL
import 'dotenv/config';

export interface DbConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  ssl: boolean;
}

// Log environment variables for debugging (without exposing sensitive info)
console.log('🔍 config.ts: Environment variables check:');
console.log('🔍 config.ts: process.env.PG_HOST exists:', !!process.env.PG_HOST);
console.log('🔍 config.ts: process.env.PG_PORT exists:', !!process.env.PG_PORT);
console.log('🔍 config.ts: process.env.PG_DATABASE exists:', !!process.env.PG_DATABASE);
console.log('🔍 config.ts: process.env.PG_USER exists:', !!process.env.PG_USER);
console.log('🔍 config.ts: process.env.PG_PASSWORD exists:', !!process.env.PG_PASSWORD);
console.log('🔍 config.ts: process.env.PG_SSL exists:', !!process.env.PG_SSL);

// Configuration from environment variables
const dbConfig: DbConfig = {
  host: process.env.PG_HOST || 'localhost',
  port: parseInt(process.env.PG_PORT || '5432', 10),
  database: process.env.PG_DATABASE || 'ai_puzzle_db',
  user: process.env.PG_USER || 'postgres',
  password: process.env.PG_PASSWORD || '',
  ssl: process.env.PG_SSL === 'true' // Enable SSL if explicitly set to 'true'
};

console.log('Database configuration loaded (host redacted):', {
  ...dbConfig,
  password: '***REDACTED***' // Don't log the password
});

export default dbConfig;
