# Setting Up Azure PostgreSQL for AI Puzzle Site

This guide will walk you through the process of setting up an Azure PostgreSQL database for the AI Puzzle Site application.

## Prerequisites

- An Azure account with an active subscription
- Azure CLI installed (optional, for command-line setup)

## Step 1: Create an Azure PostgreSQL Server

### Using the Azure Portal

1. Sign in to the [Azure Portal](https://portal.azure.com)
2. Click on "Create a resource" and search for "Azure Database for PostgreSQL"
3. Select "Azure Database for PostgreSQL" and click "Create"
4. Choose "Single server" deployment option
5. Fill in the basic details:
   - Server name: Choose a unique name (e.g., `ai-puzzle-db-server`)
   - Data source: "None" (we'll import data later)
   - Location: Choose a region close to your users
   - Version: 14 (or the latest available)
   - Compute + Storage: Basic tier is sufficient for development (or choose according to your needs)
6. Set up admin username and password (make note of these)
7. Click "Review + create" and then "Create"

### Using Azure CLI

```bash
# Login to Azure
az login

# Create a resource group (if you don't have one already)
az group create --name ai-puzzle-rg --location eastus

# Create PostgreSQL server
az postgres server create \
  --resource-group ai-puzzle-rg \
  --name ai-puzzle-db-server \
  --location eastus \
  --admin-user dbadmin \
  --admin-password YourSecurePassword123! \
  --sku-name B_Gen5_1 \
  --version 14
```

## Step 2: Configure Firewall Rules

### Using the Azure Portal

1. Go to your PostgreSQL server in the Azure Portal
2. Click on "Connection security" under Settings
3. Add your client IP address:
   - Click "Add current client IP address"
   - Or manually add IP range if needed
4. Enable "Allow access to Azure services" if your app will be hosted on Azure
5. Click "Save"

### Using Azure CLI

```bash
# Add your client IP address
az postgres server firewall-rule create \
  --resource-group ai-puzzle-rg \
  --server-name ai-puzzle-db-server \
  --name AllowMyIP \
  --start-ip-address YOUR_IP_ADDRESS \
  --end-ip-address YOUR_IP_ADDRESS

# Allow Azure services (optional)
az postgres server firewall-rule create \
  --resource-group ai-puzzle-rg \
  --server-name ai-puzzle-db-server \
  --name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0
```

## Step 3: Create the Database

### Using the Azure Portal

1. Go to your PostgreSQL server in the Azure Portal
2. Click on "Databases" under Settings
3. Click "+ Add" to create a new database
4. Enter "ai_puzzle_db" as the name
5. Click "OK"

### Using Azure CLI

```bash
az postgres db create \
  --resource-group ai-puzzle-rg \
  --server-name ai-puzzle-db-server \
  --name ai_puzzle_db
```

## Step 4: Set Up Database Schema and Seed Data

You have a few options to run the SQL scripts:

### Option 1: Using pgAdmin

1. Download and install [pgAdmin](https://www.pgadmin.org/download/)
2. Connect to your Azure PostgreSQL server using your server details
3. Run the SQL scripts from `src/database/schema.sql` and `src/database/seed.sql`

### Option 2: Using the psql Command Line Tool

```bash
# Install psql if needed
# For Windows: Install from PostgreSQL website
# For macOS: brew install postgresql
# For Linux: apt-get install postgresql-client

# Run schema.sql
psql "host=ai-puzzle-db-server.postgres.database.azure.com port=5432 dbname=ai_puzzle_db user=dbadmin@ai-puzzle-db-server password=YourSecurePassword123! sslmode=require" -f src/database/schema.sql

# Run seed.sql
psql "host=ai-puzzle-db-server.postgres.database.azure.com port=5432 dbname=ai_puzzle_db user=dbadmin@ai-puzzle-db-server password=YourSecurePassword123! sslmode=require" -f src/database/seed.sql
```

### Option 3: Using Azure Data Studio

1. Download and install [Azure Data Studio](https://docs.microsoft.com/en-us/sql/azure-data-studio/download-azure-data-studio)
2. Install the PostgreSQL extension
3. Connect to your Azure PostgreSQL server
4. Open and run the SQL scripts

## Step 5: Update Environment Variables

1. Update your `.env` file with the actual values for your Azure PostgreSQL database:

```
PG_HOST=ai-puzzle-db-server.postgres.database.azure.com
PG_PORT=5432
PG_DATABASE=ai_puzzle_db
PG_USER=dbadmin@ai-puzzle-db-server
PG_PASSWORD=YourSecurePassword123!
PG_SSL=true
```

## Step 6: Test the Connection

Run the database connection test script:

```bash
npm run test-db
```

If the connection is successful, you should see:
- "Database connection successful!"
- A list of the tables in your database
- Counts of the data in your tables

## Troubleshooting

### Connection Issues

1. **Firewall Rules**: Make sure your IP address is allowed in the firewall rules
2. **Connection String**: Verify your connection string format
3. **SSL Issues**: Ensure SSL is enabled and properly configured
4. **Username Format**: For Azure PostgreSQL, use `username@servername` format

### Data Issues

1. **Missing Tables**: Run the schema.sql script to create tables
2. **Empty Tables**: Run the seed.sql script to populate data

## Additional Resources

- [Azure PostgreSQL Documentation](https://docs.microsoft.com/en-us/azure/postgresql/)
- [Node-Postgres Documentation](https://node-postgres.com/)
