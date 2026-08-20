import { create } from 'zustand';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  institution: string;
  avatarUrl: string;
  badgeColor: string;
  department: string;
}

export const DEMO_USERS: UserProfile[] = [
  {
    id: 'user_scientist_1',
    name: 'Dr. A. K. Nair',
    email: 'ak.nair@cmlre.gov.in',
    role: 'Chief Marine Scientist',
    institution: 'CMLRE Cochin',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    badgeColor: 'var(--color-accent)',
    department: 'Fisheries & Ocean Ecosystems',
  },
  {
    id: 'user_edna_2',
    name: 'Dr. Priya Sundaram',
    email: 'priya.s@incois.gov.in',
    role: 'eDNA & Genomics Lead',
    institution: 'INCOIS / CMLRE',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    badgeColor: 'var(--color-info)',
    department: 'Molecular Ecology & Bioinformatics',
  },
  {
    id: 'user_jury_3',
    name: 'SIH Evaluator / Jury',
    email: 'jury@sih2026.gov.in',
    role: 'Hackathon Reviewer',
    institution: 'MoES Hackathon Evaluation',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    badgeColor: 'var(--color-warning)',
    department: 'Expert Evaluation Panel',
  },
];

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => boolean;
  quickLogin: (user: UserProfile) => void;
  logout: () => void;
}

const STORAGE_KEY = 'cmlre_auth_user';

const getInitialUser = (): UserProfile | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (err) {
    console.error('Failed to load auth user from storage', err);
  }
  return null;
};

export const useAuthStore = create<AuthState>((set) => {
  const initialUser = getInitialUser();
  return {
    user: initialUser,
    isAuthenticated: !!initialUser,

    login: (email: string) => {
      // Find matching demo user or create a generic authenticated session
      const matched = DEMO_USERS.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase()
      );

      const userToSet: UserProfile = matched || {
        id: `user_${Date.now()}`,
        name: email.split('@')[0].replace('.', ' ').toUpperCase(),
        email: email.trim(),
        role: 'Research Scientist',
        institution: 'CMLRE Marine Portal',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        badgeColor: 'var(--color-accent)',
        department: 'Oceanographic Research',
      };

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userToSet));
      } catch (e) {
        console.error(e);
      }

      set({ user: userToSet, isAuthenticated: true });
      return true;
    },

    quickLogin: (user: UserProfile) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } catch (e) {
        console.error(e);
      }
      set({ user, isAuthenticated: true });
    },

    logout: () => {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        console.error(e);
      }
      set({ user: null, isAuthenticated: false });
    },
  };
});
