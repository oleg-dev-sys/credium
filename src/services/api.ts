import type { Product, SearchParams, SearchResponse, ApprovalCheckResponse } from '@/components/types';

interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string; 
  city?: string;
  phone?: string;
  birth_date?: string;
  monthly_income?: number;
  monthly_expenses?: number;
  total_monthly_payments?: number;
  ai_score?: number;
  created_at?: string;
  credit_score?: number;
}

export interface NotificationSettings {
  email_offers: boolean;
  email_news: boolean;
  push_alerts: boolean;
  push_approvals: boolean;
  sms_important: boolean;
  marketing: boolean;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.credium.store';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (res.status === 401 && typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('session-expired'));
  }

  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  return res.json();
}

export const api = {
  /**
   * 1. ПРОДУКТЫ И ПОИСК (С кэшированием до 24ч)
   */
  async getProducts(): Promise<Product[]> {
    return request<Product[]>('/api/products', {
      next: { revalidate: 3600, tags: ['products'] }
    });
  },

  async getTop10(): Promise<Product[]> {
    return request<Product[]>('/api/top10', {
      next: { revalidate: 3600 } // 1 час
    });
  },

  async getProduct(id: string): Promise<Product> {
    return request<Product>(`/api/product/${id}`, {
      next: { revalidate: 3600 } // 1 час
    });
  },

  async search(params: SearchParams): Promise<SearchResponse> {
    return request<SearchResponse>('/api/search', {
      method: 'POST',
      body: JSON.stringify(params),
      // Поиск не кэшируем, так как параметры всегда разные
      cache: 'no-store' 
    });
  },

  async checkApproval(productId: string, userId: string): Promise<ApprovalCheckResponse> {
    return request<ApprovalCheckResponse>(`/api/products/${productId}/check-approval?user_id=${userId}`, {
      cache: 'no-store'
    });
  },

  /**
   * 2. АВТОРИЗАЦИЯ
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    return request<AuthResponse>('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: email,
        password: password,
      }),
      cache: 'no-store'
    });
  },

  async register(email: string, password: string): Promise<AuthResponse> {
    return request<AuthResponse>('/auth/register', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: email,
        password: password,
      }),
      cache: 'no-store'
    });
  },

  async loginWithTelegram(user: any): Promise<AuthResponse> {
    return request<AuthResponse>('/auth/telegram-widget', {
      method: 'POST',
      body: JSON.stringify(user),
      cache: 'no-store'
    });
  },

  /**
   * 3. ПРОФИЛЬ (Токен передаем аргументом)
   */
  async getMe(token: string): Promise<UserProfile> {
    return request<UserProfile>('/api/users/me', {
      headers: { 'Authorization': `Bearer ${token}` },
      cache: 'no-store'
    });
  },

  async updateProfile(token: string, data: Partial<UserProfile>): Promise<UserProfile> {
    return request<UserProfile>('/api/users/me', {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(data),
      cache: 'no-store'
    });
  },

  async getNotificationSettings(token: string): Promise<NotificationSettings> {
    return request<NotificationSettings>('/api/users/me/notifications', {
      headers: { 'Authorization': `Bearer ${token}` },
      cache: 'no-store'
    });
  },

  async updateNotificationSettings(token: string, settings: NotificationSettings): Promise<NotificationSettings> {
    return request<NotificationSettings>('/api/users/me/notifications', {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(settings),
      cache: 'no-store'
    });
  },

  async changePassword(token: string, current_password: string, new_password: string): Promise<void> {
    return request('/api/users/me/change-password', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ current_password, new_password }),
      cache: 'no-store'
    });
  },

  async deleteMyAccount(token: string): Promise<void> {
    return request('/api/users/me', {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
      cache: 'no-store'
    });
  }
};

export default api;