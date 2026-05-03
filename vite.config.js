import https from 'node:https'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { DEVPOST_URL, parseHackathonsHtml } from './src/lib/devpostHackathons.js'

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
      (response) => {
        if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
          if (redirects > 5) {
            reject(new Error('Too many redirects while fetching Devpost'))
            return
          }
          resolve(fetchHtml(new URL(response.headers.location, url).toString(), redirects + 1))
          return
        }

        if (response.statusCode !== 200) {
          reject(new Error(`Devpost returned HTTP ${response.statusCode}`))
          return
        }

        let body = ''
        response.setEncoding('utf8')
        response.on('data', (chunk) => {
          body += chunk
        })
        response.on('end', () => resolve(body))
      }
    )

    req.on('error', reject)
    req.setTimeout(15000, () => {
      req.destroy(new Error('Timed out while fetching Devpost'))
    })
  })
}

function devpostHackathonApi() {
  return {
    name: 'devpost-hackathon-api',
    configureServer(server) {
      server.middlewares.use('/api/devpost-hackathons', async (_req, res) => {
        try {
          const html = await fetchHtml(DEVPOST_URL)
          const hackathons = parseHackathonsHtml(html)

          if (!hackathons.length) {
            throw new Error('No Devpost hackathons were parsed from the page')
          }

          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({
            sourceUrl: DEVPOST_URL,
            syncedAt: new Date().toISOString(),
            count: hackathons.length,
            hackathons,
          }))
        } catch (error) {
          res.statusCode = 502
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({
            sourceUrl: DEVPOST_URL,
            error: error.message,
          }))
        }
      })
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), devpostHackathonApi()],
})
