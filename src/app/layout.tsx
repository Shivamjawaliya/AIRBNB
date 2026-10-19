import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Terracotta Serene - 1BHK Candolim | Whirlpool/WiFi - Condominiums for Rent in Candolim, Goa, India - Airbnb',
  description: 'Entire rental unit in Candolim, India. 4 guests · 1 bedroom · 1 bed · 1 bathroom. High-speed WiFi, Private whirlpool hot tub, and luxury furnishings.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body className="min-h-screen bg-white text-slate-800 flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
