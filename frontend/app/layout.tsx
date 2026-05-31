// app/layout.tsx
import type { Metadata } from 'next';
import {
  Geist,
  Geist_Mono,
  Inter,
} from 'next/font/google';

import './globals.css';

import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { AuthProvider } from '@/hooks/use-auth';
import { Toaster } from 'sonner';

import {
  OrganizationProvider,
} from '@/contexts/organization-context';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Enterprise Management',
  description: 'Enterprise Management System',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          inter.variable,
          geistSans.variable,
          geistMono.variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <AuthProvider>
            <OrganizationProvider>
              {children}
              <Toaster 
                position="top-right" 
                richColors 
                closeButton
                duration={4000}
              />
            </OrganizationProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}