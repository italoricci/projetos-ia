import { defineConfig } from '@playwright/test';

export default defineConfig({
  timeout: 5000,
  testDir: 'tests',
  use: {
    baseURL: 'https://erickwendel.github.io/vanilla-js-web-app-example/',
    headless: false,
    channel: 'chrome',
    actionTimeout: 5000,
    screenshot: 'only-on-failure'
  },
  reporter: [['list'], ['html', { open: 'never' }]]
});
