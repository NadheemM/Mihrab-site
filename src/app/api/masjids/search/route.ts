import { searchInstitutions, searchInstitutionsNearby } from '@/lib/mihrab-api';
import type { MihrabInstitution } from '@/types/mihrab';

function mapResults(results: MihrabInstitution[]) {
  return results.map(m => ({
    _id:     String(m.id),
    name:    m.name,
    address: m.address || m.location_name || '',
    lat:     m.latitude,
    lng:     m.longitude,
  }));
}

function extractResults(data: unknown): MihrabInstitution[] {
  if (Array.isArray(data)) return data as MihrabInstitution[];
  const d = data as { results?: MihrabInstitution[] };
  return Array.isArray(d?.results) ? d.results : [];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') ?? '';
  if (!q.trim()) return Response.json([]);

  // Try dedicated search endpoint first; fall back to proximity search
  try {
    const data = await searchInstitutions(q);
    const results = extractResults(data);
    if (results.length > 0) return Response.json(mapResults(results));
  } catch { /* fall through */ }

  try {
    const data = await searchInstitutionsNearby(q);
    return Response.json(mapResults(extractResults(data)));
  } catch {
    return Response.json([]);
  }
}
