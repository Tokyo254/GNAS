// Enhanced environment detection
const getApiBaseUrl = () => {
  // Use VITE_API_BASE_URL if provided
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // Auto-detect based on environment
  if (import.meta.env.DEV) {
    return 'http://localhost:5000';
  }
  
  // Production fallback - use current domain
  return window.location.origin;
};

const API_BASE_URL = getApiBaseUrl();
const isDevelopment = import.meta.env.DEV;

// Ensure base URL doesn't have trailing slash
const cleanBaseUrl = API_BASE_URL.replace(/\/$/, '');

console.log(`🌐 API Base URL: ${cleanBaseUrl}`);
console.log(`🔧 Environment: ${import.meta.env.MODE}`);
console.log(`📱 App Name: ${import.meta.env.VITE_APP_NAME || 'GNIAS'}`);

// Generic API response type
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Array<{ msg: string; param?: string }>;
}

// Enhanced API fetch with better error handling
export const apiFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const token = localStorage.getItem('token');
  
  // Ensure URL starts with slash
  const normalizedUrl = url.startsWith('/') ? url : `/${url}`;
  const fullUrl = `${cleanBaseUrl}/api${normalizedUrl}`;
  
  if (isDevelopment) {
    console.log(`🔄 API Call: ${fullUrl}`, { 
      method: options.method || 'GET',
      hasToken: !!token
    });
  }
  
  try {
    const response = await fetch(fullUrl, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });
    
    if (isDevelopment) {
      console.log(`📨 API Response: ${normalizedUrl}`, {
        status: response.status,
        ok: response.ok,
        statusText: response.statusText
      });
    }
    
    // Handle 401 Unauthorized (token expired)
    if (response.status === 401) {
      console.warn('🔄 Token expired or invalid');
      
      // Clear invalid token
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to login if we're not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login?session=expired';
      }
      
      throw new Error('Authentication failed. Please log in again.');
    }
    
    return response;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error('🚨 Network error - backend may be down');
      throw new Error('Cannot connect to server. Please check your internet connection and try again.');
    }
    throw error;
  }
};

// Main API call function
export const apiCall = async <T = any>(
  url: string, 
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  try {
    const response = await apiFetch(url, options);
    
    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      
      if (isDevelopment) {
        console.error('❌ Non-JSON response:', {
          url,
          status: response.status,
          preview: text.substring(0, 200)
        });
      }
      
      // If it's a 404, check if the endpoint exists
      if (response.status === 404) {
        throw new Error(`API endpoint not found: ${url}. Please check the server configuration.`);
      }
      
      throw new Error(`Server returned unexpected response: ${response.status} ${response.statusText}`);
    }
    
    const data: ApiResponse<T> = await response.json();
    
    if (!response.ok) {
      if (isDevelopment) {
        console.error('❌ API Error Response:', {
          url,
          status: response.status,
          error: data
        });
      }
      
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }
    
    if (isDevelopment) {
      console.log('✅ API Success:', { url, data });
    }
    
    return data;
  } catch (error) {
    console.error('🚨 API call failed:', {
      url,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Network error occurred'
    };
  }
};

// FormData upload helper
export const apiFormDataCall = async <T = any>(
  url: string, 
  formData: FormData,
  method: string = 'POST'
): Promise<ApiResponse<T>> => {
  const token = localStorage.getItem('token');
  const normalizedUrl = url.startsWith('/') ? url : `/${url}`;
  const fullUrl = `${cleanBaseUrl}/api${normalizedUrl}`;
  
  if (isDevelopment) {
    console.log('📤 FormData Upload:', fullUrl);
  }
  
  try {
    const response = await fetch(fullUrl, {
      method,
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        // Don't set Content-Type - let browser set it with boundary
      },
      body: formData,
    });
    
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error(`Server returned non-JSON response: ${response.status}`);
    }
    
    const data: ApiResponse<T> = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Upload failed');
    }
    
    return data;
  } catch (error) {
    console.error('FormData upload failed:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Upload failed'
    };
  }
};

// Auth service
export const authService = {
  login: async (credentials: { email: string; password: string }) => 
    apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    }),
  
  registerJournalist: async (data: any) =>
    apiCall('/auth/register/journalist', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  
  registerComms: async (data: any) =>
    apiCall('/auth/register/comms', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  
  getMe: () => apiCall('/auth/me'),
  
  verifyEmail: (token: string) =>
    apiCall('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token })
    }),
  
  forgotPassword: (email: string) =>
    apiCall('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    }),
  
  resetPassword: (token: string, password: string, confirmPassword: string) =>
    apiCall('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password, confirmPassword })
    })
};

// Blog service
export const blogService = {
  getPosts: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    featured?: boolean;
    sortBy?: 'latest' | 'popular' | 'trending';
  }) => {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.category) queryParams.append('category', params.category);
    if (params?.featured) queryParams.append('featured', 'true');
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    
    const queryString = queryParams.toString();
    const url = `/blog/posts${queryString ? `?${queryString}` : ''}`;
    
    return apiCall(url);
  },

  getPost: (id: string) => apiCall(`/blog/posts/${id}`),

  likePost: (id: string) => 
    apiCall(`/blog/posts/${id}/like`, { method: 'POST' }),

  sharePost: (id: string) =>
    apiCall(`/blog/posts/${id}/share`, { method: 'POST' }),

  getComments: (postId: string) => 
    apiCall(`/blog/posts/${postId}/comments`),

  addComment: (postId: string, content: string, parentComment?: string) =>
    apiCall(`/blog/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content, parentComment })
    }),

  likeComment: (commentId: string) =>
    apiCall(`/blog/comments/${commentId}/like`, { method: 'POST' }),

  reportPost: (postId: string, reason: string, details: string) =>
    apiCall(`/blog/posts/${postId}/report`, {
      method: 'POST',
      body: JSON.stringify({ reason, details })
    })
};

// Admin service
export const adminService = {
  getAnalytics: () => apiCall('/admin/analytics'),
  getWhistleblowerMessages: () => apiCall('/admin/whistleblower-messages'),
  getPendingJournalists: () => apiCall('/admin/journalists/pending'),
  getPressReleases: () => apiCall('/admin/press-releases'),
  getUsers: () => apiCall('/admin/users'),
  
  approveJournalist: (id: string) =>
    apiCall(`/admin/journalists/${id}/approve`, { method: 'PUT' }),
  
  rejectJournalist: (id: string) =>
    apiCall(`/admin/journalists/${id}/reject`, { method: 'PUT' }),
  
  deleteUser: (id: string) =>
    apiCall(`/admin/users/${id}`, { method: 'DELETE' }),
  
  deletePressRelease: (id: string) =>
    apiCall(`/admin/press-releases/${id}`, { method: 'DELETE' })
};

// Bulk upload service
export const bulkUploadService = {
  uploadUsers: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiFormDataCall('/admin/bulk-upload/users', formData);
  },

  uploadPressReleases: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiFormDataCall('/admin/bulk-upload/releases', formData);
  }
};

// Health check utility
export const checkServerHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${cleanBaseUrl}/health`);
    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
};