'use client';
import { useState, useEffect } from 'react';

interface PrayerEntry { name: string; h: number; m: number; }

function parseTime(t: string): { h: number; m: number } {
  const [h, m] = t.split(':').map(Number);
  return { h, m };
}

function buildCountdown(prayers: PrayerEntry[]) {
  const now = new Date();
  const nowSecs = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  for (const p of prayers) {
    const pSecs = p.h * 3600 + p.m * 60;
    if (pSecs > nowSecs) {
      const diff = pSecs - nowSecs;
      return { name: p.name, h: Math.floor(diff / 3600), m: Math.floor((diff % 3600) / 60), s: diff % 60 };
    }
  }
  const fajrSecs = prayers[0].h * 3600 + prayers[0].m * 60;
  const diff = (86400 - nowSecs) + fajrSecs;
  return { name: prayers[0].name, h: Math.floor(diff / 3600), m: Math.floor((diff % 3600) / 60), s: diff % 60 };
}

function pad(n: number) { return String(n).padStart(2, '0'); }

export default function PrayerCountdown() {
  const [prayers, setPrayers] = useState<PrayerEntry[] | null>(null);
  const [cd, setCd] = useState<ReturnType<typeof buildCountdown> | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const { latitude, longitude } = pos.coords;
        const res = await fetch(
          `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=2`
        );
        const json = await res.json();
        const t = json.data.timings;
        setPrayers([
          { name: 'Fajr',    ...parseTime(t.Fajr) },
          { name: 'Dhuhr',   ...parseTime(t.Dhuhr) },
          { name: 'Asr',     ...parseTime(t.Asr) },
          { name: 'Maghrib', ...parseTime(t.Maghrib) },
          { name: 'Isha',    ...parseTime(t.Isha) },
        ]);
      } catch { /* silently ignore — pill stays hidden */ }
    });
  }, []);

  useEffect(() => {
    if (!prayers) return;
    setCd(buildCountdown(prayers));
    const id = setInterval(() => setCd(buildCountdown(prayers)), 1000);
    return () => clearInterval(id);
  }, [prayers]);

  if (!cd) return null;

  return (
    <div
      role="timer"
      aria-label={`Time until ${cd.name}: ${pad(cd.h)} hours ${pad(cd.m)} minutes ${pad(cd.s)} seconds`}
      aria-live="off"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.875rem',
        background: 'rgba(65,194,220,0.06)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(65,194,220,0.2)',
        borderRadius: 'var(--radius-pill)',
        padding: '0.55rem 1.25rem 0.55rem 0.875rem',
      }}
    >
      <span style={{ position: 'relative', width: 8, height: 8, flexShrink: 0 }} aria-hidden="true">
        <span style={{ display: 'block', width: 8, height: 8, borderRadius: '50%', background: '#4ade80' }} />
        <span style={{
          position: 'absolute', inset: 0, borderRadius: '50%', background: '#4ade80',
          animation: 'pulseRing 1.5s ease-out infinite',
        }} />
      </span>

      <span style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '0.8125rem',
        color: '#718096',
        letterSpacing: '0.03em',
      }}>
        Next:&nbsp;
        <span style={{ color: '#41C2DC', fontWeight: 600 }}>{cd.name}</span>
      </span>

      <span style={{
        fontFamily: "'DM Sans', sans-serif",
        fontVariantNumeric: 'tabular-nums',
        fontSize: '1rem',
        fontWeight: 700,
        letterSpacing: '0.04em',
        color: '#0F1A30',
      }}>
        {pad(cd.h)}:{pad(cd.m)}:{pad(cd.s)}
      </span>
    </div>
  );
}
