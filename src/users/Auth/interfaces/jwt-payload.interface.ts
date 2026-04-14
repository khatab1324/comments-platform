export interface JwtPayload {
  user_id: number;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}
