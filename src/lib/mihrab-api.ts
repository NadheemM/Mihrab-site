import type { MihrabMosque, MihrabPrayerTime, MihrabPaginatedResponse } from '@/types/mihrab';

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

export function getMosque(id: number) {
  return apiFetch<MihrabMosque>(`/api/mosques/${id}/`);
}

export function getPrayerTimes(mosqueId: number) {
  return apiFetch<MihrabPrayerTime[]>(`/api/prayer-times/?mosque=${mosqueId}`);
}
