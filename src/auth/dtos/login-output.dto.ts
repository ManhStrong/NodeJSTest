import { Expose } from 'class-transformer';
import { ROLE } from '../../shares/role.constant';

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

  @Expose()
  roles: ROLE[];
}
