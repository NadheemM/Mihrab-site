export interface MihrabMosque {
  id: number;
  name: string;
  description?: string;
  location_name?: string;
  address?: string;
  image: string;
  bayan_languages: string;
  has_jumma_prayer: string;
  has_ablution_room: string;
  has_women_space: string;
  has_parking: string;
  quran_class_for: string;
  admin?: number;
  submitted_by?: number;
  latitude: string;
  longitude: string;
  followers: number[];
  can_give_news: boolean;
  verification_status: 'pending' | 'verified' | 'rejected';
  sourced_from?: string;
  sourced_group?: string;
}

// Returned by /api/institutions/nearby/ — lat/lng are numbers (unlike MihrabMosque)
export interface MihrabInstitution {
  id: number;
  name: string;
  description?: string | null;
  location_name?: string | null;
  address?: string | null;
  type: string;
  image?: string | null;
  latitude: number;
  longitude: number;
  verification_status: 'pending' | 'verified' | 'rejected';
  phone?: string | null;
  website?: string | null;
  sourced_from?: string;
  sourced_group?: string;
}

export interface MihrabPrayerTime {
  id: number;
  mosque: number;
  prayer: 'fazar' | 'zuhar' | 'asr' | 'magrib' | 'esha' | 'jumma';
  type: 'azan' | 'ikamah' | 'bayan';
  time?: string;
  is_available: boolean;
  can_schedule_override: boolean;
  updated_at: number;
  source: string;
}

export interface MihrabPaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
