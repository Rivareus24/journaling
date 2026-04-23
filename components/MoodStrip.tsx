import type { Entry } from '@/lib/types'
import { toISODate } from '@/lib/dates'

interface MoodStripProps {
  entries: Entry[]
}

const MOOD_HEIGHT: Record<string, number> = { great: 20, good: 16, low: 10, bad: 6 }
const MOOD_COLOR: Record<string, string> = {
  great: 'var(--mood-great)',
  good:  'var(--mood-good)',
  low:   'var(--mood-low)',
  bad:   'var(--mood-bad)',
}

function getLast14Days(): string[] {
  return Array.from({ length: 14 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (13 - i))
    return toISODate(d)
  })
}

export default function MoodStrip({ entries }: MoodStripProps) {
  const days = getLast14Days()
  const byDate = Object.fromEntries(entries.map((e) => [e.date, e]))
  const todayISO = toISODate(new Date())

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{
        fontFamily: 'var(--font-ui)', fontSize: 10, letterSpacing: 1.5,
        textTransform: 'uppercase', color: 'var(--ink-faded)', fontWeight: 500,
      }}>
        ultimi 14 giorni
      </span>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 22 }}>
        {days.map((date, i) => {
          const entry = byDate[date]
          const mood = entry?.mood
          const isToday = date === todayISO
          if (mood) {
            return (
              <div
                key={date}
                style={{
                  width: 7,
                  height: MOOD_HEIGHT[mood] ?? 10,
                  background: MOOD_COLOR[mood],
                  opacity: isToday ? 1 : 0.7,
                  borderRadius: 1,
                }}
              />
            )
          }
          return (
            <div
              key={date}
              style={{
                width: 7, height: 3,
                borderBottom: '1px dashed var(--ink-light)',
                alignSelf: 'flex-end',
              }}
            />
          )
        })}
      </div>
    </div>
  )
}
