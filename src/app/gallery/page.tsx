'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';

const images = [
  '/1.jpeg', '/2.jpeg', '/3.jpeg', '/4.jpeg',
  '/5.jpeg', '/6.jpeg', '/7.jpeg',
];

export default function GalleryPage() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.page}>
      <div className="container">

        {/* Header */}
        <header className={styles.header}>
          <span className="text-gold-label">Community Moments</span>
          <h1 className={styles.title}>Gallery</h1>
        </header>

        {/* Phone mockup */}
        <div className={styles.phoneStage} aria-label="App screenshot slideshow">
          {/* Floating gold accent dots */}
          <span className={styles.dot + ' ' + styles.dot1} aria-hidden="true" />
          <span className={styles.dot + ' ' + styles.dot2} aria-hidden="true" />
          <span className={styles.dot + ' ' + styles.dot3} aria-hidden="true" />
          <span className={styles.dot + ' ' + styles.dot4} aria-hidden="true" />

          <div>
            <div className={styles.phoneOuter}>
              <div className={styles.phoneInner} role="img" aria-label={`App screenshot ${currentIndex + 1} of ${images.length}`}>
                {images.map((src, index) => (
                  <div
                    key={src}
                    className={`${styles.slide} ${index === currentIndex ? styles.slideVisible : styles.slideHidden}`}
                  >
                    <Image
                      src={src}
                      alt={`Mihrab app screenshot ${index + 1}`}
                      fill
                      sizes="280px"
                      style={{ objectFit: 'cover' }}
                      priority={index === 0}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Slide indicator dots */}
            <div className={styles.dotsRow} role="tablist" aria-label="Screenshot navigation">
              {images.map((_, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={i === currentIndex}
                  aria-label={`Screenshot ${i + 1}`}
                  onClick={() => setCurrentIndex(i)}
                  className={`${styles.indicatorDot} ${i === currentIndex ? styles.indicatorActive : styles.indicatorInactive}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Video section */}
        <section className={styles.videoSection} aria-labelledby="video-title">
          <div className={styles.videoHeader}>
            <span className="text-gold-label">Watch & Explore</span>
            <h2 id="video-title" className={styles.videoTitle}>See it in Action</h2>
          </div>
          <div className={styles.videoWrap}>
            <iframe
              src="https://www.youtube.com/embed/3wkIk6Q4Hl0"
              title="Mihrab App — full walkthrough video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </section>

        {/* CTA */}
        <div className={styles.cta}>
          <p className={styles.ctaText}>Experience it yourself. Download the app today.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="https://play.google.com/store/apps/details?id=in.mihrab.app&hl=en_IN"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-gold"
            >
              Google Play
            </Link>
            <Link
              href="https://apps.apple.com/in/app/mihrab/id6630381320"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-gold"
            >
              App Store
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
