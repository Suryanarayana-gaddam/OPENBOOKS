import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from "dotenv"

export default defineConfig({
  plugins: [react()],
  define:{
    "process.env.VITE_FIREBASE_API_KEY" : JSON.stringify(process.env.VITE_FIREBASE_API_KEY)
  },
  build : {
    outDir : 'dist',
  },
  base: '/',
});
