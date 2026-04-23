import { describe, it, expect, vi } from 'vitest'

vi.mock('@/lib/supabase', () => ({ supabase: {} }))

import { searchEntries } from '@/lib/entries'
import type { Entry } from '@/lib/types'

const mockEntries: Entry[] = [
  { id: '1', date: '2026-04-20', body: 'Ho camminato nel parco sotto il sole', mood: 'good', created_at: '', updated_at: '' },
  { id: '2', date: '2026-04-19', body: 'Cena lunga con Marco e Luisa', mood: 'great', created_at: '', updated_at: '' },
  { id: '3', date: '2026-04-18', body: 'Giornata pesante al lavoro', mood: 'low', created_at: '', updated_at: '' },
]

describe('searchEntries', () => {
  it('returns empty array for empty query', () => {
    expect(searchEntries(mockEntries, '')).toEqual([])
  })
  it('returns empty array for whitespace-only query', () => {
    expect(searchEntries(mockEntries, '   ')).toEqual([])
  })
  it('finds entries by exact word', () => {
    const results = searchEntries(mockEntries, 'parco')
    expect(results.length).toBeGreaterThan(0)
    expect(results[0].date).toBe('2026-04-20')
  })
  it('does fuzzy matching', () => {
    const results = searchEntries(mockEntries, 'Marco')
    expect(results.length).toBeGreaterThan(0)
  })
  it('returns empty for no match', () => {
    const results = searchEntries(mockEntries, 'zzzzzzzzz')
    expect(results).toEqual([])
  })
})
