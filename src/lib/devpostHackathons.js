export const DEVPOST_URL = 'https://devpost.com/swathikanthetiwork/challenges'

function decodeHtml(value = '') {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&#39;', "'")
    .replaceAll('&quot;', '"')
    .replaceAll('&nbsp;', ' ')
    .replaceAll('&ndash;', '-')
    .replaceAll('&mdash;', '-')
    .replaceAll('&euro;', '€')
    .replaceAll(/<[^>]+>/g, '')
    .replaceAll(/\s+/g, ' ')
    .trim()
}

function pick(block, pattern) {
  const match = block.match(pattern)
  return match ? decodeHtml(match[1]) : ''
}

function pickAttr(block, pattern) {
  const match = block.match(pattern)
  if (!match) return ''
  const value = decodeHtml(match[1])
  return value.startsWith('//') ? `https:${value}` : value
}

function upgradeDevpostImage(value = '') {
  return value.replace('/datas/medium.', '/datas/large.')
}

export function parseHackathonsHtml(html) {
  const articlePattern = /<article class="challenge-listing[\s\S]*?<\/article>/g
  const articles = html.match(articlePattern) || []

  return articles.map((block) => {
    const clockContent = pick(block, /<i class='fas fa-clock '><\/i>\s*<div class="stat-content">\s*([\s\S]*?)\s*<\/div>/)
    const status =
      pick(clockContent, /<time[^>]*>([\s\S]*?)<\/time>/) ||
      pick(clockContent, /<span class="value date-range">([\s\S]*?)<\/span>/) ||
      pick(clockContent, /<span class="one-line action">([\s\S]*?)<\/span>/) ||
      pick(clockContent, /<span class="action">([\s\S]*?)<\/span>/) ||
      clockContent

    const prize = pick(block, /<span class="value"><span data-currency="true">([\s\S]*?)<\/span><\/span>/)
    const participants = pick(block, /<i class='fas fa-user-friends '><\/i>\s*<span class="value">([\s\S]*?)<\/span>/)

    return {
      id: pickAttr(block, /data-id="([^"]+)"/) || pick(block, /<h2 class="title">\s*([\s\S]*?)\s*<\/h2>/),
      title: pick(block, /<h2 class="title">\s*([\s\S]*?)\s*<\/h2>/),
      location: pick(block, /<p class="challenge-location">\s*[\s\S]*?<\/i>\s*([\s\S]*?)\s*<\/p>/),
      summary: pick(block, /<p class="challenge-description">\s*([\s\S]*?)\s*<\/p>/),
      prize,
      status,
      participants,
      href: pickAttr(block, /<a class="clearfix"[^>]*href="([^"]+)"/),
      image: upgradeDevpostImage(pickAttr(block, /<img[^>]*class="thumbnail_image[^"]*"[^>]*src="([^"]+)"/)),
      featured: /class="challenge-listing featured"/.test(block),
      source: 'Devpost',
    }
  }).filter((hackathon) => hackathon.title && hackathon.href)
}

export function mapDevpostHackathons(hackathons = []) {
  return hackathons.map((hackathon) => ({
    title: hackathon.title,
    subtitle: hackathon.location,
    period: hackathon.status,
    summary: hackathon.summary,
    href: hackathon.href,
    image: upgradeDevpostImage(hackathon.image),
    source: hackathon.source || 'Devpost',
    tags: [
      hackathon.featured ? 'featured' : 'devpost',
      hackathon.prize ? `${hackathon.prize} prizes` : '',
      hackathon.participants ? `${hackathon.participants} participants` : '',
    ].filter(Boolean),
  }))
}

export function getHackathonSignature(hackathons = []) {
  return hackathons
    .map((hackathon) => `${hackathon.title}|${hackathon.period}|${hackathon.href}`)
    .sort()
    .join('::')
}
