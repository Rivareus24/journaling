'use client'

import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import MoodGlyph from '@/components/ui/MoodGlyph'
import { formatDateShort } from '@/lib/dates'
import type { Entry, Mood } from '@/lib/types'

interface ArchiveDrawerProps {
  open: boolean
  entries: Entry[]
  currentDate: string
  onSelectEntry: (date: string) => void
  onClose: () => void
}

const MESI = ['', 'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
  'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre']

export default function ArchiveDrawer({
  open, entries, currentDate, onSelectEntry, onClose,
}: ArchiveDrawerProps) {
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  const firstEntry = entries[0]
  const currentMonth = firstEntry ? firstEntry.date.slice(0, 7) : null

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop — transparent, catches clicks outside */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'absolute', inset: 0, zIndex: 2,
              background: 'transparent',
            }}
          />
          {/* Drawer */}
          <motion.div
            initial={{ x: 380 }}
            animate={{ x: 0 }}
            exit={{ x: 380 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'absolute', top: 77, right: 0, bottom: 56,
              width: 380,
              background: 'var(--paper-warm)',
              borderLeft: '1px solid var(--rule)',
              boxShadow: 'var(--shadow-drawer)',
              zIndex: 3,
              display: 'flex', flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{ padding: '24px 24px 16px', borderBottom: '1px solid var(--rule)', flexShrink: 0 }}>
              <div style={{
                fontFamily: 'var(--font-ui)', fontSize: 11, letterSpacing: 2,
                textTransform: 'uppercase', color: 'var(--ink-faded)',
              }}>
                le pagine passate
              </div>
              {currentMonth && (
                <div style={{ marginTop: 6, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                  <div style={{ fontFamily: 'var(--font-title)', fontSize: 24, fontWeight: 400, letterSpacing: -0.3 }}>
                    {MESI[Number(currentMonth.split('-')[1])]} <span style={{ fontStyle: 'italic' }}>{currentMonth.split('-')[0]}</span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--ink-faded)', fontStyle: 'italic' }}>
                    {entries.length} {entries.length === 1 ? 'pagina' : 'pagine'}
                  </div>
                </div>
              )}
            </div>

            {/* Entry list */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {entries.map((entry) => {
                const { day, dowShort, monthShort } = formatDateShort(entry.date)
                const isActive = entry.date === currentDate
                return (
                  <button
                    key={entry.date}
                    onClick={() => onSelectEntry(entry.date)}
                    style={{
                      border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer',
                      padding: '18px 24px',
                      borderBottom: '1px solid var(--rule)',
                      display: 'flex', gap: 14,
                      background: isActive ? 'var(--accent-wash)' : 'transparent',
                    }}
                  >
                    <div style={{ width: 34, flexShrink: 0, textAlign: 'center' }}>
                      <div style={{ fontFamily: 'var(--font-title)', fontSize: 22, fontWeight: 400, lineHeight: 1 }}>{day}</div>
                      <div style={{ fontFamily: 'var(--font-ui)', fontSize: 9, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--ink-faded)', marginTop: 2 }}>{dowShort}</div>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        {entry.mood && <MoodGlyph mood={entry.mood as NonNullable<Mood>} size={13} />}
                        <span style={{ fontFamily: 'var(--font-ui)', fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--ink-faded)' }}>
                          {monthShort} · {day}
                        </span>
                      </div>
                      <div style={{
                        fontFamily: 'var(--font-body)', fontSize: 13, lineHeight: 1.45,
                        color: 'var(--ink-soft)',
                        overflow: 'hidden', display: '-webkit-box',
                        WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                      }}>
                        {entry.body || <span style={{ fontStyle: 'italic', color: 'var(--ink-faded)' }}>pagina vuota</span>}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
