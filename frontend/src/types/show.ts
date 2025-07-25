export interface Show {
  id: string;
  title: string;
  description?: string;
  category?: string;
  language?: string;
  duration?: number;
  publishDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateShowDto {
  title: string;
  description?: string;
  category?: string;
  language?: string;
  duration?: number;
  publishDate?: string;
}

export interface UpdateShowDto extends Partial<CreateShowDto> {}

export interface QueryShowDto {
  search?: string;
  category?: string;
  language?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface ShowsResponse {
  data: Show[];
  total: number;
  page: number;
  limit: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export enum ShowCategory {
  DOCUMENTARY = 'Documentary',
  EDUCATIONAL = 'Educational',
  CULTURAL = 'Cultural',
  ENTERTAINMENT = 'Entertainment'
}

export enum ShowLanguage {
  ENGLISH = 'English',
  ARABIC = 'Arabic',
  FRENCH = 'French',
  SPANISH = 'Spanish'
}

export const SHOW_CATEGORIES = Object.values(ShowCategory);
export const SHOW_LANGUAGES = Object.values(ShowLanguage); 