'use client';

interface SplineHeroProps {
  className?: string;
}

const PRAYER_ROWS = [
  { name: 'Fajr',    time: '5:15',  active: false },
  { name: 'Dhuhr',   time: '12:30', active: false },
  { name: 'Asr',     time: '3:45',  active: true  },
  { name: 'Maghrib', time: '6:20',  active: false },
  { name: 'Isha',    time: '8:00',  active: false },
];

export default function SplineHero({ className }: SplineHeroProps) {
  return (
    <div
      className={className}
      aria-hidden="true"
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <style>{`
        @keyframes phoneFloat {
          0%, 100% { transform: perspective(900px) rotateY(-18deg) rotateX(6deg) translateY(0px); }
          50%       { transform: perspective(900px) rotateY(-18deg) rotateX(6deg) translateY(-14px); }
        }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 32px 80px rgba(65,194,220,0.22), 0 0 0 1px rgba(65,194,220,0.12); }
          50%       { box-shadow: 0 40px 100px rgba(65,194,220,0.35), 0 0 0 1px rgba(65,194,220,0.2); }
        }
      `}</style>

      {/* Outer glow ring */}
      <div style={{
        position: 'absolute',
        width: 260,
        height: 500,
        borderRadius: 44,
        background: 'radial-gradient(ellipse, rgba(65,194,220,0.12) 0%, transparent 70%)',
        transform: 'perspective(900px) rotateY(-18deg) rotateX(6deg)',
        animation: 'phoneFloat 4s ease-in-out infinite',
        pointerEvents: 'none',
      }} />

      {/* Phone shell */}
      <div style={{
        width: 230,
        height: 470,
        borderRadius: 38,
        border: '9px solid #0F1A30',
        background: '#FFFFFF',
        animation: 'phoneFloat 4s ease-in-out infinite, glowPulse 4s ease-in-out infinite',
        transformStyle: 'preserve-3d',
        position: 'relative',
        overflow: 'hidden',
        zIndex: 1,
      }}>
        {/* Notch */}
        <div style={{
          position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)',
          width: 64, height: 14, borderRadius: 8, background: '#0F1A30', zIndex: 3,
        }} />

        {/* Status bar */}
        <div style={{
          background: '#41C2DC',
          height: 52,
          display: 'flex',
          alignItems: 'flex-end',
          padding: '0 14px 8px',
          justifyContent: 'space-between',
        }}>
          <span style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#0F1A30',
            opacity: 0.75,
          }}>
            Mihrab
          </span>
          <div style={{ display: 'flex', gap: 3 }}>
            {[1,1,1].map((_, i) => (
              <div key={i} style={{ width: 3, height: 7 + i * 2, background: '#0F1A30', opacity: 0.5, borderRadius: 1 }} />
            ))}
          </div>
        </div>

        {/* Screen body */}
        <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 6, height: 'calc(100% - 52px)' }}>
          {/* Section label */}
          <p style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: 8,
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#718096',
            margin: '2px 0 4px',
          }}>
            Today&apos;s Prayers
          </p>

          {/* Prayer rows */}
          {PRAYER_ROWS.map((p) => (
            <div key={p.name} style={{
              background: p.active ? 'rgba(65,194,220,0.1)' : '#F4FAFA',
              borderRadius: 7,
              height: 34,
              display: 'flex',
              alignItems: 'center',
              padding: '0 10px',
              justifyContent: 'space-between',
              borderLeft: p.active ? '3px solid #41C2DC' : '3px solid transparent',
            }}>
              <span style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: 9,
                fontWeight: p.active ? 700 : 500,
                color: p.active ? '#007A7A' : '#0F1A30',
              }}>
                {p.name}
              </span>
              <span style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: 9,
                fontWeight: 700,
                color: p.active ? '#007A7A' : '#718096',
                fontVariantNumeric: 'tabular-nums',
              }}>
                {p.time}
              </span>
            </div>
          ))}

          {/* Map card */}
          <div style={{
            flex: 1,
            borderRadius: 10,
            marginTop: 4,
            background: 'linear-gradient(135deg, #EEF8F8 0%, #B3F0F0 100%)',
            position: 'relative',
            overflow: 'hidden',
            minHeight: 80,
          }}>
            {/* Grid lines */}
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: 'linear-gradient(rgba(65,194,220,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(65,194,220,0.12) 1px, transparent 1px)',
              backgroundSize: '18px 18px',
            }} />
            {/* Location pin */}
            <div style={{
              position: 'absolute', top: '45%', left: '50%',
              transform: 'translate(-50%,-50%)',
              width: 22, height: 22, borderRadius: '50%',
              background: '#41C2DC',
              border: '3px solid #FFFFFF',
              boxShadow: '0 0 0 4px rgba(65,194,220,0.25)',
              zIndex: 1,
            }} />
            {/* Pulse ring */}
            <div style={{
              position: 'absolute', top: '45%', left: '50%',
              transform: 'translate(-50%,-50%)',
              width: 44, height: 44, borderRadius: '50%',
              border: '1.5px solid rgba(65,194,220,0.4)',
            }} />
            <p style={{
              position: 'absolute', bottom: 6, left: 0, right: 0,
              textAlign: 'center',
              fontFamily: 'system-ui, sans-serif',
              fontSize: 8, fontWeight: 600,
              color: '#007A7A',
              letterSpacing: '0.05em',
            }}>
              Nearest Masjid
            </p>
          </div>

          {/* Bottom tab bar */}
          <div style={{
            height: 36,
            background: '#F4FAFA',
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            marginTop: 2,
          }}>
            {['⏱', '🕌', '📖', '🧭'].map((icon, i) => (
              <div key={i} style={{
                width: 28, height: 28, borderRadius: 8,
                background: i === 0 ? '#41C2DC' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11,
              }}>
                {icon}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
