export type Locale = 'en' | 'es';
export const SUPPORTED_LOCALES: Locale[] = ['en', 'es'];

export type PaginationParams = {
  page?: number;
  limit?: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
};

export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

export type ApiError = {
  statusCode: number;
  message: string;
  errors?: Record<string, string[]>;
};
