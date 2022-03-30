import chalk from 'chalk'
import { writeFile } from 'fs/promises'
import ora from 'ora'
import fs from 'fs'

export async function exportJson<Data>(data: Data): Promise<void> {
  const exportingJson = ora('Exporting JSON').start()
  try {
    if (!fs.existsSync('out')) {
      fs.mkdirSync('out')
    }

    await writeFile('out/scrapedData.json', JSON.stringify(data))
    exportingJson.succeed(chalk.green('JSON was exported'))
  } catch (error) {
    exportingJson.fail(chalk.bgRed(`Failed to export JSON - ${error}`))
  }
}
