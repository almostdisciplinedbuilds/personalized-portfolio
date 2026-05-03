import { DEVPOST_URL, parseHackathonsHtml } from '../src/lib/devpostHackathons.js'

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
    res.status(204).end()
    return
  }

  try {
    const response = await fetch(DEVPOST_URL, {
      headers: {
        'user-agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X) AppleWebKit/537.36 PortfolioDevpostSync/1.0',
        accept: 'text/html,application/xhtml+xml',
      },
    })

    if (!response.ok) {
      throw new Error(`Devpost returned HTTP ${response.status}`)
    }

    const html = await response.text()
    const hackathons = parseHackathonsHtml(html)

    if (!hackathons.length) {
      throw new Error('No Devpost hackathons were parsed from the page')
    }

    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=1800')
    res.status(200).json({
      sourceUrl: DEVPOST_URL,
      syncedAt: new Date().toISOString(),
      count: hackathons.length,
      hackathons,
    })
  } catch (error) {
    res.status(502).json({
      sourceUrl: DEVPOST_URL,
      error: error.message,
    })
  }
}
