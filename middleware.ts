// @ts-ignore
import { NextResponse } from 'next/server';
// @ts-ignore
import type { NextRequest } from 'next/server';

/**
 * Middleware compatible con Vercel Edge Runtime.
 * Evita importar librerías pesadas. Solo lógica de tokens y rutas.
 */
export function middleware(request: NextRequest) {
  // En una app real, Supabase guarda la sesión en una cookie llamada 'sb-access-token'
  const session = request.cookies.get('sb-access-token');
  const { pathname } = request.nextUrl;

  // 1. Protección de rutas: Si no hay sesión, al login
  if (!session && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. Control granular (Ejem: Admin)
  const role = request.cookies.get('user-role')?.value;

  if (role === 'cocinero' && (pathname.includes('/admin') || pathname.includes('/waiter'))) {
    return NextResponse.redirect(new URL('/dashboard/kitchen', request.url));
  }

  if (role === 'mesero' && (pathname.includes('/admin') || pathname.includes('/kitchen'))) {
    return NextResponse.redirect(new URL('/dashboard/waiter', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};
