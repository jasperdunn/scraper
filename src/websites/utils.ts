import chalk from 'chalk'
import ora from 'ora'
import { Page } from 'playwright'
import { Metadata } from './types'

export async function getMetadata(page: Page): Promise<Metadata> {
  const pageUrl = page.url()
  const retrievingMetadata = ora(`${pageUrl} - Retrieving metadata`).start()
  let metadata: Metadata = {}

  try {
    const postLocator = page.locator('head > meta, title')
    metadata = await postLocator.evaluateAll((elements: HTMLElement[]) => {
      return elements.reduce<Metadata>((accumulator, element): Metadata => {
        if (element.tagName === 'TITLE') {
          return { ...accumulator, title: element.innerText }
        }

        let k
        let v
        for (let i = 0; i < element.attributes.length; i++) {
          const name = element.attributes[i]?.name
          const value = element.attributes[i]?.value

          if (!name || !value) {
            continue
          }

          if (name === 'charset') {
            k = name
            v = value
          } else if (name === 'name' || name === 'property') {
            k = value
          } else if (name === 'content') {
            v = value
          }

          if (!k || !v) {
            continue
          }

          return { ...accumulator, [k]: v }
        }

        return accumulator
      }, {})
    })

    retrievingMetadata.succeed(
      chalk.green(`${pageUrl} - Metadata was retrieved`)
    )
  } catch (error) {
    retrievingMetadata.fail(
      chalk.red(`${pageUrl} - Failed to retrieve Metadata - ${error}`)
    )
  }

  return metadata
}
