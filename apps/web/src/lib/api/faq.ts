import { api } from '../api-client';

export type FaqTranslation = {
  languageCode: 'en' | 'es';
  question: string;
  answer: string;
};

export type FaqItem = {
  id: string;
  order: number;
  isActive: boolean;
  translations: FaqTranslation[];
};

export type FaqResponse = {
  items: FaqItem[];
  total: number;
  page: number;
  limit: number;
};

export const faqApi = {
  getAll: (params?: { locale?: string; isAdmin?: boolean }) => {
    return api.get<FaqResponse>('/faq', { params });
  },

  getById: (id: string) => {
    return api.get<FaqItem>(`/faq/${id}`);
  },

  create: (data: any) => {
    return api.post<FaqItem>('/faq', data);
  },

  update: (id: string, data: any) => {
    return api.put<FaqItem>(`/faq/${id}`, data);
  },

  delete: (id: string) => {
    return api.delete<{ success: boolean }>(`/faq/${id}`);
  },
};
