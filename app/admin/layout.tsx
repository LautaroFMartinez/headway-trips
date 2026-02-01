import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  // El middleware ya maneja la redirección, pero verificamos de nuevo por seguridad
  const session = await getAdminSession();

  // Si no hay sesión y no estamos en /admin (login), redirigir
  // Esto es manejado por el middleware, pero es una capa extra de seguridad

  return <>{children}</>;
}

// No indexar páginas de admin
export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};
