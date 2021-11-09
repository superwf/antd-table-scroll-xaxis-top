import { PlaywrightTestConfig, devices } from '@playwright/test'

const config: PlaywrightTestConfig = {
  projects: [
    {
      name: 'Chrome Stable',
      use: {
        browserName: 'chromium',
        channel: 'chrome',
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: 'Firefox',
      use: {
        browserName: 'firefox',
        viewport: { width: 1920, height: 1080 },
      },
    },
  ],
}
export default config
