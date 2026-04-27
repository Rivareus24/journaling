import { NextRequest } from 'next/server'
import { vi, describe, it, expect, beforeEach } from 'vitest'

const mockGetUser = vi.fn()

vi.mock('@supabase/ssr', () => ({
  createServerClient: () => ({
    auth: { getUser: mockGetUser },
  }),
}))

function makeRequest(pathname: string) {
  return new NextRequest(`http://localhost:3000${pathname}`)
}

describe('middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('reindirizza a /login se non autenticato', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })
    const { middleware } = await import('../middleware')
    const res = await middleware(makeRequest('/'))
    expect(res.headers.get('location')).toContain('/login')
  })

  it('lascia passare le richieste autenticate', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-123' } } })
    const { middleware } = await import('../middleware')
    const res = await middleware(makeRequest('/'))
    expect(res.headers.get('location')).toBeNull()
  })

  it('non blocca /login quando non autenticato', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })
    const { middleware } = await import('../middleware')
    const res = await middleware(makeRequest('/login'))
    expect(res.headers.get('location')).toBeNull()
  })

  it('non blocca /auth/callback', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })
    const { middleware } = await import('../middleware')
    const res = await middleware(makeRequest('/auth/callback'))
    expect(res.headers.get('location')).toBeNull()
  })

  it('reindirizza utente autenticato da /login a /', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-123' } } })
    const { middleware } = await import('../middleware')
    const res = await middleware(makeRequest('/login'))
    expect(res.headers.get('location')).toContain('/')
  })
})
