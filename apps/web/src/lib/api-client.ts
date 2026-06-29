type RequestOptions = {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | undefined>;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
};

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    // Client Side Request (Browser)
    if (window.location.hostname.includes('larolatattoonyc.com')) {
      return 'https://api.larolatattoonyc.com/api';
    }
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
  }
  
  // Server Side Request (Next.js SSR in PM2)
  // Always use local loopback to avoid SSL certificates or Hairpin NAT timeouts.
  return process.env.INTERNAL_API_URL || 'http://localhost:4000/api';
};

const API_URL = getApiUrl();

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  options?: RequestOptions,
): Promise<T> {
  const url = new URL(`${API_URL}${path}`);

  if (options?.params) {
    Object.entries(options.params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        url.searchParams.set(key, String(value));
      }
    });
  }

  const isFormData = body instanceof FormData;
  const headers: Record<string, string> = {
    ...(!isFormData && { 'Content-Type': 'application/json' }),
    ...options?.headers,
  };

  if (typeof window !== 'undefined') {
    const locale = window.location.pathname.split('/')[1];
    if (locale) {
      headers['x-locale'] = locale;
    }
    const token = localStorage.getItem('auth_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const fetchOptions: RequestInit = {
    method,
    headers,
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
    cache: options?.cache,
    next: options?.next,
  };

  let response = await fetch(url.toString(), fetchOptions);

  if (response.status === 401 && typeof window !== 'undefined') {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      try {
        const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });

        if (refreshRes.ok) {
          const refreshData = await refreshRes.json();
          localStorage.setItem('auth_token', refreshData.accessToken);
          localStorage.setItem('refresh_token', refreshData.refreshToken);
          
          headers['Authorization'] = `Bearer ${refreshData.accessToken}`;
          fetchOptions.headers = headers;
          
          response = await fetch(url.toString(), fetchOptions);
        } else {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/en/login';
        }
      } catch (err) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
      }
    }
  }

  const json: any = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(json.message || 'An error occurred');
  }

  return json;
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>('GET', path, undefined, options),

  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>('POST', path, body, options),

  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>('PUT', path, body, options),

  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>('PATCH', path, body, options),

  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>('DELETE', path, undefined, options),
};
