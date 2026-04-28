import { NextResponse } from 'next/server';

export default function middleware(request) {
  const { pathname } = request.nextUrl;

  // Protect dashboard routes - check for session token cookie
  if (pathname.startsWith('/dashboard')) {
    const token =
      request.cookies.get('authjs.session-token') ||
      request.cookies.get('__Secure-authjs.session-token') ||
      request.cookies.get('next-auth.session-token') ||
      request.cookies.get('__Secure-next-auth.session-token');

    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  // Redirect authenticated users away from auth pages
  if (pathname.startsWith('/auth/')) {
    const token =
      request.cookies.get('authjs.session-token') ||
      request.cookies.get('__Secure-authjs.session-token') ||
      request.cookies.get('next-auth.session-token') ||
      request.cookies.get('__Secure-next-auth.session-token');

    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*'],
};
