import { Expose } from 'class-transformer';

export class LoginOutput {
  @Expose()
  accessToken: string;

  @Expose()
  refreshToken: string;
}

export class AccessTokenClaims {
  @Expose()
  id: number;

  @Expose()
  userName: string;
}
