import { getMosque, getPrayerTimes } from '@/lib/mihrab-api';
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
    const time = pt.time.slice(0, 5); // "HH:MM:SS" → "HH:MM"
    if (pt.type === 'azan')   t[key].azaan  = time;
    if (pt.type === 'ikamah') t[key].iqamah = time;
  }
  return t;
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const numId = Number(id);
    const [mosque, prayerTimes] = await Promise.all([
      getMosque(numId),
      getPrayerTimes(numId),
    ]);
    const lastUpdated = prayerTimes.length
      ? new Date(Math.max(...prayerTimes.map(p => p.updated_at)) * 1000).toISOString()
      : new Date().toISOString();

    return Response.json({
      _id:         String(mosque.id),
      name:        mosque.name,
      address:     mosque.address || mosque.location_name || '',
      timings:     buildTimings(prayerTimes),
      lastUpdated,
    });
  } catch (err) {
    console.error('[masjids/id GET]', err);
    return Response.json({ error: 'Mosque not found' }, { status: 404 });
  }
}
