export type Masjid = {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  rating: number;
  facilityTypes: string[];
  isFavorite: boolean;
  image?: string;
  description?: string;
  capacity?: string;
  email?: string;
};
