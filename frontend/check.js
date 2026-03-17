import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function readLocalEnv() {
  const envPath = path.join(__dirname, '.env.local')
  if (!fs.existsSync(envPath)) return {}

  return fs
    .readFileSync(envPath, 'utf8')
    .split(/\r?\n/)
    .filter(Boolean)
    .reduce((acc, line) => {
      if (line.trim().startsWith('#')) return acc
      const index = line.indexOf('=')
      if (index === -1) return acc
      const key = line.slice(0, index).trim()
      const value = line.slice(index + 1).trim()
      acc[key] = value
      return acc
    }, {})
}

async function main() {
  const localEnv = readLocalEnv()
  const configFromWindow = globalThis.FIGHTHUB_CONFIG || {}
  const url =
    process.env.FIGHTHUB_FIGHTERS_URL ||
    `${localEnv.VITE_SUPABASE_URL || configFromWindow.supabaseUrl || ''}/rest/v1/fighters?select=*`
  const key =
    process.env.SUPABASE_ANON_KEY ||
    localEnv.VITE_SUPABASE_ANON_KEY ||
    localEnv.VITE_SUPABASE_PUBLISHABLE_KEY ||
    configFromWindow.supabaseAnonKey

  if (!url || !key) {
    throw new Error('Supabase URL/anon key ausentes. Defina .env.local ou variaveis de ambiente.')
  }

  const response = await fetch(url, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Falha ao consultar fighters: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  const tauan = data.find((fighter) =>
    String(fighter.name || '')
      .toLowerCase()
      .includes('tauan')
  )

  console.log('ALL DATA LENGTH:', data.length)
  console.log('TAUAN DATA:', tauan || null)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
