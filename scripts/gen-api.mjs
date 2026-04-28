import { writeFile } from 'node:fs/promises'
import openapiTS, { astToString } from 'openapi-typescript'

const baseURL = process.env.VITE_API_URL
if (!baseURL) {
  console.error('Error: VITE_API_URL is not set. Define it in .env (or pass it via env) before running gen:api.')
  process.exit(1)
}

const target = new URL('/v3/api-docs', baseURL)
const outPath = './src/types/api.d.ts'

console.log(`[gen:api] fetching ${target.href}`)
const ast = await openapiTS(target)
await writeFile(outPath, astToString(ast), 'utf8')
console.log(`[gen:api] wrote ${outPath}`)
