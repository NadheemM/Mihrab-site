import type { MihrabMosque, MihrabInstitution, MihrabPrayerTime, MihrabPaginatedResponse } from '@/types/mihrab';

const BASE = process.env.MIHRAB_API_BASE ?? 'https://app.mihrab.in';

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'API-KEY': process.env.MIHRAB_API_KEY! },
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error(`Mihrab API ${res.status} on ${path}`);
  return res.json() as Promise<T>;
}

export function getMosques(limit = 100) {
  return apiFetch<MihrabPaginatedResponse<MihrabMosque>>(`/api/mosques/?limit=${limit}`);
}

export function getNearbyInstitutions(lat: number, lng: number, radius = 50000, limit = 20) {
  return apiFetch<MihrabPaginatedResponse<MihrabInstitution>>(
    `/api/institutions/nearby/?type=mosque&latitude=${lat}&longitude=${lng}&radius=${radius}&limit=${limit}&offset=0`,
  );
}

export function searchInstitutions(query: string, limit = 20) {
  const q = encodeURIComponent(query.trim());
  // Database-wide text search (no proximity constraint)
  return apiFetch<MihrabPaginatedResponse<MihrabInstitution>>(
    `/api/institutions/?type=mosque&limit=${limit}&search=${q}`,
  );
}

export function searchInstitutionsNearby(query: string, limit = 20) {
  const q = encodeURIComponent(query.trim());
  // Fallback: proximity-sorted search when global endpoint unavailable
  return apiFetch<MihrabPaginatedResponse<MihrabInstitution>>(
    `/api/institutions/nearby/?type=mosque&latitude=23.8&longitude=90.4&radius=20000000&limit=${limit}&search=${q}`,
  );
}

export function getMosque(id: number) {
  return apiFetch<MihrabMosque>(`/api/mosques/${id}/`);
}

export function getPrayerTimes(mosqueId: number) {
  return apiFetch<MihrabPrayerTime[]>(`/api/prayer-times/?mosque=${mosqueId}`);
}
