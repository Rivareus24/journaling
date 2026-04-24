'use client'

import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useIsMobile } from '@/hooks/useIsMobile'
import { useAutosave } from '@/hooks/useAutosave'
import { useKeyboardNav } from '@/hooks/useKeyboardNav'
import { getEntry, getRecentEntries, getAllEntries } from '@/lib/entries'
import { toISODate, isFutureDate } from '@/lib/dates'
import { getRandomPrompt } from '@/lib/prompts'
import type { Entry, Mood } from '@/lib/types'
import TopBar from '@/components/TopBar'
import DiaryPage from '@/components/DiaryPage'
import Footer from '@/components/Footer'
import ArchiveDrawer from '@/components/ArchiveDrawer'
import BottomSheet from '@/components/BottomSheet'
import SearchOverlay from '@/components/SearchOverlay'
import MoodPicker from '@/components/MoodPicker'
import PaperNoise from '@/components/ui/PaperNoise'

export default function Home() {
  const isMobile = useIsMobile()
  const today = toISODate(new Date())

  const [currentDate, setCurrentDate] = useState(today)
  const [draftBody, setDraftBody] = useState('')
  const [draftMood, setDraftMood] = useState<Mood>(null)
  const [isDirty, setIsDirty] = useState(false)
  const [recentEntries, setRecentEntries] = useState<Entry[]>([])
  const [allEntries, setAllEntries] = useState<Entry[]>([])
  const [archiveOpen, setArchiveOpen] = useState(false)
  const [sheetState, setSheetState] = useState<'peek' | 'half' | 'full' | 'hidden'>('peek')
  const [searchOpen, setSearchOpen] = useState(false)
  const [prompt] = useState(getRandomPrompt)

  const { lastSavedAt, saveError, flush } = useAutosave(currentDate, draftBody, draftMood, isDirty)

  // Load entry when date changes
  useEffect(() => {
    setDraftBody('')
    setDraftMood(null)
    setIsDirty(false)
    getEntry(currentDate).then((entry) => {
      if (entry) {
        setDraftBody(entry.body)
        setDraftMood(entry.mood)
      }
    })
  }, [currentDate])

  // Load recent 14 days (refresh after each save)
  useEffect(() => {
    getRecentEntries(14).then(setRecentEntries)
  }, [lastSavedAt])

  // Load all entries lazily for search
  useEffect(() => {
    if (searchOpen && allEntries.length === 0) {
      getAllEntries().then(setAllEntries)
    }
  }, [searchOpen])

  const goToPrevDay = useCallback(() => {
    flush()
    const d = new Date(currentDate + 'T12:00:00')
    d.setDate(d.getDate() - 1)
    setCurrentDate(toISODate(d))
  }, [currentDate, flush])

  const goToNextDay = useCallback(() => {
    flush()
    const d = new Date(currentDate + 'T12:00:00')
    d.setDate(d.getDate() + 1)
    if (toISODate(d) <= today) setCurrentDate(toISODate(d))
  }, [currentDate, today, flush])

  const goToToday = useCallback(() => { flush(); setCurrentDate(today) }, [today, flush])

  useKeyboardNav({
    onPrevDay: goToPrevDay,
    onNextDay: goToNextDay,
    onSearch: () => setSearchOpen(true),
    onArchive: () => setArchiveOpen((v) => !v),
  })

  const handleBodyChange = (body: string) => { setDraftBody(body); setIsDirty(true) }
  const handleMoodChange = (mood: Mood) => { setDraftMood(mood); setIsDirty(true) }

  const isFuture = isFutureDate(currentDate)

  // Mobile layout
  if (isMobile) {
    return (
      <div
        className="paper-bg"
        style={{ height: '100dvh', position: 'relative', overflow: 'hidden', fontFamily: 'var(--font-body)', color: 'var(--ink)' }}
      >
        <PaperNoise opacity={0.3} />

        {/* Page card */}
        <div style={{
          position: 'absolute', top: 16, left: 16, right: 16,
          bottom: 96,
          display: 'flex', flexDirection: 'column',
        }}>
          <DiaryPage
            currentDate={currentDate}
            draftBody={draftBody}
            draftMood={draftMood}
            onChange={handleBodyChange}
            onMoodChange={handleMoodChange}
            isFuture={isFuture}
            prompt={prompt}
            variant="mobile"
            onEditorFocus={() => setSheetState('hidden')}
            onEditorBlur={() => setSheetState((s) => s === 'hidden' ? 'peek' : s)}
          />
        </div>

        {/* Mood bar above sheet */}
        <div style={{
          position: 'absolute', left: 16, right: 16, bottom: 56,
          background: 'var(--paper-warm)',
          borderTop: '1px solid var(--rule)',
          padding: '10px 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderRadius: '0 0 3px 3px',
        }}>
          <div style={{ fontFamily: 'var(--font-title)', fontSize: 13, fontStyle: 'italic', color: 'var(--ink-faded)', fontWeight: 300 }}>
            com&apos;è andata?
          </div>
          <MoodPicker current={draftMood} onChange={handleMoodChange} variant="bar" />
        </div>

        <BottomSheet
          state={sheetState}
          onStateChange={setSheetState}
          entries={recentEntries}
          onSelectEntry={(date) => { flush(); setCurrentDate(date); setSheetState('peek') }}
        />

        <AnimatePresence>
          {searchOpen && (
            <SearchOverlay
              entries={allEntries}
              onSelect={(date) => { flush(); setCurrentDate(date); setSearchOpen(false) }}
              onClose={() => setSearchOpen(false)}
            />
          )}
        </AnimatePresence>
      </div>
    )
  }

  // Web layout
  return (
    <div
      className="paper-bg"
      style={{
        height: '100vh', position: 'relative', overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        fontFamily: 'var(--font-body)', color: 'var(--ink)',
      }}
    >
      <PaperNoise opacity={0.35} />

      <TopBar
        recentEntries={recentEntries}
        archiveOpen={archiveOpen}
        onArchiveToggle={() => setArchiveOpen((v) => !v)}
        onSearchOpen={() => setSearchOpen(true)}
      />

      <main style={{ flex: 1, display: 'flex', justifyContent: 'center', overflow: 'hidden', padding: '40px 0 0' }}>
        <DiaryPage
          currentDate={currentDate}
          draftBody={draftBody}
          draftMood={draftMood}
          onChange={handleBodyChange}
          onMoodChange={handleMoodChange}
          isFuture={isFuture}
          prompt={prompt}
        />
      </main>

      <Footer
        lastSavedAt={lastSavedAt}
        saveError={saveError}
        onPrevDay={goToPrevDay}
        onNextDay={goToNextDay}
      />

      <ArchiveDrawer
        open={archiveOpen}
        entries={recentEntries}
        currentDate={currentDate}
        onSelectEntry={(date) => { flush(); setCurrentDate(date); setArchiveOpen(false) }}
        onClose={() => setArchiveOpen(false)}
      />

      <AnimatePresence>
        {searchOpen && (
          <SearchOverlay
            entries={allEntries}
            onSelect={(date) => { setCurrentDate(date); setSearchOpen(false) }}
            onClose={() => setSearchOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
