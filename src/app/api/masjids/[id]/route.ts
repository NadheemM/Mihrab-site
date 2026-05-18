import { getInstitution, getMosque } from '@/lib/mihrab-api';
import type { MihrabPrayerTime } from '@/types/mihrab';

const BASE = process.env.MIHRAB_API_BASE ?? 'https://app.mihrab.in';

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
    if (!key) continue;
    const raw = pt.time;
    if (!raw) continue;
    const time = raw.slice(0, 5);
    if (pt.type === 'azan')   t[key].azaan  = time;
    if (pt.type === 'ikamah') t[key].iqamah = time;
  }
  return t;
}

async function fetchPrayerTimesRaw(id: number) {
  const headers = { 'API-KEY': process.env.MIHRAB_API_KEY! };
  const debug: Record<string, unknown> = {};

  for (const param of ['institution', 'mosque']) {
    const url = `${BASE}/api/prayer-times/?${param}=${id}&limit=100`;
    try {
      const res = await fetch(url, { headers, next: { revalidate: 0 } });
      const text = await res.text();
      let data: unknown;
      try { data = JSON.parse(text); } catch { data = text; }
      debug[param] = { status: res.status, body: data };
      if (res.ok) {
        const rows: MihrabPrayerTime[] = Array.isArray(data)
          ? (data as MihrabPrayerTime[])
          : ((data as { results?: MihrabPrayerTime[] })?.results ?? []);
        if (rows.length > 0) return { rows, debug };
      }
    } catch (e) {
      debug[param] = { error: String(e) };
    }
  }
  return { rows: [] as MihrabPrayerTime[], debug };
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const numId = Number(id);

    const [entity, { rows: prayerTimes, debug }] = await Promise.all([
      getInstitution(numId).catch(() => getMosque(numId)),
      fetchPrayerTimesRaw(numId),
    ]);

    console.log(`[masjids/${id}] prayer-times debug:`, JSON.stringify(debug, null, 2));

    const lastUpdated = prayerTimes.length
      ? new Date(Math.max(...prayerTimes.map(p => p.updated_at)) * 1000).toISOString()
      : new Date().toISOString();

    return Response.json({
      _id:         String(entity.id),
      name:        entity.name,
      address:     entity.address || entity.location_name || '',
      timings:     buildTimings(prayerTimes),
      lastUpdated,
      _debug:      debug,
    });
  } catch (err) {
    console.error('[masjids/id GET]', err);
    return Response.json({ error: 'Mosque not found' }, { status: 404 });
  }
}
