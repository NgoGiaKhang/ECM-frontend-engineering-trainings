import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import type { User } from "./types";
import { ROLES, type RoleType } from "@/constants/role.enum";

type AuthStore = {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
   hasAdminRole: () => boolean;
};

const adminRoles = [ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.MANAGER, ROLES.MODERATOR] as string[];

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        token: null,
        isAuthenticated: false,

        login: (user) =>
          set({
            user,
            isAuthenticated: true,
          }),

        logout: () =>
          set({
            user: null,
            isAuthenticated: false,
          }),
          hasAdminRole: () => {
            const user = get().user;
            return user?.roles.some((role) => adminRoles.includes(role)) || false;
          }
      }),
      {
        name: "auth-storage",
      },
    ),
    {
      name: "auth-store",
    },
  ),
);
