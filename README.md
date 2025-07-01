# AI Puzzle Showcase

A modern web application that showcases various AI capabilities, tools, frameworks, and language models. The application gamifies learning about AI through an interactive jigsaw puzzle feature where users can compose solutions for given use cases.

## Features

- **AI Showcase**: Browse and explore various AI tools, frameworks, and language models
- **Interactive Puzzles**: Solve puzzles by selecting the right combination of AI tools for specific use cases
- **Gamification**: Earn points, get hints, and challenge yourself with different difficulty levels
- **Responsive Design**: Works on desktop and mobile devices
- **Database Integration**: Uses Azure PostgreSQL for persistent data storage
- **Client-Server Architecture**: Separates frontend from backend database operations

## Technologies Used

### Frontend
- React
- TypeScript
- Vite
- CSS (with modern flexbox and grid layouts)
- Drag and Drop API

### Backend
- Express.js
- Node.js
- TypeScript
- Azure PostgreSQL
- Node-Postgres (pg)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Azure PostgreSQL database (or local PostgreSQL for development)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ai-puzzle-site.git
   cd ai-puzzle-site
   ```

2. Install dependencies for both frontend and backend:
   ```bash
   npm install
   cd server
   npm install
   cd ..
   ```

3. Copy the environment variables template:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your database credentials and configuration.

### Running the Application

#### Development Mode (Frontend and Backend)

Run both the frontend and backend servers simultaneously:

```bash
npm run dev:all
```

#### Separate Servers

Frontend only:
```bash
npm run dev
```

Backend API only:
```bash
npm run start-api
```

### Troubleshooting

If you encounter any issues with blank pages or database connectivity:

1. Check the console for errors (F12 in your browser)
2. Run the database test server: `npm run db-test-server`
3. Check the detailed debugging guide: [Debug Blank Page Issues](docs/debug-blank-page.md)
4. Verify your database setup: [Azure PostgreSQL Setup](docs/azure-postgresql-setup.md)

### Database Setup

1. Create an Azure PostgreSQL database or use a local PostgreSQL instance
2. Run the SQL scripts in `src/database/schema.sql` to create the tables
3. Run the SQL scripts in `src/database/seed.sql` to populate the database with initial data
4. Create a `.env` file in the root directory with the following variables:

```
# API Settings
VITE_API_URL=http://localhost:3001/api
VITE_USE_API=true

# Database Settings (for API server only)
PG_HOST=your-db-host.postgres.database.azure.com
PG_PORT=5432
PG_DATABASE=your-database-name
PG_USER=your-username
PG_PASSWORD=your-password
PG_SSL=true

# Server Settings
API_PORT=3001
```

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/ai-puzzle-site.git
cd ai-puzzle-site
```

2. Install dependencies for both the client and server
```bash
npm install
cd server
npm install
cd ..
```

3. Start the development servers (both frontend and API)
```bash
npm run dev:all
```

Alternatively, you can run them separately:
```bash
# Start just the frontend
npm run dev

# Start just the API server
npm run start-api
```

4. Open your browser and navigate to `http://localhost:5173`

## Development Modes

The application supports two data modes:

1. **Mock Data Mode**: Uses hardcoded data from `src/data/mockData.ts`. This is the default mode in development and doesn't require a database or API server.

2. **API Mode**: Connects to the API server to fetch data from the database. To enable:
   - Set `VITE_USE_API=true` in your `.env` file
   - Ensure the API server is running with `npm run start-api`

## Project Structure

```
ai-puzzle-site/
├── public/              # Static assets
├── src/                 # Source files
│   ├── assets/          # Images and other assets
│   ├── components/      # React components
│   │   ├── AIPuzzle/    # Puzzle game components
│   │   ├── AIShowcase/  # AI showcase components
│   │   ├── Header/      # Header components
│   │   ├── Footer/      # Footer components
│   │   └── common/      # Common UI components
│   ├── data/            # Mock data and sample content
│   ├── database/        # Database scripts and connection
│   │   ├── config.ts    # Database configuration
│   │   ├── db.ts        # Database service functions
│   │   ├── schema.sql   # Database schema
│   │   └── seed.sql     # Sample data
│   ├── hooks/           # Custom React hooks
│   │   └── useDatabase.tsx # Database context provider
│   ├── pages/           # Page components
│   ├── types/           # TypeScript type definitions
│   ├── App.css          # Main app styles
│   ├── App.tsx          # Main app component
│   ├── index.css        # Global styles
│   └── main.tsx         # Entry point
├── .env                 # Environment variables (not in repo)
├── .gitignore           # Git ignore file
├── index.html           # HTML template
├── package.json         # Project dependencies
├── tsconfig.json        # TypeScript configuration
└── vite.config.ts       # Vite configuration
```

## How to Play

1. Browse through the AI Showcase to learn about different AI tools, frameworks, and models
2. Select a use case to start a puzzle challenge
3. Drag and drop the correct AI tools to build your solution
4. Use hints if you get stuck
5. Check your solution to see if it's correct
6. Earn points based on how accurate your solution is

## Database Structure

The application uses the following database tables:

- `ai_tools` - Contains information about AI tools, frameworks, and models
- `ai_tool_capabilities` - Stores capabilities for each AI tool
- `ai_use_cases` - Contains information about use cases and puzzle challenges
- `ai_use_case_required_tools` - Stores required tools for each use case
- `ai_use_case_optional_tools` - Stores optional tools for each use case
- `ai_use_case_hints` - Stores hints for each use case
- `ai_use_case_solution_tools` - Stores the correct solution tools for each use case
- `user_progress` - Tracks user progress, scores, and completion status

## Future Enhancements

- User accounts and authentication
- More complex puzzles with interconnected tools
- Real-world AI demos for each tool
- Community features to share and discuss solutions
- Achievements and badges system
- Leaderboards for top scores

## License

This project is licensed under the MIT License - see the LICENSE file for details

## Documentation

- [Client-Server Architecture](docs/client-server-architecture.md)
- [Azure PostgreSQL Setup](docs/azure-postgresql-setup.md)
- [Architecture Diagrams](docs/architecture-diagrams.md)
- [Debug Blank Page Issues](docs/debug-blank-page.md)
- [React Hooks Issue Fix](docs/debug-hooks-issue.md) - Documentation on fixing issues with React hooks and the Start Challenge button
- [Architecture Improvements](docs/architecture-improvements.md) - Analysis of current architecture and suggested improvements for scalability and performance
