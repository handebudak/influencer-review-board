// Middleware - Protected routes için auth check
import { NextResponse } from 'next/server';

export function middleware() {
  // Middleware'i şimdilik basit tutuyoruz
  // Auth check'i client-side yapacağız
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};

