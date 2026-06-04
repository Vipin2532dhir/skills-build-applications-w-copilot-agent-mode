import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      all: true,
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100,
    },
  },
})
