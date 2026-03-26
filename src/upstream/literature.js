function normalizeText(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
}

function uniqueStrings(values) {
  return [...new Set(values.map((value) => normalizeText(value)).filter(Boolean))];
}

export function buildLiteratureQueries(problemId, title) {
  const cleanTitle = normalizeText(title);
  return uniqueStrings([
    `Erdos Problem ${problemId}`,
    cleanTitle,
    cleanTitle ? `${cleanTitle} Erdos` : null,
    cleanTitle ? `${cleanTitle} combinatorics` : null,
  ]);
}

export async function fetchCrossrefLiterature(problemId, title) {
  const query = buildLiteratureQueries(problemId, title)[0] ?? `Erdos Problem ${problemId}`;
  const url = `https://api.crossref.org/works?query.title=${encodeURIComponent(query)}&rows=5&sort=relevance`;
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'erdos-problems-cli',
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Crossref lookup failed for problem ${problemId}: ${response.status}`);
  }

  const payload = await response.json();
  const items = Array.isArray(payload?.message?.items) ? payload.message.items : [];

  return {
    provider: 'crossref',
    fetchedAt: new Date().toISOString(),
    problemId: String(problemId),
    query,
    results: items.slice(0, 5).map((item) => ({
      title: normalizeText(Array.isArray(item?.title) ? item.title[0] : item?.title),
      url: normalizeText(item?.URL),
      doi: normalizeText(item?.DOI),
      publisher: normalizeText(item?.publisher),
      published:
        item?.issued?.['date-parts']?.[0]?.filter((value) => value !== null && value !== undefined).join('-')
        ?? null,
    })),
  };
}

export async function fetchOpenAlexLiterature(problemId, title) {
  const query = buildLiteratureQueries(problemId, title)[0] ?? `Erdos Problem ${problemId}`;
  const url = `https://api.openalex.org/works?search=${encodeURIComponent(query)}&per-page=5&sort=relevance_score:desc`;
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'erdos-problems-cli',
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`OpenAlex lookup failed for problem ${problemId}: ${response.status}`);
  }

  const payload = await response.json();
  const results = Array.isArray(payload?.results) ? payload.results : [];

  return {
    provider: 'openalex',
    fetchedAt: new Date().toISOString(),
    problemId: String(problemId),
    query,
    results: results.slice(0, 5).map((item) => ({
      title: normalizeText(item?.title),
      url: normalizeText(item?.primary_location?.landing_page_url ?? item?.id),
      doi: normalizeText(item?.doi),
      citedByCount: Number(item?.cited_by_count ?? 0),
      publicationYear: item?.publication_year ?? null,
    })),
  };
}
