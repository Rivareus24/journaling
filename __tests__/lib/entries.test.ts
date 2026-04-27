import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Entry } from '@/lib/types'

const { mockGetUser, mockUpsert } = vi.hoisted(() => ({
  mockGetUser: vi.fn(),
  mockUpsert: vi.fn(),
}))

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: { getUser: mockGetUser },
    from: () => ({ upsert: mockUpsert, select: vi.fn(), eq: vi.fn(), maybeSingle: vi.fn(), gte: vi.fn(), order: vi.fn() }),
  },
}))

import { searchEntries, upsertEntry } from '@/lib/entries'

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

describe('upsertEntry', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('include user_id nel payload e usa onConflict corretto', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-abc' } } })
    mockUpsert.mockResolvedValue({ error: null })

    await upsertEntry('2026-04-27', 'testo', 'good')

    expect(mockGetUser).toHaveBeenCalled()
    expect(mockUpsert).toHaveBeenCalledWith(
      expect.objectContaining({ user_id: 'user-abc', date: '2026-04-27', body: 'testo', mood: 'good' }),
      expect.objectContaining({ onConflict: 'date,user_id' })
    )
  })

  it('lancia errore se non autenticato', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })

    await expect(upsertEntry('2026-04-27', 'testo', 'good')).rejects.toThrow('Not authenticated')
  })
})
