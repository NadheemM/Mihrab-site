'use client';
import { Clock, MapPin, BookOpen, Compass, Radio, Building2 } from 'lucide-react';
import styles from './page.module.css';
import TiltCard from '@/components/TiltCard';

const features = [
  {
    icon: <Clock size={32} aria-hidden="true" />,
    title: "Accurate Prayer Times & Reminders",
    description: "Get precise prayer times based on your current location. Set customizable notifications so you never miss a Salah. Our offline mode ensures access even without an internet connection.",
  },
  {
    icon: <MapPin size={32} aria-hidden="true" />,
    title: "Locate Nearby Masjids",
    description: "Instantly discover mosques around you. Get accurate distances, directions, and view followed mosques directly from your dashboard.",
  },
  {
    icon: <BookOpen size={32} aria-hidden="true" />,
    title: "Readable Quran & Authentic Hadith",
    description: "Read the Holy Quran with ease. Navigate by Surah, Page, or Juz. Dive into authentic Hadith collections from trusted sources to enrich your knowledge daily.",
  },
  {
    icon: <Compass size={32} aria-hidden="true" />,
    title: "Precision Qibla Direction",
    description: "Find the exact Qibla direction from anywhere in the world using your smartphone's compass. Fast, accurate, and completely free.",
  },
  {
    icon: <Building2 size={32} aria-hidden="true" />,
    title: "Business Listings",
    description: "Discover Halal businesses, Islamic services, and Madrasas. List your own business straight from the app to reach the wider community.",
  },
  {
    icon: <Radio size={32} aria-hidden="true" />,
    title: "Mihrab FM & Duas",
    description: "Listen to continuous Islamic broadcasts on Mihrab FM. Access a wide library of Duas, Zikr, and learn the 99 Names of Allah with clear interfaces.",
  },
];

export default function FeaturesPage() {
  return (
    <div className={styles.page}>

      {/* Dark hero band */}
      <section className={styles.hero} aria-labelledby="features-title">
        <div className={styles.heroContent}>
          <span className="text-gold-label">Platform Features</span>
          <h1 id="features-title" className={styles.heroTitle}>
            Everything for your<br />spiritual journey
          </h1>
          <p className={styles.heroSub}>
            Beautifully designed tools for every Muslim — prayer times, Quran, Qibla, community, and more, all unified in one application.
          </p>
        </div>
      </section>

      {/* Card grid */}
      <section aria-label="Feature list">
        <div className="container">
          <div className={styles.grid} role="list">
            {features.map((f, i) => (
              <TiltCard
                key={f.title}
                wrapperClassName={`animate-card stagger-${Math.min(i + 1, 6)}`}
                wrapperStyle={{ display: 'flex' }}
                className={styles.card}
                style={{ width: '100%' }}
              >
                <article role="listitem">
                  <div className={styles.iconWrap} aria-hidden="true">
                    {f.icon}
                  </div>
                  <h2 className={styles.cardTitle}>{f.title}</h2>
                  <p className={styles.cardText}>{f.description}</p>
                </article>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
