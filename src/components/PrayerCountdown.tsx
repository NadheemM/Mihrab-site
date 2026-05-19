'use client';
import { useState, useEffect } from 'react';
import { usePrayerTimes } from '@/lib/usePrayerTimes';

const PRAYER_ORDER = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;

function pad(n: number) { return String(n).padStart(2, '0'); }

function fmt12(time: string): string {
  const [h, m] = time.split(':').map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
}

function buildCountdown(raw: Record<string, string>) {
  const now     = new Date();
  const nowSecs = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  const entries = PRAYER_ORDER
    .filter(name => raw[name])
    .map(name => {
      const [h, m] = raw[name].split(':').map(Number);
      return { name, secs: h * 3600 + m * 60 };
    });

  const next   = entries.find(e => e.secs > nowSecs);
  const target = next ?? entries[0];
  const diff   = next ? target.secs - nowSecs : (86400 - nowSecs) + target.secs;

  return {
    name: target.name,
    time: fmt12(raw[target.name]),
    h: Math.floor(diff / 3600),
    m: Math.floor((diff % 3600) / 60),
    s: diff % 60,
  };
}

export default function PrayerCountdown() {
  const prayer = usePrayerTimes();
  const [cd, setCd] = useState<ReturnType<typeof buildCountdown> | null>(null);

  useEffect(() => {
    if (!prayer?.raw) return;
    const tick = () => setCd(buildCountdown(prayer.raw));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [prayer]);

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
        fontFamily: "'Inter', sans-serif",
        fontSize: '0.8125rem',
        color: '#718096',
        letterSpacing: '0.03em',
      }}>
        Next:&nbsp;
        <span style={{ color: '#41C2DC', fontWeight: 600 }}>{cd.name}</span>
        &nbsp;{cd.time}
      </span>

      <span style={{
        fontFamily: "'Inter', sans-serif",
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
