import type { ReactNode } from 'react';
import type { User } from '../context/AuthContext';

interface RoleBasedComponentProps {
  children: ReactNode;
  allowedRoles: string[];
}

const RoleBasedComponent = ({ children, allowedRoles }: RoleBasedComponentProps) => {
  const userJson = localStorage.getItem('user');
  
  let user: User | null = null;
  try {
    user = userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
  
  if (user && allowedRoles.includes(user.role)) {
    return <>{children}</>;
  }
  
  return null;
};

export default RoleBasedComponent;