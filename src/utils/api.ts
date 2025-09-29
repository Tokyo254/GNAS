// utils/api.ts
export const apiFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  let token = localStorage.getItem('token');
  
  const response = await fetch(`http://localhost:5000/api${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });
  
  // If token is expired, try to refresh it
  if (response.status === 401) {
    // Import the refreshToken function dynamically to avoid circular dependencies
    const authModule = await import('../context/AuthContext');
    const refreshed = await authModule.useAuth().refreshToken();
    
    if (refreshed) {
      // Retry the original request with new token
      token = localStorage.getItem('token');
      return fetch(`http://localhost:5000/api${url}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          ...options.headers,
        },
      });
    }
  }
  
  return response;
};

// Generic API response type
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Array<{ msg: string; param?: string }>;
}