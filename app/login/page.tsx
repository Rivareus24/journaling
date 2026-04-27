'use client'

import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <>
      <style>{`
        @keyframes riseUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .login-title {
          animation: riseUp 1s cubic-bezier(.22,.61,.36,1) 0.7s both;
        }
        .login-rule {
          animation: riseUp .7s ease 1.4s both;
        }
        .login-quote {
          animation: riseUp .8s ease 1.7s both;
        }
        .login-btn {
          animation: riseUp .8s ease 2.0s both;
        }
        .login-btn:hover {
          border-color: var(--ink-soft) !important;
          color: var(--ink) !important;
          background: rgba(43,38,32,0.04) !important;
          transform: translateY(-2px);
        }
      `}</style>

      <div
        className="paper-bg"
        style={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0 32px' }}>

          {/* journaling — handwritten */}
          <div
            className="login-title"
            style={{
              fontFamily: 'var(--font-hand)',
              fontWeight: 400,
              fontSize: 'clamp(72px, 18vw, 108px)',
              lineHeight: 1,
              letterSpacing: '-1px',
              color: 'var(--ink-soft)',
              opacity: 0,
            }}
          >
            journaling
          </div>

          {/* vertical accent line */}
          <div
            className="login-rule"
            style={{
              width: 1,
              height: 56,
              background: 'linear-gradient(to bottom, var(--accent), transparent)',
              margin: '20px 0 24px',
              opacity: 0,
            }}
          />

          {/* quote */}
          <p
            className="login-quote"
            style={{
              fontFamily: 'var(--font-body)',
              fontStyle: 'italic',
              fontWeight: 300,
              fontSize: 'clamp(17px, 3.5vw, 22px)',
              lineHeight: 1.7,
              color: 'var(--ink-soft)',
              maxWidth: 360,
              margin: '0 0 52px',
              opacity: 0,
            }}
          >
            &ldquo;The palest ink is better than<br />the most excellent memory.&rdquo;
          </p>

          {/* Google button */}
          <button
            className="login-btn"
            onClick={handleGoogleLogin}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 14,
              padding: '14px 36px',
              background: 'transparent',
              border: '1px solid var(--rule-strong)',
              borderRadius: 2,
              fontFamily: 'var(--font-ui)',
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: '0.5px',
              color: 'var(--ink-soft)',
              cursor: 'pointer',
              opacity: 0,
              transition: 'border-color .2s, color .2s, transform .15s, background .2s',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Accedi con Google
          </button>

        </div>
      </div>
    </>
  )
}
