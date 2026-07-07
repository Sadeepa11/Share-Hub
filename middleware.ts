import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('session')?.value;
  const session = await decrypt(sessionCookie);

  const isAuthRoute = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register');
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  const isProtectedUserRoute =
    request.nextUrl.pathname.startsWith('/dashboard') ||
    request.nextUrl.pathname.startsWith('/posts/create') ||
    request.nextUrl.pathname.startsWith('/requests');

  // If user is logged in and tries to access login/register, redirect to dashboard
  if (isAuthRoute && session) {
    if (session.role === 'admin') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If user is not logged in and tries to access protected route, redirect to login
  if (!session && (isProtectedUserRoute || isAdminRoute)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If user is logged in but not an admin, restrict from admin routes
  if (session && isAdminRoute && session.role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
