import { searchInstitutions, searchInstitutionsNearby } from '@/lib/mihrab-api';

function mapResults(results: Awaited<ReturnType<typeof searchInstitutions>>['results']) {
  return results.map(m => ({
    _id:     String(m.id),
    name:    m.name,
    address: m.address || m.location_name || '',
    lat:     m.latitude,
    lng:     m.longitude,
  }));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') ?? '';
  if (!q.trim()) return Response.json([]);

  // Try database-wide search first; fall back to proximity-sorted search
  try {
    const data = await searchInstitutions(q, 30);
    return Response.json(mapResults(data.results));
  } catch {
    try {
      const data = await searchInstitutionsNearby(q, 30);
      return Response.json(mapResults(data.results));
    } catch {
      return Response.json([]);
    }
  }
}
