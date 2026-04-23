'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Icon from '@/components/ui/Icon'
import MoodGlyph from '@/components/ui/MoodGlyph'
import { searchEntries } from '@/lib/entries'
import { formatDateShort } from '@/lib/dates'
import type { Entry, Mood } from '@/lib/types'

interface SearchOverlayProps {
  entries: Entry[]
  onSelect: (date: string) => void
  onClose: () => void
}

export default function SearchOverlay({ entries, onSelect, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Entry[]>([])

  useEffect(() => {
    const id = setTimeout(() => {
      setResults(searchEntries(entries, query))
    }, 250)
    return () => clearTimeout(id)
  }, [query, entries])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 20,
        background: 'rgba(43,38,32,0.4)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        paddingTop: 120,
      }}
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 560,
          background: 'var(--page)',
          borderRadius: 8,
          boxShadow: 'var(--shadow-page)',
          overflow: 'hidden',
          margin: '0 16px',
        }}
      >
        {/* Input */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '16px 20px',
          borderBottom: results.length > 0 ? '1px solid var(--rule)' : 'none',
        }}>
          <Icon name="search" size={18} color="var(--ink-faded)" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cerca nei tuoi pensieri..."
            style={{
              flex: 1, border: 'none', outline: 'none', background: 'transparent',
              fontFamily: 'var(--font-body)', fontSize: 17, color: 'var(--ink)',
            }}
          />
          {query && (
            <button onClick={() => setQuery('')} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}>
              <Icon name="close" size={16} color="var(--ink-faded)" />
            </button>
          )}
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div style={{ maxHeight: 360, overflowY: 'auto' }}>
            {results.map((entry) => {
              const { day, dowShort, monthShort } = formatDateShort(entry.date)
              return (
                <button
                  key={entry.date}
                  onClick={() => onSelect(entry.date)}
                  style={{
                    border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer',
                    padding: '14px 20px',
                    borderBottom: '1px solid var(--rule)',
                    display: 'flex', gap: 14,
                    background: 'transparent',
                  }}
                >
                  <div style={{ width: 34, flexShrink: 0, textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-title)', fontSize: 20, fontWeight: 400, lineHeight: 1 }}>{day}</div>
                    <div style={{ fontFamily: 'var(--font-ui)', fontSize: 9, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--ink-faded)', marginTop: 2 }}>{dowShort}</div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      {entry.mood && <MoodGlyph mood={entry.mood as NonNullable<Mood>} size={12} />}
                      <span style={{ fontFamily: 'var(--font-ui)', fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--ink-faded)' }}>
                        {monthShort} · {day}
                      </span>
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-body)', fontSize: 13, lineHeight: 1.45, color: 'var(--ink-soft)',
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

        {query && results.length === 0 && (
          <div style={{ padding: '24px 20px', fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 14, color: 'var(--ink-faded)', textAlign: 'center' }}>
            Nessuna pagina trovata.
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
