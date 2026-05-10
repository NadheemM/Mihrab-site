'use client';
import { useState, ReactNode, CSSProperties } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  wrapperClassName?: string;
  wrapperStyle?: CSSProperties;
}

export default function TiltCard({ children, className = '', style, wrapperClassName = '', wrapperStyle }: Props) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -10;
    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 10;
    setRotation({ x: rotateX, y: rotateY });
  };

  return (
    <div
      className={wrapperClassName}
      style={{ perspective: '1000px', ...wrapperStyle }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setRotation({ x: 0, y: 0 }); setIsHovered(false); }}
    >
      <div
        className={className}
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) ${isHovered ? 'scale(1.02)' : 'scale(1)'}`,
          transition: 'transform 300ms ease-out',
          transformStyle: 'preserve-3d',
          position: 'relative',
          ...style,
        }}
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
            background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.08) 50%, transparent 70%)',
            borderRadius: 'inherit',
          }}
        />
      </div>
    </div>
  );
}
