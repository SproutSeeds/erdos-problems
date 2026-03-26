const DDG_HTML_URL = 'https://html.duckduckgo.com/html/';

function decodeEntities(text) {
  return String(text ?? '')
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, decimal) => String.fromCodePoint(Number.parseInt(decimal, 10)))
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function stripTags(text) {
  return decodeEntities(String(text ?? '').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
}

function uniqueStrings(values) {
  return [...new Set(values.map((value) => String(value ?? '').trim()).filter(Boolean))];
}

function resolveDuckDuckGoUrl(rawUrl) {
  const value = String(rawUrl ?? '').trim();
  if (!value) {
    return null;
  }
  if (value.startsWith('//')) {
    return `https:${value}`;
  }
  if (value.startsWith('/l/?')) {
    const params = new URLSearchParams(value.slice(4));
    return params.get('uddg') ?? null;
  }
  return value;
}

function extractResultSnippet(resultHtml) {
  const snippetMatch = resultHtml.match(/<a[^>]*class="result__snippet"[^>]*>([\s\S]*?)<\/a>/i)
    ?? resultHtml.match(/<div[^>]*class="result__snippet"[^>]*>([\s\S]*?)<\/div>/i);
  return stripTags(snippetMatch?.[1] ?? '');
}

function parseDuckDuckGoResults(html, query) {
  const blockPattern = /<div[^>]*class="result(?:\s|")([\s\S]*?)<\/div>\s*<\/div>/gi;
  const results = [];
  let match = blockPattern.exec(html);
  while (match) {
    const block = match[0];
    const anchor = block.match(/<a[^>]*class="result__a"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i);
    if (anchor) {
      const url = resolveDuckDuckGoUrl(anchor[1]);
      const title = stripTags(anchor[2]);
      if (url && title) {
        results.push({
          query,
          title,
          url,
          snippet: extractResultSnippet(block),
        });
      }
    }
    match = blockPattern.exec(html);
  }
  return results;
}

export function buildProblemSearchQueries(problemId, title) {
  const cleanTitle = String(title ?? '').trim();
  return uniqueStrings([
    `"Erdos Problem #${problemId}"`,
    `erdos problem ${problemId}`,
    cleanTitle ? `"${cleanTitle}"` : null,
    cleanTitle ? `"${cleanTitle}" erdos` : null,
    cleanTitle ? `"${cleanTitle}" sunflower` : null,
  ]);
}

async function fetchDuckDuckGoQuery(query) {
  const url = `${DDG_HTML_URL}?q=${encodeURIComponent(query)}`;
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'erdos-problems-cli',
      Accept: 'text/html',
    },
  });

  if (!response.ok) {
    throw new Error(`DuckDuckGo search failed for "${query}": ${response.status}`);
  }

  const html = await response.text();
  return {
    provider: 'duckduckgo',
    query,
    url,
    results: parseDuckDuckGoResults(html, query).slice(0, 5),
  };
}

export async function fetchProblemPublicSearchReview(problemId, title) {
  const queries = buildProblemSearchQueries(problemId, title).slice(0, 3);
  const searchRuns = [];
  const errors = [];

  for (const query of queries) {
    try {
      searchRuns.push(await fetchDuckDuckGoQuery(query));
    } catch (error) {
      errors.push({
        query,
        error: String(error?.message ?? error),
      });
    }
  }

  const combinedResults = [];
  const seenUrls = new Set();
  for (const run of searchRuns) {
    for (const result of run.results) {
      if (seenUrls.has(result.url)) {
        continue;
      }
      seenUrls.add(result.url);
      combinedResults.push(result);
    }
  }

  return {
    fetchedAt: new Date().toISOString(),
    problemId: String(problemId),
    title: String(title ?? '').trim() || `Erdos Problem #${problemId}`,
    provider: 'duckduckgo',
    queries,
    searchRuns,
    combinedResults: combinedResults.slice(0, 10),
    errors,
  };
}
