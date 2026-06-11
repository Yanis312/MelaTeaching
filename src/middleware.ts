import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'

const intlMiddleware = createIntlMiddleware({
  locales: ['fr', 'ar', 'en'],
  defaultLocale: 'fr',
  localePrefix: 'as-needed',
})

const PUBLIC_PATHS = ['/login', '/register', '/ar/login', '/ar/register', '/en/login', '/en/register']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: () => {},
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const isPublic = PUBLIC_PATHS.some(p => pathname.startsWith(p)) || pathname === '/'

  if (!user && !isPublic) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
}
