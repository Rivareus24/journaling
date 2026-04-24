import { loginAction } from './action'

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  const hasError = searchParams.error === '1'

  return (
    <div
      className="paper-bg"
      style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ width: '100%', maxWidth: 360, padding: '0 24px' }}>
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <span
            style={{
              fontFamily: 'var(--font-title)',
              fontSize: 32,
              fontWeight: 400,
              letterSpacing: -0.5,
              color: 'var(--ink)',
            }}
          >
            journaling
          </span>
        </div>

        {/* Form */}
        <form action={loginAction} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label
              htmlFor="token"
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: 0.8,
                textTransform: 'uppercase',
                color: 'var(--ink-faded)',
              }}
            >
              Token di accesso
            </label>
            <input
              id="token"
              name="token"
              type="password"
              autoComplete="current-password"
              autoFocus
              required
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 16,
                padding: '10px 14px',
                background: 'var(--page)',
                border: `1px solid ${hasError ? 'var(--accent)' : 'var(--rule-strong)'}`,
                borderRadius: 'var(--radius-md)',
                color: 'var(--ink)',
                outline: 'none',
                width: '100%',
              }}
            />
            {hasError && (
              <span
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: 12,
                  color: 'var(--accent)',
                  fontStyle: 'italic',
                }}
              >
                Token non valido. Riprova.
              </span>
            )}
          </div>

          <button
            type="submit"
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: 0.3,
              padding: '10px 20px',
              background: 'var(--ink)',
              color: 'var(--paper)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              marginTop: 4,
            }}
          >
            Entra
          </button>
        </form>
      </div>
    </div>
  )
}
