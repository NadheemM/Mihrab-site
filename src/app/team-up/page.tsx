import Link from 'next/link';
import Image from 'next/image';
import ScrollReveal from '@/components/ScrollReveal';
import styles from './page.module.css';

const PARTNERS = [
  {
    id: 'gtaf',
    name: 'GTAF',
    description: 'Global Taaleem & Awqaf Foundation — supporting Islamic education and community welfare worldwide.',
    href: 'https://gtaf.org/',
    logo: '/gtaf-logo.svg',
    initial: 'G',
  },
  {
    id: 'meritlife',
    name: 'MeritLife Technologies',
    description: 'Building purpose-driven technology that empowers communities and drives meaningful social impact.',
    href: 'https://www.meritlife.tech/',
    logo: '/meritlife-logo.png',
    initial: 'M',
  },
];

export default function TeamUpPage() {
  return (
    <div className={styles.page}>
      <div className="container">

        {/* Hero grid */}
        <div className={styles.grid}>

          {/* Left — text content */}
          <div className={styles.content}>
            <ScrollReveal variant="up" delay={0}>
              <h1 className={styles.heading}>
                <span className={styles.headingLight}>{"Let's"}</span>
                <br />
                <span className={styles.headingAccent}>Collaborate</span>
              </h1>
            </ScrollReveal>

            <ScrollReveal variant="up" delay={150}>
              <p className={styles.body}>
                At Mihrab, we are dedicated to partnering with aligned organizations to uplift and
                serve the Ummah. We champion collaboration and shared resources to maximize our
                collective impact and avoid unnecessary duplication of effort.
              </p>
            </ScrollReveal>

            <ScrollReveal variant="up" delay={300}>
              <Link href="/contact" className="btn btn-primary" style={{ display: 'inline-block' }}>
                Collaborate with Us
              </Link>
            </ScrollReveal>
          </div>

          {/* Right — illustration */}
          <ScrollReveal variant="scale" delay={150} className={styles.illustrationWrap}>
            <Image
              src="/image.png"
              alt="Two people shaking hands in front of puzzle pieces, representing collaboration"
              width={520}
              height={400}
              className={styles.illustration}
              priority
            />
          </ScrollReveal>

        </div>

        {/* Divider */}
        <ScrollReveal variant="up" delay={0}>
          <div className="divider-arabesque" aria-hidden="true" style={{ margin: '4rem 0' }}>
            <span className="divider-arabesque-icon" />
          </div>
        </ScrollReveal>

        {/* Partners section */}
        <section className={styles.partnersSection} aria-labelledby="partners-heading">

          <ScrollReveal variant="blur">
            <div className={styles.partnersHeader}>
              <span className="text-teal-label" style={{ marginBottom: '0.5rem' }}>Since 2023</span>
              <h2 id="partners-heading" className={styles.partnersTitle}>
                Our <span className={styles.headingAccent}>Partners</span>
              </h2>
              <p className={styles.partnersSubtitle}>
                Many organisations and individuals have supported our journey in various ways.
                We appreciate their contributions. May Allah reward them all.
              </p>
            </div>
          </ScrollReveal>

          <div className={styles.partnersGrid} role="list">
            {PARTNERS.map((p, i) => (
              <ScrollReveal key={p.id} variant="up" delay={i * 150}>
                <a
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.partnerCard}
                  role="listitem"
                  aria-label={`${p.name} — opens partner website`}
                >
                  {/* Logo area */}
                  <div className={styles.partnerLogo} aria-hidden="true">
                    {p.logo ? (
                      <Image
                        src={p.logo}
                        alt={`${p.name} logo`}
                        width={140}
                        height={48}
                        style={{ objectFit: 'contain', width: '100%', height: '100%' }}
                      />
                    ) : (
                      <span className={styles.partnerInitial}>{p.initial}</span>
                    )}
                  </div>

                  {/* Text */}
                  <div className={styles.partnerInfo}>
                    <h3 className={styles.partnerName}>{p.name}</h3>
                    <p className={styles.partnerDesc}>{p.description}</p>
                  </div>

                  {/* Arrow */}
                  <div className={styles.partnerArrow} aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"/>
                      <polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </div>
                </a>
              </ScrollReveal>
            ))}
          </div>

        </section>

      </div>
    </div>
  );
}
