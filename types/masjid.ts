export type PrayerTime = {
  name: "Fajr" | "Dhuhr" | "Asr" | "Maghrib" | "Isha" | "Jummah" | "Sunrise";
  time: string; // "05:10"
};
export type Masjid = {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  rating: number;
  country: string;
  denomination: string;
  followersCount: number;
  facilityTypes: string[];
  isFavorite: boolean;
  image?: string;
  description?: string;
  capacity?: string;
  email?: string;
  prayerTimes?: PrayerTime[];
  masjidProfileImage?: string;
};
