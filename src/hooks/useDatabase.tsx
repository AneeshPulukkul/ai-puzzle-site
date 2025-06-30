import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import dbServiceBrowser from '../database/db-browser';
import { AI_TOOLS, AI_USE_CASES } from '../data/mockData';
import type { AITool, AIUseCase } from '../types';

interface DatabaseContextType {
  isLoading: boolean;
  error: string | null;
  tools: AITool[];
  useCases: AIUseCase[];
  getUseCaseById: (id: string) => Promise<AIUseCase | null>;
  useMockData: boolean;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

// Use the browser-compatible service for browser environments
const dbService = dbServiceBrowser;

export const DatabaseProvider = ({ children }: { children: ReactNode }) => {
  console.log('🔍 DatabaseProvider initializing...');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tools, setTools] = useState<AITool[]>([]);
  const [useCases, setUseCases] = useState<AIUseCase[]>([]);
  const [useMockData, setUseMockData] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      console.log('🔍 useDatabase: Starting to load data...');
      try {
        // In the browser, we'll use the API endpoint or mock data
        console.log('🔍 useDatabase: Testing connection to API...');
        
        try {
          const isConnected = await dbService.testConnection();
          console.log('🔍 useDatabase: API connection test result:', isConnected);
          
          if (!isConnected) {
            console.warn('⚠️ API connection failed, using mock data as fallback');
            setUseMockData(true);
            setTools(AI_TOOLS);
            setUseCases(AI_USE_CASES);
            setError('Could not connect to the database. Using mock data instead.');
            setIsLoading(false);
            return;
          }
        } catch (error) {
          // Handle specific error message from the enhanced error handling
          const errorMessage = error instanceof Error 
            ? error.message 
            : 'Unknown connection error';
            
          console.error('❌ Connection error:', errorMessage);
          setUseMockData(true);
          setTools(AI_TOOLS);
          setUseCases(AI_USE_CASES);
          setError(errorMessage);
          setIsLoading(false);
          return;
        }

        // In case API is working in future, we'll keep this logic
        console.log('🔍 useDatabase: Loading tools and use cases from API...');
        const [toolsData, useCasesData] = await Promise.all([
          dbService.getAllTools(),
          dbService.getAllUseCases()
        ]);
        
        console.log('🔍 useDatabase: Data loaded successfully!');
        console.log('🔍 useDatabase: Tools count:', toolsData.length);
        console.log('🔍 useDatabase: Use cases count:', useCasesData.length);

        setTools(toolsData);
        setUseCases(useCasesData);
        setIsLoading(false);
      } catch (err) {
        console.error('❌ Data loading error:', err);
        console.warn('⚠️ Falling back to mock data');
        
        // Use mock data as fallback
        setUseMockData(true);
        setTools(AI_TOOLS);
        setUseCases(AI_USE_CASES);
        
        // Still show the error for debugging purposes
        const errorMessage = err instanceof Error ? err.message : 'Unknown data loading error';
        console.error('❌ Detailed error:', errorMessage);
        setError(errorMessage);
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const getUseCaseById = async (id: string): Promise<AIUseCase | null> => {
    console.log('🔍 useDatabase: Getting use case by ID:', id);
    try {
      if (useMockData) {
        console.log('🔍 useDatabase: Using mock data for getUseCaseById');
        // Use mock data if API connection failed
        const useCase = AI_USE_CASES.find(uc => uc.id === id);
        return useCase || null;
      }
      console.log('🔍 useDatabase: Fetching use case from API');
      return await dbService.getUseCaseById(id);
    } catch (err) {
      console.error('❌ Error fetching use case:', err);
      // Fallback to mock data
      const useCase = AI_USE_CASES.find(uc => uc.id === id);
      return useCase || null;
    }
  };

  const value = {
    isLoading,
    error,
    tools,
    useCases,
    getUseCaseById,
    useMockData
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = (): DatabaseContextType => {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};

export default useDatabase;
