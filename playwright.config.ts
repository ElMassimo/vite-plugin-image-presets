import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:4173',
  },
  webServer: {
    command: 'npm run example:now',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
  },
})
