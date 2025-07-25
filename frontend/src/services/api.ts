import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { Show, CreateShowDto, UpdateShowDto, QueryShowDto, ShowsResponse } from '../types/show';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          localStorage.removeItem('authToken');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // CMS Endpoints
  async createShow(showData: CreateShowDto): Promise<Show> {
    const response: AxiosResponse<Show> = await this.api.post('/cms/shows', showData);
    return response.data;
  }

  async getShows(query?: QueryShowDto): Promise<ShowsResponse> {
    const response: AxiosResponse<ShowsResponse> = await this.api.get('/cms/shows', { params: query });
    return response.data;
  }

  async getShow(id: string): Promise<Show> {
    const response: AxiosResponse<Show> = await this.api.get(`/cms/shows/${id}`);
    return response.data;
  }

  async updateShow(id: string, showData: UpdateShowDto): Promise<Show> {
    const response: AxiosResponse<Show> = await this.api.patch(`/cms/shows/${id}`, showData);
    return response.data;
  }

  async deleteShow(id: string): Promise<void> {
    await this.api.delete(`/cms/shows/${id}`);
  }

  async getCategories(): Promise<string[]> {
    const response: AxiosResponse<string[]> = await this.api.get('/cms/shows/categories/list');
    return response.data;
  }

  async getLanguages(): Promise<string[]> {
    const response: AxiosResponse<string[]> = await this.api.get('/cms/shows/languages/list');
    return response.data;
  }

  // Discovery Endpoints
  async searchShows(query?: QueryShowDto): Promise<ShowsResponse> {
    const response: AxiosResponse<ShowsResponse> = await this.api.get('/discovery/shows', { params: query });
    return response.data;
  }

  async getShowDetails(id: string): Promise<Show> {
    const response: AxiosResponse<Show> = await this.api.get(`/discovery/shows/${id}`);
    return response.data;
  }

  async getDiscoveryCategories(): Promise<string[]> {
    const response: AxiosResponse<string[]> = await this.api.get('/discovery/categories');
    return response.data;
  }

  async getDiscoveryLanguages(): Promise<string[]> {
    const response: AxiosResponse<string[]> = await this.api.get('/discovery/languages');
    return response.data;
  }

  async fullTextSearch(query: string): Promise<Show[]> {
    const response: AxiosResponse<Show[]> = await this.api.get('/discovery/search/fulltext', {
      params: { q: query }
    });
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService; 