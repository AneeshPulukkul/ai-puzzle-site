import { useState, useEffect } from 'react'
import './App.css'
import type { GameState } from './types'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import AIShowcase from './components/AIShowcase/AIShowcase'
import AIPuzzle from './components/AIPuzzle/AIPuzzle'
import { DatabaseProvider, useDatabase } from './hooks/useDatabase'

function AppContent() {
  console.log('🔍 AppContent: Component rendering');
  const { isLoading, error, useMockData } = useDatabase();
  const [activeTab, setActiveTab] = useState<'showcase' | 'puzzle'>('showcase');
  const [gameState, setGameState] = useState<GameState>({
    currentUseCase: null,
    selectedTools: [],
    score: 0,
    hintsUsed: 0,
    puzzlePieces: [],
    isComplete: false
  });

  useEffect(() => {
    console.log('🔍 AppContent: useEffect - Component mounted');
    console.log('🔍 AppContent: State -', { isLoading, error, useMockData });
  }, [isLoading, error, useMockData]);

  // Access database context at the component level
  const { getUseCaseById } = useDatabase();
  
  const startNewGame = async (useCaseId: string) => {
    console.log('🔍 AppContent: startNewGame called with ID:', useCaseId);
    
    try {
      const useCase = await getUseCaseById(useCaseId);
      console.log('🔍 AppContent: useCase retrieved:', useCase);
      if (!useCase) {
        console.error('🔍 AppContent: Use case not found:', useCaseId);
        return;
      }

      setGameState({
        currentUseCase: useCase,
        selectedTools: [],
        score: 0,
        hintsUsed: 0,
        puzzlePieces: [],
        isComplete: false
      });
      setActiveTab('puzzle');
    } catch (error) {
      console.error('🔍 AppContent: Error starting new game:', error);
    }
  };

  const resetGame = () => {
    setGameState({
      currentUseCase: null,
      selectedTools: [],
      score: 0,
      hintsUsed: 0,
      puzzlePieces: [],
      isComplete: false
    });
    setActiveTab('showcase');
  };

  // Show loading state
  if (isLoading) {
    console.log('🔍 AppContent: Rendering loading state');
    return (
      <div className="app-container">
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="main-content">
          <div className="loading-state">
            <h2>Loading AI Puzzle Data...</h2>
            <div className="loading-spinner"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Main application rendering
  console.log('🔍 AppContent: Rendering main content');
  return (
    <div className="app-container">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="main-content">
        {/* Show error state as a banner if there's an error but using mock data */}
        {error && useMockData && (
          <div className="warning-banner">
            <p>
              <strong>⚠️ Database connection error:</strong> {error}
            </p>
            <p>Using mock data instead. Some features may be limited.</p>
          </div>
        )}
        
        {/* Show error state as full page if there's an error and not using mock data */}
        {error && !useMockData ? (
          <div className="error-state">
            <h2>Error Loading Data</h2>
            <p>{error}</p>
            <p>Please check your database connection and try again.</p>
          </div>
        ) : (
          // Render the main content if no fatal error
          activeTab === 'showcase' ? (
            <AIShowcase startNewGame={startNewGame} />
          ) : (
            <AIPuzzle gameState={gameState} setGameState={setGameState} resetGame={resetGame} />
          )
        )}
      </main>
      <Footer />
    </div>
  )
}

function App() {
  console.log('🔍 App: Rendering root component');
  return (
    <DatabaseProvider>
      <AppContent />
      {import.meta.env.DEV && <DebugPanel />}
    </DatabaseProvider>
  )
}

import DebugPanel from './components/Debug/DebugPanel';

export default App
