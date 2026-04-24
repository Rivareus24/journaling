import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === '/login') {
    return NextResponse.next()
  }

  const cookieToken = request.cookies.get('diary_token')?.value
  const secret = process.env.DIARY_TOKEN

  if (!secret || cookieToken !== secret) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|403).*)'],
}
