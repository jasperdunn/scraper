import chalk from 'chalk'
import ora from 'ora'
import { Page } from 'playwright'
import { getMetadata } from '../utils'
import { JasperDunnData, Post } from './types'

async function getPosts(page: Page): Promise<Post[]> {
  const pageUrl = page.url()
  const retrievingPosts = ora(`${pageUrl} - Retrieving posts`).start()
  let posts: Post[] = []

  try {
    posts = await page
      .locator('a.post')
      .evaluateAll((elements: HTMLElement[]) => {
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

    retrievingPosts.succeed(chalk.green(`${pageUrl} - Posts were retrieved`))
  } catch (error) {
    retrievingPosts.fail(
      chalk.bgRed(`${pageUrl} - Failed to retrieve Posts - ${error}`)
    )
  }

  return posts
}

export async function scrapeJasperdunn(page: Page): Promise<JasperDunnData> {
  await page.goto('https://www.jasperdunn.com')

  // Only used for dev logging purposes
  // page.evaluateAll executes code on a headless browser,
  // so console.logs inside this function will not appear on the node console.
  page.on('console', (msg) => {
    const args = msg.args()
    for (let i = 0; i < args.length; ++i) {
      console.log(`${i}: ${args[i]}`)
    }
  })

  const posts = await getPosts(page)
  const metadata = await getMetadata(page)
  await page.close()

  return { posts, metadata }
}
