'use client';

import { Suspense, useState, useEffect, use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, MapPin, Clock } from 'lucide-react';
import GlowCard from '@/components/GlowCard';
import PrayerCountdown from '@/components/PrayerCountdown';

interface Timings {
  fajr:    { azaan: string; iqamah: string };
  zuhar:   { azaan: string; iqamah: string };
  asar:    { azaan: string; iqamah: string };
  maghrib: { azaan: string; iqamah: string };
  isha:    { azaan: string; iqamah: string };
  jummah:  { azaan: string; iqamah: string };
}

const prayerMeta = [
  { key: 'fajr',    label: 'Fajr',    color: 'var(--fajr-color)' },
  { key: 'zuhar',   label: 'Zuhar',   color: 'var(--dhuhr-color)' },
  { key: 'asar',    label: 'Asar',    color: 'var(--asr-color)' },
  { key: 'maghrib', label: 'Maghrib', color: 'var(--maghrib-color)' },
  { key: 'isha',    label: 'Isha',    color: 'var(--isha-color)' },
  { key: 'jummah',  label: 'Jummah',  color: 'var(--brand-gold)' },
];

function getCurrentPrayerKey(): string {
  const h = new Date().getHours();
  if (h < 6)  return 'fajr';
  if (h < 13) return 'zuhar';
  if (h < 16) return 'asar';
  if (h < 19) return 'maghrib';
  return 'isha';
}

function SkeletonRows() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="skeleton" style={{ height: 52, borderRadius: 8, marginBottom: 4 }} />
      ))}
    </>
  );
}

function MasjidContent({ masjidId }: { masjidId: string }) {
  const router       = useRouter();
  const searchParams = useSearchParams();

  const name    = decodeURIComponent(searchParams.get('name') ?? '');
  const address = decodeURIComponent(searchParams.get('addr') ?? '');
  const lat     = parseFloat(searchParams.get('lat') ?? '0');
  const lng     = parseFloat(searchParams.get('lng') ?? '0');

  const [timings,      setTimings]      = useState<Timings | null>(null);
  const [loadingTimes, setLoadingTimes] = useState(true);
  const [lastUpdated,  setLastUpdated]  = useState('');
  const currentPrayer = getCurrentPrayerKey();

  useEffect(() => {
    let cancelled = false;

    async function load() {
      // Step 1: calculated prayer times from aladhan.com (always works if lat/lng present)
      if (lat && lng) {
        try {
          const now     = new Date();
          const dateStr = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;
          const res     = await fetch(
            `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${lat}&longitude=${lng}&method=2`,
          );
          const json = await res.json();
          const t    = json?.data?.timings;
          if (t && !cancelled) {
            setTimings({
              fajr:    { azaan: t.Fajr,    iqamah: '' },
              zuhar:   { azaan: t.Dhuhr,   iqamah: '' },
              asar:    { azaan: t.Asr,     iqamah: '' },
              maghrib: { azaan: t.Maghrib, iqamah: '' },
              isha:    { azaan: t.Isha,    iqamah: '' },
              jummah:  { azaan: t.Dhuhr,   iqamah: '' },
            });
          }
        } catch { /* leave timings null */ }
      }

      // Step 2: Mihrab API for mosque-specific iqamah times
      try {
        const res  = await fetch(`/api/masjids/${masjidId}`);
        const data = await res.json();
        if (!cancelled && data?.timings) {
          setLastUpdated(data.lastUpdated ?? '');
          if (data.hasTimes) {
            // Merge iqamah (and azaan if aladhan didn't load) from Mihrab
            setTimings(prev => {
              const base = prev ?? {
                fajr:    { azaan: '', iqamah: '' },
                zuhar:   { azaan: '', iqamah: '' },
                asar:    { azaan: '', iqamah: '' },
                maghrib: { azaan: '', iqamah: '' },
                isha:    { azaan: '', iqamah: '' },
                jummah:  { azaan: '', iqamah: '' },
              };
              const merged = { ...base };
              for (const k of Object.keys(base) as (keyof Timings)[]) {
                const mihrab = data.timings[k];
                if (mihrab?.azaan  && !merged[k].azaan)  merged[k] = { ...merged[k], azaan:  mihrab.azaan };
                if (mihrab?.iqamah)                      merged[k] = { ...merged[k], iqamah: mihrab.iqamah };
              }
              return merged;
            });
          }
        }
      } catch { /* iqamah unavailable */ }

      if (!cancelled) setLoadingTimes(false);
    }

    load();
    return () => { cancelled = true; };
  }, [masjidId, lat, lng]);

  const displayName = name || `Masjid ${masjidId}`;

  return (
    <div style={{ backgroundColor: 'var(--surface-cream)', minHeight: '100vh', padding: '3rem 1rem 5rem' }}>
      <div className="container" style={{ maxWidth: '600px', margin: '0 auto' }}>

        {/* Back + name */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '2rem' }}>
          <button
            onClick={() => router.back()}
            aria-label="Back to masjid directory"
            style={{
              background: 'var(--surface-dark)', borderRadius: '50%',
              width: 42, height: 42, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', border: 'none',
              transition: 'background var(--duration-base) ease', marginTop: 2,
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--brand-teal-dark)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--surface-dark)')}
          >
            <ArrowLeft size={18} color="var(--text-inverse)" aria-hidden="true" />
          </button>
          <div style={{ flex: 1 }}>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 'clamp(1.5rem, 4vw, 2rem)',
              fontWeight: 700, color: 'var(--text-headline)',
              margin: 0, lineHeight: 1.15,
            }}>
              {displayName}
            </h1>
            {address && (
              <p style={{
                display: 'flex', alignItems: 'center', gap: '0.3rem',
                fontFamily: "'DM Sans', sans-serif", fontSize: '0.875rem',
                color: 'var(--text-muted)', margin: '0.3rem 0 0',
              }}>
                <MapPin size={13} aria-hidden="true" /> {address}
              </p>
            )}
          </div>
        </div>

        {/* Live prayer countdown */}
        <div style={{
          background: 'var(--surface-warm-white)', borderRadius: 'var(--radius-lg)',
          padding: '1.25rem 1.5rem', marginBottom: '1.75rem',
          display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap',
          border: '1px solid rgba(65,194,220,0.18)', borderLeft: '4px solid var(--brand-teal)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--brand-teal-dark)', flexShrink: 0 }}>
            <Clock size={15} aria-hidden="true" />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Next Prayer
            </span>
          </div>
          <PrayerCountdown />
        </div>

        {/* Section label */}
        <span className="text-gold-label" style={{ marginBottom: '0.75rem' }}>Salah Timings</span>
        <div className="divider-arabesque" aria-hidden="true" style={{ marginBottom: '1.25rem' }}>
          <span className="divider-arabesque-icon" />
        </div>

        {/* Prayer times table */}
        {loadingTimes ? (
          <SkeletonRows />
        ) : (
          <GlowCard style={{ padding: 0, overflow: 'hidden' }}>
            {lastUpdated && (
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
                padding: '0.75rem 1rem 0',
                fontFamily: "'DM Sans', sans-serif", fontSize: '0.75rem', color: 'var(--text-muted)',
              }}>
                Updated Just now
              </div>
            )}

            <table
              className="prayer-times-table"
              style={{ width: '100%', borderCollapse: 'collapse' }}
              aria-label={`Prayer times for ${displayName}`}
            >
              <caption style={{ display: 'none' }}>Prayer times for {displayName}</caption>
              <thead>
                <tr style={{ background: 'var(--surface-dark)' }}>
                  {['Prayer', 'Azaan', 'Iqamah'].map((col, ci) => (
                    <th key={col} scope="col" style={{
                      padding: '0.75rem 1rem',
                      fontFamily: "'DM Sans', sans-serif", fontSize: '0.7rem',
                      fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase',
                      color: 'var(--text-inverse)',
                      textAlign: ci === 0 ? 'left' : 'center',
                    }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {prayerMeta.map((prayer, i) => {
                  const isCurrent = prayer.key === currentPrayer;
                  const times     = (timings as any)?.[prayer.key];
                  return (
                    <tr key={prayer.key} style={{
                      background: isCurrent
                        ? 'rgba(201,146,42,0.07)'
                        : i % 2 === 0 ? 'var(--surface-cream)' : 'var(--surface-warm-white)',
                      borderLeft: `3px solid ${prayer.color}`,
                      transition: 'background var(--duration-base) ease',
                    }}>
                      <th scope="row" style={{
                        padding: '0.9rem 1rem',
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontSize: '1.1rem', fontWeight: 600,
                        color: 'var(--text-headline)', textAlign: 'left',
                      }}>
                        {prayer.label}
                        {isCurrent && (
                          <span style={{
                            marginLeft: '0.5rem',
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: '0.6rem', fontWeight: 700,
                            letterSpacing: '0.08em', textTransform: 'uppercase',
                            color: 'var(--brand-teal)', verticalAlign: 'middle',
                          }}>Now</span>
                        )}
                      </th>
                      {(['azaan', 'iqamah'] as const).map(field => (
                        <td key={field} style={{
                          padding: '0.9rem 1rem', textAlign: 'center',
                          fontFamily: "'DM Sans', sans-serif",
                          fontVariantNumeric: 'tabular-nums',
                          fontSize: '1rem', color: 'var(--text-body)',
                        }}>
                          {times?.[field] || '—'}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </GlowCard>
        )}

      </div>
    </div>
  );
}

export default function MasjidDetailsPage({ params }: { params: { id: string } | Promise<{ id: string }> }) {
  const resolvedParams = params instanceof Promise ? use(params) : params;
  return (
    <Suspense fallback={
      <div style={{ backgroundColor: 'var(--surface-cream)', minHeight: '100vh', padding: '3rem 1rem' }}>
        <div className="container" style={{ maxWidth: '600px', margin: '0 auto' }}>
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 52, borderRadius: 8, marginBottom: 4 }} />
          ))}
        </div>
      </div>
    }>
      <MasjidContent masjidId={resolvedParams.id} />
    </Suspense>
  );
}
