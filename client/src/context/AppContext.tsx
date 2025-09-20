import { createContext, useContext, useState, useEffect } from 'react';

// TypeScript interfaces for type safety
export interface User {
  name: string;
  email: string;
  id?: string;
}

export interface AppContextType {
  user: User;
  setUser: (user: User) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

// Mock user data as specified
const mockUser: User = {
  name: 'heynsschoeman',
  email: 'heynsschoeman@gmail.com',
  id: 'mock-user-001'
};

// Create the context
const AppContext = createContext<AppContextType | null>(null);

// Provider component
export function AppContextProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(mockUser);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isLoading, setIsLoading] = useState(false);

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('app-theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // Save theme to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  const contextValue: AppContextType = {
    user,
    setUser,
    theme,
    setTheme,
    isLoading,
    setIsLoading
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook to use the context
export function useAppContext(): AppContextType {
  const context = useContext(AppContext);
  
  if (!context) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  
  return context;
}

// Export the context for advanced use cases
export { AppContext };