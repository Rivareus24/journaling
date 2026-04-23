import { describe, it, expect } from 'vitest'
import { formatDateHeader, formatDateShort, isFutureDate, toISODate } from '@/lib/dates'

describe('formatDateHeader', () => {
  it('formats a Monday correctly', () => {
    const r = formatDateHeader('2026-04-20')
    expect(r.day).toBe(20)
    expect(r.monthLabel).toBe('aprile')
    expect(r.year).toBe(2026)
    expect(r.dowLabel).toBe('LUNEDÌ')
  })
  it('formats a Sunday correctly', () => {
    const r = formatDateHeader('2026-04-19')
    expect(r.dowLabel).toBe('DOMENICA')
  })
})

describe('formatDateShort', () => {
  it('returns short day and month', () => {
    const r = formatDateShort('2026-04-20')
    expect(r.day).toBe(20)
    expect(r.dowShort).toBe('lun')
    expect(r.monthShort).toBe('apr')
  })
})

describe('isFutureDate', () => {
  it('returns true for far future', () => {
    expect(isFutureDate('2099-01-01')).toBe(true)
  })
  it('returns false for past date', () => {
    expect(isFutureDate('2020-01-01')).toBe(false)
  })
})

describe('toISODate', () => {
  it('returns yyyy-mm-dd string', () => {
    const d = new Date(2026, 3, 20)  // April 20 2026 local time
    expect(toISODate(d)).toBe('2026-04-20')
  })
})
