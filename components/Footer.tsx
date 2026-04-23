import KeyHint from '@/components/ui/KeyHint'

interface FooterProps {
  lastSavedAt: Date | null
  saveError: boolean
  onPrevDay: () => void
  onNextDay: () => void
}

function timeAgo(date: Date): string {
  const minutes = Math.round((Date.now() - date.getTime()) / 60_000)
  if (minutes < 1) return 'adesso'
  if (minutes === 1) return '1 minuto fa'
  return `${minutes} minuti fa`
}

export default function Footer({ lastSavedAt, saveError }: FooterProps) {
  return (
    <div style={{
      position: 'relative', zIndex: 2, flexShrink: 0,
      height: 56, padding: '0 36px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: 'var(--paper-warm)',
      borderTop: '1px solid var(--rule)',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--ink-faded)',
      }}>
        <KeyHint>↑</KeyHint><KeyHint>↓</KeyHint>
        <span>sfoglia i giorni</span>
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--ink-faded)',
      }}>
        {saveError ? (
          <>
            <span style={{ width: 6, height: 6, borderRadius: 3, background: 'var(--mood-bad)', display: 'inline-block' }} />
            <span>errore nel salvataggio — riprovo...</span>
          </>
        ) : lastSavedAt ? (
          <>
            <span style={{ width: 6, height: 6, borderRadius: 3, background: 'var(--mood-good)', display: 'inline-block' }} />
            <span>salvato {timeAgo(lastSavedAt)}</span>
          </>
        ) : null}
      </div>
    </div>
  )
}
