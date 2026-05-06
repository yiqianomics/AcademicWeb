import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: 'https://github.com/yiqianomics/AcademicWeb', // Relative base path for GitHub Pages
  build: {
    outDir: 'dist',
  },
});