import { useState } from 'react';
import type { AITool } from '../../types';
import { useDatabase } from '../../hooks/useDatabase';
import './AIShowcase.css';

interface AIShowcaseProps {
  startNewGame: (useCaseId: string) => void;
}

const AIShowcase = ({ startNewGame }: AIShowcaseProps) => {
  const { tools, useCases } = useDatabase();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = tools.filter(tool => {
    // Filter by category if selected
    if (selectedCategory && tool.category !== selectedCategory) return false;
    
    // Filter by search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      return (
        tool.name.toLowerCase().includes(query) || 
        tool.description.toLowerCase().includes(query) ||
        tool.capabilities.some(cap => cap.toLowerCase().includes(query))
      );
    }
    
    return true;
  });

  const categories = Array.from(new Set(tools.map(tool => tool.category)));

  return (
    <div className="ai-showcase">
      <section className="hero-section">
        <h1>AI Capabilities Showcase</h1>
        <p>Explore various AI tools, frameworks, and language models. Test your knowledge with our interactive jigsaw puzzles!</p>
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search AI tools and capabilities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </section>

      <section className="category-filter">
        <h2>Explore by Category</h2>
        <div className="category-buttons">
          <button 
            className={selectedCategory === null ? 'active' : ''} 
            onClick={() => setSelectedCategory(null)}
          >
            All
          </button>
          {categories.map((category) => (
            <button 
              key={category}
              className={selectedCategory === category ? 'active' : ''} 
              onClick={() => setSelectedCategory(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </section>

      <section className="tools-grid">
        <h2>AI Tools & Models</h2>
        <div className="grid">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      <section className="use-cases">
        <h2>AI Use Cases & Puzzles</h2>
        <p>Choose a use case to solve the AI puzzle:</p>
        <div className="use-case-grid">
          {useCases.map((useCase) => (
            <div key={useCase.id} className="use-case-card">
              <h3>{useCase.title}</h3>
              <p>{useCase.description}</p>
              <div className="difficulty-label">
                <span className={`difficulty ${useCase.difficulty}`}>
                  {useCase.difficulty}
                </span>
              </div>
              <button 
                className="start-button"
                onClick={() => startNewGame(useCase.id)}
              >
                Start Challenge
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

// Tool card component
const ToolCard = ({ tool }: { tool: AITool }) => {
  return (
    <div className="tool-card">
      <div className="tool-header">
        <h3>{tool.name}</h3>
        <span className={`category-badge ${tool.category}`}>
          {tool.category}
        </span>
      </div>
      <p className="tool-description">{tool.description}</p>
      <div className="tool-capabilities">
        <h4>Capabilities:</h4>
        <ul>
          {tool.capabilities.map((capability, index) => (
            <li key={index}>{capability}</li>
          ))}
        </ul>
      </div>
      <div className="tool-complexity">
        <span className={`complexity-badge ${tool.complexity}`}>
          {tool.complexity}
        </span>
      </div>
    </div>
  );
};

export default AIShowcase;
