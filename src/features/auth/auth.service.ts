import { api } from "../../api/api";
import type { ApiResponse } from "../../api/types";
import type { LoginResponse, RegisterRequest, User } from "./types";

class AuthService {
  async register(request: RegisterRequest) {
    return api.post("/auth/register", request);
  }
  async login(email: string, password: string) {
    const response = await api.post<ApiResponse<LoginResponse>>("/auth/login", {
      email,
      password,
    });

    // Extract the actual payload (`LoginResponse`) from the ApiResponse wrapper
    const payload = response.data;

    // Persist token to the configured token provider
    await api.setToken(payload);

    // Return the unwrapped payload for callers
    return payload;
  }

  async getMe(signal?: AbortSignal) {
    const response = await api.get<ApiResponse<User>>("/auth/me", { signal });
    return response.data;
  }

  async logout() {
    await api.clearToken();
  }
}

export const authService = new AuthService();
