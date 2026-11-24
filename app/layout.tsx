import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, DM_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Communication Mastery Workbook',
  description:
    'An interactive deliberate practice workbook for mastering the four core communication micro-skills, daily progressive tier logs, and weekly calibration.',
  openGraph: {
    title: 'Communication Mastery Workbook',
    description:
      'An interactive deliberate practice workbook for mastering the four core communication micro-skills, daily progressive tier logs, and weekly calibration.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Communication Mastery Workbook',
    description:
      'An interactive deliberate practice workbook for mastering the four core communication micro-skills, daily progressive tier logs, and weekly calibration.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
    >
      <body
        className="bg-[#F1F5F9] text-[#0F172A] font-sans antialiased selection:bg-[#1D5C59]/15 selection:text-[#0F172A]"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
