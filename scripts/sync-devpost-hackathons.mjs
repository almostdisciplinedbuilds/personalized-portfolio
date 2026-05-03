import { mkdir, writeFile } from 'node:fs/promises'
import https from 'node:https'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { DEVPOST_URL, parseHackathonsHtml } from '../src/lib/devpostHackathons.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outputPath = path.resolve(__dirname, '../src/data/devpostHackathons.json')

function fetchHtml(url, redirects = 0) {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      {
        headers: {
          'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X) AppleWebKit/537.36 PortfolioDevpostSync/1.0',
          accept: 'text/html,application/xhtml+xml',
        },
      },
      (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          if (redirects > 5) {
            reject(new Error('Too many redirects while fetching Devpost'))
            return
          }
          resolve(fetchHtml(new URL(res.headers.location, url).toString(), redirects + 1))
          return
        }

        if (res.statusCode !== 200) {
          reject(new Error(`Devpost returned HTTP ${res.statusCode}`))
          return
        }

        let body = ''
        res.setEncoding('utf8')
        res.on('data', (chunk) => {
          body += chunk
        })
        res.on('end', () => resolve(body))
      }
    )

    req.on('error', reject)
    req.setTimeout(15000, () => {
      req.destroy(new Error('Timed out while fetching Devpost'))
    })
  })
}

const html = await fetchHtml(DEVPOST_URL)
const hackathons = parseHackathonsHtml(html)

if (!hackathons.length) {
  throw new Error('No Devpost hackathons were parsed from the page')
}

const payload = {
  sourceUrl: DEVPOST_URL,
  syncedAt: new Date().toISOString(),
  count: hackathons.length,
  hackathons,
}

await mkdir(path.dirname(outputPath), { recursive: true })
await writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`)

console.log(`Synced ${hackathons.length} Devpost hackathons to ${path.relative(process.cwd(), outputPath)}`)
