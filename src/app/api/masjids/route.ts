import { getMosques } from '@/lib/mihrab-api';

export async function GET() {
  try {
    const data = await getMosques();
    const mapped = data.results.map(m => ({
      _id:     String(m.id),
      name:    m.name,
      address: m.address || m.location_name || '',
      lat:     parseFloat(m.latitude) || 0,
      lng:     parseFloat(m.longitude) || 0,
    }));
    return Response.json(mapped);
  } catch (err) {
    console.error('[masjids GET]', err);
    return Response.json({ error: 'Failed to fetch mosques' }, { status: 502 });
  }
}
