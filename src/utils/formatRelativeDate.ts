export function formatRelativeDate(iso: string): string {
  const now = Date.now()
  const then = new Date(iso).getTime()
  const diffMin = Math.floor((now - then) / 60000)
  if (diffMin < 1) return 'most'
  if (diffMin < 60) return `${diffMin} perce`
  const diffH = Math.floor(diffMin / 60)
  if (diffH < 24) return `${diffH} órája`
  const diffD = Math.floor(diffH / 24)
  if (diffD === 1) return 'tegnap'
  if (diffD < 7) return `${diffD} napja`
  return new Date(iso).toLocaleDateString('hu-HU', { month: 'short', day: 'numeric' })
}
