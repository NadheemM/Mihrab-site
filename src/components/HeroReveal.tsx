'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from '@/app/page.module.css';

const LINE_1 = ['Every', 'Prayer.'];
const LINE_2 = ['Every', 'Masjid.'];

export default function HeroReveal() {
  const h1Ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const h1 = h1Ref.current;
    if (!h1) return;

    const words = h1.querySelectorAll<HTMLSpanElement>('.hero-word');
    const ctx = gsap.context(() => {
      gsap.from(words, {
        opacity: 0,
        y: 44,
        duration: 0.9,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: h1,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <h1 ref={h1Ref} className={styles.heroHeading}>
      <span className={styles.heroHeadingItalic}>
        {LINE_1.map((word, i) => (
          <span
            key={word}
            className="hero-word"
            style={{ display: 'inline-block', marginRight: i < LINE_1.length - 1 ? '0.28em' : 0 }}
          >
            {word}
          </span>
        ))}
      </span>
      <span className={styles.heroHeadingRoman}>
        {LINE_2.map((word, i) => (
          <span
            key={word}
            className="hero-word"
            style={{ display: 'inline-block', marginRight: i < LINE_2.length - 1 ? '0.28em' : 0 }}
          >
            {word}
          </span>
        ))}
      </span>
    </h1>
  );
}
