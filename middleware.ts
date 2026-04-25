// @ts-ignore
import { NextResponse } from 'next/server';
// @ts-ignore
import type { NextRequest } from 'next/server';
// Nota: Importar createMiddlewareClient de @supabase/auth-helpers-nextjs o @supabase/ssr según la versión de Next.js

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  // 1. Verificar sesión (Lógica simplificada para el blueprint)
  // const supabase = createMiddlewareClient({ req, res });
  // const { data: { session } } = await supabase.auth.getSession();
  const session = null; // Simular falta de sesión

  const { pathname } = req.nextUrl;

  // 2. Proteger rutas principales
  if (!session && (pathname.startsWith('/waiter') || pathname.startsWith('/kitchen') || pathname.startsWith('/admin'))) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/login';
    return NextResponse.redirect(redirectUrl);
  }

  // 3. Control de acceso por rol
  // const role = session?.user?.user_metadata?.role;
  const role = 'cocinero'; // Simulación para el ejemplo solicitado

  if (role === 'cocinero' && pathname.startsWith('/admin/ventas')) {
    const unauthorizedUrl = req.nextUrl.clone();
    unauthorizedUrl.pathname = '/unauthorized';
    return NextResponse.redirect(unauthorizedUrl);
  }

  return res;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
