import MoodGlyph from '@/components/ui/MoodGlyph'
import HandUnderline from '@/components/ui/HandUnderline'
import type { Mood } from '@/lib/types'

interface MoodPickerProps {
  current: Mood
  onChange: (mood: Mood) => void
  variant?: 'page' | 'bar'
}

const ORDER: NonNullable<Mood>[] = ['bad', 'low', 'good', 'great']
const LABELS: Record<NonNullable<Mood>, string> = {
  bad: 'difficile', low: 'così così', good: 'bene', great: 'benissimo',
}

export default function MoodPicker({ current, onChange, variant = 'page' }: MoodPickerProps) {
  const isBar = variant === 'bar'

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
      {ORDER.map((m) => {
        const active = m === current
        return (
          <button
            key={m}
            onClick={() => onChange(active ? null : m)}
            style={{
              border: 'none', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              padding: isBar ? 5 : '8px 14px',
              borderRadius: isBar ? 14 : 4,
              background: active ? 'var(--accent-wash)' : 'transparent',
              position: 'relative',
            }}
            aria-label={LABELS[m]}
            aria-pressed={active}
          >
            <MoodGlyph
              mood={m}
              size={isBar ? 20 : 26}
              color={active ? `var(--mood-${m})` : 'var(--ink-light)'}
            />
            {!isBar && (
              <span style={{
                fontFamily: 'var(--font-body)', fontSize: 11, fontStyle: 'italic',
                color: active ? 'var(--ink)' : 'var(--ink-faded)',
                textTransform: 'lowercase',
              }}>
                {LABELS[m]}
              </span>
            )}
            {active && !isBar && (
              <div style={{ position: 'absolute', bottom: -2, width: 20 }}>
                <HandUnderline width={20} strokeWidth={1.5} />
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
}
