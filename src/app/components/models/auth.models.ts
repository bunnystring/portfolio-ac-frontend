export interface LoginRequest {
  email: string;
  password: string; 
}

export interface AuthUser {
  name: string;
  email: string;
}

export interface LoginResponse {
  user: AuthUser;
  token: string;
}
