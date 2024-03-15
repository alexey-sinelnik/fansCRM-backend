export interface IJwtPayload {
  user: IUserJwt;
  iat: number;
  exp: number;
}

export interface IUserJwt {
  email: string;
  role: string;
  name: string;
}
