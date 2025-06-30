# Client-Server Architecture

This document explains how the AI Puzzle site is structured with a client-server architecture to properly handle database operations.

## Overview

The application is split into two main parts:

1. **Frontend (React Client)**: Runs in the browser and handles UI rendering, user interactions, and state management.
2. **Backend (Express API)**: Runs on the server and handles all database operations.

This separation solves the issue of trying to use Node.js-specific modules like `pg` in the browser environment.

## Architecture Diagram

```
┌─────────────────────────────────────┐
│           Web Browser               │
│                                     │
│  ┌─────────────────────────────┐    │
│  │                             │    │
│  │      React Frontend         │    │
│  │                             │    │
│  │  ┌─────────────────────┐    │    │
│  │  │  Components         │    │    │
│  │  │  - AIShowcase       │    │    │
│  │  │  - AIPuzzle         │    │    │
│  │  │  - Debug Panel      │    │    │
│  │  └─────────────────────┘    │    │
│  │                             │    │
│  │  ┌─────────────────────┐    │    │
│  │  │  Hooks              │    │    │
│  │  │  - useDatabase      │    │    │
│  │  └─────────────────────┘    │    │
│  │                             │    │
│  │  ┌─────────────────────┐    │    │
│  │  │  API Client         │◄───┼────┼────┐
│  │  │  (db-browser.ts)    │    │    │    │
│  │  └─────────────────────┘    │    │    │
│  │                             │    │    │
│  │  ┌─────────────────────┐    │    │    │
│  │  │  Mock Data          │◄───┼────┼────┐
│  │  │  (mockData.ts)      │    │    │    │
│  │  └─────────────────────┘    │    │    │
│  │                             │    │    │
│  └─────────────────────────────┘    │    │
│                                     │    │
└─────────────────────────────────────┘    │
                    │                      │
                    │ HTTP Requests        │
                    ▼                      │
┌─────────────────────────────────────┐    │
│          Node.js Server             │    │
│                                     │    │
│  ┌─────────────────────────────┐    │    │
│  │                             │    │    │
│  │      Express API            │    │    │
│  │                             │    │    │
│  │  ┌─────────────────────┐    │    │    │
│  │  │  Routes             │    │    │    │
│  │  │  - /api/health      │    │    │    │
│  │  │  - /api/tools       │    │    │    │
│  │  │  - /api/use-cases   │────┼────┘    │
│  │  │  - /api/user-progress    │         │
│  │  └─────────────────────┘    │         │
│  │                             │         │
│  │  ┌─────────────────────┐    │         │
│  │  │  Database Service   │    │         │
│  │  │  (db-service.js)    │    │         │
│  │  └─────────────────────┘    │         │
│  │           │                 │         │
│  └───────────┼─────────────────┘         │
│              │                           │
└──────────────┼───────────────────────────┘
               │
               │ SQL Queries
               ▼
┌─────────────────────────────────────┐
│        Azure PostgreSQL             │
│                                     │
│  ┌─────────────────────────────┐    │
│  │                             │    │
│  │      Database               │    │
│  │                             │    │
│  │  ┌─────────────────────┐    │    │
│  │  │  Tables             │    │    │
│  │  │  - ai_tools         │    │    │
│  │  │  - ai_use_cases     │    │    │
│  │  │  - user_progress    │    │    │
│  │  └─────────────────────┘    │    │
│  │                             │    │
│  └─────────────────────────────┘    │
│                                     │
└─────────────────────────────────────┘
```

## Key Components

### Frontend (Browser)

- **Technology**: React, TypeScript, Vite
- **Location**: `/src` directory
- **Data Handling**:
  - Uses the `db-browser.ts` service to connect to the API
  - Falls back to mock data when API is not available
  - Never directly imports or uses `pg` or other Node.js-specific modules

### Backend (Server)

- **Technology**: Express.js, Node.js, TypeScript
- **Location**: `/server` directory
- **Data Handling**:
  - Uses the `db.ts` service to connect to PostgreSQL
  - Exposes RESTful API endpoints for the frontend
  - Handles all database operations

### API Communication

The frontend and backend communicate via HTTP requests to the following endpoints:

- `GET /api/health` - Check API health
- `GET /api/test-connection` - Test database connection
- `GET /api/tools` - Get all AI tools
- `GET /api/use-cases` - Get all use cases
- `GET /api/use-cases/:id` - Get a specific use case by ID
- `POST /api/user-progress` - Save user progress
- `GET /api/user-progress/:userId` - Get user progress

## Configuration

The application can be configured through environment variables in the `.env` file:

```
# API Settings
VITE_API_URL=http://localhost:3001/api
VITE_USE_API=false  # Set to true to use the real API, false to use mock data

# Database Settings
PG_HOST=your-postgresql-server.postgres.database.azure.com
PG_PORT=5432
PG_DATABASE=ai_puzzle_db
PG_USER=your_user@your-postgresql-server
PG_PASSWORD=your_password
PG_SSL=true

# Server Settings
API_PORT=3001
```

## Development Workflow

1. **Development Mode**:
   - Run `npm run dev:all` to start both frontend and backend servers
   - Frontend: http://localhost:5173 (or similar Vite port)
   - Backend: http://localhost:3001

2. **Testing**:
   - Set `VITE_USE_API=false` for frontend-only development with mock data
   - Use `npm run test-db` to test database connectivity
   - Use `npm run db-test-server` for database troubleshooting

3. **Production**:
   - Set `VITE_USE_API=true` to use the real API
   - Build the frontend: `npm run build`
   - Deploy the `/server` directory to a Node.js hosting environment
   - Deploy the `/dist` directory to a static web hosting service

## Preventing "Class extends value undefined is not a constructor or null" Error

The architecture is specifically designed to prevent the error:
```
Uncaught TypeError: Class extends value undefined is not a constructor or null
    at node_modules/pg/lib/query.js (query.js:8:1)
```

This error occurs when browser code tries to use the `pg` module, which is a Node.js-specific library. The solution is:

1. Never import `pg` in any code that runs in the browser
2. Keep all database code in the server/backend
3. Use the API client in the browser to communicate with the backend
4. Always have a mock data fallback for frontend development and testing

1. **Mock Data Mode**: The default mode for development. No database or API server required.
2. **API Mode**: Uses the API server to fetch real data from the database.

To switch between modes, modify the `.env` file:

```
# Use API (set to "true" to use the API server, "false" to use mock data)
VITE_USE_API=false
```

## Development Workflow

1. **Frontend Only**: Run `npm run dev` to start just the React application with mock data
2. **Full Stack**: Run `npm run dev:all` to start both the frontend and API server
3. **API Only**: Run `npm run start-api` to start just the API server

## Troubleshooting

### Common Issues

1. **"Class extends value undefined is not a constructor or null"**
   - This error occurs when the browser tries to use Node.js-only modules like `pg`
   - Ensure you're not directly importing `db.ts` in any client-side code
   - Make sure `VITE_USE_API` is set correctly in your `.env` file

2. **API Connection Errors**
   - Check if the API server is running on the correct port
   - Verify that `VITE_API_URL` is set correctly in your `.env` file
   - Check the browser console for CORS errors

3. **Database Connection Issues**
   - Verify the database connection details in the `.env` file
   - Ensure your IP address is allowed in the Azure PostgreSQL firewall rules
   - Check the server logs for detailed error messages
