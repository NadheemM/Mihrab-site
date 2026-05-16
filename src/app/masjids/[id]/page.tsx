'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
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

interface Masjid {
  _id: string;
  name: string;
  address: string;
  timings: Timings;
  lastUpdated: string;
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

function timeAgo(dateString: string): string {
  if (!dateString) return 'Just now';
  const diffMins = Math.round((Date.now() - new Date(dateString).getTime()) / 60000);
  if (diffMins < 60) return `${diffMins || 1}m ago`;
  const diffHours = Math.round(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.round(diffHours / 24)}d ago`;
}

export default function MasjidDetailsPage({ params }: { params: { id: string } | Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = params instanceof Promise ? use(params) : params;
  const masjidId = resolvedParams.id;

  const [masjid, setMasjid]   = useState<Masjid | null>(null);
  const [loading, setLoading] = useState(true);
  const currentPrayer = getCurrentPrayerKey();

  useEffect(() => {
    fetch(`/api/masjids/${masjidId}?t=${Date.now()}`, { cache: 'no-store' })
      .then(r => r.json())
      .then(data => { setMasjid(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [masjidId]);

  if (loading) return (
    <div style={{ backgroundColor: 'var(--surface-cream)', minHeight: '100vh', padding: '3rem 1rem 7rem' }}>
      <div className="container" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <div className="skeleton" style={{ width: 40, height: 40, borderRadius: '50%' }} />
          <div style={{ flex: 1 }}>
            <div className="skeleton" style={{ height: 26, width: '55%', borderRadius: 6, marginBottom: 8 }} />
            <div className="skeleton" style={{ height: 14, width: '35%', borderRadius: 4 }} />
          </div>
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton" style={{ height: 52, borderRadius: 8, marginBottom: 4 }} />
        ))}
      </div>
    </div>
  );

  if (!masjid) return (
    <div style={{ minHeight: '100vh', background: 'var(--surface-cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif", color: 'var(--text-muted)' }}>
      Masjid not found.
    </div>
  );

  return (
    <div style={{ backgroundColor: 'var(--surface-cream)', minHeight: '100vh', padding: '3rem 1rem 5rem' }}>
      <div className="container" style={{ maxWidth: '600px', margin: '0 auto' }}>

        {/* Back + name */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '2rem' }}>
          <button
            onClick={() => router.back()}
            aria-label="Back to masjid directory"
            style={{
              background: 'var(--surface-dark)',
              borderRadius: '50%',
              width: 42, height: 42, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', border: 'none',
              transition: 'background var(--duration-base) ease',
              marginTop: 2,
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
              {masjid.name}
            </h1>
            <p style={{
              display: 'flex', alignItems: 'center', gap: '0.3rem',
              fontFamily: "'DM Sans', sans-serif", fontSize: '0.875rem',
              color: 'var(--text-muted)', margin: '0.3rem 0 0',
            }}>
              <MapPin size={13} aria-hidden="true" /> {masjid.address}
            </p>
          </div>
        </div>

        {/* Live prayer countdown */}
        <div style={{
          background: 'var(--surface-warm-white)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem 1.5rem',
          marginBottom: '1.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
          border: '1px solid rgba(65,194,220,0.18)',
          borderLeft: '4px solid var(--brand-teal)',
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
        <GlowCard style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
            padding: '0.75rem 1rem 0',
            fontFamily: "'DM Sans', sans-serif", fontSize: '0.75rem', color: 'var(--text-muted)',
          }}>
            Updated {timeAgo(masjid.lastUpdated)}
          </div>

          <table
            style={{ width: '100%', borderCollapse: 'collapse' }}
            aria-label={`Prayer times for ${masjid.name}`}
          >
            <caption style={{ display: 'none' }}>Prayer times for {masjid.name}</caption>
            <thead>
              <tr style={{ background: 'var(--surface-dark)' }}>
                {['Prayer', 'Azaan', 'Iqamah'].map((col, ci) => (
                  <th
                    key={col}
                    scope="col"
                    style={{
                      padding: '0.75rem 1rem',
                      fontFamily: "'DM Sans', sans-serif", fontSize: '0.7rem',
                      fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase',
                      color: 'var(--text-inverse)',
                      textAlign: ci === 0 ? 'left' : 'center',
                    }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {prayerMeta.map((prayer, i) => {
                const isCurrent = prayer.key === currentPrayer;
                return (
                  <tr
                    key={prayer.key}
                    style={{
                      background: isCurrent
                        ? 'rgba(201,146,42,0.07)'
                        : i % 2 === 0 ? 'var(--surface-cream)' : 'var(--surface-warm-white)',
                      borderLeft: `3px solid ${prayer.color}`,
                      animation: isCurrent ? 'goldPulse 2.5s ease-in-out infinite' : 'none',
                      transition: 'background var(--duration-base) ease',
                    }}
                  >
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
                          color: 'var(--brand-gold)', verticalAlign: 'middle',
                        }}>
                          Now
                        </span>
                      )}
                    </th>
                    {(['azaan', 'iqamah'] as const).map(field => (
                      <td key={field} style={{
                        padding: '0.9rem 1rem', textAlign: 'center',
                        fontFamily: "'DM Sans', sans-serif",
                        fontVariantNumeric: 'tabular-nums',
                        fontSize: '1rem', color: 'var(--text-body)',
                      }}>
                        {(masjid.timings as any)?.[prayer.key]?.[field] || '—'}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </GlowCard>

      </div>
    </div>
  );
}
