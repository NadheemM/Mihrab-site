'use client';

import { useEffect, useState } from 'react';

interface PrayerTimes {
  fajr: number;
  dhuhr: number;
  asr: number;
  maghrib: number;
  isha: number;
  sunrise: string; // formatted "5:58 AM"
  sunset: string;  // formatted "6:27 PM"
  raw: Record<string, string>;
}

export function usePrayerTimes(): PrayerTimes | null {
  const [data, setData] = useState<PrayerTimes | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      try {
        const res = await fetch(
          `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=2`
        );
        const json = await res.json();
        const t = json.data.timings;
        const convert = (time: string) => {
          const [h, m] = time.split(':').map(Number);
          return h + m / 60;
        };
        const fmt12 = (time: string) => {
          const [h, m] = time.split(':').map(Number);
          const ampm = h >= 12 ? 'PM' : 'AM';
          return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${ampm}`;
        };
        setData({
          fajr:    convert(t.Fajr),
          dhuhr:   convert(t.Dhuhr),
          asr:     convert(t.Asr),
          maghrib: convert(t.Maghrib),
          isha:    convert(t.Isha),
          sunrise: fmt12(t.Sunrise),
          sunset:  fmt12(t.Sunset),
          raw: t,
        });
      } catch { /* silently ignore — sky falls back to hour-based coloring */ }
    });
  }, []);

  return data;
}
