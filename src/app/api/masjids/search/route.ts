import { searchInstitutions } from '@/lib/mihrab-api';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') ?? '';
  if (!q.trim()) return Response.json([]);

  try {
    const data = await searchInstitutions(q, 20);
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
