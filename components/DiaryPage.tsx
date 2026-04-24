'use client'

import { useEffect, useRef } from 'react'
import HandUnderline from '@/components/ui/HandUnderline'
import MoodPicker from '@/components/MoodPicker'
import PaperNoise from '@/components/ui/PaperNoise'
import { formatDateHeader } from '@/lib/dates'
import type { Mood } from '@/lib/types'

interface DiaryPageProps {
  currentDate: string
  draftBody: string
  draftMood: Mood
  onChange: (body: string) => void
  onMoodChange: (mood: Mood) => void
  isFuture: boolean
  prompt: string
  variant?: 'web' | 'mobile'
  onEditorFocus?: () => void
  onEditorBlur?: () => void
}

export default function DiaryPage({
  currentDate, draftBody, draftMood,
  onChange, onMoodChange, isFuture, prompt,
  variant = 'web',
  onEditorFocus,
  onEditorBlur,
}: DiaryPageProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const isUserEditing = useRef(false)
  const { dowLabel, day, monthLabel, year } = formatDateHeader(currentDate)
  const isMobile = variant === 'mobile'

  // Sync external draftBody → contentEditable (skips updates while user is typing)
  useEffect(() => {
    const el = editorRef.current
    if (!el || isUserEditing.current) return
    if (el.textContent !== draftBody) {
      el.textContent = draftBody
    }
  }, [currentDate, draftBody])

  function scrollToCursor() {
    const container = scrollRef.current
    if (!container) return
    const sel = window.getSelection()
    if (!sel || sel.rangeCount === 0) return
    const range = sel.getRangeAt(0).cloneRange()
    range.collapse(false)
    const rect = range.getBoundingClientRect()
    const containerRect = container.getBoundingClientRect()
    if (rect.bottom > containerRect.bottom - 8) {
      container.scrollTop += rect.bottom - containerRect.bottom + 24
    }
  }

  const pageStyle: React.CSSProperties = isMobile
    ? {
        background: 'var(--page)',
        boxShadow: '0 1px 2px rgba(60,45,20,0.06), 0 8px 24px rgba(60,45,20,0.08)',
        borderRadius: '3px 3px 0 0',
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        position: 'relative',
        flex: 1,
      }
    : {
        width: 720, maxWidth: '100%',
        height: '100%',
        background: 'var(--page)',
        boxShadow: 'var(--shadow-page)',
        borderRadius: 'var(--radius-page)',
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        position: 'relative',
      }

  return (
    <div style={pageStyle}>
      <PaperNoise opacity={isMobile ? 0.25 : 0.3} />

      {/* Top deckle edge */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 4,
        background: 'var(--page-edge)', opacity: 0.4,
      }} />

      {/* Bookmark ribbon */}
      <div style={{
        position: 'absolute', top: 0, left: isMobile ? 24 : 56,
        width: isMobile ? 12 : 16,
        height: isMobile ? 48 : 64,
        background: 'var(--accent)', opacity: 0.85,
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 82%, 0 100%)',
      }} />

      {/* Mobile top spacer for bookmark alignment */}
      {isMobile && (
        <div style={{ height: 14 }} />
      )}

      {/* Date header */}
      <div style={{
        padding: isMobile ? '20px 32px 24px' : '64px 88px 32px',
        textAlign: 'center', position: 'relative',
      }}>
        <div style={{
          fontFamily: 'var(--font-ui)', fontSize: isMobile ? 10 : 11, fontWeight: 500,
          letterSpacing: isMobile ? 2 : 2.5, textTransform: 'uppercase', color: 'var(--ink-faded)',
        }}>
          {dowLabel}
        </div>
        <div style={{
          marginTop: 10,
          fontFamily: 'var(--font-title)',
          fontSize: isMobile ? 40 : 52,
          fontWeight: 300, lineHeight: 1,
          letterSpacing: isMobile ? -1 : -1.5,
          color: 'var(--ink)',
        }}>
          {day} <span style={{ fontStyle: 'italic' }}>{monthLabel}</span>
        </div>
        <div style={{
          marginTop: 6, fontFamily: 'var(--font-title)', fontStyle: 'italic',
          fontSize: isMobile ? 14 : 17, color: 'var(--ink-faded)', fontWeight: 300,
        }}>
          {year}
        </div>
        <div style={{ marginTop: isMobile ? 10 : 16, display: 'flex', justifyContent: 'center' }}>
          <HandUnderline width={isMobile ? 80 : 120} strokeWidth={isMobile ? 1.6 : 1.8} seed={1} />
        </div>
      </div>

      {/* Editor */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          padding: isMobile ? '0 30px 30px' : '0 88px',
          overflow: 'auto', position: 'relative',
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            const el = editorRef.current
            if (!el) return
            el.focus()
            const range = document.createRange()
            range.selectNodeContents(el)
            range.collapse(false)
            window.getSelection()?.removeAllRanges()
            window.getSelection()?.addRange(range)
          }
        }}
      >
        {isFuture ? (
          <p style={{
            fontFamily: 'var(--font-body)', fontStyle: 'italic',
            fontSize: isMobile ? 16 : 19, color: 'var(--ink-faded)',
            textAlign: 'center', marginTop: 40,
          }}>
            Questo giorno non è ancora arrivato.
          </p>
        ) : (
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onFocus={onEditorFocus}
            onBlur={onEditorBlur}
            onInput={(e) => {
              isUserEditing.current = true
              onChange((e.target as HTMLDivElement).textContent ?? '')
              requestAnimationFrame(() => {
                isUserEditing.current = false
                scrollToCursor()
              })
            }}
            className={isMobile ? 'diary-editor-mobile' : 'diary-editor'}
            data-placeholder={prompt}
            style={{ minHeight: 200, outline: 'none' }}
          />
        )}
      </div>

      {/* Mood picker row (web only) */}
      {!isMobile && (
        <div style={{
          padding: '28px 88px 40px',
          borderTop: '1px dashed var(--rule)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <div style={{
            fontFamily: 'var(--font-title)', fontStyle: 'italic',
            fontSize: 16, color: 'var(--ink-faded)', fontWeight: 300,
          }}>
            com&apos;è andata oggi?
          </div>
          <MoodPicker current={draftMood} onChange={onMoodChange} />
        </div>
      )}
    </div>
  )
}
