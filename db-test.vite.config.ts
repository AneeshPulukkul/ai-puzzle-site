// Database test API for Vite dev server
import { defineConfig } from 'vite';
import { Pool } from 'pg';
import dbConfig from './src/database/config';

// Create a database connection pool
const pool = new Pool({
  host: dbConfig.host,
  port: dbConfig.port,
  database: dbConfig.database,
  user: dbConfig.user,
  password: dbConfig.password,
  ssl: dbConfig.ssl ? { rejectUnauthorized: false } : false,
});

export default defineConfig({
  plugins: [
    {
      name: 'db-test-api',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          // API endpoint to test database connection
          if (req.url === '/api/test-connection') {
            console.log('API: Testing database connection...');
            let client;
            try {
              client = await pool.connect();
              console.log('API: Got client from pool');
              
              // Test connection
              const result = await client.query('SELECT NOW() as server_time');
              console.log('API: Database connection successful');
              
              // Get tables
              const tablesResult = await client.query(`
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
              `);
              
              const tables = tablesResult.rows.map(row => row.table_name);
              
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({
                success: true,
                serverTime: result.rows[0].server_time,
                tables
              }));
            } catch (error) {
              console.error('API: Database connection error:', error);
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({
                success: false,
                error: error.message
              }));
            } finally {
              if (client) client.release();
            }
            return;
          }
          
          // API endpoint to get database configuration (excluding password)
          if (req.url === '/api/db-config') {
            const safeConfig = {
              host: dbConfig.host,
              port: dbConfig.port,
              database: dbConfig.database,
              user: dbConfig.user,
              password: '********', // Don't expose the real password
              ssl: dbConfig.ssl
            };
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(safeConfig));
            return;
          }
          
          next();
        });
      }
    }
  ]
});
