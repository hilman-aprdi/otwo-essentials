import {createClient} from '@sanity/client'
import {readFileSync} from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import {normalizeSanityProduct, getProductValidationIssues} from '../src/lib/sanity/normalize-product.js'
import {allProductsQuery} from '../src/lib/sanity/queries.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')

const loadEnvLocal = () => {
  const envPath = path.join(rootDir, '.env.local')
  const content = readFileSync(envPath, 'utf8')

  content.split(/\r?\n/).forEach((line) => {
    const trimmedLine = line.trim()
    if (!trimmedLine || trimmedLine.startsWith('#')) return

    const separatorIndex = trimmedLine.indexOf('=')
    if (separatorIndex === -1) return

    const key = trimmedLine.slice(0, separatorIndex).trim()
    const value = trimmedLine.slice(separatorIndex + 1).trim()

    if (!process.env[key]) process.env[key] = value
  })
}

loadEnvLocal()

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-08-18'

if (!projectId) {
  throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local')
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
})

const products = await client.fetch(allProductsQuery)
const normalizedProducts = products.map(normalizeSanityProduct)

console.log(`Project: ${projectId}`)
console.log(`Dataset: ${dataset}`)
console.log(`Found ${products.length} product${products.length === 1 ? '' : 's'}\n`)

normalizedProducts.forEach((product, index) => {
  const issues = getProductValidationIssues(product, {validatePublicAssets: true})

  console.log(`${index + 1}. ${product.name || '(Untitled product)'}`)
  console.log(`Slug: ${product.slug || '-'}`)
  console.log(`Category: ${product.category || '-'}`)
  console.log(`Type: ${product.type || '-'}`)
  console.log(`Variants: ${product.variants.length}`)
  console.log(`Validation: ${issues.length ? issues.join('; ') : 'OK'}`)
  console.log('')
})

if (normalizedProducts[0]) {
  console.log('First normalized product:')
  console.log(JSON.stringify(normalizedProducts[0], null, 2))
}
