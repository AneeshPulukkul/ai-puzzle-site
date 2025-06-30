// Express server for handling database operations
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// Import the CommonJS database service instead of the ESM one
const dbService = require('./db-service');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.API_PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Test database connection
app.get('/api/test-connection', async (req, res) => {
  try {
    const isConnected = await dbService.testConnection();
    res.json({ 
      connected: isConnected,
      message: 'Database connection successful'
    });
  } catch (error) {
    console.error('Error testing connection:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Determine the error category for better frontend error handling
    let errorCategory = 'unknown';
    if (errorMessage.includes('not reachable') || errorMessage.includes('refused')) {
      errorCategory = 'network';
    } else if (errorMessage.includes('Authentication failed')) {
      errorCategory = 'auth';
    } else if (errorMessage.includes('does not exist')) {
      errorCategory = 'database';
    }
    
    res.status(500).json({ 
      error: 'Failed to connect to database', 
      details: errorMessage,
      category: errorCategory
    });
  }
});

// Get all tools
app.get('/api/tools', async (req, res) => {
  try {
    const tools = await dbService.getAllTools();
    res.json(tools);
  } catch (error) {
    console.error('Error fetching tools:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: 'Failed to fetch tools', details: errorMessage });
  }
});

// Get all use cases
app.get('/api/use-cases', async (req, res) => {
  try {
    const useCases = await dbService.getAllUseCases();
    res.json(useCases);
  } catch (error) {
    console.error('Error fetching use cases:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: 'Failed to fetch use cases', details: errorMessage });
  }
});

// Get use case by ID
app.get('/api/use-cases/:id', async (req, res) => {
  try {
    const useCase = await dbService.getUseCaseById(req.params.id);
    if (!useCase) {
      return res.status(404).json({ error: 'Use case not found' });
    }
    res.json(useCase);
  } catch (error) {
    console.error(`Error fetching use case with ID ${req.params.id}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: 'Failed to fetch use case', details: errorMessage });
  }
});

// Save user progress
app.post('/api/user-progress', async (req, res) => {
  try {
    const { userId, useCaseId, score, hintsUsed, completed } = req.body;
    const result = await dbService.saveUserProgress(userId, useCaseId, score, hintsUsed, completed);
    res.json({ success: result });
  } catch (error) {
    console.error('Error saving user progress:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: 'Failed to save user progress', details: errorMessage });
  }
});

// Get user progress
app.get('/api/user-progress/:userId', async (req, res) => {
  try {
    const progress = await dbService.getUserProgress(req.params.userId);
    res.json(progress);
  } catch (error) {
    console.error(`Error fetching user progress for user ${req.params.userId}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: 'Failed to fetch user progress', details: errorMessage });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});

export default app;
