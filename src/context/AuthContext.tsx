import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export interface User {
  _id: string;
  firstName: string;
  surname: string;
  lastName: string;
  fullName: string;
  email: string;
  role: 'journalist' | 'comms' | 'admin';
  orgName?: string;
  publication?: string;
  position?: string;
  phoneNumber?: string;
  bio?: string;
  interests?: string[];
  categories?: string[];
  isEmailVerified: boolean;
  status: string;
}

interface AuthContextType {
  user: User | null;
  login: (token: string, refreshToken: string, userData: User, redirectCallback: (path: string) => void) => void;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
  updateUserProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        logout();
      }
    }
  }, []);

 const login = (token: string, refreshToken: string, userData: User, redirectCallback: (path: string) => void) => {
  localStorage.setItem('token', token);
  localStorage.setItem('refreshToken', refreshToken);
  localStorage.setItem('user', JSON.stringify(userData));
  setUser(userData);
    
    switch (userData.role) {
      case 'admin':
        redirectCallback('/admin/dashboard');
        break;
      case 'journalist':
        redirectCallback('/journalist/dashboard');
        break;
      case 'comms':
        redirectCallback('/comms/dashboard');
        break;
      default:
        redirectCallback('/dashboard');
    }
  };

  const logout = () => {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (refreshToken) {
      fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      }).catch(err => console.error('Logout error:', err));
    }
    
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (!refreshToken) {
        logout();
        return false;
      }

      const response = await fetch('http://localhost:5000/api/auth/refresh-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.data.token);
        return true;
      } else {
        logout();
        return false;
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      logout();
      return false;
    }
  };

  const updateUserProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    refreshToken,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};