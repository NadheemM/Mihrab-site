'use client';
import { useRef, useState, MouseEvent, ReactNode, CSSProperties } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  wrapperStyle?: CSSProperties;
}

export default function GlowCard({ children, className = '', style, wrapperStyle }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    // glow position
    el.style.setProperty('--gx', `${(x / rect.width) * 100}%`);
    el.style.setProperty('--gy', `${(y / rect.height) * 100}%`);
    // tilt
    const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -8;
    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 8;
    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--gx', '50%');
    el.style.setProperty('--gy', '50%');
    setRotation({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <div style={{ perspective: '1000px', height: '100%', ...wrapperStyle }}>
      <div
        ref={ref}
        className={`glow-card ${className}`}
        style={{
          '--gx': '50%',
          '--gy': '50%',
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) ${isHovered ? 'scale(1.02)' : 'scale(1)'}`,
          transition: 'transform 300ms ease-out',
          transformStyle: 'preserve-3d',
          position: 'relative',
          height: '100%',
          ...style,
        } as CSSProperties}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
      >
        {children}
        {/* Shine overlay */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 400ms',
            pointerEvents: 'none',
            background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.06) 50%, transparent 70%)',
            borderRadius: 'inherit',
          }}
        />
      </div>
    </div>
  );
}
