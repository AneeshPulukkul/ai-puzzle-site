-- Database schema for AI Puzzle Showcase application

-- AI Tools table
CREATE TABLE IF NOT EXISTS ai_tools (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(20) NOT NULL CHECK (category IN ('language', 'framework', 'tool', 'model')),
    icon VARCHAR(255),
    complexity VARCHAR(20) NOT NULL CHECK (complexity IN ('beginner', 'intermediate', 'advanced'))
);

-- AI Tool Capabilities table (for many-to-many relationship)
CREATE TABLE IF NOT EXISTS ai_tool_capabilities (
    tool_id VARCHAR(50) REFERENCES ai_tools(id) ON DELETE CASCADE,
    capability VARCHAR(100) NOT NULL,
    PRIMARY KEY (tool_id, capability)
);

-- AI Use Cases table
CREATE TABLE IF NOT EXISTS ai_use_cases (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard'))
);

-- AI Use Case Hints table
CREATE TABLE IF NOT EXISTS ai_use_case_hints (
    use_case_id VARCHAR(50) REFERENCES ai_use_cases(id) ON DELETE CASCADE,
    hint_order INT NOT NULL,
    hint_text TEXT NOT NULL,
    PRIMARY KEY (use_case_id, hint_order)
);

-- Required Tools for Use Cases (many-to-many)
CREATE TABLE IF NOT EXISTS ai_use_case_required_tools (
    use_case_id VARCHAR(50) REFERENCES ai_use_cases(id) ON DELETE CASCADE,
    tool_id VARCHAR(50) REFERENCES ai_tools(id) ON DELETE CASCADE,
    PRIMARY KEY (use_case_id, tool_id)
);

-- Optional Tools for Use Cases (many-to-many)
CREATE TABLE IF NOT EXISTS ai_use_case_optional_tools (
    use_case_id VARCHAR(50) REFERENCES ai_use_cases(id) ON DELETE CASCADE,
    tool_id VARCHAR(50) REFERENCES ai_tools(id) ON DELETE CASCADE,
    PRIMARY KEY (use_case_id, tool_id)
);

-- Solution Tools for Use Cases (many-to-many)
CREATE TABLE IF NOT EXISTS ai_use_case_solution_tools (
    use_case_id VARCHAR(50) REFERENCES ai_use_cases(id) ON DELETE CASCADE,
    tool_id VARCHAR(50) REFERENCES ai_tools(id) ON DELETE CASCADE,
    solution_order INT NOT NULL,
    PRIMARY KEY (use_case_id, tool_id)
);

-- User Scores and Progress table (for future enhancement)
CREATE TABLE IF NOT EXISTS user_progress (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL, -- Could be linked to an auth system later
    use_case_id VARCHAR(50) REFERENCES ai_use_cases(id) ON DELETE CASCADE,
    score INT NOT NULL DEFAULT 0,
    hints_used INT NOT NULL DEFAULT 0,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    last_played TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_ai_tools_category ON ai_tools(category);
CREATE INDEX IF NOT EXISTS idx_ai_use_cases_difficulty ON ai_use_cases(difficulty);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
