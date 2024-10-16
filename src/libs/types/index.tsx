export interface LoginResponse {
  status: number;
  message: string;
  data: {
    access_token: string;
    refresh_token: string;
    user: User;
    status: number;
  };
}
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
}
