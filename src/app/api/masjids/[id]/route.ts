import { getPrayerTimesForInstitution } from '@/lib/mihrab-api';
import type { MihrabPrayerTime } from '@/types/mihrab';

const PRAYER_MAP: Record<string, string> = {
  fazar:  'fajr',
  zuhar:  'zuhar',
  asr:    'asar',
  magrib: 'maghrib',
  esha:   'isha',
  jumma:  'jummah',
};

function buildTimings(records: MihrabPrayerTime[]) {
  const t: Record<string, { azaan: string; iqamah: string }> = {
    fajr:    { azaan: '', iqamah: '' },
    zuhar:   { azaan: '', iqamah: '' },
    asar:    { azaan: '', iqamah: '' },
    maghrib: { azaan: '', iqamah: '' },
    isha:    { azaan: '', iqamah: '' },
    jummah:  { azaan: '', iqamah: '' },
  };
  for (const pt of records) {
    const key = PRAYER_MAP[pt.prayer];
    if (!key || !pt.time) continue;
    const time = pt.time.slice(0, 5);
    if (pt.type === 'azan')   t[key].azaan  = time;
    if (pt.type === 'ikamah') t[key].iqamah = time;
  }
  return t;
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numId = Number(id);

  const prayerTimes = await getPrayerTimesForInstitution(numId);

  console.log(`[masjids/${id}] prayer-times count: ${prayerTimes.length}`);

  const lastUpdated = prayerTimes.length
    ? new Date(Math.max(...prayerTimes.map(p => p.updated_at)) * 1000).toISOString()
    : new Date().toISOString();

  // Always return 200 — name/address come from the list page via URL params
  return Response.json({
    timings:     buildTimings(prayerTimes),
    lastUpdated,
    hasTimes:    prayerTimes.length > 0,
  });
}
