'use client';
import { useState, useEffect } from 'react';

const PRAYERS = [
  { name: 'Fajr',    h: 5,  m: 15, icon: '🌙', label: 'Dawn' },
  { name: 'Dhuhr',   h: 12, m: 30, icon: '☀',  label: 'Midday' },
  { name: 'Asr',     h: 15, m: 45, icon: '🌤',  label: 'Afternoon' },
  { name: 'Maghrib', h: 18, m: 20, icon: '🌅',  label: 'Sunset' },
  { name: 'Isha',    h: 20, m: 0,  icon: '🌃',  label: 'Night' },
];

function pad(n: number) { return String(n).padStart(2, '0'); }

function getActivePrayer(): string | null {
  const now = new Date();
  const nowSecs = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  let active = PRAYERS[PRAYERS.length - 1].name;
  for (const p of PRAYERS) {
    const pSecs = p.h * 3600 + p.m * 60;
    if (nowSecs < pSecs) {
      const idx = PRAYERS.indexOf(p);
      active = idx === 0 ? PRAYERS[PRAYERS.length - 1].name : PRAYERS[idx - 1].name;
      break;
    }
  }
  return active;
}

export default function PrayerTimesWidget() {
  const [activePrayer, setActivePrayer] = useState<string | null>(null);

  useEffect(() => {
    setActivePrayer(getActivePrayer());
    const id = setInterval(() => setActivePrayer(getActivePrayer()), 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1px solid rgba(65,194,220,0.18)',
        borderRadius: 20,
        boxShadow: '0 8px 40px rgba(65,194,220,0.10)',
        overflow: 'hidden',
        maxWidth: 600,
        margin: '0 auto',
      }}
      role="region"
      aria-label="Today's prayer times"
    >
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #41C2DC 0%, #2B9AB5 100%)',
        padding: '1.25rem 1.75rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(15,26,48,0.65)', margin: 0 }}>
            Today&apos;s Schedule
          </p>
          <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: '1.5rem', fontWeight: 700, color: '#0F1A30', margin: 0, lineHeight: 1.2 }}>
            Prayer Times
          </h3>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(15,26,48,0.55)', margin: 0 }}>
            Now Active
          </p>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '1rem', fontWeight: 700, color: '#0F1A30', margin: 0 }}>
            {activePrayer ?? '—'}
          </p>
        </div>
      </div>

      {/* Prayer rows */}
      <div style={{ padding: '0.5rem 0' }}>
        {PRAYERS.map((p, i) => {
          const isActive = activePrayer === p.name;
          return (
            <div
              key={p.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.85rem 1.75rem',
                background: isActive ? 'rgba(65,194,220,0.06)' : 'transparent',
                borderLeft: isActive ? '3px solid #41C2DC' : '3px solid transparent',
                borderBottom: i < PRAYERS.length - 1 ? '1px solid rgba(65,194,220,0.08)' : 'none',
                transition: 'background 0.2s ease',
              }}
              aria-current={isActive ? 'true' : undefined}
            >
              <span style={{ fontSize: '1.1rem', marginRight: '0.875rem', lineHeight: 1 }} aria-hidden="true">
                {p.icon}
              </span>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '1.05rem', fontWeight: 600, color: isActive ? '#007A7A' : '#0F1A30', margin: 0, lineHeight: 1.2 }}>
                  {p.name}
                </p>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.7rem', color: '#718096', margin: 0, letterSpacing: '0.05em' }}>
                  {p.label}
                </p>
              </div>
              <span style={{
                fontFamily: "'Inter', sans-serif",
                fontVariantNumeric: 'tabular-nums',
                fontSize: '1.05rem',
                fontWeight: 700,
                color: isActive ? '#007A7A' : '#2D3748',
                letterSpacing: '0.03em',
              }}>
                {pad(p.h)}:{pad(p.m)}
              </span>
              {isActive && (
                <span style={{
                  marginLeft: '0.75rem',
                  background: '#41C2DC',
                  color: '#0F1A30',
                  fontSize: '0.625rem',
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  padding: '2px 8px',
                  borderRadius: 999,
                }}>
                  Active
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
