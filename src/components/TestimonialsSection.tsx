'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import ScrollReveal from './ScrollReveal';
import { useIsMobile } from '@/lib/useIsMobile';

const REVIEWS = [
  {
    name: 'Nihal P S',
    date: '4 March 2025',
    rating: 5,
    text: 'Mihrab App is a must-have for Muslims in India, offering precise prayer timings, a Qibla finder, Mushaff, and Hadith access. With a sleek, ad-free design, dark mode, and masjid connection, it\'s perfect for Ramzan. Featuring prayer alarms and Thajjud timings, Mihrab stands out as the best prayer time app in India, providing a seamless Islamic experience.',
  },
  {
    name: 'Jeon Asee',
    date: '10 March 2026',
    rating: 5,
    text: 'Alhamdulillah. This is the best app I have ever used. It is very useful because you can learn Islam in any language. It contains things like prayer on time, the meaning of the Quran in any language, and Hadiths, which are really valuable.',
  },
  {
    name: 'Ayisha Rabiya',
    date: '26 February 2026',
    rating: 5,
    text: 'Alhamdulillah. This is the app I was expecting. It feels like listening to Islamic books as audiobooks. The duas are arranged in separate topics, and there are many features. This one app fulfills all Islamic app needs.',
  },
  {
    name: 'Sharin Sajid',
    date: '22 January 2026',
    rating: 5,
    text: 'This is the best app I have ever used. It helps track prayers, the Names of Allah, and Quran verses. In this busy century, we don\'t always have enough time to sit and read properly, and this app makes it so much easier. I truly love this app. Alhamdulillah, I found something that helps repair my heart.',
  },
  {
    name: 'Nafela Rihaana',
    date: '4 January 2026',
    rating: 5,
    text: 'It is such a great app that every Muslim should have. It\'s easy to use and helps me spiritually a lot. The tracker is really good and it\'s the best Muslim software I have used so far. I would absolutely recommend adding widgets like daily verse and tracker to the home screen.',
  },
];

const N = REVIEWS.length;

const AVATAR_COLORS: Record<string, string> = {
  N: '#41C2DC',
  J: '#6366f1',
  A: '#f59e0b',
  S: '#10b981',
};

function Stars({ count }: { count: number }) {
  return (
    <div style={{ display: 'flex', gap: 3 }} aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} width="15" height="15" viewBox="0 0 24 24"
          fill={i < count ? '#22c55e' : '#d1d5db'} aria-hidden="true">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function ReviewCard({ r }: { r: typeof REVIEWS[0] }) {
  const initial = r.name[0];
  const avatarBg = AVATAR_COLORS[initial] ?? '#41C2DC';

  return (
    <div style={{
      background: '#FFFFFF',
      border: '1px solid rgba(0,0,0,0.08)',
      borderRadius: 16,
      padding: '1.5rem',
      boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      boxSizing: 'border-box',
    }}>
      {/* Header: avatar + name + Play badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: 44, height: 44, borderRadius: '50%',
              background: avatarBg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Inter', sans-serif", fontWeight: 700,
              fontSize: '1.0625rem', color: '#0F1A30', flexShrink: 0,
            }}
            aria-hidden="true"
          >
            {initial}
          </div>
          <div>
            <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '0.9375rem', color: '#0F1A30', margin: 0, lineHeight: 1.3 }}>
              {r.name}
            </p>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', color: '#9CA3AF', margin: 0 }}>
              {r.date}
            </p>
          </div>
        </div>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.6875rem', color: '#9CA3AF', letterSpacing: '0.03em', flexShrink: 0 }}>
          Google Play
        </span>
      </div>

      {/* Stars */}
      <div style={{ marginBottom: '0.875rem' }}>
        <Stars count={r.rating} />
      </div>

      {/* Text */}
      <p style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: '0.9375rem',
        lineHeight: 1.7,
        color: '#374151',
        margin: 0,
        flex: 1,
      }}>
        {r.text}
      </p>
    </div>
  );
}

export default function TestimonialsSection() {
  const isMobile = useIsMobile();
  const VISIBLE  = isMobile ? 1 : 3;
  const CLONES   = VISIBLE;

  // Extended track: [last CLONES clones] + real reviews + [first CLONES clones]
  const extended = [
    ...REVIEWS.slice(N - CLONES),
    ...REVIEWS,
    ...REVIEWS.slice(0, CLONES),
  ];
  const TOTAL = extended.length; // N + 2*CLONES

  // idx = first visible slide index; starts at CLONES (= first real slide)
  const [idx,  setIdx]  = useState(CLONES);
  const [anim, setAnim] = useState(true);
  const pausedRef = useRef(false);

  const next = useCallback(() => { setAnim(true); setIdx(i => i + 1); }, []);
  const prev = useCallback(() => { setAnim(true); setIdx(i => i - 1); }, []);

  // After a transition ends, snap from clone zone back to real zone
  const onTransEnd = useCallback(() => {
    setIdx(i => {
      if (i >= N + CLONES) { setAnim(false); return i - N; }
      if (i < CLONES)      { setAnim(false); return i + N; }
      return i;
    });
  }, [CLONES]);

  // Re-enable animation one frame after a no-anim snap
  useEffect(() => {
    if (anim) return;
    const r1 = requestAnimationFrame(() => {
      requestAnimationFrame(() => setAnim(true));
    });
    return () => cancelAnimationFrame(r1);
  }, [anim]);

  // Reset carousel when responsive breakpoint crosses
  useEffect(() => {
    setAnim(false);
    setIdx(VISIBLE);
  }, [VISIBLE]);

  // Auto-advance every 5 s
  useEffect(() => {
    if (typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => {
      if (!pausedRef.current) { setAnim(true); setIdx(i => i + 1); }
    }, 5000);
    return () => clearInterval(id);
  }, []);

  // track width = TOTAL/VISIBLE * 100% of container
  // translateX: -idx/TOTAL * 100% of track = -idx/VISIBLE * container  (verified)
  const trackW   = `${(TOTAL / VISIBLE) * 100}%`;
  const translateX = `translateX(${(-idx / TOTAL) * 100}%)`;

  return (
    <section
      style={{ padding: '5rem 0', background: '#FFFFFF' }}
      aria-labelledby="testimonials-heading"
    >
      <div className="container">

        {/* Header row: heading left, nav buttons right */}
        <div style={{
          display:        'flex',
          alignItems:     'flex-end',
          justifyContent: 'space-between',
          marginBottom:   '2.5rem',
          flexWrap:       'wrap',
          gap:            '1rem',
        }}>
          <ScrollReveal variant="fade">
            <div>
              <span className="text-teal-label">Community Love</span>
              <h2
                id="testimonials-heading"
                style={{
                  fontFamily:    "'Inter', sans-serif",
                  fontSize:      'clamp(1.875rem, 3.5vw, 2.5rem)',
                  fontWeight:    700,
                  color:         '#0F1A30',
                  margin:        '0.5rem 0 0',
                  letterSpacing: '-0.02em',
                }}
              >
                Loved by the community
              </h2>
            </div>
          </ScrollReveal>

          {/* Primary-color nav buttons */}
          <div style={{ display: 'flex', gap: '0.625rem', flexShrink: 0 }}>
            <NavBtn onClick={prev} label="Previous review" dir="left" />
            <NavBtn onClick={next} label="Next review"     dir="right" />
          </div>
        </div>

        {/* Carousel */}
        <div
          style={{ overflow: 'hidden' }}
          onMouseEnter={() => { pausedRef.current = true;  }}
          onMouseLeave={() => { pausedRef.current = false; }}
        >
          <div
            onTransitionEnd={onTransEnd}
            style={{
              display:    'flex',
              alignItems: 'stretch',
              width:      trackW,
              transform:  translateX,
              transition: anim
                ? 'transform 0.55s cubic-bezier(0.25,0.46,0.45,0.94)'
                : 'none',
              willChange: 'transform',
            }}
          >
            {extended.map((r, i) => (
              <div
                key={i}
                style={{
                  flex:       `0 0 calc(100% / ${TOTAL})`,
                  padding:    '0 0.75rem',
                  boxSizing:  'border-box',
                }}
              >
                <ReviewCard r={r} />
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

// ── Nav button ───────────────────────────────────────────────────────────────
function NavBtn({ onClick, label, dir }: { onClick: () => void; label: string; dir: 'left' | 'right' }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      style={navBtnBase}
      onMouseEnter={e => { e.currentTarget.style.background = '#2BA8C5'; }}
      onMouseLeave={e => { e.currentTarget.style.background = '#41C2DC'; }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {dir === 'left'
          ? <polyline points="15 18 9 12 15 6" />
          : <polyline points="9 18 15 12 9 6" />}
      </svg>
    </button>
  );
}

const navBtnBase: React.CSSProperties = {
  width:          44,
  height:         44,
  borderRadius:   '50%',
  border:         'none',
  background:     '#41C2DC',
  color:          '#0F1A30',
  cursor:         'pointer',
  display:        'flex',
  alignItems:     'center',
  justifyContent: 'center',
  transition:     'background 0.2s ease',
  flexShrink:     0,
};
