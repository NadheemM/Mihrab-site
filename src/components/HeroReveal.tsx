'use client';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import styles from '@/app/page.module.css';

const LINE_1 = ['Every', 'Prayer.'];
const LINE_2 = ['Every', 'Masjid.'];

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const container: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.13, delayChildren: 0.2 },
  },
};

const word: Variants = {
  hidden: { opacity: 0, y: 52 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.0, ease: EASE },
  },
};

export default function HeroReveal() {
  return (
    <motion.h1
      className={styles.heroHeading}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
    >
      <span className={styles.heroHeadingItalic}>
        {LINE_1.map((w, i) => (
          <motion.span
            key={w}
            variants={word}
            style={{
              display: 'inline-block',
              marginRight: i < LINE_1.length - 1 ? '0.28em' : 0,
            }}
          >
            {w}
          </motion.span>
        ))}
      </span>
      <span className={styles.heroHeadingRoman}>
        {LINE_2.map((w, i) => (
          <motion.span
            key={w}
            variants={word}
            style={{
              display: 'inline-block',
              marginRight: i < LINE_2.length - 1 ? '0.28em' : 0,
            }}
          >
            {w}
          </motion.span>
        ))}
      </span>
    </motion.h1>
  );
}
