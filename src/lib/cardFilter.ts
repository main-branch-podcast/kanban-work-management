export function normalizeFilterQuery(query: string): string {
  return query.trim();
}

export function matchesNameFilter(cardText: string, query: string): boolean {
  const normalizedQuery = normalizeFilterQuery(query);

  return normalizedQuery === "" ||
    cardText.toLowerCase().includes(normalizedQuery.toLowerCase());
}
