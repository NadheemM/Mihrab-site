'use client';
import { useState, useEffect } from 'react';
import styles from '@/app/page.module.css';

const PRAYERS = [
  { name: 'Fajr',    h: 5,  m: 15 },
  { name: 'Dhuhr',   h: 12, m: 30 },
  { name: 'Asr',     h: 15, m: 45 },
  { name: 'Maghrib', h: 18, m: 20 },
  { name: 'Isha',    h: 20, m: 0  },
];

function getNext() {
  const now = new Date();
  const nowSecs = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

  for (let i = 0; i < PRAYERS.length; i++) {
    const p = PRAYERS[i];
    const pSecs = p.h * 3600 + p.m * 60;
    if (pSecs > nowSecs) {
      const diff = pSecs - nowSecs;
      // Interval starts from previous prayer (or midnight for Fajr)
      const prevSecs = i === 0 ? 0 : PRAYERS[i - 1].h * 3600 + PRAYERS[i - 1].m * 60;
      const intervalTotal = pSecs - prevSecs;
      const elapsed = nowSecs - prevSecs;
      // Bar fills as time passes — more filled = less time remaining
      const progress = Math.round((elapsed / intervalTotal) * 100);
      const timeStr = `${p.h % 12 || 12}:${String(p.m).padStart(2, '0')} ${p.h >= 12 ? 'PM' : 'AM'}`;
      const hLeft = Math.floor(diff / 3600);
      const mLeft = Math.floor((diff % 3600) / 60);
      return { name: p.name, timeStr, hLeft, mLeft, progress: Math.max(2, Math.min(progress, 98)) };
    }
  }
  // Past Isha — interval is Isha→midnight→Fajr
  const fajr = PRAYERS[0];
  const isha = PRAYERS[PRAYERS.length - 1];
  const ishaSecs = isha.h * 3600 + isha.m * 60;
  const fajrSecs = fajr.h * 3600 + fajr.m * 60;
  const diff = (86400 - nowSecs) + fajrSecs;
  const intervalTotal = (86400 - ishaSecs) + fajrSecs;
  const elapsed = nowSecs - ishaSecs;
  const progress = Math.round((elapsed / intervalTotal) * 100);
  const timeStr = `${fajr.h}:${String(fajr.m).padStart(2, '0')} AM`;
  const hLeft = Math.floor(diff / 3600);
  const mLeft = Math.floor((diff % 3600) / 60);
  return { name: fajr.name, timeStr, hLeft, mLeft, progress: Math.max(2, Math.min(progress, 98)) };
}

export default function NextPrayerCard() {
  const [data, setData] = useState<ReturnType<typeof getNext> | null>(null);

  useEffect(() => {
    setData(getNext());
    const id = setInterval(() => setData(getNext()), 60_000);
    return () => clearInterval(id);
  }, []);

  if (!data) return null;

  const { name, timeStr, hLeft, mLeft, progress } = data;
  const label = hLeft > 0 ? `in ${hLeft}h ${mLeft}m` : `in ${mLeft}m`;

  return (
    <div className={styles.visualCard} style={{ top: '2%', left: '4%', right: '4%', zIndex: 3 }}>
      <div className={styles.visualCardLabel}>Next Prayer</div>
      <div className={styles.visualCardPrayer}>
        <div className={styles.visualPrayerDot} />
        <span className={styles.visualPrayerName}>{name}</span>
        <span className={styles.visualPrayerTime}>{timeStr}</span>
      </div>
      <div className={styles.visualPrayerBar}>
        <div className={styles.visualPrayerBarFill} style={{ width: `${progress}%` }} />
      </div>
      <div className={styles.visualCardSub}>{label}</div>
    </div>
  );
}
