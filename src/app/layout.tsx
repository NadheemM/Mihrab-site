import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TransitionProvider from '@/components/TransitionProvider';
import { PrayerTimesProvider } from '@/lib/PrayerTimesContext';

export const metadata: Metadata = {
  title: 'Mihrab — Connect with Masjids & Grow in Faith',
  description: 'Mihrab connects the Ummah with accurate prayer times, masjid directories, community news, and local business listings.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <PrayerTimesProvider>
          <Navbar />
          {/* pt accounts for fixed navbar height; hero pages override this with their own full-height section */}
          <main style={{ flex: 1, paddingTop: '64px' }}>
            <TransitionProvider>{children}</TransitionProvider>
          </main>
          <Footer />
        </PrayerTimesProvider>
      </body>
    </html>
  );
}
