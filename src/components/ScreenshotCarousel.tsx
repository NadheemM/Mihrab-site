'use client';
import { useState, useCallback } from 'react';
import Image from 'next/image';
import { useIsMobile } from '@/lib/useIsMobile';

const screens = [
  { src: '/first.png',  label: 'Home Screen' },
  { src: '/second.jpg', label: 'App Features' },
  { src: '/third.jpg',  label: 'Daily Content' },
  { src: '/fourth.jpg', label: 'Hadith & Dua' },
  { src: '/fifth.jpg',  label: 'Quran' },
  { src: '/sixth.jpg',  label: 'More Features' },
];

const N = screens.length;
function mod(n: number, m: number) { return ((n % m) + m) % m; }

// Shadow per depth layer — center casts outward on both sides,
// each side layer casts further outward toward its outer neighbour
function buildShadow(off: number): string {
  const abs = Math.abs(off);
  if (abs === 0) {
    return [
      '0 40px 80px rgba(0,0,0,0.42)',
      '-28px 8px 48px rgba(0,0,0,0.14)',
      ' 28px 8px 48px rgba(0,0,0,0.14)',
    ].join(',');
  }
  const dir = off > 0 ? 1 : -1;
  return [
    `${dir * abs * 22}px ${abs * 10}px ${abs * 38}px rgba(0,0,0,0.32)`,
    `${dir * abs *  6}px  0px ${abs * 16}px rgba(0,0,0,0.18)`,
  ].join(',');
}

export default function ScreenshotCarousel() {
  const [active, setActive] = useState(0);
  const isMobile = useIsMobile();

  const prev = useCallback(() => setActive(a => mod(a - 1, N)), []);
  const next = useCallback(() => setActive(a => mod(a + 1, N)), []);

  const PW   = isMobile ? 150 : 205;   // phone width
  const PH   = isMobile ? 300 : 415;   // phone height
  const STEP = isMobile ? 172 : 248;   // centre-to-centre spacing
  const SIDE = isMobile ? 1   : 2;     // visible phones each side

  return (
    <div style={{ width: '100%' }}>

      {/* ── Track ── */}
      <div style={{
        position: 'relative',
        height: PH + 80,
        overflow: 'hidden',
      }}>
        {screens.map((s, i) => {
          // Shortest circular distance from active
          let off = i - active;
          if (off >  N / 2) off -= N;
          if (off < -N / 2) off += N;
          const abs = Math.abs(off);

          // Hide phones beyond the visible side slots
          if (abs > SIDE + 0.6) return null;

          const scale   = 1 - abs * 0.115;
          const tx      = off * STEP;
          const ty      = abs * 16;           // side phones drop slightly
          const opacity = 1 - abs * 0.22;
          const zIndex  = 20 - abs;
          const isCenter = abs === 0;

          return (
            <div
              key={i}
              onClick={() => !isCenter && setActive(i)}
              role={isCenter ? undefined : 'button'}
              aria-label={isCenter ? undefined : `View ${s.label}`}
              tabIndex={isCenter ? undefined : 0}
              onKeyDown={e => { if (!isCenter && (e.key === 'Enter' || e.key === ' ')) setActive(i); }}
              style={{
                position:  'absolute',
                left:      `calc(50% - ${PW / 2}px)`,
                top:       `calc(50% - ${PH / 2}px)`,
                width:     PW,
                height:    PH,
                borderRadius: 30,
                border:    `${isCenter ? 10 : 8}px solid #0F1A30`,
                background: '#0F1A30',
                overflow:  'hidden',
                zIndex,
                opacity,
                cursor:    isCenter ? 'default' : 'pointer',
                boxShadow: buildShadow(off),
                transform: `translateX(${tx}px) translateY(${ty}px) scale(${scale})`,
                transition: [
                  'transform 0.55s cubic-bezier(0.25,0.46,0.45,0.94)',
                  'opacity   0.55s ease',
                  'box-shadow 0.45s ease',
                ].join(', '),
                willChange: 'transform, opacity',
              }}
            >
              {/* Notch */}
              <div style={{
                position: 'absolute', top: 5, left: '50%',
                transform: 'translateX(-50%)',
                width: 52, height: 11, borderRadius: 6,
                background: '#0F1A30', zIndex: 2,
              }} aria-hidden="true" />

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

      {/* ── Controls: prev · dots · next ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: '1.25rem', marginTop: '2rem',
      }}>

        <button
          onClick={prev}
          aria-label="Previous screenshot"
          style={{
            width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
            border: '1.5px solid rgba(65,194,220,0.35)',
            background: 'rgba(65,194,220,0.08)',
            color: '#41C2DC', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.2s ease, border-color 0.2s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(65,194,220,0.20)';
            e.currentTarget.style.borderColor = 'rgba(65,194,220,0.7)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(65,194,220,0.08)';
            e.currentTarget.style.borderColor = 'rgba(65,194,220,0.35)';
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>

        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
          {screens.map((s, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Go to ${s.label}`}
              aria-pressed={active === i}
              style={{
                width:  active === i ? 24 : 8,
                height: 8,
                borderRadius: 4,
                background: active === i ? '#41C2DC' : 'rgba(65,194,220,0.28)',
                border: 'none', cursor: 'pointer', padding: 0,
                transition: 'width 0.25s ease, background 0.25s ease',
              }}
            />
          ))}
        </div>

        <button
          onClick={next}
          aria-label="Next screenshot"
          style={{
            width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
            border: '1.5px solid rgba(65,194,220,0.35)',
            background: 'rgba(65,194,220,0.08)',
            color: '#41C2DC', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.2s ease, border-color 0.2s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(65,194,220,0.20)';
            e.currentTarget.style.borderColor = 'rgba(65,194,220,0.7)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(65,194,220,0.08)';
            e.currentTarget.style.borderColor = 'rgba(65,194,220,0.35)';
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>

      </div>
    </div>
  );
}
