import { TelegramGroup } from '../../types';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface SendMessageResponse {
  success: boolean;
  results: Array<{
    groupId: string;  // Changed to string to match the TelegramGroup id type
    success: boolean;
    result?: any;
    error?: string;
  }>;
  error?: string;
}

export type { TelegramGroup };
