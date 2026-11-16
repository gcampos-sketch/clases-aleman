import {learningRevision} from './scripts/version-learning-assets.mjs';
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import {fileURLToPath} from 'node:url';

export default defineConfig({
  define:{'import.meta.env.VITE_LEARNING_REVISION':JSON.stringify(learningRevision)},
  plugins:[react(),tailwindcss()],
  resolve:{alias:{'@':fileURLToPath(new URL('./src',import.meta.url))}},
  build:{outDir:'dist-static',emptyOutDir:true,rolldownOptions:{input:'static.html'}},
});
