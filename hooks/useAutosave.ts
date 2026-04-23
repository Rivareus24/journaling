import { useCallback, useEffect, useRef, useState } from 'react'
import { upsertEntry } from '@/lib/entries'
import type { Mood } from '@/lib/types'

export function useAutosave(
  date: string,
  body: string,
  mood: Mood,
  isDirty: boolean
) {
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState(false)

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const retryRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const failedDateRef = useRef<string | null>(null)
  const argsRef = useRef({ date, body, mood })
  argsRef.current = { date, body, mood }

  const doSave = useCallback(async () => {
    if (retryRef.current) clearTimeout(retryRef.current)
    const { date, body, mood } = argsRef.current
    setIsSaving(true)
    setSaveError(false)
    try {
      await upsertEntry(date, body, mood)
      failedDateRef.current = null
      setLastSavedAt(new Date())
    } catch {
      failedDateRef.current = date
      setSaveError(true)
      retryRef.current = setTimeout(() => {
        if (argsRef.current.date === failedDateRef.current) doSave()
      }, 30_000)
    } finally {
      setIsSaving(false)
    }
  }, [])

  useEffect(() => {
    if (!isDirty) return
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(doSave, 800)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [body, mood, isDirty, doSave])

  useEffect(() => {
    return () => {
      if (retryRef.current) clearTimeout(retryRef.current)
    }
  }, [])

  return { lastSavedAt, isSaving, saveError }
}
