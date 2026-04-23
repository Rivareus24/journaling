import { describe, it, expect } from 'vitest'
import { getRandomPrompt, PROMPTS } from '@/lib/prompts'

describe('getRandomPrompt', () => {
  it('returns a string', () => {
    expect(typeof getRandomPrompt()).toBe('string')
  })
  it('returns a question ending with ?', () => {
    for (let i = 0; i < 20; i++) {
      expect(getRandomPrompt()).toMatch(/\?$/)
    }
  })
  it('returns a value from the PROMPTS pool', () => {
    const p = getRandomPrompt()
    expect(PROMPTS).toContain(p)
  })
  it('returns varied results', () => {
    const results = new Set(Array.from({ length: 100 }, () => getRandomPrompt()))
    expect(results.size).toBeGreaterThan(1)
  })
})
