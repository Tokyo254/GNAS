const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
                     (import.meta.env.DEV ? 'http://localhost:5000' : '');

// Development helper
const isDevelopment = import.meta.env.DEV;

// Remove any trailing /api from the base URL since we add it later
const cleanBaseUrl = API_BASE_URL?.replace(/\/api$/, '') || API_BASE_URL;

if (isDevelopment && !cleanBaseUrl) {
  console.warn('⚠️ VITE_API_BASE_URL is not defined. Using default: http://localhost:5000');
}

console.log(`🌐 API Base URL: ${cleanBaseUrl}`);
console.log(`🔧 Environment: ${import.meta.env.MODE}`);
console.log(`📱 App Name: ${import.meta.env.VITE_APP_NAME}`);

// Generic API response type
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Array<{ msg: string; param?: string }>;
}

export const apiFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  let token = localStorage.getItem('token');
  
  // Enhanced logging for development
  if (isDevelopment) {
    console.log(`🔄 API Call: ${url}`, { 
      method: options.method || 'GET',
      hasToken: !!token,
      environment: import.meta.env.MODE,
      baseUrl: cleanBaseUrl
    });
  }
  
  const response = await fetch(`${cleanBaseUrl}/api${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
      ...options.headers,
    },
  });
  
  // Development response logging
  if (isDevelopment) {
    console.log(`📨 API Response: ${url}`, {
      status: response.status,
      ok: response.ok
    });
  }
  
  // If token is expired, try to refresh it
  if (response.status === 401) {
    try {
      if (isDevelopment) {
        console.log('🔄 Token expired, attempting refresh...');
      }
      
      // Import the refreshToken function dynamically to avoid circular dependencies
      const authModule = await import('../context/AuthContext');
      const refreshed = await authModule.useAuth().refreshToken();
      
      if (refreshed) {
        // Retry the original request with new token
        token = localStorage.getItem('token');
        if (isDevelopment) {
          console.log('✅ Token refreshed, retrying request...');
        }
        
        return fetch(`${cleanBaseUrl}/api${url}`, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...options.headers,
          },
        });
      }
    } catch (error) {
      console.error('❌ Token refresh failed:', error);
    }
  }
  
  return response;
};

// Helper function for API calls with enhanced error handling
export const apiCall = async <T = any>(
  url: string, 
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  try {
    const response = await apiFetch(url, options);
    const data: ApiResponse<T> = await response.json();
    
    if (!response.ok) {
      if (isDevelopment) {
        console.error('❌ API Error:', {
          url,
          status: response.status,
          error: data
        });
      }
      throw new Error(data.message || `API request failed with status ${response.status}`);
    }
    
    if (isDevelopment) {
      console.log('✅ API Success:', { url, data });
    }
    
    return data;
  } catch (error) {
    console.error('🚨 API call error:', error);
    
    // Enhanced error messages for development
    if (isDevelopment) {
      console.error('🔍 Error details:', {
        url,
        method: options.method,
        body: options.body
      });
    }
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Network error occurred'
    };
  }
};

// Special handling for FormData (file uploads)
export const apiFormDataCall = async <T = any>(
  url: string, 
  formData: FormData
): Promise<ApiResponse<T>> => {
  const token = localStorage.getItem('token');
  
  if (isDevelopment) {
    console.log('📤 FormData API Call:', url);
  }
  
  try {
    const response = await fetch(`${cleanBaseUrl}/api${url}`, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        // Let browser set Content-Type with boundary for FormData
      },
      body: formData,
    });
    
    const data: ApiResponse<T> = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'FormData upload failed');
    }
    
    return data;
  } catch (error) {
    console.error('FormData API error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Upload failed'
    };
  }
};

export const blogService = {
  // Get all blog posts with filters
  async getPosts(params?: {
    page?: number;
    limit?: number;
    category?: string;
    featured?: boolean;
    sortBy?: 'latest' | 'popular' | 'trending';
  }): Promise<ApiResponse<{
    posts: any[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }>> {
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

  // Get single blog post
  async getPost(id: string): Promise<ApiResponse<any>> {
    return apiCall(`/blog/posts/${id}`);
  },

  // Like/unlike a post
  async likePost(id: string): Promise<ApiResponse<{
    likes: number;
    userLiked: boolean;
  }>> {
    return apiCall(`/blog/posts/${id}/like`, {
      method: 'POST'
    });
  },

  // Share a post
  async sharePost(id: string): Promise<ApiResponse<{
    shares: number;
  }>> {
    return apiCall(`/blog/posts/${id}/share`, {
      method: 'POST'
    });
  },

  // Get comments for a post
  async getComments(postId: string): Promise<ApiResponse<any[]>> {
    return apiCall(`/blog/posts/${postId}/comments`);
  },

  // Add comment
  async addComment(
    postId: string, 
    content: string, 
    parentComment?: string
  ): Promise<ApiResponse<any>> {
    return apiCall(`/blog/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content, parentComment })
    });
  },

  // Like comment
  async likeComment(
    postId: string, 
    commentId: string
  ): Promise<ApiResponse<{
    likes: number;
    userLiked: boolean;
  }>> {
    return apiCall(`/blog/posts/${postId}/comments/${commentId}/like`, {
      method: 'POST'
    });
  },

  // Report a post
  async reportPost(
    postId: string, 
    reason: string, 
    details: string
  ): Promise<ApiResponse> {
    return apiCall(`/blog/posts/${postId}/report`, {
      method: 'POST',
      body: JSON.stringify({ reason, details })
    });
  }
};

// Add to your utils/api.ts
export const bulkUploadService = {
  // Bulk upload press releases
  async uploadPressReleases(file: File): Promise<ApiResponse<{
    total: number;
    successful: number;
    failed: number;
    errors: string[];
  }>> {
    const formData = new FormData();
    formData.append('csv', file);
    
    return apiFormDataCall('/bulk-upload/press-releases', formData);
  }
};