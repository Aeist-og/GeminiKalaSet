export type UserRole = 'artisan' | 'business' | 'customer';

export interface UserProfile {
  id: string; // references auth.users id
  fullName: string;
  phone: string;
  role: UserRole;
  languagePreference: 'en' | 'hi';
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
  email?: string;
  location?: string;
  state?: string;
  district?: string;
  craftSpecialization?: string;
  businessName?: string;
  curiosityInterests?: string[];
  bio?: string;
  giNumber?: string;
  address?: string;
}

export interface AuthSessionState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserProfile | null;
  error: string | null;
}
