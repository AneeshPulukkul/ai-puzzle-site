// API Client Service for Browser Environment
import { AI_TOOLS, AI_USE_CASES } from '../data/mockData';
import type { AITool, AIUseCase } from '../types';

// Base API URL - will default to mock in development but can be configured
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Determine if the API should be used or mock data
const USE_API = import.meta.env.VITE_USE_API === 'true';

// Utility function to fetch from API with timeout
const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeout = 5000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

// API client service that can use real API or fall back to mock data
const dbServiceBrowser = {
  // Test connection to the API
  testConnection: async (): Promise<boolean> => {
    console.log(`🔍 dbServiceBrowser: Testing connection to ${USE_API ? 'API' : 'mock data'}...`);
    
    if (!USE_API) {
      console.log('🔍 dbServiceBrowser: API disabled by config, using mock data');
      return false;
    }
    
    try {
      // First, check if the API server is running
      try {
        const healthResponse = await fetchWithTimeout(`${API_BASE_URL}/health`);
        console.log('🔍 dbServiceBrowser: API health check response:', healthResponse);
        if (healthResponse.status !== 'ok') {
          throw new Error('API server is not healthy');
        }
      } catch (error) {
        console.error('❌ dbServiceBrowser: API server not available:', error);
        throw new Error('API server is not running or not reachable');
      }
      
      // Then, check the database connection
      const dbResponse = await fetchWithTimeout(`${API_BASE_URL}/test-connection`);
      console.log('🔍 dbServiceBrowser: Database connection test response:', dbResponse);
      
      return dbResponse.connected === true;
    } catch (error) {
      // Provide detailed error message based on the error type
      let errorMessage = 'API connection error';
      
      if (error instanceof Error) {
        if (error.message.includes('API server is not running')) {
          errorMessage = 'API server is not running. Please start the server.';
        } else if (error.message.includes('Failed to fetch')) {
          errorMessage = 'Network error. Unable to reach the API server.';
        } else if (error instanceof Response && error.status === 500) {
          // For errors from the API server
          const data = await error.json();
          if (data.category === 'network') {
            errorMessage = 'Database server is not reachable. Check database server status.';
          } else if (data.category === 'auth') {
            errorMessage = 'Database authentication failed. Check credentials.';
          } else if (data.category === 'database') {
            errorMessage = 'Database does not exist. Check database name.';
          } else {
            errorMessage = data.details || 'Unknown database error';
          }
        }
      }
      
      console.error(`❌ dbServiceBrowser: ${errorMessage}`, error);
      throw new Error(errorMessage);
    }
  },

  // Get all AI tools
  getAllTools: async (): Promise<AITool[]> => {
    if (!USE_API) {
      console.log('🔍 dbServiceBrowser: Using mock data for tools');
      return AI_TOOLS;
    }
    
    try {
      console.log('🔍 dbServiceBrowser: Fetching tools from API...');
      return await fetchWithTimeout(`${API_BASE_URL}/tools`);
    } catch (error) {
      console.error('❌ dbServiceBrowser: Error fetching tools from API:', error);
      console.log('🔍 dbServiceBrowser: Falling back to mock data for tools');
      return AI_TOOLS;
    }
  },

  // Get all AI use cases
  getAllUseCases: async (): Promise<AIUseCase[]> => {
    if (!USE_API) {
      console.log('🔍 dbServiceBrowser: Using mock data for use cases');
      return AI_USE_CASES;
    }
    
    try {
      console.log('🔍 dbServiceBrowser: Fetching use cases from API...');
      return await fetchWithTimeout(`${API_BASE_URL}/use-cases`);
    } catch (error) {
      console.error('❌ dbServiceBrowser: Error fetching use cases from API:', error);
      console.log('🔍 dbServiceBrowser: Falling back to mock data for use cases');
      return AI_USE_CASES;
    }
  },

  // Get a use case by ID
  getUseCaseById: async (id: string): Promise<AIUseCase | null> => {
    if (!USE_API) {
      console.log('🔍 dbServiceBrowser: Using mock data for use case by ID:', id);
      const useCase = AI_USE_CASES.find(uc => uc.id === id);
      return useCase || null;
    }
    
    try {
      console.log('🔍 dbServiceBrowser: Fetching use case by ID from API:', id);
      return await fetchWithTimeout(`${API_BASE_URL}/use-cases/${id}`);
    } catch (error) {
      console.error(`❌ dbServiceBrowser: Error fetching use case with ID ${id} from API:`, error);
      console.log('🔍 dbServiceBrowser: Falling back to mock data for use case');
      const useCase = AI_USE_CASES.find(uc => uc.id === id);
      return useCase || null;
    }
  },

  // Save user progress
  saveUserProgress: async (
    userId: string, 
    useCaseId: string, 
    score: number, 
    hintsUsed: number, 
    completed: boolean
  ): Promise<boolean> => {
    if (!USE_API) {
      console.log('🔍 dbServiceBrowser: Mocking save progress:', { userId, useCaseId, score, hintsUsed, completed });
      return true;
    }
    
    try {
      console.log('🔍 dbServiceBrowser: Saving user progress to API...');
      const response = await fetchWithTimeout(`${API_BASE_URL}/user-progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, useCaseId, score, hintsUsed, completed })
      });
      return response.success;
    } catch (error) {
      console.error('❌ dbServiceBrowser: Error saving user progress to API:', error);
      return false;
    }
  },

  // Get user progress
  getUserProgress: async (userId: string): Promise<any[]> => {
    if (!USE_API) {
      console.log('🔍 dbServiceBrowser: Mocking get user progress for user:', userId);
      return [];
    }
    
    try {
      console.log('🔍 dbServiceBrowser: Fetching user progress from API...');
      return await fetchWithTimeout(`${API_BASE_URL}/user-progress/${userId}`);
    } catch (error) {
      console.error(`❌ dbServiceBrowser: Error fetching user progress for user ${userId} from API:`, error);
      return [];
    }
  }
};

export default dbServiceBrowser;
