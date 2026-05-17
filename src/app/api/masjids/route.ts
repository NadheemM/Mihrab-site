import { getNearbyInstitutions } from '@/lib/mihrab-api';

export async function GET() {
  try {
    // Broad query centered on Dhaka — returns 100 masjids sorted by proximity
    const data = await getNearbyInstitutions(23.8, 90.4, 20_000_000, 100);
    const mapped = data.results.map(m => ({
      _id:     String(m.id),
      name:    m.name,
      address: m.address || m.location_name || '',
      lat:     m.latitude,
      lng:     m.longitude,
    }));
    return Response.json(mapped);
  } catch {
    return Response.json([]);
  }
}
