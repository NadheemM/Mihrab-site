'use client';
import { useState, useEffect } from 'react';
import { Star, Search, MapPin, ArrowRight, Navigation, Smartphone } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import GlowCard from '@/components/GlowCard';
import ScrollReveal from '@/components/ScrollReveal';

const IOS_APP_URL     = 'https://apps.apple.com/app/mihrab/id6630381320';
const ANDROID_APP_URL = 'https://play.google.com/store/apps/details?id=in.mihrab.app';

interface Masjid {
  _id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
}

type MasjidEntry = Masjid & { dist?: number };

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const toRad = (x: number) => (x * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}


function SkeletonCard() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '64px 1fr 32px',
      alignItems: 'center',
      gap: '1rem',
      padding: '1.25rem',
      marginBottom: '0.75rem',
      background: 'var(--surface-warm-white)',
      borderRadius: 'var(--radius-lg)',
      border: 'var(--border-warm)',
    }} aria-hidden="true">
      <div className="skeleton" style={{ width: 64, height: 64, borderRadius: 'var(--radius-md)' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div className="skeleton" style={{ height: 18, width: '60%', borderRadius: 4 }} />
        <div className="skeleton" style={{ height: 13, width: '40%', borderRadius: 4 }} />
      </div>
      <div className="skeleton" style={{ width: 22, height: 22, borderRadius: '50%' }} />
    </div>
  );
}

const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, #A8E8F4, rgba(65,194,220,0.3))',
  'linear-gradient(135deg, rgba(201,146,42,0.28), rgba(201,146,42,0.10))',
  'linear-gradient(135deg, rgba(107,140,174,0.35), rgba(107,140,174,0.12))',
  'linear-gradient(135deg, rgba(74,72,128,0.30), rgba(74,72,128,0.10))',
  'linear-gradient(135deg, rgba(224,123,57,0.28), rgba(224,123,57,0.10))',
  'linear-gradient(135deg, rgba(46,125,82,0.28), rgba(46,125,82,0.10))',
];

const AVATAR_TEXT_COLORS = [
  'var(--brand-teal-dark)',
  'var(--brand-gold)',
  'var(--fajr-color)',
  'var(--isha-color)',
  'var(--asr-color)',
  '#2E7D52',
];

export default function MasjidsPage() {
  const [masjids, setMasjids]           = useState<Masjid[]>([]);
  const [loading, setLoading]           = useState(true);
  const [apiError, setApiError]         = useState(false);
  const [searchQuery, setSearchQuery]   = useState('');
  const [nearbyToggle, setNearbyToggle] = useState(false);
  const [userCoords, setUserCoords]     = useState<{ lat: number; lng: number } | null>(null);
  const [locStatus, setLocStatus]       = useState<'idle' | 'requesting' | 'denied'>('idle');
  const [locPromptSeen, setLocPromptSeen] = useState(false);
  const [favorites, setFavorites]       = useState<Record<string, boolean>>({});
  const router = useRouter();

  useEffect(() => {
    fetch('/api/masjids')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) { setMasjids(data); }
        else { setApiError(true); }
        setLoading(false);
      })
      .catch(() => { setApiError(true); setLoading(false); });

    try {
      const saved = localStorage.getItem('masjidFavorites');
      if (saved) setFavorites(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = { ...favorites, [id]: !favorites[id] };
    setFavorites(next);
    localStorage.setItem('masjidFavorites', JSON.stringify(next));
  };

  function handleNearbyToggle() {
    setLocPromptSeen(true);
    if (nearbyToggle) {
      setNearbyToggle(false);
      setUserCoords(null);
      setLocStatus('idle');
      return;
    }
    if (!navigator?.geolocation) {
      setLocStatus('denied');
      return;
    }
    setLocStatus('requesting');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setNearbyToggle(true);
        setLocStatus('idle');
      },
      () => {
        setLocStatus('denied');
        setNearbyToggle(false);
      },
      { timeout: 8000 },
    );
  }

  const filtered: MasjidEntry[] = masjids.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const masjidsWithCoords = masjids.filter(m => m.lat !== 0 || m.lng !== 0);

  const nearbyList: MasjidEntry[] | null = nearbyToggle && userCoords
    ? masjidsWithCoords.length > 0
      ? [...masjidsWithCoords]
          .map(m => ({ ...m, dist: haversineKm(userCoords.lat, userCoords.lng, m.lat, m.lng) }))
          .sort((a, b) => (a.dist ?? 0) - (b.dist ?? 0))
          .slice(0, 5)
      : null
    : null;

  // Only flag no-coords when masjids actually loaded — avoids false banner when API fails
  const noCoords = nearbyToggle && userCoords !== null && masjids.length > 0 && masjidsWithCoords.length === 0;

  // Search always takes priority; nearby only applies when search is empty
  const displayList: MasjidEntry[] = searchQuery ? filtered : (nearbyList ?? filtered);

  return (
    <div style={{ backgroundColor: 'var(--surface-cream)', minHeight: '100vh', padding: '4rem 0 5rem' }}>
      <div className="container" style={{ maxWidth: '660px', margin: '0 auto' }}>

        {/* Header */}
        <ScrollReveal variant="up">
          <div style={{ marginBottom: '2.25rem' }}>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: 700,
              color: 'var(--text-headline)',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              margin: '0.4rem 0 1rem',
            }}>
              Masjid Directory
            </h1>
            <div className="divider-arabesque" aria-hidden="true">
              <span className="divider-arabesque-icon" />
            </div>
          </div>
        </ScrollReveal>

        {/* Search */}
        <ScrollReveal variant="up" delay={300}>
          <div role="search" style={{ position: 'relative', marginBottom: '1.25rem' }}>
            <Search size={17} aria-hidden="true" style={{
              position: 'absolute', left: '1rem', top: '50%',
              transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none',
            }} />
            <input
              type="search"
              placeholder="Search by name or area…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              aria-label="Search masjids"
              style={{
                width: '100%',
                padding: '0.85rem 1.25rem 0.85rem 2.875rem',
                borderRadius: 'var(--radius-pill)',
                border: 'var(--border-warm)',
                fontSize: '0.9375rem',
                fontFamily: "'DM Sans', sans-serif",
                background: 'var(--surface-warm-white)',
                color: 'var(--text-body)',
                outline: 'none',
                boxShadow: 'var(--shadow-sm)',
                transition: 'border-color var(--duration-base) ease, box-shadow var(--duration-base) ease',
              }}
              onFocus={e => {
                e.target.style.borderColor = 'var(--brand-teal)';
                e.target.style.boxShadow = '0 0 0 3px rgba(65,194,220,0.14), var(--shadow-sm)';
              }}
              onBlur={e => {
                e.target.style.borderColor = '';
                e.target.style.boxShadow = 'var(--shadow-sm)';
              }}
            />
          </div>
        </ScrollReveal>

        {/* Location prompt — shown once until user interacts with the toggle */}
        {!locPromptSeen && !nearbyToggle && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            background: 'rgba(65,194,220,0.05)',
            border: '1px solid rgba(65,194,220,0.22)',
            borderRadius: 'var(--radius-lg)',
            padding: '0.875rem 1.25rem',
            marginBottom: '1.25rem',
            flexWrap: 'wrap',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Navigation size={15} color="var(--brand-teal-dark)" aria-hidden="true" />
              <span style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.875rem',
                color: 'var(--text-body)',
              }}>
                Enable location to find masjids near you
              </span>
            </div>
            <button
              onClick={handleNearbyToggle}
              className="btn btn-primary"
              style={{ fontSize: '0.8rem', padding: '0.4rem 1rem' }}
            >
              Turn On
            </button>
          </div>
        )}

        {/* Location requesting status */}
        {locStatus === 'requesting' && (
          <div role="status" aria-live="polite" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(65,194,220,0.05)',
            border: '1px solid rgba(65,194,220,0.22)',
            borderRadius: 'var(--radius-lg)',
            padding: '0.875rem 1.25rem',
            marginBottom: '1.25rem',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.875rem',
            color: 'var(--brand-teal-dark)',
          }}>
            <Navigation size={15} aria-hidden="true" />
            Requesting your location…
          </div>
        )}

        {/* Location denied */}
        {locStatus === 'denied' && (
          <div role="alert" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(239,68,68,0.06)',
            border: '1px solid rgba(239,68,68,0.22)',
            borderRadius: 'var(--radius-lg)',
            padding: '0.875rem 1.25rem',
            marginBottom: '1.25rem',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.875rem',
            color: '#b91c1c',
          }}>
            <Navigation size={15} aria-hidden="true" />
            Location access was denied. Please allow it in your browser settings to see nearby masjids.
          </div>
        )}

        {/* Section label + toggle */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: '1.25rem',
            fontWeight: 600,
            color: 'var(--text-headline)',
            margin: 0,
          }}>
            {searchQuery
              ? `Results for "${searchQuery}"`
              : nearbyToggle && userCoords
              ? 'Nearby Masjids'
              : 'All Masjids'}
          </h2>
          <button
            onClick={handleNearbyToggle}
            role="switch"
            aria-checked={nearbyToggle}
            aria-label="Show nearby masjids only"
            style={{
              background: nearbyToggle ? 'var(--brand-teal)' : 'rgba(61,53,41,0.14)',
              borderRadius: 'var(--radius-pill)',
              padding: '0.2rem',
              display: 'flex',
              alignItems: 'center',
              width: '52px',
              justifyContent: nearbyToggle ? 'flex-end' : 'flex-start',
              cursor: 'pointer',
              border: 'none',
              flexShrink: 0,
              transition: 'background var(--duration-base) ease',
            }}
          >
            <div style={{
              background: 'white',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.22)',
              transition: 'transform var(--duration-base) ease',
            }} />
          </button>
        </div>

        {/* No-coords notice — shown when nearby toggle is on but masjids lack GPS data */}
        {noCoords && (
          <div role="status" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(201,146,42,0.07)',
            border: '1px solid rgba(201,146,42,0.28)',
            borderRadius: 'var(--radius-lg)',
            padding: '0.875rem 1.25rem',
            marginBottom: '1.25rem',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.875rem',
            color: 'var(--brand-gold)',
          }}>
            <MapPin size={15} aria-hidden="true" />
            GPS coordinates not yet available for these masjids — showing all masjids.
          </div>
        )}

        {/* List */}
        <div role="list" aria-label="Masjid listings" aria-busy={loading}>

          {loading && Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}

          {/* API error state */}
          {!loading && apiError && (
            <div style={{
              textAlign: 'center', padding: '2.5rem 1.5rem',
              background: 'var(--surface-warm-white)',
              borderRadius: 'var(--radius-lg)',
              border: 'var(--border-warm)',
              marginBottom: '1rem',
            }}>
              <p style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: '1.2rem', fontWeight: 600,
                color: 'var(--text-headline)', margin: '0 0 0.5rem',
              }}>Unable to load masjids</p>
              <p style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: '0.875rem',
                color: 'var(--text-muted)', margin: 0,
              }}>The masjid directory is temporarily unavailable. Please try again shortly.</p>
            </div>
          )}

          {!loading && !apiError && displayList.length === 0 && (
            <div style={{
              textAlign: 'center', padding: '3rem 1rem',
              fontFamily: "'DM Sans', sans-serif",
              color: 'var(--text-muted)', fontSize: '0.9375rem',
            }}>
              {searchQuery
                ? `No masjids match "${searchQuery}".`
                : 'No masjids found.'}
            </div>
          )}

          {!loading && !apiError && displayList.map((masjid, i) => {
            const avatarBg   = AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length];
            const avatarText = AVATAR_TEXT_COLORS[i % AVATAR_TEXT_COLORS.length];
            const isFav      = !!favorites[masjid._id];
            const distKm     = masjid.dist ?? null;

            return (
              <ScrollReveal key={masjid._id} variant="up" delay={i * 150} style={{ marginBottom: '0.75rem' }}>
                <GlowCard style={{ cursor: 'pointer' }} className="glow-card">
                  <div
                    role="listitem"
                    onClick={() => router.push(`/masjids/${masjid._id}`)}
                    onKeyDown={e => e.key === 'Enter' && router.push(`/masjids/${masjid._id}`)}
                    tabIndex={0}
                    aria-label={`View prayer times for ${masjid.name}${distKm !== null ? `, ${distKm.toFixed(1)} km away` : ''}`}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '64px 1fr auto',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1.1rem 1.25rem',
                    }}
                  >
                    {/* Avatar */}
                    <div aria-hidden="true" style={{
                      width: 64, height: 64,
                      background: avatarBg,
                      clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <span style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontSize: '1.75rem', fontWeight: 700,
                        color: avatarText, lineHeight: 1,
                      }}>
                        {masjid.name.charAt(0)}
                      </span>
                    </div>

                    {/* Details */}
                    <div>
                      <h3 style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontSize: '1.2rem', fontWeight: 600,
                        color: 'var(--text-headline)', margin: '0 0 0.25rem',
                        lineHeight: 1.2,
                      }}>
                        {masjid.name}
                      </h3>
                      <p style={{
                        display: 'flex', alignItems: 'center', gap: '0.3rem',
                        fontFamily: "'DM Sans', sans-serif", fontSize: '0.8125rem',
                        color: 'var(--text-muted)', margin: 0,
                      }}>
                        <MapPin size={12} aria-hidden="true" />
                        {masjid.address}
                      </p>
                      {distKm !== null && (
                        <p style={{
                          display: 'flex', alignItems: 'center', gap: '0.3rem',
                          fontFamily: "'DM Sans', sans-serif", fontSize: '0.75rem',
                          color: 'var(--brand-teal-dark)', margin: '0.25rem 0 0',
                          fontWeight: 500,
                        }}>
                          <Navigation size={11} aria-hidden="true" />
                          {distKm < 1
                            ? `${(distKm * 1000).toFixed(0)} m away`
                            : `${distKm.toFixed(1)} km away`}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                      <button
                        onClick={e => toggleFavorite(masjid._id, e)}
                        aria-label={isFav ? `Remove ${masjid.name} from favourites` : `Add ${masjid.name} to favourites`}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          padding: '0.2rem',
                          color: isFav ? 'var(--brand-gold)' : 'var(--text-muted)',
                          transition: 'color var(--duration-base) ease, transform var(--duration-fast) ease',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.2)')}
                        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                      >
                        <Star size={20} fill={isFav ? 'var(--brand-gold)' : 'transparent'} aria-hidden="true" />
                      </button>
                      <ArrowRight size={14} color="var(--text-muted)" aria-hidden="true" />
                    </div>
                  </div>
                </GlowCard>
              </ScrollReveal>
            );
          })}

          {/* App CTA — always shown at the bottom */}
          {!loading && (
            <ScrollReveal variant="up" delay={displayList.length * 150}>
              <div style={{
                textAlign: 'center',
                padding: '2rem 1.5rem',
                background: 'var(--surface-warm-white)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid rgba(65,194,220,0.18)',
                borderTop: '3px solid var(--brand-teal)',
                marginTop: '1rem',
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 'var(--radius-md)',
                  background: 'rgba(65,194,220,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1rem',
                }}>
                  <Smartphone size={24} color="var(--brand-teal)" aria-hidden="true" />
                </div>
                <p style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: '1.3rem', fontWeight: 600,
                  color: 'var(--text-headline)',
                  margin: '0 0 0.4rem',
                }}>
                  Discover Every Masjid
                </p>
                <p style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '0.875rem',
                  color: 'var(--text-muted)',
                  margin: '0 0 1.5rem',
                  lineHeight: 1.6,
                }}>
                  Get live prayer alerts, full masjid directory, Qibla, and community updates — all in the Mihrab app.
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Link
                    href={ANDROID_APP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    style={{ textDecoration: 'none' }}
                  >
                    Google Play
                  </Link>
                  <Link
                    href={IOS_APP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    style={{ textDecoration: 'none' }}
                  >
                    App Store
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          )}

        </div>
      </div>
    </div>
  );
}
