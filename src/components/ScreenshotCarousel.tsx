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

export default function ScreenshotCarousel() {
  const [active, setActive] = useState(0);
  const isMobile = useIsMobile();

  const prev = useCallback(() => setActive(a => mod(a - 1, N)), []);
  const next = useCallback(() => setActive(a => mod(a + 1, N)), []);

  // Phone frame dimensions
  const PW   = isMobile ? 140 : 205;
  const PH   = isMobile ? 282 : 415;
  // Tight overlap — STEP < PW so phones stack closely
  const STEP = isMobile ? 108 : 160;
  // Visible side phones per side
  const SIDE = isMobile ? 1 : 2;

  return (
    <div style={{ width: '100%' }}>

      {/* ── Track ── */}
      <div style={{
        position: 'relative',
        height: PH + 90,
        overflow: 'hidden',
      }}>
        {screens.map((s, i) => {
          // Shortest circular offset from active index
          let off = i - active;
          if (off >  N / 2) off -= N;
          if (off < -N / 2) off += N;
          const abs = Math.abs(off);

          if (abs > SIDE + 0.6) return null;

          const isCenter = abs === 0;
          const scale    = 1 - abs * 0.145;         // each step ~14.5% smaller
          const tx       = off * STEP;               // horizontal — tight overlap
          const ty       = abs * 22;                 // side phones drop below center
          const opacity  = 1 - abs * 0.20;
          // Side phones angle inward to face center (3-D "stack" look)
          const rotateY  = off === 0 ? 0 : off > 0 ? -14 : 14;
          const zIndex   = 20 - abs;

          // Center: large symmetric glow. Sides: shadow cast outward away from center.
          const shadow = isCenter
            ? [
                '0 36px 72px rgba(0,0,0,0.50)',
                '-22px 6px 44px rgba(0,0,0,0.14)',
                ' 22px 6px 44px rgba(0,0,0,0.14)',
              ].join(', ')
            : off > 0
            ? `${abs * 20}px ${abs * 10}px ${abs * 36}px rgba(0,0,0,0.38), inset -3px 0 10px rgba(0,0,0,0.22)`
            : `-${abs * 20}px ${abs * 10}px ${abs * 36}px rgba(0,0,0,0.38), inset 3px 0 10px rgba(0,0,0,0.22)`;

          const frameColor = isCenter ? '#18334e' : '#0a1520';
          const framePx    = isCenter ? 11 : 8;

          return (
            <div
              key={i}
              onClick={() => !isCenter && setActive(i)}
              role={isCenter ? undefined : 'button'}
              aria-label={isCenter ? undefined : `View ${s.label}`}
              tabIndex={isCenter ? undefined : 0}
              onKeyDown={e => { if (!isCenter && (e.key === 'Enter' || e.key === ' ')) setActive(i); }}
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
                position: 'absolute', top: 7, left: '50%',
                transform: 'translateX(-50%)',
                width: 56, height: 13, borderRadius: 8,
                background: frameColor, zIndex: 2,
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

      {/* ── Navigation: ‹ › arrows only ── */}
      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        gap: '1.5rem', marginTop: '2rem',
      }}>
        {[
          { label: 'Previous screenshot', onClick: prev, points: '15 18 9 12 15 6' },
          { label: 'Next screenshot',     onClick: next, points: '9 18 15 12 9 6'  },
        ].map(btn => (
          <button
            key={btn.label}
            onClick={btn.onClick}
            aria-label={btn.label}
            style={{
              width: 46, height: 46, borderRadius: '50%', flexShrink: 0,
              border: '1.5px solid rgba(65,194,220,0.40)',
              background: 'rgba(65,194,220,0.08)',
              color: '#41C2DC', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.2s ease, border-color 0.2s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background    = 'rgba(65,194,220,0.22)';
              e.currentTarget.style.borderColor   = 'rgba(65,194,220,0.85)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background    = 'rgba(65,194,220,0.08)';
              e.currentTarget.style.borderColor   = 'rgba(65,194,220,0.40)';
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points={btn.points}/>
            </svg>
          </button>
        ))}
      </div>

    </div>
  );
}
