'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Clock, MapPin, BookOpen, Compass, Radio, Building2 } from 'lucide-react';
import SkySceneClient from '@/components/SkySceneClient';
import styles from './page.module.css';
import AnimatedCounter from '@/components/AnimatedCounter';
import ScrollReveal from '@/components/ScrollReveal';
import GlowCard from '@/components/GlowCard';
import MotionLift from '@/components/MotionLift';
import HeroReveal from '@/components/HeroReveal';
import ScreenshotCarousel from '@/components/ScreenshotCarousel';
import TestimonialsSection from '@/components/TestimonialsSection';

const EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

const staggerParent: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.05 } },
};

const revealCard: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: EASE } },
};

const revealUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};


export default function Home() {
  const [appStats, setAppStats] = useState({ masjids: '74170+', rating: '4.8', downloads: '50K+', reviews: '2K+' });

  useEffect(() => {
    fetch('/api/app-stats')
      .then(r => r.json())
      .then(d => { if (d.rating) setAppStats(d); })
      .catch(() => {});
  }, []);

  return (
    <div className={styles.home}>

      {/* ── Sky Scene (viewport 1 — pure 3D, no text) ── */}
      <section className={styles.skySection} aria-label="Sky scene">

        {/* Layer 0 — 3D Sky Canvas */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <SkySceneClient />
        </div>

        {/* Layer 1 — SVG noise grain (cover, no repeat — prevents tile seams) */}
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0, zIndex: 1,
          opacity: 0.18, mixBlendMode: 'overlay', pointerEvents: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }} />

        {/* Layer 2 — bottom gradient fade into hero section */}
        <div aria-hidden="true" style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: '45vh', zIndex: 2, pointerEvents: 'none',
          background: 'linear-gradient(to bottom, transparent 0%, rgba(15,26,48,0.5) 55%, #0F1A30 100%)',
        }} />

        {/* Layer 3 — scroll pulse indicator */}
        <div className={styles.scrollHint} aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

      </section>

      {/* ── Hero content (viewport 2 — heading, CTAs, stats on dark bg) ── */}
      <section className={styles.heroSection} aria-label="Hero">
        <div className={`container ${styles.heroContainer}`}>
          <div className={styles.heroContent}>

            <div className={styles.heroDivider} aria-hidden="true">
              <span className={styles.heroDividerDot} />
            </div>

            <HeroReveal />

            <ScrollReveal variant="up" delay={150}>
              <p className={styles.heroSub}>
                Mihrab connects Muslims with accurate prayer times, every local masjid, and the pulse of the community — all in one place.
              </p>
            </ScrollReveal>

            <ScrollReveal variant="up" delay={300}>
              <div className={styles.ctaGroup}>
                <Link
                  href="https://play.google.com/store/apps/details?id=in.mihrab.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  Google Play
                </Link>
                <Link
                  href="https://apps.apple.com/app/mihrab/id6630381320"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  App Store
                </Link>
                <Link href="/features" className="btn btn-secondary">
                  Explore Features
                </Link>
              </div>
            </ScrollReveal>

            <ScrollReveal variant="up" delay={600}>
            <div className={styles.statsStrip} aria-label="Platform statistics">
              <div className={styles.statItem}>
                <span className={styles.statNumber}>{appStats.masjids}</span>
                <span className={styles.statLabel}>Masjids</span>
              </div>
              <span className={styles.statSep} aria-hidden="true" />
              <div className={styles.statItem}>
                <span className={styles.statNumber}>{appStats.downloads}</span>
                <span className={styles.statLabel}>Downloads</span>
              </div>
              <span className={styles.statSep} aria-hidden="true" />
              <div className={styles.statItem}>
                <span className={styles.statNumber}>{appStats.rating}★</span>
                <span className={styles.statLabel}>Rating</span>
              </div>
            </div>
            </ScrollReveal>

          </div>
        </div>
      </section>

      {/* ── Bento Features ── */}
      <section className={styles.bentoSection} aria-labelledby="features-heading">
        <div className="container">

          <ScrollReveal className={styles.bentoHeader}>
            <span className="text-teal-label">Why Mihrab</span>
            <h2 id="features-heading" className={styles.bentoTitle}>
              Essential tools for every Muslim
            </h2>
            <div className="divider-arabesque" aria-hidden="true" style={{ maxWidth: 320, marginLeft: 0 }}>
              <span className="divider-arabesque-icon" />
            </div>
          </ScrollReveal>

          <div className="bento" role="list">

            {/* 01 — Prayer Times */}
            <ScrollReveal delay={0} variant="scale" style={{ height: '100%' }}>
              <MotionLift>
                <GlowCard className={`${styles.bentoCard} ${styles.accentTeal}`} style={{ position: 'relative', overflow: 'hidden' }}>
                  <span className={styles.cardNum}>01</span>
                  <div className={styles.bentoIconWrap} style={{ background: 'rgba(65,194,220,0.12)', color: 'var(--brand-teal-dark)' }}>
                    <Clock size={24} aria-hidden="true" />
                  </div>
                  <h3 className={styles.bentoCardTitle}>Prayer Times &amp; Reminders</h3>
                  <p className={styles.bentoCardText}>Exact Azaan and Iqamah schedules for every local masjid, updated in real-time. Set custom notifications so you never miss a Salah.</p>
                </GlowCard>
              </MotionLift>
            </ScrollReveal>

            {/* 02 — Mosque Locator */}
            <ScrollReveal delay={150} variant="scale" style={{ height: '100%' }}>
              <MotionLift>
                <GlowCard className={`${styles.bentoCard} ${styles.accentGold}`} style={{ position: 'relative', overflow: 'hidden' }}>
                  <span className={styles.cardNum}>02</span>
                  <div className={styles.bentoIconWrap} style={{ background: 'rgba(201,146,42,0.12)', color: 'var(--brand-gold)' }}>
                    <MapPin size={24} aria-hidden="true" />
                  </div>
                  <h3 className={styles.bentoCardTitle}>Mosque Locator</h3>
                  <p className={styles.bentoCardText}>Find every masjid nearby with distances and saved favourites.</p>
                </GlowCard>
              </MotionLift>
            </ScrollReveal>

            {/* 03 — Qibla */}
            <ScrollReveal delay={300} variant="scale" style={{ height: '100%' }}>
              <MotionLift>
                <GlowCard className={`${styles.bentoCard} ${styles.accentFajr}`} style={{ position: 'relative', overflow: 'hidden' }}>
                  <span className={styles.cardNum}>03</span>
                  <div className={styles.bentoIconWrap} style={{ background: 'rgba(107,140,174,0.15)', color: 'var(--fajr-color)' }}>
                    <Compass size={24} aria-hidden="true" />
                  </div>
                  <h3 className={styles.bentoCardTitle}>Qibla Direction</h3>
                  <p className={styles.bentoCardText}>Precise Qibla from anywhere, using your device compass.</p>
                </GlowCard>
              </MotionLift>
            </ScrollReveal>

            {/* 04 — Quran */}
            <ScrollReveal delay={150} variant="up" style={{ height: '100%' }}>
              <MotionLift>
                <GlowCard className={`${styles.bentoCard} ${styles.accentAsr}`} style={{ position: 'relative', overflow: 'hidden' }}>
                  <span className={styles.cardNum}>04</span>
                  <div className={styles.bentoIconWrap} style={{ background: 'rgba(224,123,57,0.12)', color: 'var(--asr-color)' }}>
                    <BookOpen size={24} aria-hidden="true" />
                  </div>
                  <h3 className={styles.bentoCardTitle}>Quran &amp; Authentic Hadith</h3>
                  <p className={styles.bentoCardText}>Read the Holy Quran by Surah or Juz. Authentic Hadith from trusted sources to enrich your knowledge daily.</p>
                </GlowCard>
              </MotionLift>
            </ScrollReveal>

            {/* 05 — Radio */}
            <ScrollReveal delay={300} variant="up" style={{ height: '100%' }}>
              <MotionLift>
                <GlowCard className={`${styles.bentoCard} ${styles.accentIsha}`} style={{ position: 'relative', overflow: 'hidden' }}>
                  <span className={styles.cardNum}>05</span>
                  <div className={styles.bentoIconWrap} style={{ background: 'rgba(74,72,128,0.12)', color: 'var(--isha-color)' }}>
                    <Radio size={24} aria-hidden="true" />
                  </div>
                  <h3 className={styles.bentoCardTitle}>Mihrab FM &amp; Duas</h3>
                  <p className={styles.bentoCardText}>Live Islamic broadcast, Duas and 99 Names of Allah.</p>
                </GlowCard>
              </MotionLift>
            </ScrollReveal>

            {/* 06 — Business */}
            <ScrollReveal delay={450} variant="up" style={{ height: '100%' }}>
              <MotionLift>
                <GlowCard className={`${styles.bentoCard} ${styles.accentTeal}`} style={{ position: 'relative', overflow: 'hidden' }}>
                  <span className={styles.cardNum}>06</span>
                  <div className={styles.bentoIconWrap} style={{ background: 'rgba(65,194,220,0.1)', color: 'var(--brand-teal-dark)' }}>
                    <Building2 size={24} aria-hidden="true" />
                  </div>
                  <h3 className={styles.bentoCardTitle}>Business Listings</h3>
                  <p className={styles.bentoCardText}>Halal businesses and Islamic services, right from the app.</p>
                </GlowCard>
              </MotionLift>
            </ScrollReveal>

          </div>
        </div>
      </section>

      {/* ── App Screenshots Carousel ── */}
      <section className={styles.carouselSection} aria-labelledby="screenshots-heading">
        <div className={styles.carouselInner}>
          <ScrollReveal variant="fade">
            <div className={styles.carouselHeader}>
              <span className="text-teal-label">Inside the App</span>
              <h2 id="screenshots-heading" className={styles.sectionTitle}>
                See Mihrab in action
              </h2>
              <p className={styles.carouselSub}>
                Prayer times, Quran, Qibla, Mosque maps and Islamic radio — all in one beautiful app.
              </p>
            </div>
          </ScrollReveal>
          <ScreenshotCarousel />
        </div>
      </section>

      {/* ── Testimonials ── */}
      <TestimonialsSection />

      {/* ── Stats band ── */}
      <section className={styles.statsBand} aria-label="Platform statistics">
        <div className="container">
          <motion.div
            className={styles.statsBandInner}
            variants={staggerParent}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div className="stat-box" variants={revealCard}>
              <span className="stat-box__number">{appStats.masjids}</span>
              <span className="stat-box__label">Masjids Listed</span>
            </motion.div>
            <span className="stat-divider" aria-hidden="true" />
            <motion.div className="stat-box" variants={revealCard}>
              <span className="stat-box__number">{appStats.downloads}</span>
              <span className="stat-box__label">Downloads</span>
            </motion.div>
            <span className="stat-divider" aria-hidden="true" />
            <motion.div className="stat-box" variants={revealCard}>
              <span className="stat-box__number">{appStats.rating}★</span>
              <span className="stat-box__label">Play Store Rating</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={styles.ctaSection} aria-label="Download call to action">
        <div className="container">
          <motion.div
            className={styles.ctaInner}
            variants={staggerParent}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
          >
            <motion.span className="text-teal-label" variants={revealUp}>
              Get Started
            </motion.span>
            <motion.h2 className={styles.ctaHeading} variants={revealCard}>
              Ready to transform your<br />spiritual routine?
            </motion.h2>
            <motion.p className={styles.ctaSub} variants={revealUp}>
              Join the growing community of Muslims using Mihrab every day.
            </motion.p>
            <motion.div
              variants={revealUp}
              style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}
            >
              <Link
                href="https://play.google.com/store/apps/details?id=in.mihrab.app"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ fontSize: '1rem', padding: '0.9rem 2.5rem' }}
              >
                Google Play
              </Link>
              <Link
                href="https://apps.apple.com/app/mihrab/id6630381320"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ fontSize: '1rem', padding: '0.9rem 2.5rem' }}
              >
                App Store
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
