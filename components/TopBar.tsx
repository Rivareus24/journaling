import Icon from '@/components/ui/Icon'
import MoodStrip from '@/components/MoodStrip'
import type { Entry } from '@/lib/types'

interface TopBarProps {
  recentEntries: Entry[]
  archiveOpen: boolean
  onArchiveToggle: () => void
  onSearchOpen: () => void
}

export default function TopBar({
  recentEntries, archiveOpen, onArchiveToggle, onSearchOpen,
}: TopBarProps) {
  return (
    <div style={{
      position: 'relative', zIndex: 2, flexShrink: 0,
      height: 77,
      padding: '0 36px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      borderBottom: '1px solid var(--rule)',
      background: 'var(--paper)',
    }}>
      {/* Left: logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontFamily: 'var(--font-title)', fontSize: 22, fontWeight: 500, letterSpacing: -0.3 }}>
            My Diary
          </span>
          <span style={{ fontFamily: 'var(--font-hand)', fontSize: 18, color: 'var(--accent)' }}>·</span>
          <span style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 14, color: 'var(--ink-faded)' }}>
            pensieri di tutti i giorni
          </span>
        </div>
      </div>

      {/* Center: mood strip */}
      <MoodStrip entries={recentEntries} />

      {/* Right: actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <button
          onClick={onSearchOpen}
          style={{
            ...btnReset,
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '7px 12px',
            borderRadius: 4,
            border: '1px solid var(--rule)',
            background: 'var(--page)',
          }}
        >
          <Icon name="search" size={15} color="var(--ink-soft)" />
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--ink-faded)' }}>
            cerca
          </span>
          <span style={{
            fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--ink-light)',
            padding: '1px 5px', border: '1px solid var(--rule)', borderRadius: 3, marginLeft: 8,
          }}>
            ⌘K
          </span>
        </button>
        <button onClick={onArchiveToggle} style={btnReset} aria-label="Archivio">
          <Icon name="book" size={20} color={archiveOpen ? 'var(--accent)' : 'var(--ink-soft)'} />
        </button>
        <button style={btnReset} aria-label="Statistiche">
          <Icon name="chart" size={20} color="var(--ink-soft)" />
        </button>
      </div>
    </div>
  )
}

const btnReset: React.CSSProperties = {
  border: 'none', background: 'transparent', padding: 0, cursor: 'pointer',
  fontFamily: 'inherit', color: 'inherit', display: 'flex', alignItems: 'center',
}
