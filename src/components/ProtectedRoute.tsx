import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import type { User } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'journalist' | 'comms' | 'admin';
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const token = localStorage.getItem('token');
  const userJson = localStorage.getItem('user');
  
  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  // Parse user data
  let user: User | null = null;
  try {
    user = userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    localStorage.removeItem('user');
    return <Navigate to="/login" replace />;
  }
  
  // If email is not verified, redirect to login with message
  if (user && !user.isEmailVerified) {
    return <Navigate to="/login?message=Please verify your email before accessing the dashboard" replace />;
  }
  
  // If account is not active, redirect to login
  if (user && user.status !== 'active') {
    return <Navigate to="/login?message=Your account is not active. Please contact support." replace />;
  }
  
  // If role is required and user doesn't have it, redirect to unauthorized
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;