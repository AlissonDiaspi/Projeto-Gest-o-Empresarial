
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { AuthProvider } from '@/hooks/use-auth';
import { Toaster } from 'sonner';
import { OrganizationProvider } from '@/contexts/organization-context';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  console.log = () => {};
  console.info = () => {};
  console.debug = () => {};
}

export const metadata: Metadata = {
  title: 'Enterprise Management',
  description: 'Sistema de Gestão Empresarial',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={cn('min-h-screen bg-background font-sans antialiased', inter.variable)}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <OrganizationProvider>
              {children}
              <Toaster position="top-right" richColors closeButton duration={4000} />
            </OrganizationProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}