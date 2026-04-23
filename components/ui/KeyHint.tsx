export default function KeyHint({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      minWidth: 22, height: 22, padding: '0 5px',
      fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 500,
      color: 'var(--ink-soft)',
      background: 'var(--page)',
      border: '1px solid var(--rule)',
      borderRadius: 3,
    }}>
      {children}
    </span>
  )
}
