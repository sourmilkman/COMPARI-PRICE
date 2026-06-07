import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { execSync } from 'node:child_process'
import process from 'node:process'

function getBuildId() {
  try {
    return execSync('git rev-parse --short HEAD', {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
  } catch {
    return 'local'
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: process.env.GITHUB_PAGES === 'true' ? '/COMPARI-PRICE/' : '/',
  define: {
    __BUILD_ID__: JSON.stringify(getBuildId()),
  },
  plugins: [react()],
})
