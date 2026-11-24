import type { Metadata } from 'next';
import './globals.css';

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
    <html lang="en">
      <body
        className="bg-[#F1F5F9] text-[#0F172A] font-sans antialiased selection:bg-[#1D5C59]/15 selection:text-[#0F172A]"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
