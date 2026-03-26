export interface TokenRequestBody {
  username: string;
  password: string;
}

export interface TokenResponseBody {
  token: string;
}

export interface AuthTokenPayload {
  sub: string;
  ownerId: number;
  username: string;
  iat: number;
  exp: number;
}

export interface AuthenticatedOwner {
  id: number;
  username: string;
  label: string | null;
}
