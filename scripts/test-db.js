// Script to test database connection and set up schema
import 'dotenv/config';
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current file directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get config from environment variables
const dbConfig = {
  host: process.env.PG_HOST || 'localhost',
  port: parseInt(process.env.PG_PORT || '5432', 10),
  database: process.env.PG_DATABASE || 'ai_puzzle_db',
  user: process.env.PG_USER || 'postgres',
  password: process.env.PG_PASSWORD || '',
  ssl: process.env.PG_SSL === 'true' ? { rejectUnauthorized: false } : false
};

console.log('Testing database connection with the following configuration:');
console.log({
  host: dbConfig.host,
  port: dbConfig.port,
  database: dbConfig.database,
  user: dbConfig.user,
  ssl: dbConfig.ssl ? 'enabled' : 'disabled'
});

const pool = new Pool({
  host: dbConfig.host,
  port: dbConfig.port,
  database: dbConfig.database,
  user: dbConfig.user,
  password: dbConfig.password,
  ssl: dbConfig.ssl
});

async function testConnection() {
  let client;
  try {
    console.log('Attempting to connect to database...');
    client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('✅ Database connection successful!');
    console.log('Server time:', result.rows[0].now);
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  } finally {
    if (client) client.release();
  }
}

async function setupSchema() {
  let client;
  try {
    console.log('\nSetting up database schema...');
    
    // Read schema.sql file
    const schemaPath = path.resolve(__dirname, '../src/database/schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    
    client = await pool.connect();
    await client.query(schemaSQL);
    console.log('✅ Schema created successfully!');
    
    // Check if tables were created
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log('\nTables created:');
    tablesResult.rows.forEach(row => {
      console.log(`- ${row.table_name}`);
    });
    
    return true;
  } catch (error) {
    console.error('❌ Schema setup failed:', error.message);
    return false;
  } finally {
    if (client) client.release();
  }
}

async function seedData() {
  let client;
  try {
    console.log('\nSeeding database with initial data...');
    
    // Read seed.sql file
    const seedPath = path.resolve(__dirname, '../src/database/seed.sql');
    const seedSQL = fs.readFileSync(seedPath, 'utf8');
    
    client = await pool.connect();
    await client.query(seedSQL);
    console.log('✅ Data seeded successfully!');
    
    // Check data in tables
    console.log('\nData summary:');
    const tables = ['ai_tools', 'ai_tool_capabilities', 'ai_use_cases', 'ai_use_case_hints', 
                    'ai_use_case_required_tools', 'ai_use_case_optional_tools', 'ai_use_case_solution_tools'];
    
    for (const table of tables) {
      try {
        const countResult = await client.query(`SELECT COUNT(*) FROM ${table}`);
        console.log(`- ${table}: ${countResult.rows[0].count} records`);
      } catch (error) {
        console.log(`- ${table}: Error counting records`);
      }
    }
    
    return true;
  } catch (error) {
    console.error('❌ Data seeding failed:', error.message);
    return false;
  } finally {
    if (client) client.release();
  }
}

async function main() {
  try {
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error('\n❌ Cannot proceed without database connection. Please check your configuration.');
      process.exit(1);
    }
    
    // Ask user if they want to set up schema
    console.log('\n⚠️ Setting up schema will create or replace database tables.');
    console.log('Do you want to proceed with setting up the schema? (y/n)');
    
    // Simulate user input for this script
    const answer = 'y'; // You can change this to prompt for input if needed
    
    if (answer.toLowerCase() === 'y') {
      const schemaSetup = await setupSchema();
      if (schemaSetup) {
        const dataSeed = await seedData();
      }
    } else {
      console.log('Schema setup skipped.');
    }
    
    console.log('\nDatabase setup process completed.');
  } catch (error) {
    console.error('An unexpected error occurred:', error);
  } finally {
    await pool.end();
  }
}

main();
