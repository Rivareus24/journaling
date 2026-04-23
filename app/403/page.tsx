export default function ForbiddenPage() {
  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-body)',
      color: 'var(--ink-faded)',
      background: 'var(--paper)',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-title)', fontSize: 52, fontWeight: 300, color: 'var(--ink-light)' }}>
          403
        </div>
        <div style={{ marginTop: 8, fontStyle: 'italic', fontSize: 16 }}>
          Questo diario non è tuo.
        </div>
      </div>
    </div>
  )
}
