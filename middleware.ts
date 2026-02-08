import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

const ADMIN_ROUTES = ['/admin/dashboard', '/admin/viajes', '/admin/cotizaciones', '/admin/mensajes', '/admin/reservas', '/admin/clientes', '/admin/blog'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Solo proteger rutas de admin (excepto /admin que es el login)
  const isProtectedRoute = ADMIN_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));

  if (isProtectedRoute && !user) {
    // Redirigir al login
    const loginUrl = new URL('/admin', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Si está logueado y va a /admin, redirigir a dashboard
  if (pathname === '/admin' && user) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/mis-reservas/:path*', '/auth/:path*'],
};
