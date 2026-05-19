'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface PrayerTimes {
  fajr:    number;
  dhuhr:   number;
  asr:     number;
  maghrib: number;
  isha:    number;
  sunrise: string;
  sunset:  string;
  raw:     Record<string, string>;
}

const Ctx = createContext<PrayerTimes | null>(null);

function toDecimal(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h + m / 60;
}

function fmt12(time: string): string {
  const [h, m] = time.split(':').map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
}

export function PrayerTimesProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<PrayerTimes | null>(null);

  useEffect(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        try {
          const res = await fetch(
            `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=2`
          );
          if (!res.ok) return;
          const json = await res.json();
          const t = json.data.timings;
          setData({
            fajr:    toDecimal(t.Fajr),
            dhuhr:   toDecimal(t.Dhuhr),
            asr:     toDecimal(t.Asr),
            maghrib: toDecimal(t.Maghrib),
            isha:    toDecimal(t.Isha),
            sunrise: fmt12(t.Sunrise),
            sunset:  fmt12(t.Sunset),
            raw: t,
          });
        } catch { /* silent — components handle null gracefully */ }
      },
      () => { /* permission denied — data stays null */ },
      { timeout: 10_000 }
    );
  }, []);

  return <Ctx.Provider value={data}>{children}</Ctx.Provider>;
}

export function usePrayerTimes(): PrayerTimes | null {
  return useContext(Ctx);
}
