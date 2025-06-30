export interface AITool {
  id: string;
  name: string;
  description: string;
  category: 'language' | 'framework' | 'tool' | 'model';
  icon?: string;
  capabilities: string[];
  complexity: 'beginner' | 'intermediate' | 'advanced';
}

export interface AIUseCase {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  requiredTools: string[];
  optionalTools: string[];
  hints: string[];
  solution: string[];
}

export interface PuzzlePiece {
  id: string;
  toolId: string;
  position: {
    x: number;
    y: number;
  };
  isPlaced: boolean;
}

export interface GameState {
  currentUseCase: AIUseCase | null;
  selectedTools: string[];
  score: number;
  hintsUsed: number;
  puzzlePieces: PuzzlePiece[];
  isComplete: boolean;
}
