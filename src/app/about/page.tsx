import ScrollReveal from '@/components/ScrollReveal';
import styles from './page.module.css';

export default function AboutPage() {
  return (
    <div className={styles.page}>

      {/* Dark hero band */}
      <section className={styles.hero} aria-labelledby="about-title">
        <ScrollReveal variant="blur">
          <div className={styles.heroContent}>
            <span className="text-gold-label">Our Story</span>
            <h1 id="about-title" className={styles.heroTitle}>About Mihrab</h1>
          </div>
        </ScrollReveal>
      </section>

      {/* Main content */}
      <main className={styles.main}>
        <div className="container">

          {/* 2-column panel */}
          <div className={styles.panel}>
            <div className={styles.twoCol}>

              {/* Pull-quote column */}
              <ScrollReveal variant="left">
                <aside className={styles.pullQuote} aria-label="Mission statement">
                  <blockquote className={styles.pullQuoteText}>
                    "Empowering Muslims with accessible, accurate, and ad-free Islamic tools."
                  </blockquote>
                  <p className={styles.pullQuoteAttr}>— Supported by Digital Dawah Center</p>
                </aside>
              </ScrollReveal>

              {/* Body copy column */}
              <ScrollReveal variant="right" delay={100}>
                <div className={styles.body}>
                  <p>
                    Mihrab was created with a singular vision: to help Muslims deepen their connection with their faith and their local communities. Wherever the call to prayer echoes across the neighbourhood, we wanted to give that tradition a digital home.
                  </p>
                  <p>
                    In today&apos;s fast-paced world, maintaining a consistent spiritual routine can be challenging. We built Mihrab to be the ultimate, all-in-one Islamic companion that fits seamlessly into daily life.
                  </p>

                  <h2 className={styles.bodyHeading}>Our Mission</h2>
                  <p>
                    To empower Muslims with accessible, accurate, and ad-free Islamic knowledge and tools — fostering a stronger bond between the individual, the Masjid, and the Creator.
                  </p>

                  <h2 className={styles.bodyHeading}>What We Offer</h2>
                  <ul className={styles.offerList}>
                    <li>Precision prayer times and reminders tailored to your location.</li>
                    <li>A comprehensive Mosque locator to find your nearest place of worship.</li>
                    <li>The Holy Quran in readable formats with clear navigation by Surah or Juz.</li>
                    <li>Authentic Hadith collections from trusted, verified sources.</li>
                    <li>A dedicated platform for discovering Islamic businesses and services.</li>
                  </ul>
                </div>
              </ScrollReveal>
            </div>
          </div>

          {/* Stat boxes */}
          <div className={styles.stats} aria-label="Platform statistics">
            <ScrollReveal variant="scale" delay={0} style={{ height: '100%' }}>
              <div className={styles.statBox}>
                <span className={styles.statNumber}>12</span>
                <span className={styles.statLabel}>Masjids Listed</span>
              </div>
            </ScrollReveal>
            <ScrollReveal variant="scale" delay={100} style={{ height: '100%' }}>
              <div className={styles.statBox}>
                <span className={styles.statNumber}>5</span>
                <span className={styles.statLabel}>Daily Prayers</span>
              </div>
            </ScrollReveal>
            <ScrollReveal variant="scale" delay={200} style={{ height: '100%' }}>
              <div className={styles.statBox}>
                <span className={styles.statNumber}>1</span>
                <span className={styles.statLabel}>Community</span>
              </div>
            </ScrollReveal>
          </div>

        </div>
      </main>

    </div>
  );
}
