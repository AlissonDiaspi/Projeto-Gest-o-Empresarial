import type { Metadata } from 'next';

import {
  Geist,
  Geist_Mono,
  Inter,
} from 'next/font/google';

import './globals.css';

import { cn } from '@/lib/utils';

import { ThemeProvider } from '@/components/providers/theme-provider';

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
  title: 'Enterprise Management System',

  description:
    'Enterprise SaaS Platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',

          inter.variable,

          geistSans.variable,

          geistMono.variable,
        )}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}