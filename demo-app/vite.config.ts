import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import {resolve} from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@nichitaa/auth-react-router': resolve('..', 'src')
    }
  },
  plugins: [react()],
})
