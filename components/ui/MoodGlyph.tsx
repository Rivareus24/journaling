import type { Mood } from '@/lib/types'

interface MoodGlyphProps {
  mood: NonNullable<Mood>
  size?: number
  color?: string
}

const PATHS: Record<NonNullable<Mood>, string> = {
  great: 'M3,13 Q10,3 17,8 Q19,10 17,13',
  good:  'M3,12 Q10,7 17,10',
  low:   'M3,10 Q10,14 17,11',
  bad:   'M3,8 Q10,16 17,9',
}

const COLORS: Record<NonNullable<Mood>, string> = {
  great: 'var(--mood-great)',
  good:  'var(--mood-good)',
  low:   'var(--mood-low)',
  bad:   'var(--mood-bad)',
}

export default function MoodGlyph({ mood, size = 20, color }: MoodGlyphProps) {
  const c = color ?? COLORS[mood]
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" style={{ display: 'block' }}>
      <circle cx="10" cy="10" r="8.5" fill="none" stroke={c} strokeWidth="1.2" opacity="0.5" />
      <path d={PATHS[mood]} fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}
