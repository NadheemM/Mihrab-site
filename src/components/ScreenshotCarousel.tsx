'use client';
import Image from 'next/image';

const screens = [
  { src: '/first.png',  label: 'Home Screen' },
  { src: '/second.jpg', label: 'App Features' },
  { src: '/third.jpg',  label: 'Daily Content' },
  { src: '/fourth.jpg', label: 'Hadith & Dua' },
  { src: '/fifth.jpg',  label: 'Quran' },
  { src: '/sixth.jpg',  label: 'More Features' },
];

// Duplicate once for seamless infinite loop — when set A scrolls off-screen
// set B is already in place; the container resets to 0 invisibly.
const track = [...screens, ...screens];

// Each slide fills the phone screen height exactly so the snap is clean.
const PHONE_W  = 265;
const PHONE_H  = 535;
const SLIDE_H  = PHONE_H;
// Total track height = 12 slides × SLIDE_H. Animation moves exactly 50% (one set).
// Duration = slides * seconds-per-slide for a comfortable viewing pace.
const DURATION = `${screens.length * 4}s`; // 4 s per image = 24 s per full pass

export default function ScreenshotCarousel() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '2.5rem 0 1rem' }}>

      {/* ── Phone shell ── */}
      <div
        role="img"
        aria-label="Mihrab app screenshots cycling through a phone mockup"
        style={{
          position:     'relative',
          width:        PHONE_W,
          height:       PHONE_H,
          borderRadius: 44,
          border:       '10px solid #0e1828',
          background:   '#0e1828',
          boxShadow: [
            '0 50px 100px rgba(0,0,0,0.50)',
            '0 20px  48px rgba(0,0,0,0.30)',
            'inset 0 0 0 1px rgba(255,255,255,0.05)',
          ].join(', '),
          overflow: 'hidden',
        }}
      >
        {/* Dynamic island */}
        <div aria-hidden="true" style={{
          position: 'absolute', top: 10, left: '50%',
          transform: 'translateX(-50%)',
          width: 82, height: 22, borderRadius: 14,
          background: '#0e1828', zIndex: 10,
        }} />

        {/* Volume / power buttons — purely decorative */}
        <div aria-hidden="true" style={{ position:'absolute', left:-12, top: 88, width:4, height:30, borderRadius:2, background:'#1c2e4a' }} />
        <div aria-hidden="true" style={{ position:'absolute', left:-12, top:126, width:4, height:30, borderRadius:2, background:'#1c2e4a' }} />
        <div aria-hidden="true" style={{ position:'absolute', left:-12, top:162, width:4, height:54, borderRadius:2, background:'#1c2e4a' }} />
        <div aria-hidden="true" style={{ position:'absolute', right:-12, top:100, width:4, height:42, borderRadius:2, background:'#1c2e4a' }} />

        {/* ── Infinite scrolling strip ── */}
        <div className="phone-scroll-track" style={{ position:'absolute', top:0, left:0, width:'100%' }}>
          {track.map((s, i) => (
            <div key={i} style={{ position:'relative', width:'100%', height: SLIDE_H, flexShrink:0 }}>
              <Image
                src={s.src}
                alt={i < screens.length ? s.label : ''}
                aria-hidden={i >= screens.length}
                fill
                sizes={`${PHONE_W * 2}px`}
                style={{ objectFit:'cover', objectPosition:'top' }}
                priority={i < 2}
              />
            </div>
          ))}
        </div>

        {/* Glare highlight — top-left sheen */}
        <div aria-hidden="true" style={{
          position:'absolute', inset:0, borderRadius:34,
          background:'linear-gradient(140deg, rgba(255,255,255,0.05) 0%, transparent 55%)',
          pointerEvents:'none', zIndex:8,
        }} />
      </div>

      {/* ── CSS animation + reduced-motion override ── */}
      <style>{`
        .phone-scroll-track {
          animation: phoneScrollUp ${DURATION} linear infinite;
        }
        @keyframes phoneScrollUp {
          from { transform: translateY(0); }
          to   { transform: translateY(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .phone-scroll-track {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
