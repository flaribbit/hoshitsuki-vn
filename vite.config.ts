import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import story from './src/plugins/story'

// https://vitejs.dev/config/
export default defineConfig({
  base: "",
  plugins: [vue(), story()]
})
