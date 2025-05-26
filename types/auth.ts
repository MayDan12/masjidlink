export type UserRole = "user" | "imam";

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  masjidName?: string;
  masjidAddress?: string;
  masjidWebsite?: string;
  termsAccepted: boolean;
}

export interface UserDocument {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  donorRank: string;
  followingMasjids: string[];
  masjidId?: string;
  imamApproved?: boolean;
  termsAccepted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MasjidDocument {
  masjidId: string;
  name: string;
  address: string;
  imamId?: string;
  imamName?: string;
  imamApproved?: boolean;
  createdAt: string;
  updatedAt: string;
}
