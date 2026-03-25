const SITE_BASE_URL = 'https://www.erdosproblems.com';

function decodeEntities(text) {
  return text
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, decimal) => String.fromCodePoint(Number.parseInt(decimal, 10)))
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function collapseWhitespace(text) {
  return text.replace(/[ \t]+/g, ' ').replace(/\s*\n\s*/g, '\n').trim();
}

function htmlToReadableText(html) {
  const withoutScripts = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ');
  const blockSeparated = withoutScripts
    .replace(/<(br|\/p|\/div|\/li|\/h1|\/h2|\/h3|\/section|\/article|\/tr)>/gi, '\n')
    .replace(/<li[^>]*>/gi, '- ')
    .replace(/<p[^>]*>/gi, '\n')
    .replace(/<div[^>]*>/gi, '\n')
    .replace(/<h[1-6][^>]*>/gi, '\n');
  const stripped = blockSeparated.replace(/<[^>]+>/g, ' ');
  const decoded = decodeEntities(stripped);
  const normalizedLines = decoded
    .split('\n')
    .map((line) => collapseWhitespace(line))
    .filter(Boolean);
  return normalizedLines.join('\n');
}

function extractTitle(html, problemId) {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (!match) {
    return `Erdos Problem #${problemId}`;
  }
  return collapseWhitespace(decodeEntities(match[1]));
}

function selectPreviewLines(lines) {
  const anchorIndex = lines.findIndex((line) => /^(OPEN|SOLVED|PROVED|PARTIAL)\b/i.test(line));
  if (anchorIndex >= 0) {
    return lines.slice(anchorIndex, anchorIndex + 24);
  }
  return lines.slice(0, 24);
}

export async function fetchProblemSiteSnapshot(problemId) {
  const url = `${SITE_BASE_URL}/${problemId}`;
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'erdos-problems-cli',
      Accept: 'text/html',
    },
  });

  if (!response.ok) {
    throw new Error(`Unable to fetch problem page ${problemId}: ${response.status}`);
  }

  const html = await response.text();
  const text = htmlToReadableText(html);
  const title = extractTitle(html, problemId);
  const lines = text.split('\n').filter(Boolean);

  return {
    url,
    fetchedAt: new Date().toISOString(),
    html,
    title,
    text,
    previewLines: selectPreviewLines(lines),
  };
}
