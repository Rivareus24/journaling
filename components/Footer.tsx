'use client'

import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
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
  const router = useRouter()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div style={{
      position: 'relative', zIndex: 2, flexShrink: 0,
      height: 56, padding: '0 36px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: 'var(--paper-warm)',
      borderTop: '1px solid var(--rule)',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 16,
        fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--ink-faded)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <KeyHint>↑</KeyHint><KeyHint>↓</KeyHint>
          <span>sfoglia i giorni</span>
        </div>
        <span style={{ color: 'var(--rule-strong)' }}>·</span>
        <button
          onClick={handleSignOut}
          style={{
            background: 'none', border: 'none', padding: 0,
            fontFamily: 'var(--font-body)', fontSize: 13,
            color: 'var(--ink-faded)', cursor: 'pointer',
          }}
        >
          esci
        </button>
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', gap: 16,
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
        <a
          href="https://buymeacoffee.com/journaling24"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--ink-faded)', textDecoration: 'none' }}
        >
          ☕ offrimi un caffè
        </a>
      </div>
    </div>
  )
}
