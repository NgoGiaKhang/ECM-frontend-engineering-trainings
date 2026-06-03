import type { AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import type { TokenProvider } from "./token.provider";

/**
 * Zod-like type guard to safely check the login/register response structure
 */
interface AuthResponsePayload {
  accessToken?: string;
}

export class NoRefreshTokenLocalStorageProvider implements TokenProvider {
  private readonly STORAGE_KEY = "auth_access_token";

  /**
   * Retrieves the current access token directly from LocalStorage.
   * Returns a promise containing the raw token string or null if unauthenticated.
   */
  public async bearer(): Promise<string | null> {
    if (typeof window === "undefined") return null; // Safe guard for SSR environments (e.g., Next.js)
    return localStorage.getItem(this.STORAGE_KEY);
  }

  /**
   * Parses the raw response payload, validates the presence of the `accessToken`,
   * and commits it to LocalStorage.
   */
  public async persist(payload: unknown): Promise<void> {
    if (typeof window === "undefined") return;

    // Safely parse unknown payload structure to prevent runtime breakage
    const castedPayload = payload as AuthResponsePayload;
    const token = castedPayload?.accessToken;

    if (!token || typeof token !== "string") {
      throw new Error(
        'Invalid response structure: Unable to extract a valid string "data.accessToken" from payload.',
      );
    }

    localStorage.setItem(this.STORAGE_KEY, token);
  }

  /**
   * Evicts the stored access token from LocalStorage to reset the client state.
   */
  public async clear(): Promise<void> {
    if (typeof window === "undefined") return;
    localStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * Modifies the outgoing Axios interceptor configuration by appending
   * the valid Bearer token directly into the Authorization header.
   */
  public async configure(
    config: InternalAxiosRequestConfig,
  ): Promise<InternalAxiosRequestConfig> {
    const token = await this.bearer();

    if (token) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  }

  /**
   * Since this provider explicitly does not support a refresh token mechanism,
   * it returns empty defaults for the refresh payload signature.
   */
  public async prepareRefresh(): Promise<{
    method?: string;
    body?: unknown;
    config?: AxiosRequestConfig;
  }> {
    return {
      body: {},
      config: {},
    };
  }

  /**
   * Evaluates whether a refresh lifecycle can be initialized.
   * Always yields false since refresh strategies are omitted from this provider.
   */
  public async refreshable(): Promise<boolean> {
    return false;
  }
}
