import {createClient} from '@sanity/client'
import {readFileSync} from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import {getProductValidationIssues, normalizeSanityProduct} from '../src/lib/sanity/normalize-product.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')

const loadEnvLocal = () => {
  try {
    const content = readFileSync(path.join(rootDir, '.env.local'), 'utf8')

    content.split(/\r?\n/).forEach((line) => {
      const trimmedLine = line.trim()
      if (!trimmedLine || trimmedLine.startsWith('#')) return

      const separatorIndex = trimmedLine.indexOf('=')
      if (separatorIndex === -1) return

      const key = trimmedLine.slice(0, separatorIndex).trim()
      const value = trimmedLine.slice(separatorIndex + 1).trim()

      if (!process.env[key]) process.env[key] = value
    })
  } catch {
    // CI/Vercel can provide env directly.
  }
}

const getArgValue = (name) => {
  const prefix = `--${name}=`
  const matchedArg = process.argv.find((arg) => arg.startsWith(prefix))

  return matchedArg ? matchedArg.slice(prefix.length) : ''
}

const hasArg = (name) => process.argv.includes(`--${name}`)

const getSanityDocumentId = (slug) => {
  const safeSlug = String(slug || 'untitled')
    .toLowerCase()
    .replace(/[^a-z0-9_.-]/g, '-')
    .replace(/\.+/g, '.')
    .replace(/-{2,}/g, '-')
    .replace(/^[^a-z0-9_]+/, '')
    .replace(/\.\./g, '.')
    .slice(0, 120)

  return `product-${safeSlug || 'untitled'}`
}

const toSanityProductDocument = (product) => ({
  _id: getSanityDocumentId(product.slug),
  _type: 'product',
  legacyId: product.id || '',
  name: product.name,
  slug: {
    _type: 'slug',
    current: product.slug,
  },
  category: product.category?.toLowerCase() || '',
  type: product.type || '',
  material: product.material || '',
  description: product.description || '-',
  designTheme: Array.isArray(product.designTheme) ? product.designTheme : [],
  featured: product.featured === true,
  displayOrder: typeof product.displayOrder === 'number' ? product.displayOrder : undefined,
  swapImage: product.swapImage === true,
  variants: (product.variants || product.colors || []).map((variant, index) => ({
    _key: `${variant.code || variant.name || 'variant'}-${index}`.replace(/[^a-zA-Z0-9_-]/g, '-'),
    name: variant.name || '',
    code: variant.code || '',
    frontImage: variant.frontImage || '',
    backImage: variant.backImage || '',
    inStock: variant.inStock !== false,
  })),
  links: product.links || {},
})

loadEnvLocal()

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-08-18'
const token = process.env.SANITY_API_WRITE_TOKEN
const limit = Number.parseInt(getArgValue('limit'), 10)
const dryRun = hasArg('dry-run')

if (!projectId) throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID')
if (!dryRun && !token) throw new Error('Missing SANITY_API_WRITE_TOKEN. Add it to .env.local before running import.')

const products = JSON.parse(readFileSync(path.join(rootDir, 'src/data/products.json'), 'utf8'))
const selectedProducts = Number.isFinite(limit) && limit > 0 ? products.slice(0, limit) : products
const documents = selectedProducts.map(toSanityProductDocument)
const duplicateDocumentIds = documents
  .map((document) => document._id)
  .filter((documentId, index, documentIds) => documentIds.indexOf(documentId) !== index)
const invalidDocuments = documents
  .map((document) => {
    const normalizedProduct = normalizeSanityProduct(document)
    const issues = getProductValidationIssues(normalizedProduct, {validatePublicAssets: true})

    return {document, issues}
  })
  .filter((item) => item.issues.length > 0)

console.log(`Project: ${projectId}`)
console.log(`Dataset: ${dataset}`)
console.log(`Products selected: ${selectedProducts.length}`)
console.log(`Dry run: ${dryRun ? 'yes' : 'no'}`)

if (duplicateDocumentIds.length > 0) {
  throw new Error(`Import stopped because duplicate Sanity document IDs were generated: ${[...new Set(duplicateDocumentIds)].join(', ')}`)
}

if (invalidDocuments.length > 0) {
  console.log('\nInvalid products:')
  invalidDocuments.slice(0, 20).forEach(({document, issues}) => {
    console.log(`- ${document.name}: ${issues.join('; ')}`)
  })

  throw new Error(`Import stopped because ${invalidDocuments.length} product${invalidDocuments.length === 1 ? '' : 's'} failed validation.`)
}

if (dryRun) {
  console.log('\nDry run complete. No documents were written.')
  console.log(`First document ID: ${documents[0]?._id || '-'}`)
  process.exit(0)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
})

const batchSize = 25
let importedCount = 0

for (let index = 0; index < documents.length; index += batchSize) {
  const batch = documents.slice(index, index + batchSize)
  const transaction = client.transaction()

  batch.forEach((document) => {
    transaction.createOrReplace(document)
  })

  await transaction.commit()
  importedCount += batch.length
  console.log(`Imported ${importedCount}/${documents.length}`)
}

console.log(`\nImport complete. Imported ${importedCount} product${importedCount === 1 ? '' : 's'} to Sanity.`)
