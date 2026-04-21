import Link from 'next/link';
import Image from 'next/image';
import { Compass, BookOpen, Clock, MapPin } from 'lucide-react';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.home}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroContainer}`}>
          <div className={styles.heroText}>
            <h1 className="animate-fade-in">Deepen Your Connection With Your Masjid</h1>
            <p className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Mihrab App is your complete Islamic companion. Get accurate prayer times, track your daily salah, read the Holy Quran, and discover nearby mosques instantly.
            </p>
            <div className={`${styles.ctaGroup} animate-fade-in`} style={{ animationDelay: '0.4s' }}>
              <Link href="https://play.google.com/store/apps/details?id=in.mihrab.app&hl=en_IN" target="_blank" rel="noopener noreferrer" className="btn-primary">
                Download App Now
              </Link>
              <Link href="/features" className={styles.btnSecondary}>
                Explore Features
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Summary */}
      <section className={styles.features}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Essential Features for Every Muslim</h2>
          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <Clock size={32} />
              </div>
              <h3>Prayer Times & Tracking</h3>
              <p>Get exact prayer times for anywhere in the world and keep a record of your daily Salah.</p>
            </div>
            
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <MapPin size={32} />
              </div>
              <h3>Mosque Locator</h3>
              <p>Discover nearby Masjids instantly and get directions along with distance.</p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <BookOpen size={32} />
              </div>
              <h3>The Holy Quran</h3>
              <p>Read the Quran with ease, browse by Surah or Juz, and pick up right where you left off.</p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <Compass size={32} />
              </div>
              <h3>Qibla Direction</h3>
              <p>Find the precise Qibla direction globally using your device's built-in compass.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className={styles.ctaSection}>
        <div className="container text-center">
          <h2>Ready to transform your spiritual routine?</h2>
          <p>Join thousands of Muslims who use Mihrab App daily.</p>
          <Link href="https://play.google.com/store/apps/details?id=in.mihrab.app&hl=en_IN" target="_blank" className="btn-primary" style={{ marginTop: '2rem' }}>
            Get Mihrab App Free
          </Link>
        </div>
      </section>
    </div>
  );
}
