import { getNearbyInstitutions } from '@/lib/mihrab-api';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat    = parseFloat(searchParams.get('lat')    ?? '');
  const lng    = parseFloat(searchParams.get('lng')    ?? '');
  const radius = parseInt(searchParams.get('radius')   ?? '50000');
  const limit  = parseInt(searchParams.get('limit')    ?? '20');

  if (isNaN(lat) || isNaN(lng)) {
    return Response.json({ error: 'lat and lng required' }, { status: 400 });
  }

  try {
    const data = await getNearbyInstitutions(lat, lng, radius, limit);
    const mapped = data.results.map(m => ({
      _id:     String(m.id),
      name:    m.name,
      address: m.address || m.location_name || '',
      lat:     m.latitude,
      lng:     m.longitude,
    }));
    return Response.json(mapped);
  } catch {
    return Response.json({ error: 'Failed to fetch nearby masjids' }, { status: 502 });
  }
}
