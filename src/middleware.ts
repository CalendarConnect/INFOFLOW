import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check current route
  const path = request.nextUrl.pathname;
  
  // Redirect root to editor
  if (path === '/') {
    return NextResponse.redirect(new URL('/editor', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}; 