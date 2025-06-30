import './Header.css';

interface HeaderProps {
  activeTab: 'showcase' | 'puzzle';
  setActiveTab: (tab: 'showcase' | 'puzzle') => void;
}

const Header = ({ activeTab, setActiveTab }: HeaderProps) => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <h1>AI Puzzle Showcase</h1>
        </div>
        <nav className="navigation">
          <button 
            className={`nav-button ${activeTab === 'showcase' ? 'active' : ''}`}
            onClick={() => setActiveTab('showcase')}
          >
            AI Showcase
          </button>
          <button 
            className={`nav-button ${activeTab === 'puzzle' ? 'active' : ''}`}
            onClick={() => setActiveTab('puzzle')}
          >
            AI Puzzle
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
