'use client';
import { useMemo } from 'react';
import styles from './DailyVerse.module.css';

const VERSES = [
  {
    arabic: 'وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا',
    translation: 'And whoever fears Allah — He will make for him a way out.',
    ref: 'Surah At-Talaq · 65:2',
  },
  {
    arabic: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا',
    translation: 'Indeed, with hardship will be ease.',
    ref: 'Surah Ash-Sharh · 94:6',
  },
  {
    arabic: 'وَعَسَىٰ أَن تَكْرَهُوا شَيْئًا وَهُوَ خَيْرٌ لَّكُمْ',
    translation: 'And it may be that you dislike a thing which is good for you.',
    ref: 'Surah Al-Baqarah · 2:216',
  },
  {
    arabic: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا',
    translation: 'For indeed, with hardship will be ease.',
    ref: 'Surah Ash-Sharh · 94:5',
  },
  {
    arabic: 'وَهُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ',
    translation: 'And He is with you wherever you are.',
    ref: 'Surah Al-Hadid · 57:4',
  },
  {
    arabic: 'إِنَّ اللَّهَ مَعَ الصَّابِرِينَ',
    translation: 'Indeed, Allah is with the patient.',
    ref: 'Surah Al-Baqarah · 2:153',
  },
  {
    arabic: 'وَلَا تَيْأَسُوا مِن رَّوْحِ اللَّهِ',
    translation: 'And do not despair of relief from Allah.',
    ref: 'Surah Yusuf · 12:87',
  },
  {
    arabic: 'إِنَّ اللَّهَ لَا يُضِيعُ أَجْرَ الْمُحْسِنِينَ',
    translation: 'Indeed, Allah does not allow to be lost the reward of those who do good.',
    ref: 'Surah At-Tawbah · 9:120',
  },
  {
    arabic: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
    translation: 'Sufficient for us is Allah, and He is the best Disposer of affairs.',
    ref: 'Surah Al-Imran · 3:173',
  },
  {
    arabic: 'وَتَوَكَّلْ عَلَى اللَّهِ ۚ وَكَفَىٰ بِاللَّهِ وَكِيلًا',
    translation: 'And rely upon Allah; and sufficient is Allah as Disposer of affairs.',
    ref: 'Surah Al-Ahzab · 33:3',
  },
  {
    arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً',
    translation: 'Our Lord, give us good in this world and good in the Hereafter.',
    ref: 'Surah Al-Baqarah · 2:201',
  },
  {
    arabic: 'إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ',
    translation: 'Indeed, actions are by intentions.',
    ref: 'Hadith · Bukhari & Muslim',
  },
];

function getDayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  return Math.floor(diff / 86400000);
}

export default function DailyVerse() {
  const verse = useMemo(() => {
    const idx = getDayOfYear() % VERSES.length;
    return VERSES[idx];
  }, []);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.label}>Daily Verse</span>
        <span className={styles.datePill}>
          {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
        </span>
      </div>

      <p className={styles.arabic} lang="ar" dir="rtl">
        {verse.arabic}
      </p>

      <p className={styles.translation}>
        &ldquo;{verse.translation}&rdquo;
      </p>

      <p className={styles.ref}>{verse.ref}</p>
    </div>
  );
}
