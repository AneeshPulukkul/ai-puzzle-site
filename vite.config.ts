import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { config } from 'dotenv'

// Load environment variables from .env file
config();

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Make environment variables accessible to the client
  define: {
    'process.env': process.env
  }
})
