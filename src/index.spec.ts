import { test, expect } from '@playwright/test'
import { capitalize } from 'lodash'

import { sleep } from '../src/sleep'

const antdEnv = ['antd3', 'antd4']

antdEnv.forEach(env => {
  test(`${env} sync top and bottom`, async ({ page }) => {
    await page.goto(`/${env}.html`)
    const title = page.locator('head title')
    await expect(title).toHaveText(`${capitalize(env)} example`)
    await sleep(1000)
    // top sync bottom
    await page.evaluate(() => document.querySelector('[role="scrollbar"]')!.scroll(100, 0))
    await sleep(100)
    let bottomScrollLeft = await page.evaluate(() => document.querySelector('.ant-table-body')!.scrollLeft)
    expect(bottomScrollLeft).toBe(100)

    await page.evaluate(() => document.querySelector('[role="scrollbar"]')!.scroll(200, 0))
    await sleep(100)
    bottomScrollLeft = await page.evaluate(() => document.querySelector('.ant-table-body')!.scrollLeft)
    expect(bottomScrollLeft).toBe(200)

    // bottom sync top
    await page.evaluate(() => document.querySelector('.ant-table-body')!.scroll(120, 0))
    await sleep(100)
    let topScrollLeft = await page.evaluate(() => document.querySelector('[role="scrollbar"]')!.scrollLeft)
    expect(topScrollLeft).toBe(120)

    await page.evaluate(() => document.querySelector('.ant-table-body')!.scroll(220, 0))
    await sleep(100)
    topScrollLeft = await page.evaluate(() => document.querySelector('[role="scrollbar"]')!.scrollLeft)
    expect(topScrollLeft).toBe(220)
  })
})
