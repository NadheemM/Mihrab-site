'use client';
import { useEffect, useRef, ReactNode, CSSProperties } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  delay?: number;
  variant?: 'up' | 'left' | 'right' | 'scale' | 'fade' | 'blur' | 'rotate' | 'clip';
  threshold?: number;
}

export default function ScrollReveal({
  children,
  className = '',
  style,
  delay = 0,
  variant = 'up',
  threshold = 0.12,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.transitionDelay = delay > 0 ? `${delay}ms` : '';
          el.classList.add('sr-visible');
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, threshold]);

  const variantClass =
    variant === 'left'   ? 'sr-left'   :
    variant === 'right'  ? 'sr-right'  :
    variant === 'scale'  ? 'sr-scale'  :
    variant === 'fade'   ? 'sr-fade'   :
    variant === 'blur'   ? 'sr-blur'   :
    variant === 'rotate' ? 'sr-rotate' :
    variant === 'clip'   ? 'sr-clip'   : 'sr-up';

  return (
    <div ref={ref} className={`${variantClass} ${className}`} style={style}>
      {children}
    </div>
  );
}
