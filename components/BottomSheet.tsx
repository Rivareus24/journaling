'use client'

import { useRef } from 'react'
import { motion, useMotionValue, animate } from 'framer-motion'
import MoodGlyph from '@/components/ui/MoodGlyph'
import Icon from '@/components/ui/Icon'
import { formatDateShort } from '@/lib/dates'
import type { Entry, Mood } from '@/lib/types'

export type SheetState = 'peek' | 'half' | 'full' | 'hidden'

interface BottomSheetProps {
  state: SheetState
  onStateChange: (state: SheetState) => void
  entries: Entry[]
  onSelectEntry: (date: string) => void
}

const SHEET_HEIGHT = 740
const SNAP: Record<'peek' | 'half' | 'full', number> = { peek: 56, half: 420, full: 740 }

const MESI = ['', 'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
  'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre']

function stateToY(state: SheetState) {
  if (state === 'hidden') return SHEET_HEIGHT
  return SHEET_HEIGHT - SNAP[state]
}

export default function BottomSheet({ state, onStateChange, entries, onSelectEntry }: BottomSheetProps) {
  const y = useMotionValue(stateToY(state))
  const isPeek = state === 'peek'

  const currentMonth = entries.length > 0 ? entries[0].date.slice(0, 7) : null

  function snapTo(newState: 'peek' | 'half' | 'full') {
    onStateChange(newState)
    animate(y, stateToY(newState), { type: 'spring', stiffness: 400, damping: 40 })
  }

  function onDragEnd() {
    const current = y.get()
    const distances = (Object.entries(SNAP) as ['peek' | 'half' | 'full', number][]).map(
      ([st]) => ({ st, dist: Math.abs(current - stateToY(st)) })
    )
    const nearest = distances.reduce((a, b) => (a.dist < b.dist ? a : b))
    snapTo(nearest.st)
  }

  // Sync external state changes (including hidden)
  const prevState = useRef(state)
  if (prevState.current !== state) {
    prevState.current = state
    animate(y, stateToY(state), { type: 'spring', stiffness: 400, damping: 40 })
  }

  return (
    <motion.div
      style={{
        position: 'fixed', left: 0, right: 0, bottom: 0,
        height: SHEET_HEIGHT,
        background: 'var(--paper-warm)',
        borderRadius: 'var(--radius-sheet)',
        boxShadow: 'var(--shadow-sheet)',
        borderTop: '1px solid var(--rule-strong)',
        y,
        display: 'flex', flexDirection: 'column',
        zIndex: 10,
      }}
      drag="y"
      dragConstraints={{ top: 0, bottom: stateToY('peek') }}
      dragElastic={0.05}
      onDragEnd={onDragEnd}
    >
      {/* Handle */}
      <div
        style={{ padding: '8px 0 6px', display: 'flex', justifyContent: 'center', flexShrink: 0 }}
        onClick={() => isPeek && snapTo('half')}
      >
        <div style={{ width: 40, height: 4, borderRadius: 2, background: 'var(--ink-light)' }} />
      </div>

      {/* Header */}
      <div
        style={{ padding: '0 24px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, cursor: isPeek ? 'pointer' : 'default' }}
        onClick={() => isPeek && snapTo('half')}
      >
        <div>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--ink-faded)', fontWeight: 500 }}>
            le pagine passate
          </div>
          {!isPeek && currentMonth && (
            <div style={{ marginTop: 4, fontFamily: 'var(--font-title)', fontSize: 22, fontWeight: 400, letterSpacing: -0.3 }}>
              {MESI[Number(currentMonth.split('-')[1])]} <span style={{ fontStyle: 'italic' }}>{currentMonth.split('-')[0]}</span>
            </div>
          )}
        </div>
        {isPeek
          ? <Icon name="arrowUp" size={14} color="var(--ink-light)" />
          : (
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--ink-faded)', fontStyle: 'italic' }}>
              {entries.length} {entries.length === 1 ? 'pagina' : 'pagine'}
            </div>
          )
        }
      </div>

      {/* Full list */}
      {!isPeek && (
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {entries.map((entry) => {
            const { day, dowShort, monthShort } = formatDateShort(entry.date)
            return (
              <button
                key={entry.date}
                onClick={() => onSelectEntry(entry.date)}
                style={{
                  border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer',
                  padding: '14px 24px',
                  borderTop: '1px solid var(--rule)',
                  display: 'flex', gap: 14,
                  background: 'transparent',
                }}
              >
                <div style={{ textAlign: 'center', width: 34, flexShrink: 0 }}>
                  <div style={{ fontFamily: 'var(--font-title)', fontSize: 22, fontWeight: 400, lineHeight: 1 }}>{day}</div>
                  <div style={{ fontFamily: 'var(--font-ui)', fontSize: 9, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--ink-faded)', marginTop: 2 }}>{dowShort}</div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                    {entry.mood && <MoodGlyph mood={entry.mood as NonNullable<Mood>} size={12} />}
                    <span style={{ fontFamily: 'var(--font-ui)', fontSize: 9, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--ink-faded)' }}>
                      {monthShort} · {day}
                    </span>
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-body)', fontSize: 13, lineHeight: 1.4, color: 'var(--ink-soft)',
                    overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                  }}>
                    {entry.body}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}
