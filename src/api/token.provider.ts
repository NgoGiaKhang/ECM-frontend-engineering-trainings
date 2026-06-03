import type { AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";

/**
 * TokenProvider Interface
 *
 * Defines the contract for handling authentication tokens.
 * This allows switching between different storage mechanisms (LocalStorage, Cookies, Memory)
 * without modifying the core HttpClient logic.
 */
export interface TokenProvider {
    /**
     * Retrieves the current access token.
     * Used to populate the 'Authorization' header.
     */
    bearer(): Promise<string | null>;

    /**
     * Parses the raw response payload and saves the tokens.
     * The implementation should validate the payload structure.
     */
    persist(payload: unknown): Promise<void>;

    /**
     * Clears all tokens.
     * Called upon logout or when refresh fails.
     */
    clear(): Promise<void>;

    /**
     * Allows the provider to modify the request config before it is sent.
     * Example: Adding 'withCredentials: true' for Cookie-based auth or custom headers.
     *
     * NOTE: Use InternalAxiosRequestConfig for interceptors in Axios v1+
     */
    configure(config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig>;

    /**
     * Returns the specific configuration needed for the Refresh Token API call.
     *
     * - LocalStorage: Usually sends refreshToken in the JSON body.
     * - Cookies: Usually requires nobody, but needs 'withCredentials: true'.
     */
    prepareRefresh(): Promise<{ method?: string, body?: unknown; config?: AxiosRequestConfig }>;

    /**
     * Checks if a refresh attempt is possible (e.g., has refresh token).
     */
    refreshable(): Promise<boolean>;
}
