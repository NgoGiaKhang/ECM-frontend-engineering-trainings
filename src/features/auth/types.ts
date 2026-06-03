export type User = {
  id: string;
  email: string;
  roles: ReadonlyArray<string>;
  fullname: string;
};

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export type RegisterRequest = {
    fullname: string;
    email: string;
    password: string;
};