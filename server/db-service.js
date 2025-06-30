// Database service for the server (CommonJS version)
const { Pool } = require('pg');
require('dotenv').config({ path: '../.env' });

console.log('🔍 server-db.js: Loading database configuration:', {
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  database: process.env.PG_DATABASE,
  user: process.env.PG_USER,
  ssl: process.env.PG_SSL ? 'enabled' : 'disabled',
});

// Create a connection pool
const pool = new Pool({
  host: process.env.PG_HOST,
  port: parseInt(process.env.PG_PORT || '5432', 10),
  database: process.env.PG_DATABASE,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  ssl: process.env.PG_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

// Test database connection
const testConnection = async () => {
  console.log('🔍 server-db.js: Testing database connection...');
  let client = null;
  try {
    client = await pool.connect();
    console.log('🔍 server-db.js: Got client from pool');
    const result = await client.query('SELECT NOW()');
    console.log('🔍 server-db.js: Database connection successful:', result.rows[0]);
    return true;
  } catch (error) {
    console.error('❌ server-db.js: Database connection error:', error);
    // Log detailed error for debugging
    if (error instanceof Error) {
      console.error('❌ server-db.js: Error message:', error.message);
      console.error('❌ server-db.js: Error stack:', error.stack);
      
      // Check for specific PostgreSQL error codes
      if (error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT') {
        throw new Error(`Database server not reachable: ${process.env.PG_HOST}. Check network connection and server status.`);
      } else if (error.code === 'ECONNREFUSED') {
        throw new Error(`Connection refused by database server: ${process.env.PG_HOST}. Check if PostgreSQL is running and port ${process.env.PG_PORT} is open.`);
      } else if (error.code === '28P01') {
        throw new Error('Authentication failed. Check database username and password.');
      } else if (error.code === '3D000') {
        throw new Error(`Database "${process.env.PG_DATABASE}" does not exist.`);
      }
    }
    
    // Re-throw the error with a more descriptive message
    throw new Error(`Database connection failed: ${error.message || 'Unknown error'}`);
  } finally {
    if (client) {
      console.log('🔍 server-db.js: Releasing client back to pool');
      client.release();
    }
  }
};

// Get all AI tools
const getAllTools = async () => {
  let client = null;
  try {
    client = await pool.connect();
    
    // Get all tools
    const toolsResult = await client.query(`
      SELECT * FROM ai_tools 
      ORDER BY name
    `);
    
    // For each tool, get its capabilities
    const tools = await Promise.all(
      toolsResult.rows.map(async (toolRow) => {
        const capabilitiesResult = await client.query(`
          SELECT capability FROM ai_tool_capabilities 
          WHERE tool_id = $1
        `, [toolRow.id]);
        
        return {
          id: toolRow.id,
          name: toolRow.name,
          description: toolRow.description,
          category: toolRow.category,
          icon: toolRow.icon || undefined,
          capabilities: capabilitiesResult.rows.map(row => row.capability),
          complexity: toolRow.complexity
        };
      })
    );
    
    return tools;
  } catch (error) {
    console.error('Error fetching AI tools:', error);
    return [];
  } finally {
    if (client) client.release();
  }
};

// Get all AI use cases
const getAllUseCases = async () => {
  let client = null;
  try {
    client = await pool.connect();
    
    // Get all use cases
    const useCasesResult = await client.query(`
      SELECT * FROM ai_use_cases 
      ORDER BY difficulty, title
    `);
    
    // For each use case, get related data
    const useCases = await Promise.all(
      useCasesResult.rows.map(async (useCaseRow) => {
        // Get required tools
        const requiredToolsResult = await client.query(`
          SELECT tool_id FROM ai_use_case_required_tools 
          WHERE use_case_id = $1
        `, [useCaseRow.id]);
        
        // Get optional tools
        const optionalToolsResult = await client.query(`
          SELECT tool_id FROM ai_use_case_optional_tools 
          WHERE use_case_id = $1
        `, [useCaseRow.id]);
        
        // Get hints
        const hintsResult = await client.query(`
          SELECT hint_text FROM ai_use_case_hints 
          WHERE use_case_id = $1
          ORDER BY hint_order
        `, [useCaseRow.id]);
        
        // Get solution
        const solutionResult = await client.query(`
          SELECT tool_id FROM ai_use_case_solution_tools 
          WHERE use_case_id = $1
          ORDER BY solution_order
        `, [useCaseRow.id]);
        
        return {
          id: useCaseRow.id,
          title: useCaseRow.title,
          description: useCaseRow.description,
          difficulty: useCaseRow.difficulty,
          requiredTools: requiredToolsResult.rows.map(row => row.tool_id),
          optionalTools: optionalToolsResult.rows.map(row => row.tool_id),
          hints: hintsResult.rows.map(row => row.hint_text),
          solution: solutionResult.rows.map(row => row.tool_id)
        };
      })
    );
    
    return useCases;
  } catch (error) {
    console.error('Error fetching AI use cases:', error);
    return [];
  } finally {
    if (client) client.release();
  }
};

// Get a specific use case by ID
const getUseCaseById = async (id) => {
  let client = null;
  try {
    client = await pool.connect();
    
    // Get the use case
    const useCaseResult = await client.query(`
      SELECT * FROM ai_use_cases 
      WHERE id = $1
    `, [id]);
    
    if (useCaseResult.rows.length === 0) {
      return null;
    }
    
    const useCaseRow = useCaseResult.rows[0];
    
    // Get required tools
    const requiredToolsResult = await client.query(`
      SELECT tool_id FROM ai_use_case_required_tools 
      WHERE use_case_id = $1
    `, [id]);
    
    // Get optional tools
    const optionalToolsResult = await client.query(`
      SELECT tool_id FROM ai_use_case_optional_tools 
      WHERE use_case_id = $1
    `, [id]);
    
    // Get hints
    const hintsResult = await client.query(`
      SELECT hint_text FROM ai_use_case_hints 
      WHERE use_case_id = $1
      ORDER BY hint_order
    `, [id]);
    
    // Get solution
    const solutionResult = await client.query(`
      SELECT tool_id FROM ai_use_case_solution_tools 
      WHERE use_case_id = $1
      ORDER BY solution_order
    `, [id]);
    
    return {
      id: useCaseRow.id,
      title: useCaseRow.title,
      description: useCaseRow.description,
      difficulty: useCaseRow.difficulty,
      requiredTools: requiredToolsResult.rows.map(row => row.tool_id),
      optionalTools: optionalToolsResult.rows.map(row => row.tool_id),
      hints: hintsResult.rows.map(row => row.hint_text),
      solution: solutionResult.rows.map(row => row.tool_id)
    };
  } catch (error) {
    console.error(`Error fetching use case with ID ${id}:`, error);
    return null;
  } finally {
    if (client) client.release();
  }
};

// Save user progress
const saveUserProgress = async (userId, useCaseId, score, hintsUsed, completed) => {
  let client = null;
  try {
    client = await pool.connect();
    
    await client.query(`
      INSERT INTO user_progress (user_id, use_case_id, score, hints_used, completed, last_played)
      VALUES ($1, $2, $3, $4, $5, NOW())
      ON CONFLICT (user_id, use_case_id) 
      DO UPDATE SET 
        score = GREATEST(user_progress.score, $3), 
        hints_used = $4, 
        completed = $5, 
        last_played = NOW()
    `, [userId, useCaseId, score, hintsUsed, completed]);
    
    return true;
  } catch (error) {
    console.error('Error saving user progress:', error);
    return false;
  } finally {
    if (client) client.release();
  }
};

// Get user progress
const getUserProgress = async (userId) => {
  let client = null;
  try {
    client = await pool.connect();
    
    const result = await client.query(`
      SELECT 
        up.use_case_id, 
        uc.title, 
        up.score, 
        up.hints_used, 
        up.completed, 
        up.last_played
      FROM user_progress up
      JOIN ai_use_cases uc ON up.use_case_id = uc.id
      WHERE up.user_id = $1
      ORDER BY up.last_played DESC
    `, [userId]);
    
    return result.rows;
  } catch (error) {
    console.error('Error fetching user progress:', error);
    return [];
  } finally {
    if (client) client.release();
  }
};

module.exports = {
  testConnection,
  getAllTools,
  getAllUseCases,
  getUseCaseById,
  saveUserProgress,
  getUserProgress
};
