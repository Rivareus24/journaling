import Fuse from 'fuse.js'
import { supabase } from './supabase'
import type { Entry, Mood } from './types'

export async function getEntry(date: string): Promise<Entry | null> {
  const { data } = await supabase
    .from('entries')
    .select('*')
    .eq('date', date)
    .maybeSingle()
  return data
}

export async function upsertEntry(date: string, body: string, mood: Mood): Promise<void> {
  const { error } = await supabase.from('entries').upsert(
    { date, body, mood, updated_at: new Date().toISOString() },
    { onConflict: 'date' }
  )
  if (error) throw new Error(error.message)
}

export async function getRecentEntries(days: number): Promise<Entry[]> {
  const since = new Date()
  since.setDate(since.getDate() - days + 1)
  const sinceISO = since.toISOString().split('T')[0]
  const { data } = await supabase
    .from('entries')
    .select('*')
    .gte('date', sinceISO)
    .order('date', { ascending: false })
  return data ?? []
}

export async function getAllEntries(): Promise<Entry[]> {
  const { data } = await supabase
    .from('entries')
    .select('*')
    .order('date', { ascending: false })
  return data ?? []
}

export function searchEntries(entries: Entry[], query: string): Entry[] {
  if (!query.trim()) return []
  const fuse = new Fuse(entries, {
    keys: ['body'],
    threshold: 0.4,
    includeScore: false,
  })
  return fuse.search(query).map((r) => r.item)
}
