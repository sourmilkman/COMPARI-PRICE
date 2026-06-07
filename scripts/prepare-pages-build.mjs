import { copyFileSync, mkdirSync } from 'node:fs'

const files = ['index.html', 'favicon.svg', 'pwa-icon.svg', 'manifest.webmanifest', 'sw.js']

mkdirSync('dist', { recursive: true })

for (const file of files) {
  copyFileSync(file, `dist/${file}`)
}
