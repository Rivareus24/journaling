import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Single-segment paths are token-setting routes — skip protection
  const segment = pathname.slice(1)
  if (segment && !segment.includes('/')) {
    return NextResponse.next()
  }

  const cookieToken = request.cookies.get('diary_token')?.value
  const secret = process.env.DIARY_TOKEN

  if (!secret || cookieToken !== secret) {
    return NextResponse.redirect(new URL('/403', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|403).*)'],
}
