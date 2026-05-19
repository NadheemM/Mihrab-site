'use client';
import { useState, useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useIsMobile } from '@/lib/useIsMobile';

const screens = [
  { src: '/first.png',  label: 'Home Screen',  feature: 'Prayer Times & Daily Tracker' },
  { src: '/second.jpg', label: 'App Features',  feature: 'All Your Islamic Tools in One Place' },
  { src: '/third.jpg',  label: 'Daily Content', feature: 'Daily Hadith, Dua & Quranic Verse' },
  { src: '/fourth.jpg', label: 'Hadith & Dua',  feature: 'Authentic Hadith from Trusted Sources' },
  { src: '/fifth.jpg',  label: 'Quran',         feature: 'Read the Holy Quran with Ease' },
  { src: '/sixth.jpg',  label: 'Tracker',       feature: 'Salah Tracker & Fasting Reminder' },
];

const N = screens.length;
function mod(n: number, m: number) { return ((n % m) + m) % m; }

export default function ScreenshotCarousel() {
  const [active, setActive]       = useState(0);
  const [labelVisible, setLabelVisible] = useState(true);
  const [shownFeature, setShownFeature] = useState(screens[0].feature);
  const isMobile = useIsMobile();

  // ── Auto-advance ──────────────────────────────────────────────────────────
  const autoRef   = useRef<ReturnType<typeof setInterval> | null>(null);
  const pausedRef = useRef(false);

  const pauseAuto  = useCallback(() => { pausedRef.current = true; }, []);
  const resumeAuto = useCallback(() => { pausedRef.current = false; }, []);

  useEffect(() => {
    // Respect prefers-reduced-motion — skip auto-advance if user has it on
    if (typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    autoRef.current = setInterval(() => {
      if (!pausedRef.current) setActive(a => mod(a + 1, N));
    }, 4000);
    return () => { if (autoRef.current) clearInterval(autoRef.current); };
  }, []);

  // After manual interaction pause auto for 3 s then resume
  const withCooldown = useCallback((fn: () => void) => {
    fn();
    pauseAuto();
    setTimeout(resumeAuto, 3000);
  }, [pauseAuto, resumeAuto]);

  const prev = useCallback(() => withCooldown(() => setActive(a => mod(a - 1, N))), [withCooldown]);
  const next = useCallback(() => withCooldown(() => setActive(a => mod(a + 1, N))), [withCooldown]);
  const goTo = useCallback((i: number) => withCooldown(() => setActive(i)), [withCooldown]);

  // ── Feature label fade on slide change ────────────────────────────────────
  useEffect(() => {
    setLabelVisible(false);
    const t = setTimeout(() => {
      setShownFeature(screens[active].feature);
      setLabelVisible(true);
    }, 190);
    return () => clearTimeout(t);
  }, [active]);

  // ── Keyboard navigation (arrow keys) ─────────────────────────────────────
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft')  prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [prev, next]);

  // ── Touch / swipe ─────────────────────────────────────────────────────────
  const swipeStartX = useRef(0);
  const swipeStartY = useRef(0);

  // ── Dimensions (responsive) ───────────────────────────────────────────────
  const PW   = isMobile ? 140 : 205;
  const PH   = isMobile ? 282 : 415;
  const STEP = isMobile ? 108 : 160;   // < PW → phones overlap / stack
  const SIDE = isMobile ? 1   : 2;

  return (
    <div style={{ width: '100%' }}>

      {/* ── Track ── */}
      <div
        style={{ position: 'relative', height: PH + 90, overflow: 'hidden' }}
        onMouseEnter={pauseAuto}
        onMouseLeave={resumeAuto}
        onTouchStart={e => {
          swipeStartX.current = e.touches[0].clientX;
          swipeStartY.current = e.touches[0].clientY;
          pauseAuto();
        }}
        onTouchEnd={e => {
          const dx = e.changedTouches[0].clientX - swipeStartX.current;
          const dy = Math.abs(e.changedTouches[0].clientY - swipeStartY.current);
          // Only trigger on horizontal swipes > 50 px that aren't vertical scrolls
          if (Math.abs(dx) > 50 && Math.abs(dx) > dy) {
            dx < 0 ? next() : prev();
          }
          setTimeout(resumeAuto, 2000);
        }}
      >
        {/* Ambient teal glow behind the center phone */}
        <div
          aria-hidden="true"
          style={{
            position:     'absolute',
            left:         '50%',
            top:          '50%',
            transform:    'translate(-50%, -50%)',
            width:        PW * 2.4,
            height:       PH * 1.5,
            borderRadius: '50%',
            background:   'radial-gradient(ellipse at center, rgba(65,194,220,0.20) 0%, rgba(65,194,220,0.07) 45%, transparent 72%)',
            filter:       'blur(38px)',
            pointerEvents: 'none',
            zIndex:       0,
          }}
        />

        {/* Phone frames */}
        {screens.map((s, i) => {
          let off = i - active;
          if (off >  N / 2) off -= N;
          if (off < -N / 2) off += N;
          const abs = Math.abs(off);
          if (abs > SIDE + 0.6) return null;

          const isCenter  = abs === 0;
          const scale     = 1 - abs * 0.145;
          const tx        = off * STEP;
          const ty        = abs * 22;
          const opacity   = 1 - abs * 0.20;
          const rotateY   = off === 0 ? 0 : off > 0 ? -14 : 14;
          const zIndex    = 10 - abs;
          const frameColor = isCenter ? '#18334e' : '#0a1520';
          const framePx    = isCenter ? 11 : 8;

          const shadow = isCenter
            ? '0 36px 72px rgba(0,0,0,0.50), -22px 6px 44px rgba(0,0,0,0.14), 22px 6px 44px rgba(0,0,0,0.14)'
            : off > 0
            ? `${abs * 20}px ${abs * 10}px ${abs * 36}px rgba(0,0,0,0.38), inset -3px 0 10px rgba(0,0,0,0.22)`
            : `-${abs * 20}px ${abs * 10}px ${abs * 36}px rgba(0,0,0,0.38), inset 3px 0 10px rgba(0,0,0,0.22)`;

          return (
            <div
              key={i}
              onClick={() => !isCenter && goTo(i)}
              role={isCenter ? undefined : 'button'}
              aria-label={isCenter ? undefined : `View ${s.label}`}
              tabIndex={isCenter ? undefined : 0}
              onKeyDown={e => {
                if (!isCenter && (e.key === 'Enter' || e.key === ' ')) goTo(i);
              }}
              style={{
                position:     'absolute',
                left:         `calc(50% - ${PW / 2}px)`,
                top:          `calc(50% - ${PH / 2}px)`,
                width:        PW,
                height:       PH,
                borderRadius: 34,
                border:       `${framePx}px solid ${frameColor}`,
                background:   '#0e1828',
                overflow:     'hidden',
                zIndex,
                opacity,
                cursor:       isCenter ? 'default' : 'pointer',
                boxShadow:    shadow,
                transform:    `perspective(1100px) translateX(${tx}px) translateY(${ty}px) scale(${scale}) rotateY(${rotateY}deg)`,
                transition: [
                  'transform 0.55s cubic-bezier(0.25,0.46,0.45,0.94)',
                  'opacity   0.55s ease',
                  'box-shadow 0.45s ease',
                ].join(', '),
                willChange: 'transform, opacity',
              }}
            >
              {/* Dynamic island notch */}
              <div aria-hidden="true" style={{
                position:     'absolute',
                top:          7,
                left:         '50%',
                transform:    'translateX(-50%)',
                width:        56,
                height:       13,
                borderRadius: 8,
                background:   frameColor,
                zIndex:       2,
              }} />

              <Image
                src={s.src}
                alt={s.label}
                fill
                sizes={`${PW * 2}px`}
                style={{ objectFit: 'cover', objectPosition: 'top' }}
                priority={abs === 0}
              />
            </div>
          );
        })}
      </div>

      {/* ── Feature label ── */}
      <div style={{
        height:          '1.75rem',
        margin:          '1.5rem 0 1rem',
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'center',
        overflow:        'hidden',
        padding:         '0 1rem',
      }}>
        <span style={{
          fontFamily:    "'Inter', sans-serif",
          fontSize:      isMobile ? '0.875rem' : '1rem',
          fontWeight:    600,
          color:         'var(--text-headline)',
          letterSpacing: '0.02em',
          textAlign:     'center',
          opacity:       labelVisible ? 1 : 0,
          transform:     labelVisible ? 'translateY(0)' : 'translateY(8px)',
          transition:    'opacity 0.22s ease, transform 0.22s ease',
          display:       'block',
          whiteSpace:    'nowrap',
        }}>
          {shownFeature}
        </span>
      </div>

      {/* ── Controls: ‹  n / N  › ── */}
      <div style={{
        display:         'flex',
        justifyContent:  'center',
        alignItems:      'center',
        gap:             '1.25rem',
      }}>
        {/* Prev */}
        <button
          onClick={prev}
          aria-label="Previous screenshot"
          style={arrowStyle}
          onMouseEnter={arrowHoverOn}
          onMouseLeave={arrowHoverOff}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>

        {/* Slide counter */}
        <span
          aria-live="polite"
          aria-label={`Slide ${active + 1} of ${N}`}
          style={{
            fontFamily:         "'Inter', sans-serif",
            fontSize:           '0.875rem',
            fontWeight:         600,
            fontVariantNumeric: 'tabular-nums',
            color:              'rgba(65,194,220,0.75)',
            letterSpacing:      '0.06em',
            minWidth:           '3.25rem',
            textAlign:          'center',
          }}
        >
          {active + 1} / {N}
        </span>

        {/* Next */}
        <button
          onClick={next}
          aria-label="Next screenshot"
          style={arrowStyle}
          onMouseEnter={arrowHoverOn}
          onMouseLeave={arrowHoverOff}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      </div>

    </div>
  );
}

// ── Static style objects (avoid re-creating on every render) ─────────────────
const arrowStyle: React.CSSProperties = {
  width:      46,
  height:     46,
  borderRadius: '50%',
  flexShrink: 0,
  border:     '1.5px solid rgba(65,194,220,0.40)',
  background: 'rgba(65,194,220,0.08)',
  color:      '#41C2DC',
  cursor:     'pointer',
  display:    'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'background 0.2s ease, border-color 0.2s ease',
};

function arrowHoverOn(e: React.MouseEvent<HTMLButtonElement>) {
  e.currentTarget.style.background  = 'rgba(65,194,220,0.22)';
  e.currentTarget.style.borderColor = 'rgba(65,194,220,0.85)';
}
function arrowHoverOff(e: React.MouseEvent<HTMLButtonElement>) {
  e.currentTarget.style.background  = 'rgba(65,194,220,0.08)';
  e.currentTarget.style.borderColor = 'rgba(65,194,220,0.40)';
}
