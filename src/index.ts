import { getPosts } from './jasperdunn'
import { webkit } from 'playwright'
import chalk from 'chalk'
import ora from 'ora'

async function scrape(): Promise<void> {
  const launchingBrowser = ora('Launching browser').start()
  const browser = await webkit.launch()
  launchingBrowser.succeed(chalk.green('Browser is launched'))

  const retrievingPosts = ora('Retrieving posts').start()
  const posts = await getPosts(browser)
  retrievingPosts.succeed(chalk.green('Posts were retrieved'))
  console.log(chalk.grey(JSON.stringify(posts, null, 2)))

  await browser.close()
  console.log('Closed browser')
}

scrape()
