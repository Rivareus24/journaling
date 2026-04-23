import { describe, it, expect } from 'vitest'
import { isValidToken } from '@/lib/token'

describe('isValidToken', () => {
  it('returns true when token matches secret', () => {
    expect(isValidToken('abc123', 'abc123')).toBe(true)
  })
  it('returns false when token does not match', () => {
    expect(isValidToken('wrong', 'abc123')).toBe(false)
  })
  it('returns false for undefined token', () => {
    expect(isValidToken(undefined, 'abc123')).toBe(false)
  })
  it('returns false for undefined secret', () => {
    expect(isValidToken('abc123', undefined)).toBe(false)
  })
  it('returns false for empty string', () => {
    expect(isValidToken('', 'abc123')).toBe(false)
  })
})
