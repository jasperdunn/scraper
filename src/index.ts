import { webkit } from 'playwright'
import chalk from 'chalk'
import ora from 'ora'
import { scrapeJasperdunn } from './websites/jasperdunn'
import { exportJson } from './utils'

async function scrape(): Promise<void> {
  const launchingBrowser = ora('Launching browser').start()
  const browser = await webkit.launch()
  const context = await browser.newContext()
  launchingBrowser.succeed(chalk.green('Browser was launched'))

  const jasperdunn = await scrapeJasperdunn(await context.newPage())

  const mode = process.argv[2]
  if (mode === '--dev') {
    await exportJson({ jasperdunn })
  } else if (mode === '--log') {
    console.log(chalk.grey(JSON.stringify({ jasperdunn }, null, 2)))
  }

  await browser.close()
}

scrape()
