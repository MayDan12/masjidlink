export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  role?: "user" | "imam";
  masjidId?: string; // Required when role=imam
}

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
