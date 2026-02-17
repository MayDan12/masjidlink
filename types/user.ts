export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  role?: "user" | "imam";
  masjidId?: string; // Required when role=imam
}

export type User = {
  id: string;
  createdAt: string;
  email: string;
  followers: string[];
  name: string;
  lastUpdatedFrom: string;
  masjidName: string | null;
  masjidWebsite: string | null;
  profilePicture: string;
  denomination?: string;
  role: string;
  country?: string;
  state?: string;
  imamApproved?: boolean;
  updatedAt: string;
};

export interface UserDocument {
  uid: string;
  email: string;
  name: string;
  role: "user" | "imam" | "admin";
  donorRank?: string;
  followingMasjids: string[];
  masjidId?: string; // For imams
  imamApproved?: boolean;
  createdAt: string;
  updatedAt: string;
}
