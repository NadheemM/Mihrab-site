'use client';
import { useRef, useState } from 'react';
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

export default function ScreenshotCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const isMobile = useIsMobile();

  function scrollTo(i: number) {
    setActive(i);
    const el = scrollRef.current;
    if (!el) return;
    const items = el.querySelectorAll('[data-phone]');
    items[i]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }

  return (
    <div style={{ width: '100%' }}>
      {/* Track */}
      <div
        ref={scrollRef}
        style={{
          display: 'flex',
          gap: '1.5rem',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          // Mobile: pad each side so the first/last slide can snap to center.
          // Desktop: center all phones (no overflow, justifyContent centers them).
          padding: isMobile ? '2rem calc(50% - 90px) 1.5rem' : '2rem 2rem 1.5rem',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
          alignItems: 'center',
          justifyContent: isMobile ? 'flex-start' : 'center',
        }}
        onScroll={(e) => {
          const el = e.currentTarget;
          const center = el.scrollLeft + el.clientWidth / 2;
          const items = Array.from(el.querySelectorAll('[data-phone]')) as HTMLElement[];
          let closest = 0;
          let minDist = Infinity;
          items.forEach((item, i) => {
            const dist = Math.abs(item.offsetLeft + item.offsetWidth / 2 - center);
            if (dist < minDist) { minDist = dist; closest = i; }
          });
          setActive(closest);
        }}
      >
        {screens.map((s, i) => (
          <div
            key={i}
            data-phone
            style={{
              flexShrink: 0,
              width: 180,
              height: 360,
              borderRadius: 28,
              border: '8px solid #0F1A30',
              overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(65,194,220,0.15)',
              scrollSnapAlign: 'center',
              position: 'relative',
              transform: 'perspective(600px) rotateY(-6deg)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              background: '#0F1A30',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = 'perspective(600px) rotateY(0deg) translateY(-6px)';
              (e.currentTarget as HTMLDivElement).style.boxShadow = '0 32px 64px rgba(65,194,220,0.25)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = 'perspective(600px) rotateY(-6deg)';
              (e.currentTarget as HTMLDivElement).style.boxShadow = '0 20px 50px rgba(65,194,220,0.15)';
            }}
            role="img"
            aria-label={`${s.label} app screenshot`}
          >
            {/* Notch */}
            <div style={{
              position: 'absolute', top: 4, left: '50%', transform: 'translateX(-50%)',
              width: 48, height: 10, borderRadius: 6, background: '#0F1A30', zIndex: 2,
            }} aria-hidden="true" />

            <Image
              src={s.src}
              alt={s.label}
              fill
              sizes="180px"
              style={{ objectFit: 'cover', objectPosition: 'top' }}
              priority={i < 3}
            />
          </div>
        ))}
      </div>

      {/* Dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
        {screens.map((s, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            aria-label={`Show ${s.label} screenshot`}
            aria-pressed={active === i}
            style={{
              width: active === i ? 20 : 8,
              height: 8,
              borderRadius: 4,
              background: active === i ? '#41C2DC' : 'rgba(65,194,220,0.25)',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              transition: 'width 0.25s ease, background 0.25s ease',
            }}
          />
        ))}
      </div>
    </div>
  );
}
