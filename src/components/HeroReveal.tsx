'use client';
import { motion, useReducedMotion } from 'framer-motion';
import styles from '@/app/page.module.css';

const LINE_1 = ['Every', 'Prayer.'];
const LINE_2 = ['Every', 'Masjid.'];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.13, delayChildren: 0.25 },
  },
};

const wordVariants = {
  hidden: { opacity: 0, y: 52 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.0, ease: [0.16, 1, 0.3, 1] },
  },
};

const wordVariantsReduced = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};

export default function HeroReveal() {
  const shouldReduce = useReducedMotion();
  const wv = shouldReduce ? wordVariantsReduced : wordVariants;

  return (
    <motion.h1
      className={styles.heroHeading}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
    >
      <span className={styles.heroHeadingItalic}>
        {LINE_1.map((word, i) => (
          <motion.span
            key={word}
            variants={wv}
            style={{
              display: 'inline-block',
              marginRight: i < LINE_1.length - 1 ? '0.28em' : 0,
            }}
          >
            {word}
          </motion.span>
        ))}
      </span>
      <span className={styles.heroHeadingRoman}>
        {LINE_2.map((word, i) => (
          <motion.span
            key={word}
            variants={wv}
            style={{
              display: 'inline-block',
              marginRight: i < LINE_2.length - 1 ? '0.28em' : 0,
            }}
          >
            {word}
          </motion.span>
        ))}
      </span>
    </motion.h1>
  );
}
