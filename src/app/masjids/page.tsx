'use client';
import { useState, useEffect, useRef } from 'react';
import { Star, Search, MapPin, ArrowRight, Navigation, Smartphone, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import GlowCard from '@/components/GlowCard';
import ScrollReveal from '@/components/ScrollReveal';

const IOS_APP_URL     = 'https://apps.apple.com/app/mihrab/id6630381320';
const ANDROID_APP_URL = 'https://play.google.com/store/apps/details?id=in.mihrab.app';
const ITEMS_PER_PAGE  = 6;

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
      display: 'grid', gridTemplateColumns: '64px 1fr 32px',
      alignItems: 'center', gap: '1rem', padding: '1.25rem', marginBottom: '0.75rem',
      background: 'var(--surface-warm-white)', borderRadius: 'var(--radius-lg)', border: 'var(--border-warm)',
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
  'var(--brand-teal-dark)', 'var(--brand-gold)', 'var(--fajr-color)',
  'var(--isha-color)', 'var(--asr-color)', '#2E7D52',
];

export default function MasjidsPage() {
  const [masjids, setMasjids]               = useState<Masjid[]>([]);
  const [loading, setLoading]               = useState(true);
  const [apiError, setApiError]             = useState(false);
  const [searchQuery, setSearchQuery]       = useState('');
  const [searchResults, setSearchResults]   = useState<MasjidEntry[] | null>(null);
  const [searchLoading, setSearchLoading]   = useState(false);
  const [nearbyToggle, setNearbyToggle]     = useState(false);
  const [userCoords, setUserCoords]         = useState<{ lat: number; lng: number } | null>(null);
  const [locStatus, setLocStatus]           = useState<'idle' | 'requesting' | 'denied'>('idle');
  const [locPromptSeen, setLocPromptSeen]   = useState(false);
  const [favorites, setFavorites]           = useState<Record<string, boolean>>({});
  const [nearbyResults, setNearbyResults]   = useState<MasjidEntry[] | null>(null);
  const [nearbyLoading, setNearbyLoading]   = useState(false);
  const [page, setPage]                     = useState(1);
  const listTopRef = useRef<HTMLDivElement>(null);
  const autoEnableAttempted = useRef(false);
  const router = useRouter();

  // Load default masjids + favourites
  useEffect(() => {
    fetch('/api/masjids')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setMasjids(data); else setApiError(true); })
      .catch(() => setApiError(true))
      .finally(() => setLoading(false));

    try {
      const saved = localStorage.getItem('masjidFavorites');
      if (saved) setFavorites(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  // Debounced API search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(null);
      setPage(1);
      return;
    }
    if (searchQuery.length < 2) return;

    const timer = setTimeout(async () => {
      setSearchLoading(true);
      setPage(1);
      try {
        const res  = await fetch(`/api/masjids/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        setSearchResults(Array.isArray(data) ? data : []);
      } catch {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Auto-enable nearby if location permission is already granted
  useEffect(() => {
    if (autoEnableAttempted.current) return;
    autoEnableAttempted.current = true;
    try {
      if (localStorage.getItem('masjidNearbyOff') === '1') { setLocPromptSeen(true); return; }
    } catch { return; }
    if (!navigator?.geolocation || !navigator?.permissions) return;
    navigator.permissions.query({ name: 'geolocation' as PermissionName })
      .then(result => {
        if (result.state !== 'granted') return;
        setLocPromptSeen(true);
        setNearbyLoading(true);
        navigator.geolocation.getCurrentPosition(
          async pos => {
            const { latitude: lat, longitude: lng } = pos.coords;
            setUserCoords({ lat, lng });
            setNearbyToggle(true);
            try {
              const res = await fetch(`/api/masjids/nearby?lat=${lat}&lng=${lng}&radius=50000&limit=12`);
              const data = await res.json();
              setNearbyResults(
                Array.isArray(data) && data.length > 0
                  ? data.map((m: Masjid) => ({ ...m, dist: haversineKm(lat, lng, m.lat, m.lng) }))
                  : [],
              );
            } catch { setNearbyResults(null); }
            finally { setNearbyLoading(false); }
          },
          () => { setNearbyLoading(false); },
          { timeout: 5000 },
        );
      })
      .catch(() => {});
  }, []);

  // Reset page when nearby / search mode changes
  useEffect(() => { setPage(1); }, [nearbyToggle, nearbyResults]);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = { ...favorites, [id]: !favorites[id] };
    setFavorites(next);
    localStorage.setItem('masjidFavorites', JSON.stringify(next));
  };

  function scrollToListTop() {
    listTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function goToPage(p: number) {
    setPage(p);
    scrollToListTop();
  }

  function handleNearbyToggle() {
    setLocPromptSeen(true);
    if (nearbyToggle) {
      try { localStorage.setItem('masjidNearbyOff', '1'); } catch { /* ignore */ }
      setNearbyToggle(false);
      setUserCoords(null);
      setLocStatus('idle');
      setNearbyResults(null);
      return;
    }
    try { localStorage.removeItem('masjidNearbyOff'); } catch { /* ignore */ }
    if (!navigator?.geolocation) { setLocStatus('denied'); return; }
    setLocStatus('requesting');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserCoords({ lat: latitude, lng: longitude });
        setNearbyToggle(true);
        setLocStatus('idle');
        setNearbyLoading(true);
        try {
          const res  = await fetch(`/api/masjids/nearby?lat=${latitude}&lng=${longitude}&radius=50000&limit=12`);
          const data = await res.json();
          setNearbyResults(
            Array.isArray(data) && data.length > 0
              ? data.map((m: Masjid) => ({ ...m, dist: haversineKm(latitude, longitude, m.lat, m.lng) }))
              : [],
          );
        } catch { setNearbyResults(null); }
        finally  { setNearbyLoading(false); }
      },
      () => { setLocStatus('denied'); setNearbyToggle(false); },
      { timeout: 8000 },
    );
  }

  // Full list (unpaginated) based on current mode
  const fullList: MasjidEntry[] = (() => {
    if (!searchQuery) {
      return nearbyToggle && nearbyResults !== null
        ? nearbyResults.slice(0, 12)
        : masjids.slice(0, 12);
    }
    const q = searchQuery.toLowerCase();
    const match = (m: MasjidEntry) =>
      m.name.toLowerCase().includes(q) || m.address.toLowerCase().includes(q);
    // Filter from already-loaded data (nearby or default) — this always contains the correct local results
    const base = nearbyToggle && nearbyResults ? nearbyResults : masjids;
    const local = base.filter(match);
    // Supplement with API results that pass the name filter (deduped)
    const seen = new Set(local.map(m => m._id));
    const apiExtra = (searchResults ?? []).filter(m => match(m) && !seen.has(m._id));
    return [...local, ...apiExtra];
  })();

  const totalPages  = Math.max(1, Math.ceil(fullList.length / ITEMS_PER_PAGE));
  const displayList = fullList.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const isLastPage  = page >= totalPages;
  const isBusy      = loading || nearbyLoading || searchLoading;

  return (
    <div style={{ backgroundColor: 'var(--surface-cream)', minHeight: '100vh', padding: '4rem 0 5rem' }}>
      <div className="container" style={{ maxWidth: '660px', margin: '0 auto' }}>

        {/* Header */}
        <ScrollReveal variant="up">
          <div style={{ marginBottom: '2.25rem' }}>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700,
              color: 'var(--text-headline)', letterSpacing: '-0.02em', lineHeight: 1.1,
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
            {searchLoading && (
              <div style={{
                position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)',
                width: 16, height: 16, borderRadius: '50%',
                border: '2px solid rgba(65,194,220,0.2)', borderTopColor: 'var(--brand-teal)',
                animation: 'spin 0.7s linear infinite',
              }} aria-hidden="true" />
            )}
            <input
              type="search"
              placeholder="Search any masjid by name…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              aria-label="Search masjids"
              style={{
                width: '100%', padding: '0.85rem 2.5rem 0.85rem 2.875rem',
                borderRadius: 'var(--radius-pill)', border: 'var(--border-warm)',
                fontSize: '0.9375rem', fontFamily: "'DM Sans', sans-serif",
                background: 'var(--surface-warm-white)', color: 'var(--text-body)',
                outline: 'none', boxShadow: 'var(--shadow-sm)',
                transition: 'border-color var(--duration-base) ease, box-shadow var(--duration-base) ease',
              }}
              onFocus={e => {
                e.target.style.borderColor = 'var(--brand-teal)';
                e.target.style.boxShadow   = '0 0 0 3px rgba(65,194,220,0.14), var(--shadow-sm)';
              }}
              onBlur={e => {
                e.target.style.borderColor = '';
                e.target.style.boxShadow   = 'var(--shadow-sm)';
              }}
            />
          </div>
        </ScrollReveal>

        {/* Location prompt */}
        {!locPromptSeen && !nearbyToggle && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: '0.75rem', background: 'rgba(65,194,220,0.05)',
            border: '1px solid rgba(65,194,220,0.22)', borderRadius: 'var(--radius-lg)',
            padding: '0.875rem 1.25rem', marginBottom: '1.25rem', flexWrap: 'wrap',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Navigation size={15} color="var(--brand-teal-dark)" aria-hidden="true" />
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.875rem', color: 'var(--text-body)' }}>
                Enable location to find masjids near you
              </span>
            </div>
            <button onClick={handleNearbyToggle} className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '0.4rem 1rem' }}>
              Turn On
            </button>
          </div>
        )}

        {/* Status banners */}
        {locStatus === 'requesting' && (
          <div role="status" aria-live="polite" style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(65,194,220,0.05)', border: '1px solid rgba(65,194,220,0.22)',
            borderRadius: 'var(--radius-lg)', padding: '0.875rem 1.25rem', marginBottom: '1.25rem',
            fontFamily: "'DM Sans', sans-serif", fontSize: '0.875rem', color: 'var(--brand-teal-dark)',
          }}>
            <Navigation size={15} aria-hidden="true" /> Requesting your location…
          </div>
        )}
        {locStatus === 'denied' && (
          <div role="alert" style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.22)',
            borderRadius: 'var(--radius-lg)', padding: '0.875rem 1.25rem', marginBottom: '1.25rem',
            fontFamily: "'DM Sans', sans-serif", fontSize: '0.875rem', color: '#b91c1c',
          }}>
            <Navigation size={15} aria-hidden="true" />
            Location access was denied. Please allow it in your browser settings.
          </div>
        )}

        {/* Section label + nearby toggle */}
        <div ref={listTopRef} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-headline)', margin: 0,
            }}>
              {searchQuery
                ? `Results for "${searchQuery}"`
                : nearbyToggle && userCoords ? 'Nearby Masjids' : 'All Masjids'}
            </h2>
            {!isBusy && fullList.length > 0 && (
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {fullList.length} masjid{fullList.length !== 1 ? 's' : ''} found
              </span>
            )}
          </div>
          <button
            onClick={handleNearbyToggle}
            role="switch" aria-checked={nearbyToggle} aria-label="Show nearby masjids only"
            style={{
              background: nearbyToggle ? 'var(--brand-teal)' : 'rgba(61,53,41,0.14)',
              borderRadius: 'var(--radius-pill)', padding: '0.2rem',
              display: 'flex', alignItems: 'center', width: '52px',
              justifyContent: nearbyToggle ? 'flex-end' : 'flex-start',
              cursor: 'pointer', border: 'none', flexShrink: 0,
              transition: 'background var(--duration-base) ease',
            }}
          >
            <div style={{
              background: 'white', borderRadius: '50%', width: '20px', height: '20px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.22)',
              transition: 'transform var(--duration-base) ease',
            }} />
          </button>
        </div>

        {/* Nearby loading */}
        {nearbyLoading && (
          <div role="status" aria-live="polite" style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(65,194,220,0.05)', border: '1px solid rgba(65,194,220,0.22)',
            borderRadius: 'var(--radius-lg)', padding: '0.875rem 1.25rem', marginBottom: '1.25rem',
            fontFamily: "'DM Sans', sans-serif", fontSize: '0.875rem', color: 'var(--brand-teal-dark)',
          }}>
            <Navigation size={15} aria-hidden="true" /> Finding masjids near you…
          </div>
        )}

        {/* List */}
        <div role="list" aria-label="Masjid listings" aria-busy={isBusy}>

          {isBusy && Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}

          {!isBusy && apiError && (
            <div style={{
              textAlign: 'center', padding: '2.5rem 1.5rem',
              background: 'var(--surface-warm-white)', borderRadius: 'var(--radius-lg)', border: 'var(--border-warm)', marginBottom: '1rem',
            }}>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-headline)', margin: '0 0 0.5rem' }}>
                Unable to load masjids
              </p>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>
                The masjid directory is temporarily unavailable. Please try again shortly.
              </p>
            </div>
          )}

          {!isBusy && !apiError && fullList.length === 0 && (
            <div style={{
              textAlign: 'center', padding: '3rem 1rem',
              fontFamily: "'DM Sans', sans-serif", color: 'var(--text-muted)', fontSize: '0.9375rem',
            }}>
              {searchQuery
                ? `No masjids match "${searchQuery}".`
                : nearbyToggle
                ? 'No masjids found within 50 km.'
                : 'No masjids found.'}
            </div>
          )}

          {!isBusy && !apiError && displayList.map((masjid, i) => {
            const avatarBg   = AVATAR_GRADIENTS[((page - 1) * ITEMS_PER_PAGE + i) % AVATAR_GRADIENTS.length];
            const avatarText = AVATAR_TEXT_COLORS[((page - 1) * ITEMS_PER_PAGE + i) % AVATAR_TEXT_COLORS.length];
            const isFav      = !!favorites[masjid._id];
            const distKm     = masjid.dist ?? null;

            return (
              <ScrollReveal key={masjid._id} variant="up" delay={i * 80} style={{ marginBottom: '0.75rem' }}>
                <GlowCard style={{ cursor: 'pointer' }} className="glow-card">
                  <div
                    role="listitem"
                    onClick={() => router.push(`/masjids/${masjid._id}`)}
                    onKeyDown={e => e.key === 'Enter' && router.push(`/masjids/${masjid._id}`)}
                    tabIndex={0}
                    aria-label={`View prayer times for ${masjid.name}${distKm !== null ? `, ${distKm.toFixed(1)} km away` : ''}`}
                    style={{ display: 'grid', gridTemplateColumns: '64px 1fr auto', alignItems: 'center', gap: '1rem', padding: '1.1rem 1.25rem' }}
                  >
                    <div aria-hidden="true" style={{
                      width: 64, height: 64, background: avatarBg,
                      clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.75rem', fontWeight: 700, color: avatarText, lineHeight: 1 }}>
                        {masjid.name.charAt(0)}
                      </span>
                    </div>

                    <div>
                      <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-headline)', margin: '0 0 0.25rem', lineHeight: 1.2 }}>
                        {masjid.name}
                      </h3>
                      <p style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontFamily: "'DM Sans', sans-serif", fontSize: '0.8125rem', color: 'var(--text-muted)', margin: 0 }}>
                        <MapPin size={12} aria-hidden="true" />
                        {masjid.address || 'Address not available'}
                      </p>
                      {distKm !== null && (
                        <p style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontFamily: "'DM Sans', sans-serif", fontSize: '0.75rem', color: 'var(--brand-teal-dark)', margin: '0.25rem 0 0', fontWeight: 500 }}>
                          <Navigation size={11} aria-hidden="true" />
                          {distKm < 1 ? `${(distKm * 1000).toFixed(0)} m away` : `${distKm.toFixed(1)} km away`}
                        </p>
                      )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                      <button
                        onClick={e => toggleFavorite(masjid._id, e)}
                        aria-label={isFav ? `Remove ${masjid.name} from favourites` : `Add ${masjid.name} to favourites`}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer', padding: '0.7rem',
                          minWidth: '44px', minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: isFav ? 'var(--brand-teal)' : 'var(--text-muted)',
                          transition: 'color var(--duration-base) ease, transform var(--duration-fast) ease',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.2)')}
                        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                      >
                        <Star size={20} fill={isFav ? 'var(--brand-teal)' : 'transparent'} aria-hidden="true" />
                      </button>
                      <ArrowRight size={14} color="var(--text-muted)" aria-hidden="true" />
                    </div>
                  </div>
                </GlowCard>
              </ScrollReveal>
            );
          })}

          {/* Pagination */}
          {!isBusy && !apiError && totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', margin: '1.5rem 0 1rem' }}>
              <button
                onClick={() => goToPage(page - 1)}
                disabled={page === 1}
                aria-label="Previous page"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 36, height: 36, borderRadius: '50%', border: '1px solid rgba(65,194,220,0.25)',
                  background: page === 1 ? 'transparent' : 'var(--surface-warm-white)',
                  color: page === 1 ? 'var(--text-muted)' : 'var(--brand-teal)',
                  cursor: page === 1 ? 'not-allowed' : 'pointer',
                  opacity: page === 1 ? 0.4 : 1,
                  transition: 'background 200ms ease, box-shadow 200ms ease',
                }}
              >
                <ChevronLeft size={18} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => goToPage(p)}
                  aria-label={`Page ${p}`}
                  aria-current={page === p ? 'page' : undefined}
                  style={{
                    width: 36, height: 36, borderRadius: '50%', border: 'none',
                    background: page === p ? 'var(--brand-teal)' : 'var(--surface-warm-white)',
                    color: page === p ? '#ffffff' : 'var(--text-muted)',
                    fontFamily: "'DM Sans', sans-serif", fontSize: '0.875rem', fontWeight: 600,
                    cursor: 'pointer', boxShadow: page === p ? '0 4px 12px rgba(65,194,220,0.35)' : 'var(--shadow-sm)',
                    transition: 'background 200ms ease, color 200ms ease',
                  }}
                >
                  {p}
                </button>
              ))}

              <button
                onClick={() => goToPage(page + 1)}
                disabled={page === totalPages}
                aria-label="Next page"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 36, height: 36, borderRadius: '50%', border: '1px solid rgba(65,194,220,0.25)',
                  background: page === totalPages ? 'transparent' : 'var(--surface-warm-white)',
                  color: page === totalPages ? 'var(--text-muted)' : 'var(--brand-teal)',
                  cursor: page === totalPages ? 'not-allowed' : 'pointer',
                  opacity: page === totalPages ? 0.4 : 1,
                  transition: 'background 200ms ease, box-shadow 200ms ease',
                }}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}

          {/* App CTA — shown after last page */}
          {!isBusy && !apiError && isLastPage && (
            <ScrollReveal variant="up" delay={200}>
              <div style={{
                textAlign: 'center', padding: '2rem 1.5rem',
                background: 'var(--surface-warm-white)', borderRadius: 'var(--radius-lg)',
                border: '1px solid rgba(65,194,220,0.18)', borderTop: '3px solid var(--brand-teal)',
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
                <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: 'var(--text-headline)', margin: '0 0 0.4rem' }}>
                  Discover All 74,000+ Masjids
                </p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.875rem', color: 'var(--text-muted)', margin: '0 0 1.5rem', lineHeight: 1.6 }}>
                  Get live prayer alerts, the full masjid directory, Qibla finder, and community updates — all in the Mihrab app.
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Link href={ANDROID_APP_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ textDecoration: 'none' }}>
                    Google Play
                  </Link>
                  <Link href={IOS_APP_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ textDecoration: 'none' }}>
                    App Store
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          )}

        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: translateY(-50%) rotate(360deg); } }
      `}</style>
    </div>
  );
}
