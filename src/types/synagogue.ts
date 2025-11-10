export interface Synagogue {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string | null;
  country: string;
  postalCode: string | null;
  latitude: number;
  longitude: number;
  nusach: string;
  rabbi: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  description: string | null;
  wheelchairAccess: boolean;
  parking: boolean;
  airConditioning: boolean;
  womensSection: boolean;
  mikveh: boolean;
  averageRating: number;
  totalReviews: number;
  photos: SynagoguePhoto[];
  prayerSchedule: PrayerSchedule[];
  reviews: Review[];
  minyanReports: MinyanReport[];
}

export interface SynagoguePhoto {
  id: string;
  url: string;
  caption: string | null;
  isPrimary: boolean;
}

export interface PrayerSchedule {
  dayOfWeek: number;
  prayerType: string;
  time: string;
}

export interface Review {
  id: string;
  userId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
}

export interface MinyanReport {
  id: string;
  userId: string;
  prayerType: string;
  status: string;
  reportTime: string;
  notes: string | null;
  user?: {
    name?: string;
  };
}

