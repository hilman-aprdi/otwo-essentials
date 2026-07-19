const REPLACEMENTS = [
  ['Ã‚Â²', 'Â²'],
  ['Ã¢â‚¬â€œ', 'â€“'],
  ['Ã¢â‚¬â€', 'â€”'],
  ['Ã¢â‚¬Ëœ', "'"],
  ['Ã¢â‚¬â„¢', "'"],
  ['Ã¢â‚¬Å“', '"'],
  ['Ã¢â‚¬Â', '"'],
]

export const normalizeText = (value) => {
  if (typeof value !== 'string') return value

  return REPLACEMENTS.reduce((normalized, [searchValue, replaceValue]) => normalized.split(searchValue).join(replaceValue), value)
}

export const normalizeDeep = (value) => {
  if (typeof value === 'string') return normalizeText(value)
  if (Array.isArray(value)) return value.map(normalizeDeep)
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, nestedValue]) => [key, normalizeDeep(nestedValue)]))
  }

  return value
}
