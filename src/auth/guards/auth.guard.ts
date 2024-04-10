import {
  ExecutionContext,
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { DetailErrorCode } from '../../shared/errors/detail-error-code';
import { ErrorCode } from '../../shared/errors/error-code';

@Injectable()
export class JwtAuthUserGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err) throw err;
    if (!user) {
      const error = new DetailErrorCode(ErrorCode.UNAUTHORIZED, info);
      if (info.name == ErrorCode.TOKEN_EXCEPTION) {
        throw new RequestTimeoutException(error);
      }
      throw new UnauthorizedException(error);
    }
    return user;
  }
}
