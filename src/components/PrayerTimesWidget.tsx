'use client';
import { useState, useEffect } from 'react';
import { usePrayerTimes } from '@/lib/usePrayerTimes';

const PRAYER_META = [
  {
    key: 'Fajr',    label: 'Fajr',    sublabel: 'Dawn',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  },
  {
    key: 'Dhuhr',   label: 'Dhuhr',   sublabel: 'Midday',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  },
  {
    key: 'Asr',     label: 'Asr',     sublabel: 'Afternoon',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="3.22" y1="5.22" x2="5.64" y2="7.64"/><line x1="18.36" y1="16.36" x2="20.78" y2="18.78"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/></svg>,
  },
  {
    key: 'Maghrib', label: 'Maghrib', sublabel: 'Sunset',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M17 18a5 5 0 0 0-10 0"/><line x1="12" y1="2" x2="12" y2="9"/><line x1="4.22" y1="10.22" x2="5.64" y2="11.64"/><line x1="2" y1="18" x2="4" y2="18"/><line x1="20" y1="18" x2="22" y2="18"/><line x1="18.36" y1="11.64" x2="19.78" y2="10.22"/></svg>,
  },
  {
    key: 'Isha',    label: 'Isha',    sublabel: 'Night',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/><circle cx="18.5" cy="4.5" r="0.5" fill="currentColor" stroke="none"/></svg>,
  },
] as const;

function fmt12(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${ampm}`;
}

export default function PrayerTimesWidget() {
  const prayer = usePrayerTimes();
  const [activePrayer, setActivePrayer] = useState<string | null>(null);
  const [timedOut, setTimedOut] = useState(false);

  // After 8 s with no data, show "location unavailable" instead of endless skeleton
  useEffect(() => {
    if (prayer) return;
    const id = setTimeout(() => setTimedOut(true), 8000);
    return () => clearTimeout(id);
  }, [prayer]);

  // Recompute active prayer from real times every minute
  useEffect(() => {
    if (!prayer) return;
    const compute = () => {
      const hour = new Date().getHours() + new Date().getMinutes() / 60;
      const { fajr, dhuhr, asr, maghrib, isha } = prayer;
      if      (hour < fajr)    setActivePrayer('Isha');
      else if (hour < dhuhr)   setActivePrayer('Fajr');
      else if (hour < asr)     setActivePrayer('Dhuhr');
      else if (hour < maghrib) setActivePrayer('Asr');
      else if (hour < isha)    setActivePrayer('Maghrib');
      else                     setActivePrayer('Isha');
    };
    compute();
    const id = setInterval(compute, 60_000);
    return () => clearInterval(id);
  }, [prayer]);

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
        {!prayer ? (
          timedOut ? (
            /* Location unavailable */
            <div style={{
              padding: '1.75rem',
              textAlign: 'center',
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.875rem',
              color: '#718096',
              lineHeight: 1.6,
            }}>
              Enable location access to see prayer times for your area.
            </div>
          ) : (
            /* Skeleton */
            Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="skeleton"
                style={{ height: 58, margin: '0 0 1px', borderRadius: 0 }}
              />
            ))
          )
        ) : (
          PRAYER_META.map((p, i) => {
            const isActive = activePrayer === p.key;
            const rawTime  = prayer.raw[p.key];
            const display  = rawTime ? fmt12(rawTime) : '—';
            return (
              <div
                key={p.key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.85rem 1.75rem',
                  background: isActive ? 'rgba(65,194,220,0.06)' : 'transparent',
                  borderLeft: isActive ? '3px solid #41C2DC' : '3px solid transparent',
                  borderBottom: i < PRAYER_META.length - 1 ? '1px solid rgba(65,194,220,0.08)' : 'none',
                  transition: 'background 0.2s ease',
                }}
                aria-current={isActive ? 'true' : undefined}
              >
                <span style={{ fontSize: '1.1rem', marginRight: '0.875rem', lineHeight: 1, color: isActive ? '#007A7A' : '#718096' }}>
                  {p.icon}
                </span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '1.05rem', fontWeight: 600, color: isActive ? '#007A7A' : '#0F1A30', margin: 0, lineHeight: 1.2 }}>
                    {p.label}
                  </p>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.7rem', color: '#718096', margin: 0, letterSpacing: '0.05em' }}>
                    {p.sublabel}
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
                  {display}
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
          })
        )}
      </div>
    </div>
  );
}
