import React, { createContext, useContext, useState } from 'react';

export type PageId =
  | 'command-center'
  | 'skill-intelligence'
  | 'execution-lab'
  | 'growth-proof'
  | 'admin'
  | 'data-chamber'; // Added Data Chamber

export type UserRole = 'ROLE_LEARNER' | 'ROLE_ADMIN' | 'ROLE_INSTRUCTOR';

interface AppContextType {
  currentPage: PageId;
  setCurrentPage: (page: PageId) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  isAdmin: boolean;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  hasCompletedOnboarding: boolean;
  setHasCompletedOnboarding: (val: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppContextProvider({ children }: { children: React.ReactNode }) {
  const [currentPage, setCurrentPage] = useState<PageId>('command-center');
  const [userRole, setUserRole] = useState<UserRole>('ROLE_LEARNER');
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Use localStorage to persist auth state temporarily for demo
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('karmatute_auth') === 'true';
  });

  const [hasCompletedOnboarding, setHasCompletedOnboardingState] = useState<boolean>(() => {
    return localStorage.getItem('karmatute_onboarding') === 'true';
  });

  const setHasCompletedOnboarding = (val: boolean) => {
    localStorage.setItem('karmatute_onboarding', val ? 'true' : 'false');
    setHasCompletedOnboardingState(val);
  };

  const isAdmin = userRole === 'ROLE_ADMIN';

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        userRole,
        setUserRole,
        isAdmin,
        soundEnabled,
        setSoundEnabled,
        isAuthenticated,
        setIsAuthenticated: (val: boolean) => {
          localStorage.setItem('karmatute_auth', val ? 'true' : 'false');
          setIsAuthenticated(val);
        },
        hasCompletedOnboarding,
        setHasCompletedOnboarding,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppContextProvider');
  }
  return context;
}
