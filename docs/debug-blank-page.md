# Debugging the Blank Page Issue

Follow these steps to diagnose and fix the blank page issue:

## 1. Check the console for errors

Open your browser's developer tools (F12 or right-click -> Inspect) and check the Console tab for any error messages.

Common error: `Uncaught TypeError: Class extends value undefined is not a constructor or null`
- This occurs when the browser tries to use Node.js-only modules like `pg`
- The architecture has been updated to fix this - see the [Client-Server Architecture](client-server-architecture.md) document

## 2. Check environment variables

Make sure your `.env` file is properly configured:
- `VITE_USE_API=false` - Set to false to use mock data in the browser (default)
- `VITE_USE_API=true` - Set to true to use the API server (requires running the server)

## 3. Start the API server (if using real data)

If you want to use real database data, start the API server:
```bash
npm run start-api
```

Then set `VITE_USE_API=true` in your `.env` file.

## 4. Use the Debug Panel

The application includes a Debug Panel (visible in development mode) that provides detailed information about:

- API Server Connection Status
- Database Connection Status
- Data Source (Mock or Database)
- Environment Variables
- Console Logs

Use this panel to identify specific connection issues:

1. **API Server Issues**: 
   - If "API Server: Disconnected" is shown, make sure the API server is running (`npm run start-api`)
   - Check the console logs for specific API connection errors

2. **Database Issues**:
   - If "Database: Disconnected" is shown, check your database connection settings
   - Look for specific error messages in the Debug Panel that indicate the type of database issue:
     - "Database server not reachable" - Check network/firewall settings
     - "Authentication failed" - Check username/password
     - "Database does not exist" - Check database name

3. **Environment Issues**:
   - Review the Environment section in the Debug Panel
   - Make sure `VITE_USE_API` is set correctly based on your needs

## 5. Run the database test server

```bash
npm run db-test-server
```

Then open your browser to:
http://localhost:5173/db-test.html

This specialized test page will check your database connection and show detailed information about any issues.

## 6. Check your environment variables

Make sure your `.env` file contains the correct connection details:

```
# API Settings
VITE_API_URL=http://localhost:3001/api
VITE_USE_API=false  # Set to true to use the API, false to use mock data

# Database Settings (for API server only)
PG_HOST=your-server.postgres.database.azure.com
PG_PORT=5432
PG_DATABASE=ai_puzzle_db
PG_USER=username@your-server
PG_PASSWORD=your-password
PG_SSL=true

# Server Settings
API_PORT=3001
```

Key things to check:
- Verify your username format (for Azure PostgreSQL, it should be in the format `username@servername`)
- Double-check your password
- Make sure SSL is enabled (required for Azure PostgreSQL)

## 7. Firewall settings

Make sure your Azure PostgreSQL server's firewall allows connections from your IP address:

1. Go to the Azure Portal
2. Navigate to your PostgreSQL server
3. Click on "Networking"
4. Add your client IP address to the firewall rules

## 8. Database schema

Make sure the database schema has been created:

1. Connect to your database using a tool like pgAdmin or Azure Data Studio
2. Check if the tables exist (`ai_tools`, `ai_use_cases`, etc.)
3. If not, run the schema.sql script:
   ```bash
   npm run test-db
   ```

## 9. Try using mock data temporarily

If you're still having issues, you can modify the code to always use mock data during development:

1. Open `src/hooks/useDatabase.tsx`
2. Find the `loadData` function
3. Add `setUseMockData(true);` at the beginning of the function

## 10. Need more detailed logs?

The app has been configured with extensive debugging. Look for:

1. Console logs in your browser's developer tools
2. The Debug Panel in the bottom right corner of the app (in development mode)
3. Terminal logs from the Vite development server

## 11. Check for React Hooks Issues

If certain features of the application are not working (like buttons not responding):

1. Look for errors in the console related to React hooks:
   - `Invalid hook call`
   - `React Hook cannot be called inside a callback`
   - `Rules of Hooks violation`

2. These errors occur when React hooks are not used correctly. Common issues include:
   - Using hooks inside regular functions instead of at the top level of components
   - Using hooks conditionally or in loops
   - Nesting hooks in callbacks

For more information on a specific hooks-related issue that affected the "Start Challenge" button, see [React Hooks Issue Fix](debug-hooks-issue.md).

## Common issues and solutions

### "Cannot connect to database" error
- Check your connection string format
- Verify your server is running
- Make sure your IP is whitelisted in the firewall

### "SSL required" error
- Make sure `PG_SSL=true` is in your `.env` file

### Tables not found
- Run the schema setup script: `npm run test-db`

### "Username does not exist" error
- For Azure PostgreSQL, use the format `username@servername`
