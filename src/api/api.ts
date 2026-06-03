import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";

import type { ApiErrorResponse } from "./types";
import type { TokenProvider } from "./token.provider";
import { NoRefreshTokenLocalStorageProvider } from "./token-local-storage.provider";

const BASE_API_URL = import.meta.env.VITE_BASE_API || "/api";
const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 10000;
export const CANCELED_ERRORS = ["CanceledError", "AbortError"] as const;
export const DEFAULT_ERROR_MESSAGE = "Something went wrong";
export const DEFAULT_ERROR_CODE = "UNKNOWN_ERROR";
export const REQUEST_CANCELED_CODE = "REQUEST_CANCELED";
class HttpClient {
  private instance: AxiosInstance;
  private readonly tokenProvider: TokenProvider;
  constructor(tokenProvider: TokenProvider) {
    this.tokenProvider = tokenProvider;
    this.instance = axios.create({
      baseURL: BASE_API_URL,
      timeout: API_TIMEOUT,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.instance.interceptors.response.use(
      (res) => res,
      (error: AxiosError<ApiErrorResponse>) => {
        // 1. Check if the request was intentionally canceled
        if (axios.isCancel(error)) {
          console.log("Request canceled:", error.message);

          return Promise.reject({
            status: 499, // 499 is standard shorthand for "Client Closed Request"
            message: error.message || CANCELED_ERRORS[0],
            code: REQUEST_CANCELED_CODE,
          });
        }

        // 2. Handle normal API error responses
        const status = error.response?.status;
        const data = error.response?.data;
        return Promise.reject({
          status: status ?? 0,
          message: data?.message ?? DEFAULT_ERROR_MESSAGE,
          code: data?.code ?? DEFAULT_ERROR_CODE,
        });
      },
    );
    this.initializeRequestInterceptor();
  }

  private initializeRequestInterceptor(): void {
    this.instance.interceptors.request.use(
      async (
        config: InternalAxiosRequestConfig,
      ): Promise<InternalAxiosRequestConfig> => {
        // Transparently lets the current provider handle authentication headers or configuration strategies
        return await this.tokenProvider.configure(config);
      },
      (error) => {
        // Forward interceptor configuration/network parsing failures immediately down the chain
        return Promise.reject(error);
      },
    );
  }

  /**
   * Manually pushes a new token payload into the active storage provider.
   * Useful during manual auth updates or bootstrapping workflows.
   * @param payload - The raw response data containing the token (e.g., { data: { accessToken: '...' } })
   */
  public async setToken(payload: unknown): Promise<void> {
    await this.tokenProvider.persist(payload);
  }

  /**
   * Evicts the active credentials from the storage provider.
   * Useful during manual logouts or when an unrecoverable 401 error occurs.
   */
  public async clearToken(): Promise<void> {
    await this.tokenProvider.clear();
  }
  public async hasBearerToken(): Promise<boolean> {
    return (await this.tokenProvider.bearer()) !== null;
  }

  // GET
  async get<T>(path: string, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.instance.get<T>(path, config);
    return res.data;
  }

  // POST
  async post<T>(
    path: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const res = await this.instance.post<T>(path, data, config);
    return res.data;
  }

  // PUT
  async put<T>(
    path: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const res = await this.instance.put<T>(path, data, config);
    return res.data;
  }

  // PATCH
  async patch<T>(
    path: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const res = await this.instance.patch<T>(path, data, config);
    return res.data;
  }

  // DELETE
  async delete<T>(path: string, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.instance.delete<T>(path, config);
    return res.data;
  }
}

export const api = new HttpClient(new NoRefreshTokenLocalStorageProvider());
