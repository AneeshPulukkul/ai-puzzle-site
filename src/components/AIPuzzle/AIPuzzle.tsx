import { useState, useEffect } from 'react';
import type { GameState, AITool, PuzzlePiece } from '../../types';
import { useDatabase } from '../../hooks/useDatabase';
import './AIPuzzle.css';

interface AIPuzzleProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  resetGame: () => void;
}

const AIPuzzle = ({ gameState, setGameState, resetGame }: AIPuzzleProps) => {
  const { tools } = useDatabase();
  const [draggedTool, setDraggedTool] = useState<string | null>(null);
  const [availableTools, setAvailableTools] = useState<AITool[]>([]);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Initialize the puzzle with available tools
  useEffect(() => {
    if (!gameState.currentUseCase) return;
    
    // Get all required and optional tools for this use case
    const toolIds = [
      ...gameState.currentUseCase.requiredTools,
      ...gameState.currentUseCase.optionalTools
    ];
    
    // Add a few more tools as red herrings
    const otherTools = tools
      .filter(tool => !toolIds.includes(tool.id))
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    
    // Combine all tools and shuffle
    const allTools = [
      ...tools.filter(tool => toolIds.includes(tool.id)),
      ...otherTools
    ].sort(() => 0.5 - Math.random());
    
    setAvailableTools(allTools);
    
    // Initialize puzzle pieces
    const pieces: PuzzlePiece[] = allTools.map(tool => ({
      id: `piece-${tool.id}`,
      toolId: tool.id,
      position: { x: 0, y: 0 },
      isPlaced: false
    }));
    
    setGameState(prev => ({
      ...prev,
      puzzlePieces: pieces
    }));
  }, [gameState.currentUseCase, setGameState, tools]);

  const handleDragStart = (toolId: string) => {
    setDraggedTool(toolId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedTool) return;

    // Add the tool to the selected tools if not already there
    if (!gameState.selectedTools.includes(draggedTool)) {
      setGameState(prev => ({
        ...prev,
        selectedTools: [...prev.selectedTools, draggedTool],
        puzzlePieces: prev.puzzlePieces.map(piece => 
          piece.toolId === draggedTool 
            ? { ...piece, isPlaced: true } 
            : piece
        )
      }));
    }
    
    setDraggedTool(null);
  };

  const removeSelectedTool = (toolId: string) => {
    setGameState(prev => ({
      ...prev,
      selectedTools: prev.selectedTools.filter(id => id !== toolId),
      puzzlePieces: prev.puzzlePieces.map(piece => 
        piece.toolId === toolId 
          ? { ...piece, isPlaced: false } 
          : piece
      )
    }));
  };

  const checkSolution = () => {
    if (!gameState.currentUseCase) return;
    
    const { requiredTools, solution } = gameState.currentUseCase;
    const selectedTools = gameState.selectedTools;

    // Check if all required tools are selected
    const allRequiredSelected = requiredTools.every(tool => selectedTools.includes(tool));
    
    // Check how many of the selected tools are in the solution
    const correctTools = selectedTools.filter(tool => solution.includes(tool));
    const incorrectTools = selectedTools.filter(tool => !solution.includes(tool));
    
    // Calculate score based on correct selections
    const penaltyPerWrong = 5;
    const baseScore = correctTools.length * 10;
    const penalty = incorrectTools.length * penaltyPerWrong;
    const finalScore = Math.max(0, baseScore - penalty);
    
    if (!allRequiredSelected) {
      setMessage({
        text: "You're missing some required tools for this solution!",
        type: 'error'
      });
      return;
    }
    
    // Check if the solution is correct
    const isCorrect = solution.length === correctTools.length && incorrectTools.length === 0;
    
    if (isCorrect) {
      setMessage({
        text: `Perfect solution! You've earned ${finalScore} points.`,
        type: 'success'
      });
      
      setGameState(prev => ({
        ...prev,
        score: finalScore,
        isComplete: true
      }));
    } else if (correctTools.length > 0) {
      setMessage({
        text: `You're on the right track with ${correctTools.length} correct tools, but your solution isn't optimal yet. Score: ${finalScore}`,
        type: 'info'
      });
      
      setGameState(prev => ({
        ...prev,
        score: finalScore
      }));
    } else {
      setMessage({
        text: "None of your selected tools are part of the optimal solution. Try again!",
        type: 'error'
      });
    }
  };

  const getHint = () => {
    if (!gameState.currentUseCase) return;
    
    const hintIndex = gameState.hintsUsed;
    if (hintIndex < gameState.currentUseCase.hints.length) {
      const hint = gameState.currentUseCase.hints[hintIndex];
      
      setMessage({
        text: `Hint: ${hint}`,
        type: 'info'
      });
      
      setGameState(prev => ({
        ...prev,
        hintsUsed: prev.hintsUsed + 1
      }));
    } else {
      setMessage({
        text: "You've used all available hints!",
        type: 'info'
      });
    }
  };

  const getTool = (toolId: string) => {
    return tools.find(tool => tool.id === toolId);
  };

  if (!gameState.currentUseCase) {
    return (
      <div className="ai-puzzle empty-state">
        <h2>No active challenge</h2>
        <p>Please select a use case from the AI Showcase to start a puzzle challenge.</p>
      </div>
    );
  }

  return (
    <div className="ai-puzzle">
      <div className="puzzle-header">
        <h2>{gameState.currentUseCase.title} Challenge</h2>
        <div className="game-stats">
          <span className="score">Score: {gameState.score}</span>
          <span className="hints">Hints Used: {gameState.hintsUsed}</span>
        </div>
      </div>
      
      <div className="challenge-description">
        <p>{gameState.currentUseCase.description}</p>
        <div className={`message ${message?.type}`}>
          {message && <p>{message.text}</p>}
        </div>
      </div>
      
      <div className="puzzle-workspace">
        <div className="tools-container">
          <h3>Available AI Tools</h3>
          <p>Drag the tools you need to build your solution:</p>
          <div className="tools-grid">
            {availableTools.map((tool) => {
              const isPieceUsed = gameState.puzzlePieces.find(
                piece => piece.toolId === tool.id
              )?.isPlaced;
              
              return (
                <div 
                  key={tool.id}
                  className={`tool-piece ${isPieceUsed ? 'used' : ''}`}
                  draggable={!isPieceUsed}
                  onDragStart={() => handleDragStart(tool.id)}
                >
                  <div className="tool-piece-content">
                    <h4>{tool.name}</h4>
                    <span className={`category ${tool.category}`}>
                      {tool.category}
                    </span>
                    <p>{tool.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div 
          className="solution-container"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <h3>Your Solution</h3>
          <p>Drop tools here to build your solution:</p>
          
          <div className="solution-board">
            {gameState.selectedTools.length === 0 ? (
              <div className="empty-solution">
                <p>Drag and drop tools here to compose your solution</p>
              </div>
            ) : (
              <div className="selected-tools">
                {gameState.selectedTools.map(toolId => {
                  const tool = getTool(toolId);
                  if (!tool) return null;
                  
                  return (
                    <div key={toolId} className="selected-tool">
                      <div className="selected-tool-content">
                        <h4>{tool.name}</h4>
                        <span className={`category ${tool.category}`}>
                          {tool.category}
                        </span>
                        <button 
                          className="remove-tool" 
                          onClick={() => removeSelectedTool(toolId)}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="game-controls">
        <button className="hint-button" onClick={getHint}>
          Get Hint ({gameState.currentUseCase.hints.length - gameState.hintsUsed} remaining)
        </button>
        <button 
          className="check-button" 
          onClick={checkSolution}
          disabled={gameState.selectedTools.length === 0}
        >
          Check Solution
        </button>
        {gameState.isComplete ? (
          <button className="next-button" onClick={resetGame}>
            Next Challenge
          </button>
        ) : (
          <button className="reset-button" onClick={resetGame}>
            Quit Challenge
          </button>
        )}
      </div>
    </div>
  );
};

export default AIPuzzle;
