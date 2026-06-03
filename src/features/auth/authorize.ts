import { ROLE_POWER, type RoleType } from "@/constants/role.enum";

type AuthorizeOptions =
  | {
      minimum: RoleType;
      exact?: never;
    }
  | {
      exact: RoleType;
      minimum?: never;
    };
export function authorize(
  roles: RoleType[],
  options: AuthorizeOptions,
): boolean {
  if (!roles.length) {
    return false;
  }

  if ("exact" in options) {
    return roles.includes(options.exact!);
  }

  return roles.some((role) => ROLE_POWER[role] >= ROLE_POWER[options.minimum]);
}
