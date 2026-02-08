import { Toaster } from 'sonner';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  // Admin route protection is handled by clerkMiddleware in proxy.ts
  return (
    <>
      {children}
      <Toaster position="top-right" richColors closeButton />
    </>
  );
}

// No indexar páginas de admin
export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};
