import { Browser } from 'playwright'
import { Post } from './types'

const baseUrl = 'https://www.jasperdunn.com'

export async function getPosts(browser: Browser): Promise<Post[]> {
  let posts: Post[] = []

  try {
    const page = await browser.newPage()
    await page.goto(baseUrl)

    // Only used for dev logging purposes
    // page.$$eval executes code on a headless browser,
    // so console.logs inside this function will not appear on the node console.
    page.on('console', (msg) => {
      const args = msg.args()
      for (let i = 0; i < args.length; ++i) {
        console.log(`${i}: ${args[i]}`)
      }
    })

    const postLocator = page.locator('a.post')

    posts = await postLocator.evaluateAll((elements: HTMLElement[]) => {
      return elements
        .map((element): Post | null => {
          const url = element.getAttribute('href')
          if (!url) {
            return null
          }

          const title = element.querySelector('h2.post__title')?.textContent
          if (!title) {
            return null
          }

          return {
            title,
            url,
          }
        })
        .filter((element): element is Post => element !== null)
    })
  } catch (error) {
    console.error('\x1b[41m%s\x1b[0m', `${baseUrl} - ${error}`)
  }

  return posts
}
