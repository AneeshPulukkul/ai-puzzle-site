import { Pool } from 'pg';
import type { PoolClient } from 'pg';
import dbConfig from './config';
import type { AITool, AIUseCase } from '../types';

console.log('🔍 db.ts: Loading database configuration:', {
  host: dbConfig.host,
  port: dbConfig.port,
  database: dbConfig.database,
  user: dbConfig.user,
  ssl: dbConfig.ssl ? 'enabled' : 'disabled',
});

// Create a connection pool
const pool = new Pool({
  host: dbConfig.host,
  port: dbConfig.port,
  database: dbConfig.database,
  user: dbConfig.user,
  password: dbConfig.password,
  ssl: dbConfig.ssl ? { rejectUnauthorized: false } : false,
});

// Test database connection
export const testConnection = async (): Promise<boolean> => {
  console.log('🔍 db.ts: Testing database connection...');
  let client: PoolClient | null = null;
  try {
    client = await pool.connect();
    console.log('🔍 db.ts: Got client from pool');
    const result = await client.query('SELECT NOW()');
    console.log('🔍 db.ts: Database connection successful:', result.rows[0]);
    return true;
  } catch (error) {
    console.error('❌ db.ts: Database connection error:', error);
    // Log detailed error for debugging
    if (error instanceof Error) {
      console.error('❌ db.ts: Error message:', error.message);
      console.error('❌ db.ts: Error stack:', error.stack);
    }
    return false;
  } finally {
    if (client) {
      console.log('🔍 db.ts: Releasing client back to pool');
      client.release();
    }
  }
};

// Get all AI tools
export const getAllTools = async (): Promise<AITool[]> => {
  let client: PoolClient | null = null;
  try {
    client = await pool.connect();
    
    // Get all tools
    const toolsResult = await client.query(`
      SELECT * FROM ai_tools 
      ORDER BY name
    `);
    
    // For each tool, get its capabilities
    const tools: AITool[] = await Promise.all(
      toolsResult.rows.map(async (toolRow) => {
        const capabilitiesResult = await client!.query(`
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
export const getAllUseCases = async (): Promise<AIUseCase[]> => {
  let client: PoolClient | null = null;
  try {
    client = await pool.connect();
    
    // Get all use cases
    const useCasesResult = await client.query(`
      SELECT * FROM ai_use_cases 
      ORDER BY difficulty, title
    `);
    
    // For each use case, get related data
    const useCases: AIUseCase[] = await Promise.all(
      useCasesResult.rows.map(async (useCaseRow) => {
        // Get required tools
        const requiredToolsResult = await client!.query(`
          SELECT tool_id FROM ai_use_case_required_tools 
          WHERE use_case_id = $1
        `, [useCaseRow.id]);
        
        // Get optional tools
        const optionalToolsResult = await client!.query(`
          SELECT tool_id FROM ai_use_case_optional_tools 
          WHERE use_case_id = $1
        `, [useCaseRow.id]);
        
        // Get hints
        const hintsResult = await client!.query(`
          SELECT hint_text FROM ai_use_case_hints 
          WHERE use_case_id = $1
          ORDER BY hint_order
        `, [useCaseRow.id]);
        
        // Get solution
        const solutionResult = await client!.query(`
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
export const getUseCaseById = async (id: string): Promise<AIUseCase | null> => {
  let client: PoolClient | null = null;
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
export const saveUserProgress = async (
  userId: string, 
  useCaseId: string, 
  score: number, 
  hintsUsed: number, 
  completed: boolean
): Promise<boolean> => {
  let client: PoolClient | null = null;
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
export const getUserProgress = async (userId: string): Promise<any[]> => {
  let client: PoolClient | null = null;
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

export default {
  testConnection,
  getAllTools,
  getAllUseCases,
  getUseCaseById,
  saveUserProgress,
  getUserProgress
};
