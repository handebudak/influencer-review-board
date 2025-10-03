// Middleware - Protected routes için auth check
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Middleware'i şimdilik basit tutuyoruz
  // Auth check'i client-side yapacağız
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};

