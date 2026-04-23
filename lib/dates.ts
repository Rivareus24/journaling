const GIORNI = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato']
const GIORNI_SHORT = ['dom', 'lun', 'mar', 'mer', 'gio', 'ven', 'sab']
const MESI = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre']
const MESI_SHORT = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic']

export function formatDateHeader(isoDate: string) {
  const [year, month, day] = isoDate.split('-').map(Number)
  const d = new Date(year, month - 1, day)
  return {
    dowLabel: GIORNI[d.getDay()].toUpperCase(),
    day,
    monthLabel: MESI[month - 1],
    year,
  }
}

export function formatDateShort(isoDate: string) {
  const [year, month, day] = isoDate.split('-').map(Number)
  const d = new Date(year, month - 1, day)
  return {
    day,
    dowShort: GIORNI_SHORT[d.getDay()],
    monthShort: MESI_SHORT[month - 1],
  }
}

export function isFutureDate(isoDate: string): boolean {
  const today = toISODate(new Date())
  return isoDate > today
}

export function toISODate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}
