'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import type { UserRole, Profile } from '@professor-academy/shared';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  phone?: string;
  city?: string;
  program?: string;
  avatarUrl?: string;
}

export interface SignupData {
  fullName: string;
  email: string;
  password?: string;
  phone?: string;
  city?: string;
  program?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  role: UserRole | null;
  isLoading: boolean;
  login: (emailOrPhone: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: SignupData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  demoLogin: (targetRole: UserRole) => void;
  updateUser: (partial: Partial<AuthUser>) => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

// Default Seed Test Accounts from PRD
export const SEED_ACCOUNTS: Record<UserRole, AuthUser> = {
  STUDENT: {
    id: '33333333-3333-3333-3333-333333333333',
    email: 'student@professoracademy.pk',
    fullName: 'Hamza Farooq',
    role: 'STUDENT',
    phone: '+92 300 1234567',
    city: 'Lahore',
    program: 'MDCAT Preparation (2026)',
  },
  TEACHER: {
    id: '11111111-1111-1111-1111-111111111111',
    email: 'teacher@professoracademy.pk',
    fullName: 'Prof. Dr. Arshad Mahmood',
    role: 'TEACHER',
    phone: '+92 321 7654321',
    city: 'Islamabad',
    program: 'Physics Department',
  },
  ADMIN: {
    id: '22222222-2222-2222-2222-222222222222',
    email: 'admin@professoracademy.pk',
    fullName: 'Executive Administrator',
    role: 'ADMIN',
    phone: '+92 333 9988776',
    city: 'Islamabad',
    program: 'Portal Governance',
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const router = useRouter();

  React.useEffect(() => {
    // Restore session from localStorage or cookie
    try {
      const stored = localStorage.getItem('professor_academy_user');
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      // Ignore parsing errors
    } finally {
      setIsLoading(false);
    }
  }, []);

  const persistUser = (authUser: AuthUser | null) => {
    setUser(authUser);
    if (authUser) {
      localStorage.setItem('professor_academy_user', JSON.stringify(authUser));
      document.cookie = `pa_role=${authUser.role}; path=/; max-age=86400`;
    } else {
      localStorage.removeItem('professor_academy_user');
      document.cookie = 'pa_role=; path=/; max-age=0';
    }
  };

  const login = async (emailOrPhone: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    // Simulating authentication with seeded test credentials or valid inputs
    const lower = emailOrPhone.trim().toLowerCase();

    let matchedRole: UserRole = 'STUDENT';
    if (lower.includes('admin') || lower === 'admin@professoracademy.pk') {
      matchedRole = 'ADMIN';
    } else if (lower.includes('teacher') || lower === 'teacher@professoracademy.pk') {
      matchedRole = 'TEACHER';
    } else if (lower.includes('student') || lower === 'student@professoracademy.pk') {
      matchedRole = 'STUDENT';
    }

    const template = SEED_ACCOUNTS[matchedRole];
    const authenticatedUser: AuthUser = {
      ...template,
      email: lower.includes('@') ? lower : template.email,
      phone: !lower.includes('@') ? lower : template.phone,
    };

    persistUser(authenticatedUser);
    setIsLoading(false);

    // Route to respective role dashboard
    const redirectUrl = `/${matchedRole.toLowerCase()}/dashboard`;
    router.push(redirectUrl);
    return { success: true };
  };

  const signup = async (data: SignupData): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    const newUser: AuthUser = {
      id: `usr-student-${Date.now()}`,
      email: data.email.trim().toLowerCase(),
      fullName: data.fullName.trim(),
      role: 'STUDENT',
      phone: data.phone,
      city: data.city,
      program: data.program,
    };

    persistUser(newUser);
    setIsLoading(false);

    router.push('/student/dashboard');
    return { success: true };
  };

  const logout = () => {
    persistUser(null);
    router.push('/login');
  };

  const demoLogin = (targetRole: UserRole) => {
    const targetUser = SEED_ACCOUNTS[targetRole];
    persistUser(targetUser);
    router.push(`/${targetRole.toLowerCase()}/dashboard`);
  };

  const updateUser = (partial: Partial<AuthUser>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...partial };
      localStorage.setItem('professor_academy_user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user ? user.role : null,
        isLoading,
        login,
        signup,
        logout,
        demoLogin,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
