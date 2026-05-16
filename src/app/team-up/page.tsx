import Link from 'next/link';
import Image from 'next/image';
import ScrollReveal from '@/components/ScrollReveal';
import styles from './page.module.css';

export default function TeamUpPage() {
  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.grid}>

          {/* Left — text content */}
          <div className={styles.content}>
            <ScrollReveal variant="up" delay={0}>
              <span className="text-gold-label">Partnership</span>
              <h1 className={styles.heading}>
                <span className={styles.headingLight}>{"Let's"}</span>
                <br />
                <span className={styles.headingAccent}>Team-Up</span>
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
                Team Up with Us
              </Link>
            </ScrollReveal>
          </div>

          {/* Right — illustration */}
          <ScrollReveal variant="scale" delay={150} className={styles.illustrationWrap}>
            <Image
              src="/team-up.jpg"
              alt="Two people fitting puzzle pieces together — representing partnership and collaboration"
              width={520}
              height={400}
              className={styles.illustration}
              priority
            />
          </ScrollReveal>

        </div>
      </div>
    </div>
  );
}
