import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'https://api.escuelajs.co',
    extraHTTPHeaders: {
      'Content-Type': 'application/json'
    }
  },
  reporter: [
    ['list'],
    ['allure-playwright']
  ],
});
