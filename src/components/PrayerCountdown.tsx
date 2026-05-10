'use client';
import { useState, useEffect } from 'react';

const PRAYERS = [
  { name: 'Fajr',    h: 5,  m: 15 },
  { name: 'Dhuhr',   h: 12, m: 30 },
  { name: 'Asr',     h: 15, m: 45 },
  { name: 'Maghrib', h: 18, m: 20 },
  { name: 'Isha',    h: 20, m: 0  },
];

function getCountdown() {
  const now = new Date();
  const nowSecs = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

  for (const p of PRAYERS) {
    const pSecs = p.h * 3600 + p.m * 60;
    if (pSecs > nowSecs) {
      const diff = pSecs - nowSecs;
      return { name: p.name, h: Math.floor(diff / 3600), m: Math.floor((diff % 3600) / 60), s: diff % 60 };
    }
  }
  const fajrSecs = PRAYERS[0].h * 3600 + PRAYERS[0].m * 60;
  const diff = (86400 - nowSecs) + fajrSecs;
  return { name: PRAYERS[0].name, h: Math.floor(diff / 3600), m: Math.floor((diff % 3600) / 60), s: diff % 60 };
}

function pad(n: number) { return String(n).padStart(2, '0'); }

export default function PrayerCountdown() {
  const [cd, setCd] = useState<ReturnType<typeof getCountdown> | null>(null);

  useEffect(() => {
    setCd(getCountdown());
    const id = setInterval(() => setCd(getCountdown()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!cd) return null;

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.875rem',
      background: 'rgba(0,207,207,0.06)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      border: '1px solid rgba(0,207,207,0.2)',
      borderRadius: 'var(--radius-pill)',
      padding: '0.55rem 1.25rem 0.55rem 0.875rem',
    }}
    role="timer"
    aria-label={`Time until ${cd.name}: ${pad(cd.h)} hours ${pad(cd.m)} minutes ${pad(cd.s)} seconds`}
    aria-live="off"
    >
      <span style={{ position: 'relative', width: 8, height: 8, flexShrink: 0 }} aria-hidden="true">
        <span style={{
          display: 'block', width: 8, height: 8, borderRadius: '50%', background: '#4ade80',
        }} />
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
        <span style={{ color: '#00CFCF', fontWeight: 600 }}>{cd.name}</span>
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
